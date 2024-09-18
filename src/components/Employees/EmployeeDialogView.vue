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
                     <h4 class="text-center">Personal Information</h4>
                     <v-divider style="border:1px solid;"/>
                    <!-- {{  editedObj }} -->
                     <!-- <v-autocomplete :rules="nameRules" auto-select-first item-value="organization_id" item-text="organization_name"  required prepend-inner-icon="mdi-domain" placeholder="Organization"  :items="organizations" v-model="editedObj.organization_id"></v-autocomplete> -->
                    <v-text-field :rules="nameRules" required prepend-inner-icon="mdi-account" placeholder="Last Name" v-model="editedObj.last_name"></v-text-field>
                    <v-text-field :rules="nameRules"  required prepend-inner-icon="mdi-account" placeholder="First Name" v-model="editedObj.first_name"></v-text-field>
                    <v-text-field  prepend-inner-icon="mdi-account" placeholder="Middle Name(optional)" v-model="editedObj.middle_name"></v-text-field>
                    <v-text-field required prepend-inner-icon="mdi-email" placeholder="Email" :rules="emailRules" v-model="editedObj.email"></v-text-field>
                     <v-text-field prepend-inner-icon="mdi-account" placeholder="NickName(Optional)" v-model="editedObj.nickname"></v-text-field>
                    <v-layout>
                        <v-autocomplete :rules="nameRules"  required prepend-inner-icon="mdi-account" placeholder="Position"  :items="positions" v-model="editedObj.position"></v-autocomplete>
                        <v-text-field :rules="nameRules"  required prepend-inner-icon="mdi-percent" placeholder="Commissions" type="number" min="1" v-model="editedObj.commissions"></v-text-field>
                    </v-layout>
                     <v-layout>
                    <v-text-field :rules="nameRules"  required prepend-inner-icon="mdi-counter" placeholder="Age" type="number" min="1" v-model="editedObj.age"></v-text-field>
                    <v-autocomplete :rules="nameRules"  required prepend-inner-icon="mdi-gender-male" placeholder="Gender"  :items="['Male' , 'Female' ,'Others']" v-model="editedObj.gender"></v-autocomplete>
                    </v-layout>
                    <v-text-field v-model="genderOthers" v-if="editedObj.gender== 'Others'" prepend-inner-icon="mdi-gender-male" placeholder="Gender" dense></v-text-field>
                    <v-textarea :rules="nameRules"  required prepend-inner-icon="mdi-map-marker" placeholder="Address " v-model="editedObj.address"></v-textarea>
                    <v-text-field  required prepend-inner-icon="mdi-map-marker" placeholder="Barangay " v-model="editedObj.brgy"></v-text-field>
                    <v-layout>
                        <v-text-field  required prepend-inner-icon="mdi-map-marker" placeholder="Municipality " v-model="editedObj.municipality"></v-text-field>
                        <v-text-field type="text"  required prepend-inner-icon="mdi-map-marker" placeholder="Province " v-model="editedObj.province"></v-text-field>
                    </v-layout>
                    <br/>
                        <h4 class="text-center">Government Details</h4>
                        <v-divider style="border:1px solid;"/>
                        <v-text-field type="text"   prepend-inner-icon="mdi-bank" label="SSS Number" placeholder="SSS Number " v-model="editedObj.sss"></v-text-field>
                        <v-text-field type="text"   prepend-inner-icon="mdi-bank" label="Pag-Ibig MID No." placeholder="Pag-Ibig MID No." v-model="editedObj.pag_ibig"></v-text-field>
                        <v-text-field type="text"   prepend-inner-icon="mdi-bank" label="TIN" placeholder="TIN" v-model="editedObj.tin"></v-text-field>
                        <v-text-field type="text"   prepend-inner-icon="mdi-bank" label="Philhealth" placeholder="Philhealth" v-model="editedObj.philhealth"></v-text-field>
                    
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
        editedObj:{ },
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
          if ((this.userInfo.position_id == 0 || this.userInfo.position_id == 1) && !this.$route.params.organization_id) {
                this.$router.push('/organization')
                return
            }
        await this.loadOrganizations()
    },
    methods: {
        async loadOrganizations() {
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id: this.userInfo.organization_id
            console.log(organization_id , 'organization')
            await this.classOrg.readOrganizationsPerID(organization_id).then((data) => { 
                console.log(data  , 'loadlOrga')
                this.editedObj.organization_id = data[0].organization_id
            })
            
        },
       async saveUpdateEmployee(){
            if (this.$refs.form.validate()) {
                this.loading = true
                if(this.genderOthers) this.editedObj.gender = this.genderOthers
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