<template>
    <v-container fluid >
            <v-toolbar flat  dense>
                <v-toolbar-title class="toolbarTitle"><v-icon>mdi-monitor</v-icon> Inventory  <v-chip v-if="userInfo.position_id==0 || userInfo.position_id==1">{{ $route.params.organization_name}}</v-chip><v-chip v-if="userInfo.position_id==0">{{ $route.params.organization_name}}</v-chip></v-toolbar-title>
                <v-spacer/>
                <v-btn class="textTitle" @click="addUpdateInventory()" rounded dark color="#BCAAA4"><v-icon>mdi-bottle-soda-classic-outline</v-icon>Add Product</v-btn>
            </v-toolbar>
             <v-card style="height: 700px;"  v-if="!loading">
            <v-data-table 
                dense 
                class="table-container textTitle" 
                color="#BCAAA4" 
                :items-per-page="itemsPerPage"  
                hide-default-footer 
                :sort-by="['product_name', 'quantity']"
                :sort-desc="[false, true]"
                multi-sort
                :headers="headers"
                :items="inventory"
                >
                
                <template v-slot:top>
                    <v-toolbar flat dense>
                    <label style="font-size: 13px;">  {{ inventory.length }} of {{ totalCountInventory }} Items in Page {{ page }}</label>
                    </v-toolbar>
                    <br/>
                    <i style="font-size: 11px;">click<v-icon>mdi-magnify</v-icon> to search specific data</i>
                    <v-toolbar flat dense>
                        
                        <v-flex md3>
                            <v-text-field v-model="search" color="#BCAAA4" clearable dense label="Search" append-icon="mdi-magnify" @click:append="searchProducts" @keyup.enter="searchProducts"></v-text-field>
                        </v-flex>
                        <v-spacer/>
                        <label style="font-size: 11px;">Legends :  <v-chip x-small color="#B0BEC5" text-color="white" > Not enough quantity </v-chip><v-chip x-small color="black" outlined text-color="black">Enough Quantity </v-chip></label>
                    </v-toolbar>
                </template>
                <template v-slot:body="{ items }">
                    <tbody>
                   <tr v-for="(item , i) in items" :key="i" :style="{'background-color': item.quantity <= item.minimum_qty ? '#B0BEC5' : 'transparent' }">
                    <td>{{ item.inventory_id }}</td>
                    <td> {{ item.product_name }} </td>
                    <td align="center"> {{ item.quantity }} </td>
                    <td align="center"> {{ item.minimum_qty }} </td>
                    <td align="center">{{ item.net_value }}{{ item.unit }}</td>
                     <td align="center"> 
                        <v-chip small outlined color="green">
                           {{ item.total_value }} {{ item.unit }}
                        </v-chip> 
                    </td>
                    <td align="center"> 
                        <v-chip small color="indigo" text-color="white">
                           ₱{{ parseFloat(item.total_price).toFixed(2) }} 
                        </v-chip> 
                    </td>
                    <!-- <td>{{ item.date_created }}</td> -->
                     <td>{{ item.updated_date== "Invalid date" ? item.date_created : item.updated_date }}</td>
                    <td>
                         <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="blue" @click="addUpdateInventory(item ,false )"  v-bind="attrs"
                                v-on="on">
                                mdi-pencil-outline
                                </v-icon>
                            </template>
                            <span>Edit Record</span>
                        </v-tooltip>
                        <!-- <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="red" @click="addUpdateInventory(item , true )"  v-bind="attrs"
                                v-on="on">
                                mdi-delete-empty-outline
                                </v-icon>
                            </template>
                            <span>Edit Record</span>
                        </v-tooltip> -->
                    </td>
                </tr>
                    </tbody>
                </template>

            </v-data-table>
            <!-- <v-simple-table dense class="table-container textTitle" color="#BCAAA4">
             <template v-slot:top>
                <v-toolbar flat dense>
                  <label style="font-size: 13px;">  {{ inventory.length }} of {{ totalCountInventory }} Items in Page {{ page }}</label>
                </v-toolbar>
                <br/>
                <i style="font-size: 11px;">click<v-icon>mdi-magnify</v-icon> to search specific data</i>
                <v-toolbar flat dense>
                    
                    <v-flex md3>
                        <v-text-field v-model="search" color="#BCAAA4" clearable dense label="Search" append-icon="mdi-magnify" @click:append="searchProducts" @keyup.enter="searchProducts"></v-text-field>
                    </v-flex>
                    <v-spacer/>
                    <label style="font-size: 11px;">Legends :  <v-chip x-small color="#B0BEC5" text-color="white" > Not enough quantity </v-chip><v-chip x-small color="black" outlined text-color="black">Enough Quantity </v-chip></label>
                </v-toolbar>
            </template>
            <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                     <th>Quantity Alert</th>
                    <th>Net Value</th>
                    <th>Total Value</th>
                    <th>Date Updated </th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item , i) in inventory" :key="i" :style="{'background-color': item.quantity <= 5 ? '#B0BEC5' : 'transparent' }">
                    <td>{{ item.inventory_id }}</td>
                    <td> {{ item.product_name }} </td>
                    <td> {{ item.quantity }} </td>
                    <td> {{ item.minimum_qty }} </td>
                    <td>{{ item.net_value }}{{ item.unit }}</td>
                     <td> 
                        <v-chip small outlined color="green">
                           {{ item.total_value }} {{ item.unit }}
                        </v-chip> 
                    </td>
                     <td>{{ item.updated_date== "Invalid date" ? item.date_created : item.updated_date }}</td>
                    <td>
                         <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="blue" @click="addUpdateInventory(item )"  v-bind="attrs"
                                v-on="on">
                                mdi-pencil-outline
                                </v-icon>
                            </template>
                            <span>Edit Record</span>
                        </v-tooltip>
                    </td>
                </tr>
            </tbody>
            </v-simple-table> -->
            
        </v-card>
         <div class="text-center textTitle" v-if="!loading">
            <v-pagination 
                color="#BCAAA4"
                v-model="page"
                :length="totalPages"
                @click="loadNewData( )"
                :total-visible="7"
                ></v-pagination>
            </div>
            <inventory-dialog-vue :dialog="dialog" :saveDataObj="getObj" @closeDialog="closeDialog"/>
    </v-container>
</template>

<script>
import InventoryDialogVue from './InventoryDialog.vue'
import Inventory from '@/class/inventory';
import moment from 'moment'
export default { 
    components:{InventoryDialogVue},
    data: () => ({
        classInventory : new Inventory(),
        dialog: false, 
        loading:false , 
        getObj: {},
        totalCountInventory: 0 ,
        itemsPerPage: 20 ,  
        totalItems: 0 , 
        page: 1, 
        search: '',
        hasPage: true,
        inventory: [],
        headers: [
            { text: 'Product ID', value: 'inventory_id', align: 'center' },
            { text: 'Product Name', value: 'product_name', align: 'center' },
            { text: 'Quantity', value: 'quantity', align: 'center' },
            { text: 'Quantity Alert', value: 'minimum_qty', align: 'center' },
            { text: 'Net Value', value: 'net_value', align: 'center' },
            { text: 'Total Value', value: 'total_value', align: 'center' },
             { text: 'Total Price', value: 'total_price', align: 'center' },
            { text: 'Date Updated', value: 'updated_date', align: 'center' },
             { text: 'Actions', value: 'actions', align: 'center' },
            
        ]
    }),
     watch: {
        page(val) {
            console.log(val, 'sds')
            this.loadNewData(val)
         },
         search(val) {
            if(!val) this.evaluteProducts()
        } 
    },
    async created() {
         if ((this.userInfo.position_id == 0 || this.userInfo.position_id == 1)&& !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
         }
        await this.evaluteProducts()
    },
    computed: {
         totalPages(){
            return  Math.ceil(this.totalCountInventory / this.itemsPerPage);
       },
    },  
    methods: { 
        addUpdateInventory( item = {} , isDelete = false ) {
            console.log(item)
            if (item.date_created) delete item.date_created
            item.deleted_date = isDelete ?  moment().format('YYYY-MM-DD HH:mm:ss') : null
        
            this.getObj = item
            this.dialog=!this.dialog
        },
         async searchProducts() {
             if (!this.search) {
                await this.evaluteProducts()
                return;
            }
            await this.evaluteProducts()
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            let searchData= await this.classInventory.searchProducts(  organization_id , this.search )
            this.inventory = searchData
            this.hasPage=false 
        },
         async loadNewData(page) {
            this.loading=true
            this.page = page
             await this.evaluteProducts()
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id 
            let data = await this.classInventory.loadProducts(  organization_id , this.page , this.itemsPerPage )
            this.inventory = data
            console.log(this.inventory, 'loadNewData')
             this.loading=false
        },
        async evaluteProducts() {
            this.hasPage = true
            await this.getTotalProductsCount()
            await this.loadProductsPerPage()
           
        },
           async loadProductsPerPage() {
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id 
            let data = await this.classInventory.loadProducts(  organization_id , this.page , this.itemsPerPage )
           
            this.inventory = data
            console.log(this.inventory , 'loadProductsPerPage')
        },
        async getTotalProductsCount() {
            this.loading=true
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id 
            let a =  await this.classInventory.getProductsTotalCount( organization_id ,this.search)
             this.totalCountInventory = a.TOTAL 
            console.log(this.totalCountInventory , 'this.totalCountInventory')
            this.loading=false
        },
        closeDialog(val) {
            this.dialog = val
            this.getObj={}
            this.searchProducts()
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