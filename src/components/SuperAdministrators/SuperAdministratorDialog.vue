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
            ><v-icon>mdi-account-plus</v-icon>{{ editedObj.method == 0 ? 'ADD' : 'UPDATE' }} EMPLOYEE
            <v-spacer/>
            <v-icon  v-if="!loading" @click="close()">mdi-close</v-icon>
            </v-toolbar>
            <v-card-text v-if="!loading">
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    class="textTitle"
                >
               <v-text-field :rules="nameRules" required prepend-inner-icon="mdi-account" placeholder="Last Name" v-model="editedObj.last_name"></v-text-field>
                    <v-text-field :rules="nameRules"  required prepend-inner-icon="mdi-account" placeholder="First Name" v-model="editedObj.first_name"></v-text-field>
                    <v-text-field  prepend-inner-icon="mdi-account" placeholder="Middle Name(optional)" v-model="editedObj.middle_name"></v-text-field>
                    
                   
                        <v-text-field required prepend-inner-icon="mdi-email" placeholder="Email" :rules="emailRules" v-model="editedObj.email"></v-text-field>
                    <v-layout>
                       <v-text-field :rules="nameRules"  required prepend-inner-icon="mdi-counter" placeholder="Age" type="number" min="1" v-model="editedObj.age"></v-text-field>
                        <v-autocomplete :rules="nameRules"  required prepend-inner-icon="mdi-gender-male" placeholder="Gender"  :items="['Male' , 'Female']" v-model="editedObj.gender"></v-autocomplete>
                    </v-layout>
                     <v-textarea :rules="nameRules"  required prepend-inner-icon="mdi-map-marker" placeholder="Address" v-model="editedObj.address"></v-textarea>
                </v-form>
                    <v-card-actions class="justify-end">
                        <v-btn :disabled="!valid"
                        @click="saveUpdateEmployee()"
                         class="textTitle" rounded dark color="#BCAAA4"
                    ><v-icon>mdi-account-plus</v-icon>{{ editedObj.method== 0 ? 'Add':"Update" }} Employee</v-btn>
                    
                    </v-card-actions>
                </v-card-text>
        
            <LoaderView v-else/>
          </v-card>
      </v-dialog>
</template>
<script>
import Employees from '../../class/employees'
import LoaderView from '@/views/LoaderView.vue';
import Organizations from '@/class/organizations';
export default {
    components:{LoaderView},
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
 
    data:()=>({
        classEmployees: new Employees(), 
         classOrg: new Organizations(),
        valid:false,
        editedIndex: -1 , 
        editedObj:{
            last_name:"" , 
            first_name:"" , 
            middle_name:"",
            age: null,
            email: "",
            address: "",
            gender:"",
            position:"",
           
        },
        nameRules: [
        v => !!v || 'This field is required'
        ],
        emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
      loading:false ,
      organizations: [],
      menu: false,
      menu1:false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      positions:['Senior' , 'Junior' ,'Manager']
    }),
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
            console.log('saveDataObj' , this.editedObj )
        }
        
    },
    async created() {
       
    },
    methods: {
       async saveUpdateEmployee(){
            if (this.$refs.form.validate()) {
                this.loading = true
               this.editedObj.position = 'ADMIN'
               await this.classEmployees.addUpdateEmployee(this.editedObj).then(() => {
                    this.loading = false 
                    this.close()
                 })
              
                
            }
        },
 
        formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
        close(){
            this.editedObj={}
            this.$emit("closeDialog" ,false )
        }
    }
}
</script>