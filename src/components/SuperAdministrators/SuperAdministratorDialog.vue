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
                       <v-text-field prepend-inner-icon="mdi-account" placeholder="NickName(Optional)" v-model="editedObj.nickname"></v-text-field>
                   
                        <v-text-field required prepend-inner-icon="mdi-email" placeholder="Email" :rules="emailRules" v-model="editedObj.email"></v-text-field>
                    <v-layout>
                       <v-text-field :rules="nameRules"  required prepend-inner-icon="mdi-counter" placeholder="Age" type="number" min="1" v-model="editedObj.age"></v-text-field>
                        <v-autocomplete :rules="nameRules"  required prepend-inner-icon="mdi-gender-male" placeholder="Gender"  :items="['Male' , 'Female' ,'Others']" v-model="editedObj.gender"></v-autocomplete>
                    </v-layout>
                    <v-text-field v-model="genderOthers" v-if="editedObj.gender== 'Others'" prepend-inner-icon="mdi-gender-male" placeholder="Gender" dense></v-text-field>
                     <v-textarea :rules="nameRules"  required prepend-inner-icon="mdi-map-marker" placeholder="Address " v-model="editedObj.address"></v-textarea>
                    <v-text-field  required prepend-inner-icon="mdi-map-marker" placeholder="Barangay " v-model="editedObj.brgy"></v-text-field>
                    <v-layout>
                        <v-text-field  required prepend-inner-icon="mdi-map-marker" placeholder="Municipality " v-model="editedObj.municipality"></v-text-field>
                        <v-text-field type="text"  required prepend-inner-icon="mdi-map-marker" placeholder="Province" v-model="editedObj.province"></v-text-field>
                    </v-layout>
                </v-form>
                    <v-card-actions class="justify-end">
                        <v-btn 
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
        editedIndex: -1, 
        genderOthers:"",
        editedObj:{
            last_name:"" , 
            first_name:"" , 
            middle_name:"",
            age: null,
            email: "",
            address_1: "",
            address_2: "",
            address_3: "",
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
            console.log('saveDataObj', this.editedObj)
            this.editedObj.organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id: this.userInfo.organization_id
        }
        
    },
    async created() {
       
    },
    methods: {
       async saveUpdateEmployee(){
            if (this.$refs.form.validate()) {
                this.loading = true
                 if(this.genderOthers) this.editedObj.gender = this.genderOthers
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
            this.editedObj = {}
            this.genderOthers=""
            this.$emit("closeDialog" ,false )
        }
    }
}
</script>