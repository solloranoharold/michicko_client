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
            ><v-icon>mdi-account-plus</v-icon>{{ editedObj.method == 0 ? 'ADD' : 'UPDATE' }} CLIENT
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
                    <v-text-field :rules="nameRules" required prepend-inner-icon="mdi-account" label="Last Name" placeholder="Last Name" v-model="editedObj.last_name"></v-text-field> 
                    <v-text-field :rules="nameRules" required prepend-inner-icon="mdi-account" label="First Name" placeholder="First Name" v-model="editedObj.first_name"></v-text-field> 
                    <v-text-field :rules="nameRules" type="number" min="1" required prepend-inner-icon="mdi-phone" label="Contact No" placeholder="Contact No" v-model="editedObj.contact_no"></v-text-field> 
                    <v-text-field v-if="userInfo.position_id!=3"  prepend-inner-icon="mdi-email" label="Email (optional)" placeholder="Email(optional)"  v-model="editedObj.client_email"></v-text-field>
                    <v-textarea  v-if="userInfo.position_id!=3" prepend-inner-icon="mdi-map-marker" label="Address (optional)" placeholder="Address(optional)" v-model="editedObj.client_address"></v-textarea>
                </v-form>
                    <v-card-actions class="justify-end">
                        <v-btn :disabled="!valid"
                        class="textTitle" rounded dark color="#BCAAA4"
                        @click="addUpdateClient()"
                    ><v-icon>mdi-account-plus</v-icon>{{ editedObj.method== 0 ? 'Add':"Update" }} Client</v-btn>
                    
                    </v-card-actions>
                </v-card-text>
                <LoaderView v-else/>
          </v-card>
      </v-dialog>
</template>
<script>
import Organizations from '@/class/organizations'
import Clients from '@/class/clients'
import LoaderView from '@/views/LoaderView.vue';
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
             if (Object.keys(val).length !== 0) {
                 console.log(val , ' saveDataObj update')
                this.editedObj = JSON.parse(JSON.stringify(val))
                this.editedObj.method = 1 
            }else{
                this.editedObj.method = 0
            }
            console.log('saveDataObj' , this.editedObj )
        },
    },
    async created() {
        if ((this.userInfo.position_id == 0 || this.userInfo.position_id == 1) && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
        }  
    },
    methods: {
        async loadOrganizations() {
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            this.organizations = await this.classOrg.readOrganizationsPerID(organization_id)
             this.editedObj.organization_id = this.organizations[0].organization_id
            console.log(this.organizations ,'loadOrganizations')
        },
        async addUpdateClient() {
            if (this.$refs.form.validate()) {
                console.log(this.editedObj ,'addUpdateClient')
                 this.loading=true 
                 await this.classClient.addUpdateClient(this.editedObj ).then(()=>{
                     this.close()
                     this.loading=false 
                 })
            }
        },
        close() {
            this.editedObj={}
            this.$emit('closeDialog' , false )
        }
   },
    data: () => ({
        classOrg: new Organizations(),
        classClient: new Clients(),
        editedObj: {},
        loading:false , 
        valid: false,
         nameRules: [
            v => !!v || 'This field is required'
        ],
        organizations: [],
          emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
    })
}
</script>
