<template>
     <v-dialog 
        persistent
        transition="dialog-top-transition"
        max-width="550"
        v-model="value"
      >
          <v-card >
            <v-toolbar 
               color="#BCAAA4"
              dark class="toolbarTitle"
            ><v-icon>mdi-content-cut</v-icon>{{ editedObj.method == 0 ? 'ADD' : 'UPDATE' }} SERVICE
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
                   <v-autocomplete dense :rules="nameRules" item-value="category_id" item-text="category_name"  required prepend-inner-icon="mdi-package" placeholder="Categories"  :items="categories" v-model="editedObj.category_id"></v-autocomplete>
                    <v-text-field dense :rules="nameRules" required prepend-inner-icon="mdi-room-service"  placeholder="Service" v-model="editedObj.service_name"></v-text-field> 
                    <v-layout>
                     <v-text-field dense :rules="nameRules" type="number" min="1"  required prepend-inner-icon="mdi-currency-php"  placeholder="Unit Price" v-model="editedObj.price"></v-text-field> 
                   </v-layout>
                </v-form>
                    <v-card-actions class="justify-end">
                        <v-btn :disabled="!valid"
                        @click="addUpdateServices()" class="textTitle"
                    >{{ editedObj.method== 0 ? 'Add':"Update" }} Service</v-btn>
                    
                    </v-card-actions>
                </v-card-text>
        
             <LoaderView v-else/>
          </v-card>
         
      </v-dialog>
</template>
<script>
import Organizations from '@/class/organizations'
import Services from '@/class/services';
import Category from '@/class/categories';
import LoaderView from '@/views/LoaderView.vue';
export default {
    components:{ LoaderView },
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
        classCategory: new Category(),
        classService : new Services(),
        classOrg: new Organizations(),
        valid: false,
        loading:false , 
        nameRules: [
            v => !!v || 'This field is required'
        ],
        editedObj: {},
        organizations: [],
        categories:[]
        
    }),
    watch: { 
        value(val) {
            if (val) {
                this.loadOrganizations()
                this.loadCategories()
            }
        },
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
    computed: {
            value(){
            return this.dialog
        },
    },
    async created() {
         
    },
    methods: {
        async loadOrganizations() {
             let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id: this.userInfo.organization_id
            this.organizations = await this.classOrg.readOrganizationsPerID(organization_id)
            this.editedObj.organization_id = this.organizations[0].organization_id
            console.log(this.organizations ,'loadOrganizations')
        },
        async loadCategories() {
            this.categories = await this.classCategory.loadCategories()
            console.log(this.categories , 'loadCategories')
        },
        async addUpdateServices() {

            if (this.$refs.form.validate()) {
                this.loading=true
                this.classService.addUpdateService(this.editedObj).then(() => {
                    this.loading=false 
                    this.close()
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
