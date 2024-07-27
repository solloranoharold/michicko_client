<template>
    <v-container fluid class="textTitle">
        <v-toolbar flat dense class="toolbarTitle">
            <v-toolbar-title><v-icon>mdi-currency-php</v-icon>Transactions History</v-toolbar-title>
        </v-toolbar>
        <v-card style="height: 700px;"  v-if="!loading">
            <v-simple-table dense class="table-container textTitle">
                 <template v-slot:top>
                    <v-toolbar flat dense>
                    <label class="textTitle" style="font-size: 13px;"> Page {{page}} of {{ totalPages }}, Total Items: {{ totalCountTransaction }}</label>
                    <v-spacer/>
                         <v-btn class="textTitle" @click="$router.push('/transactions')"  rounded dark color="#BCAAA4"><v-icon>mdi-content-cut</v-icon>Create Transactions</v-btn>
                     </v-toolbar>
                    <br/>
                    <i class="textTitle" style="font-size: 11px;">click<v-icon>mdi-magnify</v-icon> to search specific data</i>
                    <v-toolbar flat dense>
                        
                        <v-flex md3>
                            <v-text-field class="textTitle" v-model="search" color="#BCAAA4" clearable dense label="Search" append-icon="mdi-magnify" @click:append="searchTransaction"></v-text-field>
                        </v-flex>
                        <v-spacer/>
                        <label style="font-size: 11px;">Legends :  <v-chip x-small color="red" text-color="white" > Cancelled </v-chip><v-chip x-small color="black" outlined text-color="black"> Active </v-chip></label>
                    </v-toolbar>
                </template>
                <thead>
                    <tr>
                        <th>Transaction ID </th>
                        <th>Client Name</th>
                        <th>Service Total Amount </th>
                        <th>OTC Product Total Amount</th>
                        <th>Overall Total</th>
                        <th>Payment Method</th>
                        <th>Electronic Payment</th>
                        <th>Referrence #</th>
                        <th>Updated By</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item , i ) in transactions" :key="i" :style="{'background-color': item.status == 1  ? 'transparent' : '#EF9A9A'}">
                        <td>{{ item.transaction_id }}</td>
                        <td><v-icon>mdi-account</v-icon>{{ item.last_name }} {{ item.first_name }}</td>
                        <td>₱{{ parseFloat(item.service_total_amount).toFixed(2) }}</td>
                        <td>₱{{ item.otc_total_amount ? parseFloat(item.otc_total_amount).toFixed(2): "0.00" }}</td>
                        <td>₱{{ parseFloat(item.transaction_total_amount).toFixed(2) }}</td>
                        <td :style="{'color': item.payment_method == 'cashless'  ? 'blue' : 'green'}">{{ item.payment_method }}</td>
                        <td>
                            
                             <v-chip small color="indigo" text-color="white" v-if="item.e_payment">
                                {{ item.e_payment }}
                            </v-chip>
                        </td>
                        <td>{{ item.referrence_no }}</td>
                        <td><v-icon v-if="item.emp_last">mdi-account</v-icon>{{  item.emp_last }} {{ item.emp_first }} </td>
                        <td>{{ item.transaction_created_date }}</td>
                        <td>
                            <v-tooltip class="textTitle" bottom v-if="item.status == 1 ">
                                <template v-slot:activator="{ on, attrs }">
                                 
                                    <v-btn @click="updateTransaction(item , 0 )" x-small rounded dark color="red" v-bind="attrs"
                                    v-on="on"><v-icon small>mdi-pencil</v-icon>Cancel</v-btn>
                                </template>
                                <span>Cancel Transaction</span>
                            </v-tooltip>
                            <v-tooltip class="textTitle" bottom v-else>
                                <template v-slot:activator="{ on, attrs }">
                                 
                                    <v-btn @click="updateTransaction(item , 1 )" x-small rounded dark color="green" v-bind="attrs"
                                    v-on="on"><v-icon small>mdi-pencil</v-icon>Retrieve</v-btn>
                                </template>
                                <span>Retrieve Transaction</span>
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
    </v-container>



</template>
<script>
import Transactions from '@/class/transactions';
import Swal from 'sweetalert2'
import moment from 'moment'
import LoaderView from '@/views/LoaderView.vue';
export default {
    components:{LoaderView},
    data: () => ({
        classTransaction: new Transactions(),
        menu: false, menu1: false,
        date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        transactions: [],
        search: undefined,
        page: 1, 
        itemsPerPage: 20 ,  
        totalItems: 0, 
        totalCountTransaction: 0,
        loading:false , 
    }),
     computed: {
         totalPages() {
             return Math.ceil(this.totalCountTransaction / this.itemsPerPage);
       },  
    },
     watch: {
        page(val) {
            console.log(val, 'sds')
            this.loadNewData(val)
        } ,
         search(val) {
             if (!val) {
                 this.evaluateData()
                this.page = 1 
             }
            
        }  
    },
    async created() {
        if (this.userInfo.position_id == 0 && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
        }
       await this.evaluateData()
    },
    methods: {
        async evaluateData() {
            this.search = this.search ==null ? undefined : this.search 
            await this.loadAllTransactionsPerPage()
            await this.loadTransactionCount()
        },
        async loadTransactionCount() {
            this.loading = true
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id : this.userInfo.organization_id 
            await this.classTransaction.loadTransactionCount(organization_id , this.search).then(data => { 
                this.totalCountTransaction = data.TOTAL
                console.log(data, 'loadTransactionCount')
                this.loading=false 
             }) 
        },
        async searchTransaction() {
              if (!this.search) {
                await this.evaluateData()
                return;
            }
            await this.evaluateData()
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id : this.userInfo.organization_id 
            this.loading = true
            await this.classTransaction.searchTransaction(organization_id, this.search).then((data) => { 
                this.transactions = data 
                 this.loading = false
            })
            
        },
          async loadNewData(page) {
            this.loading=true
            this.page = page
             await this.evaluteServices()
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
             await this.classService.loadAllTransactionsPerPage(organization_id, this.page, this.itemsPerPage).then(data => { 
                 this.transactions = data
                 console.log(this.transactions, 'loadNewData')
                this.loading=false
           })
           
        },
        async updateTransaction(item, status) {
            console.log(item, status, this.userInfo.employee_id) 
            let obj = { 
                transaction_id: item.transaction_id,
                status: status,
                updated_by: this.userInfo.employee_id,
                deleted_date: status==0 ? moment().format('YYYY-MM-DD HH:mm:ss'): null 
            }
            Swal.fire({
                title: `Are you want to update this transaction ?`,
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Yes, update it!`,
            }).then(async (result) => { 
                if (result.isConfirmed) {
                    await this.classTransaction.updateHistoryTransactions(obj).then(async(data) => { 
                        console.log(data)
                        await this.loadAllTransactionsPerPage()
                    })
                }
            })
          
        },
        async loadAllTransactionsPerPage() {
            if (this.date1 > this.date2) {
                Swal.fire({
                        toast: true,
                        position:'bottom-end',
                        title: `Invalid date input`,
                        icon: "error",
                        timer: 1000,
                        showConfirmButton:false
                })
                return false 
            }
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id : this.userInfo.organization_id 
            await this.classTransaction.loadAllTransactionsPerPage(organization_id ,this.page , this.itemsPerPage).then((data) => {
                this.transactions = data 
            })
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