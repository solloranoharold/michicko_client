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
            ><v-icon>mdi-percent</v-icon>{{ editedObj.method == 0 ? 'ADD' : 'UPDATE' }} DISCOUNT
            <v-spacer/>
            <v-icon v-if="!loading" @click="close()">mdi-close</v-icon>
            </v-toolbar>
           <v-card-text v-if="!loading">
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    class="textTitle"
                >
                 <v-text-field :rules="nameRules" required prepend-inner-icon="mdi-percent" placeholder="Description" label="Description"  v-model="editedObj.description"></v-text-field> 
                     </v-form>
                    <v-card-actions class="justify-end">
                        <v-btn :disabled="!valid"
                        class="textTitle" rounded dark color="#BCAAA4"
                        @click="addUpdateEpayment()"
                    ><v-icon>mdi-percent</v-icon>{{ editedObj.method== 0 ? 'Add':"Update" }} Discount</v-btn>
                    
                    </v-card-actions>
            </v-card-text>
            <LoaderView v-else/>
       </v-card>
        
      </v-dialog>
</template>
<script>
import Organizations from '@/class/organizations';
import LoaderView from '@/views/LoaderView.vue';
export default {
    components:{LoaderView},
    data: () => ({
        classOrg: new Organizations(),
        editedObj: {}, organization_id: "", organizations: [],
        loading:false , 
        valid: false,
        nameRules: [
            v => !!v || 'This field is required'
        ],
    }),
    async created() {
        if ((this.userInfo.position_id == 0 || this.userInfo.position_id==1) && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
         }
    },
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
    methods: {
         async loadOrganizations() {
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            this.organizations = await this.classOrg.readOrganizationsPerID(organization_id)
             this.editedObj.organization_id = this.organizations[0].organization_id
            console.log(this.organizations ,'loadOrganizations')
        },
        async addUpdateEpayment() {
            if (this.$refs.form.validate()) {
                console.log(this.editedObj ,'addUpdateEpayment')
                 this.loading=true 
                 await this.classEpayment.addUpdateEPayment(this.editedObj ).then(()=>{
                     this.close()
                     this.loading=false 
                 })
            }
        },
        close() {
            this.$emit('closeDialog', false)
            this.editedObj={}
        }
    }
}
</script>