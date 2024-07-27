<template>
    <v-container fluid v-if="!loading" class="textTitle">
       <v-row no-gutters>
        <v-col cols="12" md="3" lg="3">
             <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                    dense outlined
                    v-model="date1"
                    label="First Date"
                    persistent-hint
                    prepend-inner-icon="mdi-calendar"
                    v-bind="attrs"
                    v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date1"
                    no-title
                    @input="menu = false"
                ></v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="12" md="3" lg="3">
            <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                    dense outlined
                    v-model="date2"
                    label="End Date"
                    persistent-hint
                    prepend-inner-icon="mdi-calendar"
                    v-bind="attrs"
                    v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date2"
                    no-title
                    @input="menu1 = false"
                ></v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="12" md="3" lg="3">
             <v-btn @click="evaluateTransactions()" color="#BCAAA4" dark  block><v-icon>mdi-magnify</v-icon>Search</v-btn>
        </v-col>
        
       </v-row>
                <TotalCards :TotalActualNet="getActualNet" :TotalSalesAmount="getTransactionTotalAmount" :TotalNetSales="getTotalNetSales" :TotalServiceAmount="getTotalServices" :TotalOTCAmount="getTotalOTC" />
                <br/>
                <div style="height:500px;">
                    <v-row class="rowContainer">
                        <v-col cols="12" md="12" lg="12" xs="12" sm="12">
                            <TotalSalesChart :transactions="yearlyTrasactions"/>
                        </v-col>
                        <v-col cols="12" md="12" lg="12" xs="12" sm="12">
                            <ServiceOTCSalesLineChart :transactions="transactions" :date1="date1" :date2="date2"/>
                        </v-col>
                         <v-col cols="12" md="12" lg="12" xs="12" sm="12">
                            <ServicesTotalWorkChart :transactions="transactions" :date1="date1" :date2="date2"/>
                        </v-col>
                        <v-col cols="12" md="12" lg="12" xs="12" sm="12">
                            <ServicesOTCYearlyChart :transactionsServices="yearlyServiceSales" :transactionsOTC="otcObject" />
                        </v-col>
                        <v-col cols="12" md="12" lg="12" xs="12" sm="12">
                            <v-simple-table>
                                <thead>
                                    <tr>
                                        <th style="background-color: #BCAAA4; color:white">Category</th>
                                        <th style="background-color: #BCAAA4; color:white">Work Done</th>
                                        <th style="background-color: #BCAAA4; color:white"># of Work</th>
                                        <th style="background-color: #BCAAA4; color:white">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item , i ) in tableWorkDone" :key="i">
                                        <td>{{ item.category_name }}</td>
                                        <td>{{ item.service_name }}</td>
                                        <td>{{ item.work }}</td>
                                        <td> ₱{{ parseFloat(item.price).toFixed(2) }}</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                            <div class="text-center textTitle" >
                            <v-pagination 
                                color="#BCAAA4"
                                v-model="page"
                                :length="totalPages"
                                @click="loadNewData( )"
                                :total-visible="7"
                                ></v-pagination>
                            </div>
                        </v-col>
                        <!--  -->
                    </v-row>
                </div>
                
                
    </v-container>
    <LoaderView :loading-text="loadingText" v-else/>
</template>
<script>
import moment from 'moment'
import Transactions from '@/class/transactions';
import LoaderView from '@/views/LoaderView.vue';
// import Swal from "sweetalert2"
import TotalSalesChart from './TotalSalesChart.vue';
import ServiceOTCSalesLineChart from './ServiceOTCSalesLineChart.vue';
import ServicesTotalWorkChart from './ServicesTotalWorkChart.vue';
import ServicesOTCYearlyChart from './ServicesOTCYearlyChart.vue';
import TotalCards from './TotalCards.vue'
export default {
    components:{LoaderView , TotalCards , TotalSalesChart , ServiceOTCSalesLineChart , ServicesTotalWorkChart  , ServicesOTCYearlyChart},
    data: () => ({
        classTransactions: new Transactions(),
        loadingText:"",
        loading:false , 
        organization_id: "",
        transactions: [],
        commissions: [],
        clients: [],
        yearlyTrasactions: [], 
        yearlyServiceSales: [],
        yearlyOTCSales: [],
        otcObject:{},
        menu:false , menu1:false,
        date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        
        options: {
            animations: {
                y: {
                    easing: 'easeInOutElastic',
                        from: (ctx) => {
                        if (ctx.type === 'data') {
                            if (ctx.mode === 'default' && !ctx.dropped) {
                            ctx.dropped = true;
                            return 0;
                            }
                        }
                    }
                }
            },
            scales: {
                yAxes: [
                {
                    ticks: {
                    beginAtZero: true,
                    enabled: true,
                    fontFamily: "Arial",
                    fontStyle: "bold",
                    },
                },
                ],
                xAxes: [
                {
                    ticks: {
                    beginAtZero: true,
                    enabled: true,
                    fontFamily: "Arial",
                    fontStyle: "bold",
                    },
                },
                ],
            },
            responsive: true,
            maintainAspectRatio: false,
        },
        page: 1,
        itemsPerPage: 20,
        tableWorkDone:[],
    }),
    watch: {
        page() {
            this.loadTableWorkDone()
        }
    },
    computed: {
        getTransactionTotalAmount() {
            let total = 0
            this.transactions.forEach(item => { 
                total = parseFloat(total) + parseFloat(item.transaction_total_amount)
            })
           return total.toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
            })
            // return parseFloat(total).toFixed(2).toString() 
        },
         getTotalNetSales() {
             let total_service_net_sales = 0
             let total_otc_net_sales = 0
             this.transactions.forEach(item => {
                if(item.otc_total_amount) total_otc_net_sales =parseFloat(total_otc_net_sales)+ parseFloat(item.transaction_net_sales_otc) 
                total_service_net_sales =parseFloat(total_service_net_sales)+ parseFloat(item.transaction_net_sales_services) 
             })
            let total = parseFloat(total_service_net_sales) + parseFloat(total_otc_net_sales)
            return total.toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
            })
        },
        getTotalServices() {
            let total = 0 
            this.transactions.forEach(item => {
                total =Number(total)+ Number(item.transaction_net_sales_services) 
                console.log(total , 'getTotalServices')
            })
            return total.toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
            })
        },
        getTotalOTC() {
            let total = 0 
            this.transactions.forEach(item => {
                if(item.otc_total_amount) total =parseFloat(total)+ parseFloat(item.transaction_net_sales_otc) 
            })
            return total.toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
            })
        },
        getActualNet() {
            let total = 0 
            this.yearlyTrasactions.forEach(item => { 
                 total =parseFloat(total)+ parseFloat(item.actual_net) 
            })
            return total.toLocaleString('en-US', {
            style: 'currency',
            currency: 'PHP',
            })
        },
        totalPages(){
            return  Math.ceil(this.yearlyServiceSales.length / this.itemsPerPage);
       },
    },
    async created() {
        if (this.userInfo.position_id == 0 && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
         }
        this.organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
        this.date1 = moment().startOf('month').format('YYYY-MM-DD')
        this.date2 = moment().endOf('month').format('YYYY-MM-DD')
        await this.evaluateTransactions()
    },
    methods: { 
        async evaluateTransactions() {
            
            await this.generateDashBoardCards()
            await this.generateYearlyActualNet()
            await this.generateYearServiceSales()
            await this.generateYearOTCSales()
            await this.loadTableWorkDone()
        },
        async loadTableWorkDone() {
            this.loading = true 
            await this.classTransactions.loadAllServicesSalesPerPage(this.organization_id, this.page, this.itemsPerPage).then((data) => {
                data.forEach(item => { 
                    let i = this.tableWorkDone.findIndex(x => x.service_id == item.service_id)
                    if (i > -1) {
                        this.tableWorkDone[i].work += 1 
                        this.tableWorkDone[i].price+= Number(item.price)
                    } else {
                        item.work = 1 
                        this.tableWorkDone.push(item)
                    }
                })
                this.loading = false 
                console.log(this.tableWorkDone , ' loadTableWorkDone')
             })  
        },
        async generateDashBoardCards() {
            this.loading = true 
            this.loadingText = 'TRANSACTIONS'
            await this.classTransactions.generateDashBoardCards(this.organization_id, this.date1, this.date2).then(data => { 
                console.log(data, 'generateDashBoardCards')
                this.loading = false
                this.transactions = data 
            })
        },
        async generateYearlyActualNet() {
            this.loading = true
             await this.classTransactions.generateYearlyActualNet(this.organization_id).then(data => { 
                console.log(data, 'generateYearlyActualNet')
                 this.loading = false
                this.yearlyTrasactions = data 
            })
        },
        async generateYearServiceSales() {
            this.loading = true
            await this.classTransactions.generateYearServiceSales(this.organization_id).then((data) => { 
                // this.yearlyServiceSales \
                console.log(data, ' generateYearServiceSales')
                data.forEach((item) => { 
                    let i = this.yearlyServiceSales.findIndex(x => x.category_id == item.category_id)
                    if (i > -1) {
                        let price = parseFloat(item.price).toFixed(2)
                        this.yearlyServiceSales[i].total_sales = Number(this.yearlyServiceSales[i].total_sales) + Number(price)
                        this.yearlyServiceSales[i].total_net_sales=Number(this.yearlyServiceSales[i].total_net_sales) +Number(item.total_net_sales)
                    } else {
                        this.yearlyServiceSales.push({ 
                            category_id: item.category_id,
                            category_name: item.category_name,
                            total_sales: item.price,
                            total_net_sales: item.total_net_sales, 
                        })
                    }
                    
                })
                this.loading=false
                console.log(this.yearlyServiceSales , 'generateYearServiceSales')
          })
        },
        async generateYearOTCSales() {
         this.loading = true
            await this.classTransactions.generateYearOTCSales(this.organization_id).then((data) => { 
                console.log(data, ' generateYearOTCSales')
                let total_sales = 0
                let total_net_sales = 0
                data.forEach(item => { 
                     total_sales += Number(item.product_total_amount)
                     total_net_sales += Number( item.total_net_sales) 
                })
                this.otcObject = {
                    category_name: "OTC",
                    total_sales: total_sales,
                    total_net_sales: total_net_sales
                }
                this.loading = false 
            })
       }
    
     
     
        
    }
}
</script>
<style scoped>
.rowContainer{
    height: 500px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}

</style>