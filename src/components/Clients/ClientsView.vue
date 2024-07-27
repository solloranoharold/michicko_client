<template>
    <v-container fluid >
        <v-toolbar flat  dense>
            <v-toolbar-title class="toolbarTitle"><v-icon>mdi-account-multiple</v-icon> Clients Record <v-chip v-if="userInfo.position_id==0">{{ $route.params.organization_name}}</v-chip></v-toolbar-title>
            <v-spacer/>
            <v-btn class="textTitle" @click="addUpdateClient()" rounded dark color="#BCAAA4"><v-icon>mdi-account-plus</v-icon>Add Clients</v-btn>
        </v-toolbar>
       <v-card style="height: 700px;"  v-if="!loading">
            <v-simple-table dense class="table-container textTitle" color="#BCAAA4">
             <template v-slot:top>
                <v-toolbar flat dense>
                  <label style="font-size: 13px;">  {{ clients.length }} of {{ totalCountClients }} Items in Page {{ page }}</label>
                </v-toolbar>
                <br/>
                <i style="font-size: 11px;">click<v-icon>mdi-magnify</v-icon> to search specific data</i>
                <v-toolbar flat dense>
                    
                    <v-flex md3>
                        <v-text-field v-model="search" :color="getRandomColor" clearable dense label="Search" append-icon="mdi-magnify" @click:append="searchClient"></v-text-field>
                    </v-flex>
                </v-toolbar>
            </template>
            <thead>
                <tr>
                     <th>Client ID </th>
                    <th>Client Name </th>
                    <th>Contact No</th>
                    <th>Email</th>
                    <th>Address
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item , i) in clients" :key="i" >
                    <td>{{ item.client_id }}</td>
                    <td> {{ item.last_name }} {{ item.first_name }}</td>
                    <td>{{ item.contact_no }}</td>
                    <td>{{  item.client_email }}</td>
                    <td>{{ item.client_address }}</td>
                    <td>
                        <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="green" @click="openClientServiceDialog(item )"  v-bind="attrs"
                                v-on="on">
                                mdi-archive
                                </v-icon>
                            </template>
                            <span>Transactions</span>
                        </v-tooltip>
                         <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="blue" @click="addUpdateClient(item )"  v-bind="attrs"
                                v-on="on">
                                mdi-pencil-outline
                                </v-icon>
                            </template>
                            <span>Edit Record</span>
                        </v-tooltip>
                    </td>
                </tr>
            </tbody>
            </v-simple-table>
            
        </v-card>
         <div class="text-center textTitle" v-if="hasPage && !loading">
            <v-pagination 
            color="#BCAAA4"
            v-model="page"
            :length="totalPages"
            @click="loadNewData( )"
            :total-visible="7"
            ></v-pagination>
        </div>
        <LoaderView  v-else/>
        <clients-dialog-vue :dialog="dialog" :saveDataObj="getObj" @closeDialog = "closeDialog"/>
        <client-services-dialog :dialog="serviceDialog" :clientDataObj="getObj" @closeClientsServicesDialog="closeClientsServicesDialog"/>
    
    </v-container>
</template>
<script>
import ClientsDialogVue from './ClientsDialog.vue'
import Clients from '@/class/clients'
import LoaderView from '@/views/LoaderView.vue';
import ClientServicesDialog from './ClientServicesDialog.vue';
export default {
    components:{ ClientsDialogVue  , LoaderView, ClientServicesDialog},
    data: () => ({
        classClient: new Clients(),
        serviceDialog:false , 
        dialog: false, 
        loading:false , 
        getObj: {},
        totalCountClients: 0 ,
        itemsPerPage: 20 ,  
        totalItems: 0 , 
        page: 1, 
        search: '',
        hasPage: true,
        clients:[]
    }),
    async created() {
         if (this.userInfo.position_id == 0 && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
         }
        await this.evaluteClients()
    },
     watch: {
        page(val) {
            console.log(val, 'sds')
            this.loadNewData(val)
         },
         search(val) {
            if(!val) this.evaluteClients()
        } 
    },
    computed: {
    
        totalPages(){
            return  Math.ceil(this.totalCountClients / this.itemsPerPage);
       },
        getRandomColor() {
            // Function to generate a random number between 0 and 255
            const random255 = () => Math.floor(Math.random() * 256);

            // Generate random values for red, green, and blue
            const red = random255();
            const green = random255();
            const blue = random255();

            // Convert decimal to hexadecimal and ensure two digits
            const componentToHex = (c) => {
                const hex = c.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            };

            // Combine red, green, and blue components
            const color = "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);

            return color;
        },
    }, 
    methods: {
     
        async searchClient() {
             if (!this.search) {
                await this.evaluteClients()
                return;
            }
            await this.evaluteClients()
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            let searchData= await this.classClient.searchClient(organization_id , this.search )
            this.clients = searchData
            this.hasPage=false 
        },
        async loadNewData(page) {
            this.loading=true
            this.page = page
             await this.evaluteClients()
              let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            let data = await this.classClient.loadClients(organization_id , this.page , this.itemsPerPage )
            this.clients = data
            console.log(this.clients, 'loadNewData')
             this.loading=false
        },
        async evaluteClients() {
            this.hasPage = true
            await this.getTotalClientCount()
            await this.loadClientsPerPage()
           
        },
        async getTotalClientCount() {
            this.loading=true
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            let a =  await this.classClient.getClientTotalCount( organization_id ,this.search)
             this.totalCountClients = a.TOTAL 
            console.log(this.totalCountClients , 'this.totalCountAccounts')
            this.loading=false
        },
        async loadClientsPerPage() {
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            let data = await this.classClient.loadClients( organization_id , this.page , this.itemsPerPage )
           
            this.clients = data
            console.log(this.clients , 'loadClientsPerPage')
        },
        closeDialog(val) {
            this.dialog = val
            this.getObj={}
            this.searchClient()
        },
        addUpdateClient(item = {}) {
            console.log(item)
            let obj = {
                client_id: item.client_id,
                last_name: item.last_name ,
                first_name: item.first_name,
                contact_no: item.contact_no,
                client_address: item.client_address, 
                client_email:item.client_email
            }
                this.getObj= JSON.parse(JSON.stringify(obj))
            this.dialog = !this.dialog
        },
        openClientServiceDialog(item) {
            this.getObj = JSON.parse(JSON.stringify(item))
            this.serviceDialog=!this.serviceDialog
        },
        closeClientsServicesDialog(val) {
            this.serviceDialog = val 
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