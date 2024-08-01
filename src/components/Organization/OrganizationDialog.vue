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
              dark
            ><v-icon>mdi-domain</v-icon>{{ editedObj.method == 0 ? 'ADD' : 'UPDATE' }} ORGANIZATION
            <v-spacer/>
            <v-icon v-if="!loading" @click="close()">mdi-close</v-icon>
            </v-toolbar>
            <v-card-text v-if="!loading">
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                > 
                <v-autocomplete  clearable prepend-inner-icon="mdi-account" label="Select Super Administrator" :rules="nameRules" item-text="fullname" item-value="employee_id" :items="employees" v-model="editedObj.manage_by"></v-autocomplete>
                    <v-text-field :rules="nameRules"  required prepend-inner-icon="mdi-domain" label="Organization Name" v-model="editedObj.organization_name"></v-text-field>
                    <v-textarea  :rules="nameRules" prepend-inner-icon="mdi-card-account-mail" label="Address" v-model="editedObj.address"></v-textarea>
                    <v-text-field  type="number" required prepend-inner-icon="mdi-phone" label="Contact #" :rules="nameRules" v-model="editedObj.org_contact_no"></v-text-field>
                    <v-text-field  type="text"  prepend-inner-icon="mdi-email" label="Email" :rules="emailRules" v-model="editedObj.org_email"></v-text-field>
                     
                   </v-form>
                    <v-card-actions class="justify-end">
                        <v-btn :disabled="!valid" rounded dark color="#BCAAA4"
                        @click="addUpdateOrganization()"
                    ><v-icon>mdi-domain</v-icon>{{ editedObj.method== 0 ? 'Add':"Update" }} Organization</v-btn>
                    
                    </v-card-actions>
                </v-card-text>
                <LoaderView v-else/>
          </v-card>
      </v-dialog>
</template>
<script>
import Organizations from '@/class/organizations';
import LoaderView from '@/views/LoaderView.vue';
import Employees from '@/class/employees';
export default {
    components:{LoaderView},
    data: () => ({
        classEmployee: new Employees(),
        classOrg: new Organizations(),
        editedObj: {},
        nameRules: [
        v => !!v || 'This field is required'
        ],
        valid:false,
        emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        loading: false, 
        employees:[]
    }), 
      props:{
        dialog:{
            type: Boolean,
            required: true 
        },
        saveDataObj:{
            type: Object ,
            required:true
        }
    },
     computed:{
        value(){
            return this.dialog
        },
       
    },
    watch:{
        saveDataObj(val){
            if(Object.keys(val).length !== 0 ) {
                this.editedObj = JSON.parse(JSON.stringify(val))
                this.editedObj.method = 1 
            }else{
                this.editedObj.method = 0
            }
            this.loadEmployeesData()
            console.log('saveDataObj' , this.editedObj )
        },
        
    },
    methods: {
          async loadEmployeesData() {
            let organization_id =  this.userInfo.organization_id  ? this.userInfo.organization_id : 0
            let data = await this.classEmployee.loadEmployeesOption( organization_id)  
            data.forEach(item => {
                item.fullname = `${item.last_name} ${item.first_name} ${item.middle_name ? item.middle_name : ""}`
            });
            this.employees = data.filter(rec => { 
                if (this.userInfo.position_id == 0) return rec 
                else {
                    return rec.employee_id == this.userInfo.employee_id
                }
            })
            this.editedObj.manage_by = this.employees[0].employee_id
            console.log(this.employees ,'loadEmployeesData')
        },
          async addUpdateOrganization() {
            if (this.$refs.form.validate()) {
                this.loading = true
                delete this.editedObj.employee_name
                delete this.editedObj.employee_id
                this.classOrg.addUpdateOrganization(this.editedObj).then(() => {
                    this.loading=false 
                    this.close()
                })
                 
            }
            
        },
        close() {
            this.editedObj={}
            this.$emit('closeDialog' , false )
        }
    }
}
</script>
