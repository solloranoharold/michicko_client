<template>
     <v-dialog 
        persistent
        transition="dialog-top-transition"
        max-width="550"
        v-model="value"
      >
          <v-card>
            <v-toolbar
            class="toolbarTitle"
               color="#BCAAA4"
              dark
            ><v-icon>mdi-monitor</v-icon>{{ editedObj.method == 0 ? 'ADD' : 'UPDATE' }} PRODUCT
            <v-spacer/>
            <v-icon v-if="!loading" @click="close()">mdi-close</v-icon>
            </v-toolbar>
            <v-card-text v-if="!loading">
                <br/>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    class="textTitle"
                >
                    <!-- <v-autocomplete dense :rules="nameRules" item-value="organization_id" item-text="organization_name"  required prepend-inner-icon="mdi-domain" placeholder="Organization"  :items="organizations" v-model="editedObj.organization_id"></v-autocomplete> -->
                    <v-text-field :rules="nameRules" label="Product Name" required prepend-inner-icon="mdi-bottle-soda-classic-outline" placeholder="Product" v-model="editedObj.product_name"></v-text-field> 
                    <v-layout fill-height>
                        <v-autocomplete label="Unit" :rules="nameRules"  required prepend-inner-icon="mdi-equal" placeholder="Unit"  :items="units" v-model="editedObj.unit"></v-autocomplete>
                        <v-text-field label="Unit Value"  :rules="nameRules" type="number" min="1"  required prepend-inner-icon="mdi-cylinder"  placeholder="Unit Value" v-model="editedObj.net_value"></v-text-field> 
                       
                    </v-layout>
                    <v-layout>
                         <v-text-field label="Quantity (piece)"  :readonly="editedObj.method == 1 " :rules="editedObj.method == 1 ?  [] : nameRules" type="number" :min="0" required prepend-inner-icon="mdi-plus-box" placeholder="Quantity (piece)" v-model="editedObj.quantity"></v-text-field> 
                         <v-text-field label="Price" :rules="nameRules" type="number" :min="1" required prepend-inner-icon="mdi-currency-php" placeholder="Price" v-model="editedObj.price"></v-text-field> 
                         <v-text-field label="Quantity Alert"  :rules="nameRules" type="number" :min="0" required prepend-inner-icon="mdi-plus-box" placeholder="Quantity Alert" v-model="editedObj.minimum_qty"></v-text-field> 
                    </v-layout>
                    
                      <v-switch 
                        v-model="stocks"
                        flat
                        :label="`Add Stocks`"
                        v-if="editedObj.method == 1"
                    ></v-switch>
                    <v-text-field label="Add Stocks"  v-if="editedObj.method == 1 && stocks" :rules="editedObj.method == 1 && stocks? nameRules : ''" type="number" :min="1" required prepend-inner-icon="mdi-plus-box" placeholder="Quantity (piece)" v-model="historyObj.added_quantity"></v-text-field> 
                    
                    <v-card-actions class="justify-end">
                        <v-btn :disabled="editedObj.method==0"
                        class="textTitle" rounded dark color="#BCAAA4"
                        @click="resetProducts()"
                    ><v-icon>mdi-bottle-soda-classic-outline</v-icon>Reset Product Stock</v-btn>
                        <v-btn
                        class="textTitle" rounded dark color="#BCAAA4"
                        @click="addUpdateProduct()"
                    ><v-icon>mdi-bottle-soda-classic-outline</v-icon>{{ editedObj.method== 0 ? 'Add':"Update" }} Product</v-btn>
                    
                    </v-card-actions>
                </v-form>
                </v-card-text>
                <LoaderView v-else/>


            <v-dialog persistent max-width="300px" v-model="resetDialog">
                <v-card>
                    <v-card-title>Validate Password</v-card-title>
                    <v-card-text>
                       <v-form
                            ref="form"
                            v-model="managerValid"
                            lazy-validation
                            class="textTitle"
                        >
                         <v-select :rules="nameRules" label="Manager" placeholder="Manager" prepend-icon="mdi-account" dense :items="employees" item-value="employee_id" item-text="fullname" v-model="employee_id"></v-select>
                        <v-text-field  :rules="nameRules" label="Password" @keyup.enter="validatePassword()" placeholder="Password"  dense type='password' prepend-icon="mdi-lock" v-model="password"></v-text-field>
                       </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                            <v-btn dark small rounded color="success" @click="validatePassword()"> submit </v-btn>
                            <v-btn dark small rounded color="red" @click="resetDialog = !resetDialog , password=''"> close </v-btn>
                        </v-card-actions>
                </v-card>
            </v-dialog>
          </v-card>
      </v-dialog>
</template>
<script>
import Organizations from '@/class/organizations'
import Inventory from '@/class/inventory';
import LoaderView from '@/views/LoaderView.vue';
import Employees from '@/class/employees';
import Accounts from '@/class/accounts';
import Swal from 'sweetalert2'
export default {
    components:{ LoaderView} , 
     props: {
        dialog:{
            type: Boolean,
            required: true 
        },
        saveDataObj:{
            type: Object ,
            required:true
        }
    },
    computed: {
        value() {
            return this.dialog 
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.loadOrganizations()
            }
        },
         saveDataObj(val){
            if(Object.keys(val).length !== 0 ) {
                this.editedObj = JSON.parse(JSON.stringify(val))
                this.editedObj.method = 1 
                this.historyObj = { 
                    inventory_id: val.inventory_id,
                    organization_id: this.userInfo.organization_id,
                    updated_by: this.userInfo.employee_id
                }
            }else{
                this.editedObj.method = 0
            }
            console.log('saveDataObj' , this.editedObj )
        },
    },
    methods: {
        async loadEmployees() {
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id: this.userInfo.organization_id
            await this.classEmployees.loadEmployeesOption(organization_id).then(data => { 
                this.employees = data.filter(rec => { 
                    rec.fullname = rec.nickname ? rec.nickname : `${rec.last_name} ${rec.first_name}`
                    return rec.position == 'Manager'
                })
           })
        },
        async validatePassword() {
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id : this.userInfo.organization_id
            let data = await this.classAccounts.getManagerApproval( this.employee_id , this.password , organization_id)
            if (data.length) {
                console.log('asdasdas')
                this.historyObj.previous_stock = this.editedObj.quantity 
                this.historyObj.current_stock = 0
                this.historyObj.organization_id = organization_id 
                this.historyObj.total_price = this.editedObj.quantity * this.editedObj.price
                this.historyObj.price = this.editedObj.price

                this.editedObj.quantity = 0 
                this.editedObj.net_value = 0 
                this.editedObj.updated_by = this.userInfo.employee_id
                this.editedObj.total_value = this.editedObj.net_value * this.editedObj.quantity
                this.editedObj.total_price = this.editedObj.quantity * this.editedObj.price

                await this.classInventory.addUpdateProduct(this.editedObj).then(async () => {
                     await this.classInventory.productHistoryCreate( this.historyObj)
                     this.close()
                     this.loading=false 
                 }) 
            } else {
                 Swal.fire({
                        toast: true,
                        position:'bottom-end',
                        title: `Password Incorrect!`,
                        icon: "error",
                        timer: 1000,
                        showConfirmButton:false
                })
            }
        },
        async resetProducts() {
            this.resetDialog = !this.resetDialog
           await this.loadEmployees()  
        },
        async loadOrganizations() {
             let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id: this.userInfo.organization_id
            this.organizations = await this.classOrg.readOrganizationsPerID(organization_id)
            this.editedObj.organization_id = this.organizations[0].organization_id
            console.log(this.organizations ,'loadOrganizations')
        },
        async addUpdateProduct() {
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id : this.userInfo.organization_id
            this.historyObj.organization_id = organization_id 
            if (this.$refs.form.validate()) {
                 if (this.editedObj.method == 1) {
                    if (this.historyObj.added_quantity <= 0) {
                        alert('Negative or Zero value is not allowed')
                        return false 
                    }
                     if (this.historyObj.added_quantity) {
                        this.historyObj.previous_stock = this.editedObj.quantity 
                        this.editedObj.quantity = parseFloat(this.editedObj.quantity) + parseFloat(this.historyObj.added_quantity)
                        this.historyObj.current_stock = this.editedObj.quantity
                        this.historyObj.total_price =this.editedObj.quantity * this.editedObj.price
                        this.historyObj.price = this.editedObj.price
                     }
                }
                this.editedObj.updated_by = this.userInfo.employee_id
                this.loading = true 
                this.editedObj.total_value = this.editedObj.net_value * this.editedObj.quantity
                this.editedObj.total_price = this.editedObj.quantity * this.editedObj.price
                 
                await this.classInventory.addUpdateProduct(this.editedObj).then(async () => {
                    if(this.historyObj.added_quantity && this.stocks ) await this.classInventory.productHistoryCreate( this.historyObj)
                     this.close()
                     this.loading=false 
                 }) 
            }
        },
        close() {
            this.editedObj = {}
            this.historyObj = {}
            this.employee_id = ""
            this.password=""
            this.$emit('closeDialog' , false )
        }
    },
    async created() {
        if ((this.userInfo.position_id == 0 || this.userInfo.position_id == 1) && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
        }  
   },
    data: () => ({
        stocks:false,
        classInventory: new Inventory(),
        classOrg: new Organizations(),
        classEmployees: new Employees(),
        classAccounts : new Accounts(),
        editedObj: {},
        valid: false,
         nameRules: [
            v => !!v || 'This field is required'
        ],
        organizations: [],
        employees: [],
        employee_id:"",
        units: ['ML', 'G'],
        loading: false,
        historyObj: {},
        resetDialog: false, 
        password: '',
        managerValid:false
    })
}
</script>
