<template>
     <v-dialog 
        persistent
        transition="dialog-top-transition"
        max-width="550"
        v-model="value"
      >
          <v-card>
            <v-toolbar
               color="#BCAAA4"
              dark class="toolbarTitle"
            ><v-icon>mdi-account-plus</v-icon>{{ editedObj.method == 0 ? 'ADD' : 'UPDATE' }} ACCOUNT
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
                    <!-- <v-autocomplete  dense :rules="nameRules" item-value="organization_id" item-text="organization_name"  required prepend-inner-icon="mdi-domain" placeholder="Organization"  :items="organizations" v-model="editedObj.organization_id"></v-autocomplete> -->
                     <v-autocomplete :readonly="userInfo.position_id ==2 " dense  :rules="nameRules" item-value="position_id" item-text="position"   prepend-inner-icon="mdi-domain" placeholder="Position"  :items="positions" v-model="editedObj.position_id"></v-autocomplete>
                    <v-autocomplete dense clearable :rules="nameRules" item-value="employee_id" item-text="fullname"  required prepend-inner-icon="mdi-account" placeholder="Employee"  :items="employees" v-model="editedObj.employee_id"></v-autocomplete>
                      <v-text-field dense :filled="editedObj.method == 1" :readonly="editedObj.method == 1" :rules="nameRules" required prepend-inner-icon="mdi-account" placeholder="Username" v-model="editedObj.username"></v-text-field>
                    <v-text-field v-if="editedObj.method == 0" :rules="editedObj.method == 0 ? nameRules:''" required prepend-inner-icon="mdi-lock" type="password"  placeholder="Password" v-model="editedObj.password"></v-text-field>
                    <v-text-field v-if="editedObj.method == 0" :rules="editedObj.method == 0 ? nameRules:''" required prepend-inner-icon="mdi-lock" type="password"  placeholder="Confirm Password" v-model="editedObj.cpassword"></v-text-field>
                </v-form>
                   <v-card-actions class="justify-end">
                        <v-btn :disabled="!valid"
                        @click="addUpdateAccount()"
                        class="textTitle" rounded dark color="#BCAAA4"
                    > <v-icon>mdi-account-plus</v-icon>
                    {{ editedObj.method== 0 ? 'Add':"Update" }} aCCOUNT</v-btn>
                    
                    </v-card-actions>
                </v-card-text>
                <LoaderView v-else/>
          </v-card>
      </v-dialog>
</template>
<script>
import Organizations from '@/class/organizations'
import Employees from '@/class/employees'
import Positions from '@/class/positions'
import Accounts from '@/class/accounts'
import LoaderView from '@/views/LoaderView.vue'
export default {
    components:{LoaderView},
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
    data: () => ({
        classOrg: new Organizations(),
        classEmployee: new Employees(),
        classPosition: new Positions(),
        classAccount : new Accounts(),
        valid: false,
        loading:false , 
        nameRules: [
            v => !!v || 'This field is required'
        ],
        editedObj: {},
        organizations: [],
        employees: [],
        positions: [],
        confirmPassword:""
        
    }),
    watch: { 
        value(val) {
            if (val) {
                this.loadOrganizations()
                this.loadEmployeesData()
                this.loadPositions()
            }
        },
        saveDataObj(val){
            if(Object.keys(val).length !== 0 ) {
                this.editedObj = JSON.parse(JSON.stringify(val))
                delete this.editedObj.password
                this.editedObj.method = 1 
            }else{
                this.editedObj.method = 0
            }
            console.log('saveDataObjasdasdas' , this.editedObj )
        }
    },
    computed: {
            value(){
            return this.dialog
        },
    },
    async created() {
         if ((this.userInfo.position_id == 0 || this.userInfo.position_id==1) && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
         }
    },
    methods: {
        async loadPositions() {
            let data = await this.classPosition.loadPositions()
            this.positions = data.filter(rec => { 
                return rec.position_id == 2  || rec.position_id == 3 
            })
            this.editedObj.position_id = 3
            console.log(this.positions ,'loadPositions')
        },
        async loadEmployeesData() {
            let organization_id = this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id 
            let data = await this.classEmployee.loadEmployeesOption( organization_id)  
            data.forEach(item => {
                item.fullname = `${item.last_name} ${item.first_name} ${item.middle_name ? item.middle_name : ""}`
            });
            this.employees = data.filter(rec => { 
                if (this.userInfo.employee_id) return rec.employee_id != this.userInfo.employee_id
                else return rec
            }) 
            console.log(this.employees ,'loadEmployeesData')
        },
        async loadOrganizations() {
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id 
            this.organizations = await this.classOrg.readOrganizationsPerID(organization_id)
            this.editedObj.organization_id = this.organizations[0].organization_id
            console.log(this.organizations ,'loadOrganizations')
        },
        async addUpdateAccount() {
            if (this.$refs.form.validate()) {
                 this.loading=true 
                await this.classAccount.addUpdateAccount(this.editedObj ).then(()=>{
                     this.close()
                     this.loading=false 
                 })
            }
            
        },
       
        close() {
            this.editedObj={}
            this.$emit("closeDialog" ,false )
        }
    }
}
</script>
<style>
     .custom-confirm-button .swal2-confirm {
      color: #FF0000; /* Change this to your desired text color */
    }
</style>
