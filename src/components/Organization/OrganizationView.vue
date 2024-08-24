<template>
    <v-container fluid>
         <v-toolbar flat dense>
            <v-toolbar-title><v-icon>mdi-domain</v-icon> Organizations / Branch</v-toolbar-title>
            <v-spacer/>
             <v-btn @click="addUpdateOrganization()"  rounded dark color="#BCAAA4"><v-icon>mdi-domain</v-icon>Add Branch</v-btn>
        </v-toolbar>
          <v-card style="height: 750px;"  v-if="!loading">
        <v-simple-table dense>
            <template v-slot:top>
                <v-toolbar flat dense>
                  <label class="textTitle" style="font-size: 13px;"> Page {{page}} of {{ totalPages }}, Total Items: {{ totalCountOrganization }}</label>
                </v-toolbar>
                <br/>
                <i class="textTitle" style="font-size: 11px;">click<v-icon>mdi-magnify</v-icon> to search specific data</i>
                <v-toolbar flat dense>
                    
                    <v-flex md3>
                        <v-text-field class="textTitle" v-model="search" color="#BCAAA4" clearable dense label="Search" append-icon="mdi-magnify" @click:append="searchOrganization" @keyup.enter="searchOrganization"></v-text-field>
                    </v-flex>
                    <v-spacer/>
                    <label style="font-size: 11px;">Legends :  <v-chip x-small color="#B0BEC5" text-color="white" > Not Active </v-chip><v-chip x-small color="black" outlined text-color="black"> Active </v-chip></label>
                </v-toolbar>
            </template>
            <thead>
                <tr>
                    <th>Date </th>
                    <th> Organization / Branch </th>
                    <th> Address </th>
                    <th> Contact # </th>
                    <th> Email </th>
                    <th>Manage By</th>
                    <th> Modules </th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="( item , i ) in organizations" :key="i" :style="{'background-color': item.status == 1  ? 'transparent' : '#B0BEC5'}">
                    <td>{{ item.date_created }}</td>
                    <td>
                        <v-chip outlined small color="blue">
                            {{ item.organization_name }}
                        </v-chip>
                    </td>
                    <td>{{ item.address  }}</td>
                    <td>{{ item.org_contact_no }}</td>
                    <td>{{ item.org_email }}</td>
                    <td>
                        <v-chip small  color="green" outlined>
                            <v-icon small>mdi-account</v-icon>{{ item.employee_name }}
                        </v-chip>
                    </td>
                    <td>
                          <v-icon  color="black"  @click="directToPath( item )">mdi-monitor</v-icon>
                       
                    </td>
                    <td>
                        <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                               <v-icon color="green" @click="addUpdateOrganization( item)" v-bind="attrs"
                                v-on="on">mdi-pencil</v-icon>
                            </template>
                            <span>Edit</span>
                        </v-tooltip>
                        
                       <v-tooltip bottom v-if="item.status == 1 && userInfo.position_id==0">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="red" @click="updateOrgStatus(item , 0 )"  v-bind="attrs"
                                v-on="on">
                                mdi-domain
                                </v-icon>
                            </template>
                            <span>Deactivate</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="item.status == 0 && userInfo.position_id==0">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="blue" @click="updateOrgStatus(item ,1 )"  v-bind="attrs"
                                v-on="on">
                                mdi-domain
                                </v-icon>
                            </template>
                            <span>Activate</span>
                        </v-tooltip>
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
        </v-card>
         <div class="text-center textTitle" v-if=" !loading">
            <v-pagination 
            color="#BCAAA4"
            v-model="page"
            :length="totalPages"
            @click="loadNewData( )"
            :total-visible="7"
            ></v-pagination>
        </div>
        <LoaderView v-else />
        <organization-dialog-vue :dialog="dialog" :saveDataObj="getObj" @closeDialog="closeDialog"/>
    </v-container>
   
</template>
<script>
import Organizations from '@/class/organizations';
import OrganizationDialogVue from './OrganizationDialog.vue';
import LoaderView from '@/views/LoaderView.vue';
import Accounts from '@/class/accounts';
import Swal from 'sweetalert2'
export default {
    components:{ OrganizationDialogVue , LoaderView},
    data: () => ({
        classOrg: new Organizations(),
        classAccount: new Accounts(),
        dialog: false, 
        loading:false , 
        getObj:{},
        organizations: [],
        search: undefined,
        totalCountOrganization: 0 ,
        itemsPerPage: 20 ,  
        totalItems: 0 , 
        page: 1, 
        headers: [
            { text: "Organization / Branch ", value: 'organization_name' },
            { text: 'Address', value: 'address' },
            { text:'Contact #' , value:'org_contact_no'}
        ],
        modules: [
            { text: 'Dashboard', icon: 'mdi-home', name: 'dashboard' },
            { text: "Transactions", icon: "mdi-currency-php", name: 'transactions' },
            { text: 'Expenses', icon: 'mdi-currency-php', name: 'expenses' },
            { text: 'Employees', icon: 'mdi-account-multiple-outline', name: 'employee' },
            { text: 'Accounts', icon: 'mdi-book-cog-outline', name: 'accounts' },
            { text: 'Services', icon: 'mdi-content-cut', name: 'services' },
            { text: 'Clients', icon: ' mdi-monitor-account', name: 'clients' },
            { text: "Cashless Methods", name: 'cashless', 'icon': "mdi-credit-card-marker" },
             { text: "Reports", name: 'reports', 'icon': "mdi-account-multiple" },
            
        ],
        group_Modules: [ 
            { text: 'Service Products', icon: 'mdi-bottle-soda-classic-outline', name: 'inventory' },
            { text:'OTC Products ', icon: 'mdi-bottle-soda-classic-outline', name: 'products' },
        ]
    }),
    async created() {
         this.$store.commit('GROUP_MODULES' ,[] )
            this.$store.commit('MASTER_NAVBAR' , [])
      await this.evaluateOrganization()  
    },
    watch: {
        page(val) {
            console.log(val, 'sds')
            this.loadNewData(val)
        } ,
         search(val) {
            if(!val) this.evaluateOrganization()
        }  
    },
    computed: {
       totalPages(){
            return  Math.ceil(this.totalCountOrganization / this.itemsPerPage);
       },  
    },
    methods: { 
        async evaluateOrganization() {
            await this.getTotalOrganizationsCount()
            await this.loadOrganizations()
        },
        async searchOrganization() {
               if (!this.search) {
                await this.evaluateOrganization()
                return;
            }
            await this.evaluateOrganization()
           let searchData= await this.classOrg.searchOrganization( this.userInfo.employee_id ,this.search )
            this.organizations = searchData
        },
        async getTotalOrganizationsCount() {
            this.loading=true
           let a =  await this.classOrg.organizationsTotalCount( this.userInfo.employee_id ,this.search)
             this.totalCountOrganization = a.TOTAL 
            console.log(this.totalCountOrganization , 'this.getTotalOrganizationsCount')
            this.loading=false
        },
        async loadNewData(page) {
            this.loading=true
            this.page = page
             await this.evaluateOrganization()
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
             await this.classOrg.readOrganizationsAdmin(organization_id, this.page, this.itemsPerPage).then(data => { 
                 this.organizations = data
                 console.log(this.organizations, 'loadNewData')
                this.loading=false
           })
           
        },
        async updateOrgStatus(item, status) {
            let employee_name = item.employee_name
            delete item.employee_name
            this.loading = true
            item.status = status
            await this.classOrg.addUpdateOrganization(item).then(async() => { 
                await this.classAccount.evaluateAccountStatus(item.organization_id, status)
                this.loading = false 
                item.employee_name = employee_name
            })
            console.log(item , status )
        },
        directToPath(item) {
            this.loading=true
            this.group_Modules.forEach(data => { 
                data.item = JSON.parse(JSON.stringify( item ))
            })
            this.modules.forEach(data => { 
                data.item = JSON.parse(JSON.stringify( item ))
            })
            console.log(this.modules , this.group_Modules)
            setTimeout(() => {
                this.$store.commit('MASTER_NAVBAR', this.modules)
                this.$store.commit('GROUP_MODULES', this.group_Modules)
                this.loading = false 
                // alert(`Organization ${item.organization_name} SELECTED`)
                 Swal.fire({
                     toast: true,
                     position: "bottom-end",
                     title: `Organization ${item.organization_name} SELECTED`,
                     showConfirmButton: false,
                     timer: 1500
                   });
            }, 1000);
        //   this.$router.push({name:path.name ,params: JSON.parse(JSON.stringify(item))})  
        },
        async loadOrganizations() { 
            this.loading=true
            await this.classOrg.readOrganizationsAdmin( this.userInfo.employee_id).then(data => {
                this.organizations = data
                console.log(this.organizations , 'organizations ')
               this.loading=false 
          })
        },
        addUpdateOrganization(item={}) {
            this.getObj = JSON.parse(JSON.stringify(item))
            this.dialog = !this.dialog
        },
        closeDialog(val) {
            this.dialog = val
            this.loadOrganizations()
        }
    }
}
</script>
<style scoped>
   .table-container {
  height: 750px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
</style>
