<template>
    <v-container fluid>
         <v-toolbar flat dense>
            <v-toolbar-title class="toolbarTitle"><v-icon>mdi-content-cut</v-icon> Services <v-chip v-if="userInfo.position_id==0">{{ $route.params.organization_name}}</v-chip></v-toolbar-title>
            <v-spacer/>
            <v-btn class="textTitle" @click="addUpdateServices()"  rounded dark color="#BCAAA4"><v-icon>mdi-content-cut</v-icon>Add Service</v-btn>
        </v-toolbar>
         <v-card style="height: 700px;"  v-if="!loading">
            <v-simple-table dense class="table-container textTitle" color="#BCAAA4">
             <template v-slot:top>
                <v-toolbar flat dense>
                  <label class="textTitle" style="font-size: 13px;"> Page {{page}} of {{ totalPages }}, Total Items: {{ totalCountService }}</label>
                </v-toolbar>
                <br/>
                <i class="textTitle" style="font-size: 11px;">click<v-icon>mdi-magnify</v-icon> to search specific data</i>
                <v-toolbar flat dense>
                    
                    <v-flex md3>
                        <v-text-field class="textTitle" v-model="search" color="#BCAAA4" clearable dense label="Search" append-icon="mdi-magnify" @click:append="searchServices" @keyup.enter="searchServices"></v-text-field>
                    </v-flex>
                    <v-spacer/>
                    <label style="font-size: 11px;">Legends :  <v-chip x-small color="#B0BEC5" text-color="white" > Not Active </v-chip><v-chip x-small color="black" outlined text-color="black"> Active </v-chip></label>
                </v-toolbar>
            </template>
            <thead>
                <tr>
                    <th>Category </th>
                    <th>Service Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item , i) in services" :key="i" :style="{'background-color': item.service_status == 1  ? 'transparent' : '#B0BEC5'}">
                  <td>
                        <v-chip outlined small color="black">
                            {{ item.category_name }}
                        </v-chip>
                    </td>
                    <td>{{ item.service_name }}</td>
                    <td>
                       ₱{{ parseFloat(item.price).toFixed(2) }}
                    </td>
                    <td>
                         <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="blue" @click="addUpdateServices(item ,false  )"  v-bind="attrs"
                                v-on="on">
                                mdi-pencil-outline
                                </v-icon>
                            </template>
                            <span>Edit Record</span>
                        </v-tooltip>
                         <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="indigo" @click="addUpdateStatus(item ,false  )"  v-bind="attrs"
                                v-on="on">
                                mdi-alert-outline
                                </v-icon>
                            </template>
                            <span>Activate/Deactivate</span>
                        </v-tooltip>
                         <v-tooltip bottom >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="red" @click="addUpdateStatus(item , true)"  v-bind="attrs"
                                    v-on="on">
                                    mdi-delete-empty-outline
                                    </v-icon>
                                </template>
                                <span>Delete Record</span>
                            </v-tooltip>
                    </td>
                </tr>
            </tbody>
            </v-simple-table>
            
        </v-card>
        <div class="text-center" v-if="!loading">
            <v-pagination 
            color="#BCAAA4"
            v-model="page"
            :length="totalPages"
            @click="loadNewData( )"
            :total-visible="7"
            class="textTitle"
            ></v-pagination>
        </div>
         <LoaderView  v-else/>
       <services-dialog-vue :dialog="dialog" :saveDataObj="getObj" @closeDialog="closeDialog"/>
    </v-container>
   
</template>
<script>
import Organizations from '@/class/organizations';
import Services from '@/class/services';
import ServicesDialogVue from './ServicesDialog.vue';
import LoaderView from '@/views/LoaderView.vue';
import moment from 'moment'
export default {
    components:{ ServicesDialogVue , LoaderView },
    data: () => ({
        classService: new Services(),
        classOrg: new Organizations(),
        dialog: false, 
        getObj:{},
        organizations: [],
        search: '',
        totalCountService: 0 ,
        itemsPerPage: 20 ,  
        totalItems: 0 , 
        page: 1, 
        hasPage: true,
        services: [],
        loading:false , 
        headers: [
            { text: "Services ", value: 'organization_name' },
            { text: 'Address', value: 'address' },
             { text:'Contact #' , value:'org_contact_no'}
        ]
    }),
    async created() {
        if (this.userInfo.position_id == 0 && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
         }

        await this.loadOrganizations()  
      await this.evaluteServices()
    },
    watch: {
        page(val) {
            console.log(val, 'sds')
            this.loadNewData(val)
        } ,
         search(val) {
            if(!val) this.evaluteServices()
        }  
    },
    computed: {
       totalPages(){
            return  Math.ceil(this.totalCountService / this.itemsPerPage);
       },  
    },
    methods: { 
        async loadOrganizations() { 
            this.organizations = await this.classOrg.readOrganizations()
        },
         async loadNewData(page) {
            this.loading=true
            this.page = page
             await this.evaluteServices()
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
             await this.classService.loadServices(organization_id, this.page, this.itemsPerPage).then(data => { 
                 this.services = data
                 console.log(this.services, 'loadNewData')
                this.loading=false
           })
           
        },
         async evaluteServices() {
            this.hasPage = true
            await this.getTotalServicesCount()
            await this.loadServicesPerPage()
           
        },
        async searchServices() {
            this.loading=true
             if (!this.search) {
                await this.evaluteServices()
                return;
            }
            await this.evaluteServices()
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id 
            let searchData= await this.classService.searchServices( organization_id , this.search )
            this.services = searchData
            this.hasPage = false 
            this.loading=false
        },
        async loadServicesPerPage() {
            this.loading =true
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id 
            let data = await this.classService.loadServices( organization_id , this.page , this.itemsPerPage )
           
            this.services = data
            console.log(this.services, 'loadServicesPerPage')
            this.loading=false 
        },
        async getTotalServicesCount() {
            this.loading=true
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id 
            let a =  await this.classService.getServicesTotalCount( organization_id ,this.search)
             this.totalCountService = a.TOTAL 
            console.log(this.totalCountService , 'this.totalCountService')
            this.loading=false
        },
        async addUpdateStatus(item = {}, isDelete = false) {
            console.log(isDelete)
             let obj = {
                service_id: item.service_id,
                organization_id: item.organization_id ,
                category_id: item.category_id,
                service_name: item.service_name,
                price: item.price,
                commissions: item.commissions,
                // status: item.service_status == 1 ? 0 : 1 ,
                // deleted_date : isDelete ? moment().format('YYYY-MM-DD HH:mm:ss') : null
            }
            if (isDelete) obj.deleted_date = moment().format('YYYY-MM-DD HH:mm:ss') 
            else obj.status = item.service_status == 1 ? 0 : 1 
           await this.classService.addUpdateService(obj)
            await this.searchServices()
        },
        addUpdateServices(item={}) {
           let obj = {
                service_id: item.service_id,
                organization_id: item.organization_id ,
                category_id: item.category_id,
                service_name: item.service_name,
                price: item.price,
                commissions: item.commissions
            }
                this.getObj= JSON.parse(JSON.stringify(obj))
            this.dialog = !this.dialog
        },
        closeDialog(val) {
            this.dialog = val
            this.getObj={}
            this.loadOrganizations()
            this.searchServices()
        }
    }
}
</script>
<style scoped>
   .table-container {
  height: 700px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
</style>