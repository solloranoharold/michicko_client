<template>
    <v-container class="fluid" v-if="!loading">
        <v-card class="floating-card textTitle" >
            <v-card-text>
                <div>
                        <h2 class="text-center "> PAYMENT COMPUTATIONS</h2>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-title> Service Total Amount</v-list-item-title>
                                 <v-list-item-icon> ₱{{ totalAmountServices }}</v-list-item-icon>
                            </v-list-item>
                             <v-list-item v-for="( service , i ) in tableServiceCommissions" :key="i+'a'">
                                <v-list-item-title> Employee Service Commission</v-list-item-title>
                                 <v-list-item-icon> {{ service.commissions }}%</v-list-item-icon>
                            </v-list-item>
                          
                            <v-list-item>
                                <v-list-item-title> OTC Products Total Amount</v-list-item-title>
                                 <v-list-item-icon> ₱{{ totalAmountOTC }}</v-list-item-icon>
                            </v-list-item>
                              <v-list-item v-for="( otc , i ) in tableOTCProductCommissions" :key="i+'b'">
                                <v-list-item-title>  Employee OTC Product Commission</v-list-item-title>
                                 <v-list-item-icon> {{ otc.commissions }}%</v-list-item-icon>
                            </v-list-item>
                        </v-list>
                        <br/>
                        <tr> 
                            <strong>Total Amount to Pay :  <h1> ₱{{ totalAmount}}</h1> </strong>
                        </tr>
                        <tr> </tr>
                        <h4 class="text-center">Payment Methods</h4>
                        <v-divider style="border:1px solid;"/>
                        <v-radio-group
                            v-model="transactionObj.payment_method"
                            row 
                            >
                            <v-radio
                                label="Cash"
                                value="cash"
                            ></v-radio>
                            <v-radio
                                label="Cashless"
                                value="cashless"
                            ></v-radio>
                        </v-radio-group>
                        <div v-if="transactionObj.payment_method=='cashless'">
                             <v-text-field outlined dense  label="Referrence No" v-model="transactionObj.referrence_no"></v-text-field>
                            <!-- epayment -->
                             <v-autocomplete v-model="transactionObj.e_payment" :items="epayments" item-value="payment_method" item-text="payment_method" append-icon="mdi-credit-card-marker"   color="#BCAAA4" label="Payment Method" dense outlined ></v-autocomplete>
                        </div>
                       
                       
                        <v-textarea v-model="transactionObj.transaction_details" outlined dense label="Transaction Details"></v-textarea>
                             
                    </div>
                    <v-card-actions>
                          <v-btn @click="submitPOSData()" :disabled="!this.transactionObj.client_id || !this.tableServices.length || !this.tableServicesProduct.length" dark color="#BCAAA4"  block x-large> <v-icon large>mdi-database-settings</v-icon>Submit Transaction</v-btn>
        
                    </v-card-actions>
            </v-card-text>
         </v-card>
      <v-card style="height: 80px;" class="cardHeader textTitle"  color="#ECEFF1" >
            <v-card-text>
                <v-row >
                    <v-col md="4">
                        <v-autocomplete v-model="transactionObj.client_id" :items="clients" item-value="client_id" item-text="fullname" append-icon="mdi-account"   color="#BCAAA4" label="Client Name" dense outlined clearable ></v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-autocomplete v-model="tableServices" return-object  deletable-chips multiple small-chips color="#BCAAA4"  item-text="service_name" append-icon="mdi-package" :items="services" label="Work Done" dense outlined clearable ></v-autocomplete>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <br/>
        
       <v-row  class="textTitle">
        <v-col cols="12" md="12 " lg="12" xs="6" sm="6">
             <v-card  color="#ECEFF1" >
            <v-card-text style="height: 750px;">
                <v-row class="rowContainer">
                    <v-col md="7" xs="12" sm="12">
                       <v-card class="table-container textTitle"> 
                            <v-simple-table dense >
                               <thead >
                                    <tr style="background-color: #BCAAA4;">
                                        <th style="color:white">SERVICE</th>
                                        <th style="color:white">UNIT PRICE</th>
                                    </tr>
                               </thead>
                               <tbody>
                                <tr style="border:1px solid;" v-for="(item , i) in tableServices" :key="i" >
                                    <td>{{ item.service_name }}</td>
                                    <td>₱{{ parseFloat(item.price).toFixed(2) }}</td>
                                </tr>
                               </tbody>
                            </v-simple-table>
                       </v-card>
                            <v-simple-table dense  style="width: 100%;" v-if="tableServicesProduct.length">
                               <thead>
                                   <tr style="background-color: #BCAAA4;">
                                        <th style="color:white">SERVICE ITEM</th>
                                        <th style="color:white">QUANTITY</th>
                                        <th></th>
                                    </tr>
                               </thead>
                               <tbody>
                                <tr style="border:1px solid;" v-for="(item , i) in tableServicesProduct" :key="i" @click="getTableItem(item)">
                                    <td>{{ item.product_name  }}</td>
                                    <td>x{{ item.less_quantity}}{{ item.unit }}</td>
                                    <td><v-icon color="red" @click="deleteServiceProduct( item )">mdi-delete-outline</v-icon></td>
                                </tr>
                               </tbody>
                            </v-simple-table>
                    </v-col>
                    <v-col cols="12" md="5" sm="5" xs="5">
                        <v-card class="table-container">
                            <v-card-text>
                                <v-toolbar flat dense>
                                    <v-toolbar-title class="toolbarTitle">
                                         Service Product
                                    </v-toolbar-title>
                                </v-toolbar>
                                 <v-form
                                    ref="form"
                                    v-model="valid"
                                    lazy-validation
                                > 
                                     <v-autocomplete  :rules="nameRules" v-model="serviceProductObj" required return-object  color="#BCAAA4"  item-text="product_name" append-icon="mdi-content-cut" :items="serviceProducts" label="Service Product" dense outlined clearable ></v-autocomplete>
                                     <v-text-field :rules="nameRules" outlined type="number" :min="1" required prepend-inner-icon="mdi-plus-box" placeholder="Quantity" v-model="serviceProductObj.less_quantity" dense></v-text-field> 
                                         <v-list-item-subtitle>Minimum Required : {{serviceProductObj.net_value ? serviceProductObj.net_value : 0 }} {{serviceProductObj.unit  }}</v-list-item-subtitle>
                                     <v-list-item-subtitle>Rem. Quantity : {{serviceProductObj.total_value ? serviceProductObj.total_value : 0 }} {{serviceProductObj.unit  }}</v-list-item-subtitle>
                                    </v-form>
                            </v-card-text>
                            <v-card-actions class="justify-end">
                                <v-btn @click="evaluateServiceProduct()" rounded block :disabled="!valid || !serviceProductObj.less_quantity" color="#BCAAA4" large dark><v-icon>mdi-plus-circle-outline</v-icon>ADD ITEM</v-btn>
                            
                            </v-card-actions>
                        </v-card>
                        <br/>
                         
                    </v-col>
                     <v-col cols="12" md="12" lg="12" sm="6" xs="6">
                    <v-card > 
                        <v-card-text>
                             <v-autocomplete label="Employee Service Commissions" v-model="tableServiceCommissions" return-object item-text="fullname" multiple dense outlined deletable-chips small-chips :items="employeesService"></v-autocomplete>
                             <v-simple-table dense >
                                <thead>
                                    <tr style="background-color: #BCAAA4;">
                                        <th  style="color:white">Stylist</th>
                                        <th  style="color:white">Commission</th>
                                        <th  style="color:white">Total Amount</th>
                                        <th  style="color:white">Tip</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    <tr style="border:1px solid;" v-for="(item , i ) in JSON.parse(JSON.stringify(serviceCommissions))" :key="i+'a'">
                                        <td> {{  item.fullname }}</td>
                                        <td> {{ item.commissions }}%</td>
                                        <td>₱{{ item.commission_total_amount }}</td>
                                        <td style="width: 120px;" ><v-text-field  clearable type="number" min="1"  @input="parseServicesValue(item)" v-model="item.tip"></v-text-field></td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-toolbar flat dense>
                        <h2 class="text-center">OTC PRODUCTS </h2>
                        <v-spacer/>
                        <v-btn @click="addOTCProduct()" rounded   color="#BCAAA4"  dark><v-icon>mdi-plus-circle-outline</v-icon>add OTC PRODUCT</v-btn>
                    </v-toolbar>
                    <v-simple-table dense>
                               <thead>
                                    <tr style="background-color: #BCAAA4;">
                                        <th style="color:white">Product</th>
                                        <th style="color:white">Price</th>
                                        <th style="color:white">Quantity</th>
                                        <th style="color:white">Total Amount</th>
                                        <th></th>
                                    </tr>
                               </thead>
                               <tbody>
                                <tr style="border:1px solid;" v-for="(item , i) in tableOTCProducts" :key="i" @click="getTableItem(item)">
                                    <td>{{ item.product_name }}</td>
                                    <td>₱{{ parseFloat(item.price).toFixed(2) }}</td>
                                    <td>{{ item.less_quantity }}</td>
                                    <td>₱{{ parseFloat(item.product_total_amount).toFixed(2) }}</td>
                                    <td><v-icon @click="deleteOTC(item)" color="red">mdi-delete</v-icon></td>
                                </tr>
                               </tbody>
                            </v-simple-table>
                            <br/><br/>
                              <v-autocomplete  label="Employee OTC Product Commissions" v-model="tableOTCProductCommissions" return-object item-text="fullname" multiple dense outlined deletable-chips small-chips :items="employeesOTC"></v-autocomplete>
                            
                              <v-simple-table dense >
                                <thead>
                                    <tr style="background-color: #BCAAA4;">
                                        <th  style="color:white">Stylist</th>
                                        <th  style="color:white">Commission</th>
                                        <th  style="color:white">Total Amount</th>
                                        <th  style="color:white">Tip</th> 
                                    </tr>
                                </thead>
                                <tbody >
                                    <tr style="border:1px solid;" v-for="(item , i ) in JSON.parse(JSON.stringify(OTCCommissions))" :key="i+'b'">
                                        <td> {{  item.fullname }}</td>
                                        <td> {{ item.commissions }}%</td>
                                        <td>₱{{ item.commission_total_amount }}</td>
                                        <td style="width: 120px;" ><v-text-field  clearable type="number" min="1"  @input="parseOTCValue( item )" v-model="item.tip"></v-text-field></td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <br/>
        </v-col>
       </v-row>
     
    <OTCProductsDialogVue :dialog="otcDialog" :products="OTCProducts" @closeDialog ="closeDialog" @OTCProduct="OTCProduct"/>
    </v-container>
    <LoaderView v-else :loading-text="loadingText"/>
</template>
<script>
import Clients from '@/class/clients'
import Services from '@/class/services';
import Product from '@/class/products';
import Inventory from '@/class/inventory';
import Transactions from '@/class/transactions';
import LoaderView from '@/views/LoaderView.vue';
import OTCProductsDialogVue from './OTCProductsDialog.vue';
import Epayments from '@/class/epayments';
import Employees from '@/class/employees';
import Swal from 'sweetalert2'
// decreasing qty 
import { io } from "socket.io-client";

export default {
    components:{LoaderView , OTCProductsDialogVue},
    data: () => ({
        socket:null,
        classClients: new Clients(),
        classService: new Services(), 
        classProduct: new Product(),
        classInventory: new Inventory(),
        classEmployee: new Employees(),
        classTransaction: new Transactions(),
        classEpayments: new Epayments(),
        valid: false, 
        serviceProductObj: {},
        otcProductObj: {},
        transactionObj: {},
        OTCProductObj: {},
        stylists: [],
        employeesService: [],
        employeesOTC:[],
        clients: [],
        epayments: [],
        serviceProducts: [],
        OTCProducts: [],
        tableServicesProduct:[],
        tableServices: [],
        tableOTCProducts: [],
        tableServiceCommissions: [],
        tableOTCProductCommissions: [],
        commissionsData:[],
        nameRules: [
            v => !!v || 'This field is required'
        ],
        loadingText:'',
        services: [],
        loading: false, 
        otcDialog: false, 
        transactionID: "",
        
        // obj:{}
    }),
    watch: { 
        totalAmount(val) {
            this.transactionObj.transaction_total_amount = parseFloat(val).toFixed(2)
        }, 
        totalAmountServices(val) {
            this.transactionObj.service_total_amount = parseFloat(val).toFixed(2)
        },
        totalAmountOTC(val) {
            this.transactionObj.otc_total_amount = parseFloat(val).toFixed(2)
        } 
    },
    computed: {
        totalAmountServices() {
            let total = 0
            this.tableServices.forEach(data => { 
                total= Number(total) + Number( data.price )
            })
            return parseFloat(total).toFixed(2)
            
        },
        totalAmountOTC() {
            let total = 0
            this.tableOTCProducts.forEach(data => { 
                total= Number(total) + Number( data.product_total_amount )
            })
            return parseFloat(total).toFixed(2)
        },
        totalAmount() {
            let total = 0 
            console.log(this.totalAmountOTC, this.totalAmountServices)
            total = Math.floor(Number(this.totalAmountServices) +  Number(this.totalAmountOTC) )
            console.log(total, 'totalAmount')
            return parseFloat(total).toFixed(2)
        },
        serviceCommissions() {
            this.tableServiceCommissions.forEach(item => {
                let percent = item.commissions / 100 
                item.commission_total_amount = parseFloat(this.totalAmountServices * percent).toFixed(2)
            })
            return this.tableServiceCommissions
        },
         OTCCommissions() {
            this.tableOTCProductCommissions.forEach(item => {
                let percent = item.commissions / 100 
                item.commission_total_amount = parseFloat(this.totalAmountOTC * percent).toFixed(2)
            })
            return this.tableOTCProductCommissions
        }
    },
    async created() {
        let host = process.env.VUE_APP_API_URL
        this.generateTransactionID()
        this.socket = io(host,{
        transports: ['websocket'],
        });
        this.socket.on("connect_error", (err) => {
            // the reason of the error, for example "xhr poll error"
            console.log(err.message);
            // some additional description, for example the status code of the initial HTTP response
            console.log("HTTP response"+err.description);
            // some additional context, for example the XMLHttpRequest object
            console.log( err.context);
        });
        await this.loadAllClass()
    },
    methods: {
        parseServicesValue(item) {
             let i = this.tableServiceCommissions.findIndex(x => x.employee_id == item.employee_id)
            if (i > -1) {
                this.tableServiceCommissions[i].tip = item.tip
                this.tableServiceCommissions[i].commission_total_amount = item.commission_total_amount
            }
        },
        parseOTCValue(item) {
            let i = this.tableOTCProductCommissions.findIndex(x => x.employee_id == item.employee_id)
            if (i > -1) {
                this.tableOTCProductCommissions[i].tip = item.tip
                this.tableOTCProductCommissions[i].commission_total_amount = item.commission_total_amount
            }
        },
        deleteServiceProduct(item) {
            let i = this.tableServicesProduct.findIndex(x => x.inventory_id == item.inventory_id)
            if (i > -1)  this.tableServicesProduct.splice( i , 1 )
            
        },
        async loadAllClass() {
            this.tableServices = [] 
            this.tableServicesProduct = []
            this.tableOTCProducts=[]
            this.tableOTCProductCommissions = []
            this.tableServiceCommissions = []
            this.transactionObj = {}

            await this.loadAllClients()  
            await this.loadAllServices()
            await this.loadAllProducts()
            await this.loadAllInvetory()
            await this.loadAllEmployees()
            await this.loadAllEpayments()
            
        },
      
        getCommissionTotalAmountService( item ) {
            let percent = item.commissions / 100 
            return parseFloat( this.totalAmountServices * percent).toFixed(2)
           
        },
         getCommissionTotalAmountOTCProduct( item ) {
            let percent = item.commissions / 100 
           return parseFloat(this.totalAmountOTC * percent).toFixed(2)
             
        },
        async loadAllEpayments() {
            this.loading = true
            this.loadingText = 'EPAYMENTS'
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            await this.classEpayments.loadEpayments(organization_id).then((data) => { 
                if (!data.length) {
                        Swal.fire({
                        icon: "info",
                        title: "Insert Cashless Payment Method First",
                        showConfirmButton: true,
                        });
                    return false 
                }
                this.epayments = data 
                this.transactionObj.e_payment = data[0].payment_method
                this.loading = false 
                console.log(data , 'loadEpayments')
            })
        },
        async loadAllClients() {
            this.loading = true
            this.loadingText = 'CLIENTS'
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id: this.userInfo.organization_id
            await this.classClients.loadAllClients(organization_id).then((data) => { 
                this.clients = data 
                this.clients.forEach(data => { 
                    data.fullname = `${data.last_name} ${data.first_name}`
                })
                this.loading = false 
            })
            
            
        },
        async loadAllServices() {
            this.loading = true
            this.loadingText = 'SERVICES'
             let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id: this.userInfo.organization_id
            await this.classService.loadAllServices(organization_id).then((data) => { 
                this.services = data 
                console.log(this.services, 'loadAllServices')
                this.loading = false 
            })
             
        },
        async loadAllProducts() {
            this.loading = true 
            this.loadingText = 'OTC PRODUCTS'
             let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id: this.userInfo.organization_id
            await this.classProduct.loadAllProducts(organization_id).then((data) => { 
                this.OTCProducts = data 
                console.log(this.OTCProducts, 'loadAllProducts')
                this.loading = false 
             })
            
        },
        async loadAllInvetory() {
            this.loading = true
            this.loadingText = 'SERVICES PRODUCT'
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id : this.userInfo.organization_id
            await this.classInventory.loadAllInventory(organization_id).then((data) => { 
                this.serviceProducts = data
                console.log( this.serviceProducts , 'loadAllInvetory')
                this.loading = false 
             })
             
        },
        evaluateServiceProduct() {
            if (this.serviceProductObj.less_quantity > this.serviceProductObj.total_value) {
                alert(`${this.serviceProductObj.product_name} quantity is not enough`)
                return false 
            }
            let i = this.tableServicesProduct.findIndex(x=> x.inventory_id == this.serviceProductObj.inventory_id)
            if (i < 0) this.tableServicesProduct.push(this.serviceProductObj)
            this.serviceProductObj={}
        },
        addOTCProduct() {
            this.otcDialog = !this.otcDialog
        },
        OTCProduct( val ) {
            let i = this.tableOTCProducts.findIndex(x => x.product_id == val.product_id)
            if( i < 0 ) this.tableOTCProducts.push(val)
        },
        closeDialog(val) {
            this.otcDialog = val 
        },
        deleteOTC( item ) {
            let i = this.tableOTCProducts.findIndex(x => x.product_id == item.product_id)
            if(i> -1 ) this.tableOTCProducts.splice(i , 1 )
        },
        async loadAllEmployees() {
            this.loading = true
            this.loadingText='EMPLOYEES'
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id : this.userInfo.organization_id
            await this.classEmployee.loadEmployeesOption(organization_id).then((data) => {
                this.employeesService = JSON.parse(JSON.stringify(data.filter(item => { 
                    item.fullname = `${item.last_name} ${item.first_name} ${item.middle_name ? item.middle_name : ""} (${item.position})`
                    item.commission_total_amount = 0
                    item.commission_type = 'service'
                    item.tip=""
                    return item.position !='Manager'
                })))
                this.employeesOTC = JSON.parse(JSON.stringify(data.filter(item => { 
                    item.fullname = `${item.last_name} ${item.first_name} ${item.middle_name ? item.middle_name : ""} (${item.position})`
                    item.commission_total_amount = 0
                    item.commission_type = 'otc'
                    item.tip=""
                    return item.position !='Manager'
                })))
                //  console.log(this.employees , 'loadAllEmployees')
                this.loading = false 
            })
          
        },
        submitPOSData() {
            console.log(this.transactionObj, 'submitPOSData')
            if (!this.transactionObj.payment_method) {
                Swal.fire({
                        icon: "error",
                        title: "Select payment method",
                        showConfirmButton: true,
                    });
                return false 
            }
            if (this.transactionObj.payment_method == 'cashless' && !this.transactionObj.referrence_no) {
                 Swal.fire({
                        icon: "error",
                        title: "Please input referrence no!",
                        showConfirmButton: true,
                    });
                return false 
            }
            
             if (this.transactionObj.payment_method !== 'cashless') {
                this.transactionObj.referrence_no = null
                this.transactionObj.e_payment=null
            }
            this.transactionObj.total_commissions_otc = 0
             this.transactionObj.total_commissions_service=0
            Swal.fire({
                title: `Are you want to create this transaction ?`,
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Yes, create it!`,
            }).then(async (result) => { 
                if (result.isConfirmed) {
                    await this.generateTransactionID()
                    this.transactionObj.transaction_id = this.transactionID
                    this.transactionObj.updated_by = this.userInfo.employee_id
                    this.transactionObj.organization_id = this.userInfo.organization_id
                    let commission_services = 0
                    let commission_otc= 0


                    for (let x = 0; x< this.tableOTCProductCommissions.length; x++){
                        let item = this.tableOTCProductCommissions[x]
                        console.log(item , 'tableOTCProductCommissions')
                        item.transaction_id = this.transactionID
                        if (item.tip) this.transactionObj.total_commissions_otc += Number(item.tip)
                        this.transactionObj.total_commissions_otc+= Number(item.commission_total_amount) 
                        commission_otc = Number(commission_otc) + Number(item.commissions)
                    }
                    
                    this.tableServiceCommissions.forEach(item => {
                        item.transaction_id = this.transactionID
                         if (item.tip) this.transactionObj.total_commissions_service += Number(item.tip) 
                        this.transactionObj.total_commissions_service+= Number(item.commission_total_amount)
                        commission_services = Number(commission_services) + Number(item.commissions)
                    })
                    this.tableServices.forEach(item => {
                        item.transaction_id = this.transactionID
                        item.client_id = this.transactionObj.client_id
                        item.total_commissions = commission_services
                    })
                    this.transactionObj.no_of_service = this.tableServices.length
                    this.tableServicesProduct.forEach(item => {
                        item.transaction_id = this.transactionID
                        item.client_id = this.transactionObj.client_id
                        item.updated_by = this.userInfo.employee_id
                       
                    })
                       this.tableOTCProducts.forEach(item => {
                        item.transaction_id = this.transactionID
                        item.client_id = this.transactionObj.client_id
                        item.updated_by = this.userInfo.employee_id
                         item.total_commissions	 = commission_otc
                    })

                    try {
                        console.log(this.transactionObj)
                    
                        console.log(this.transactionObj.total_commissions_otc , 'otc commissions')
                         console.log(this.transactionObj.total_commissions_service , 'services commissions')
                    // INSERTING TRANSACTIONS DATA 
                       await this.createTransaction()
                       await this.createTransactionServices()
                       await this.createTransactionServicesProduct()
                       await this.createTransactionsOTCProducts()
                       await this.createTransactionsServicesCommissions()
                       await this.createTransactionsOTCCommissions()
                        // LESS QUANTITY FOR SERVICE / OTC PRODUCTS
                        await this.evaluateAffectedServicesProduct()
                        await this.evaluateAffectedOTCProduct()
                        await this.loadAllClass()
                  
                     await  this.socket.emit('load notification')
                       await Swal.fire({
                        icon: "success",
                        title: "Transaction has been completed!",
                        showConfirmButton: true,
                       });
                      
                    //   window.location.reload()
                     
                   } catch (error) {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: error.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                   }

                    
                }
            })
        },

        async createTransaction() {
            this.loading = true
            await this.classTransaction.createTransaction(this.transactionObj).then(() => { 
                this.loadingText = 'INSERTING TRANSACTION DATA'
                this.loading = false 
           })
        },
        async createTransactionServices() {
            this.loading=true
            await this.classTransaction.createTransactionServices(this.tableServices).then(() => {
                this.loadingText = 'INSERTING  TRANSACTION SERVICES '
                this.loading=false
            })
        },
         async createTransactionServicesProduct() {
            this.loading=true
            await this.classTransaction.createTransactionServicesProduct(this.tableServicesProduct).then(() => {
                this.loadingText = 'INSERTING TRANSACTION SERVICES PRODUCT'
                this.loading=false
            })
        },
        async createTransactionsOTCProducts() {
            this.loading = true
            await this.classTransaction.createTransactionsOTCProducts(this.tableOTCProducts).then(() => {
                this.loadingText = 'INSERTING TRANSACTION OTC PRODUCTS'
                this.loading=false
            })
        },
        async createTransactionsServicesCommissions() {
            this.loading = true
            await this.classTransaction.createTransactionsCommissions(this.serviceCommissions).then(() => {
                this.loadingText = 'INSERTING TRANSACTION COMMISSIONS'
                this.loading=false
            })
        },
        async createTransactionsOTCCommissions() {
            this.loading = true
            await this.classTransaction.createTransactionsCommissions(this.OTCCommissions).then(() => {
                this.loadingText = 'INSERTING TRANSACTION COMMISSIONS'
                this.loading=false
            })
        },
    
        async generateTransactionID() {
            var chars = '0123456789'.split('');
            var str = '';
            for (var i = 0; i < chars.length; i++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            this.transactionID = str
            // return str;
           
            // const timestamp = Date.now().toString(36); // Convert timestamp to base-36 string
            // const randomStr = Math.random().toString(36).substring(2, 8); // Generate random string
            // this.transactionID = timestamp + randomStr
        },
        async evaluateAffectedServicesProduct() {
            this.loading = true
            await this.classTransaction.evaluateAffectedServicesProduct(this.tableServicesProduct).then(() => { 
            this.loadingText='DECREASING SELECTED SERVICES ITEM'
                this.loading = false 
            })
        },
        async evaluateAffectedOTCProduct() {
            this.loading = true
             await this.classTransaction.evaluateAffectedOTCProduct(this.tableOTCProducts).then(() => { 
             this.loadingText='DECREASING SELECTED OTC PRODUCT/S'
                 this.loading = false 
            })
        }
    }
}
</script>

<style scoped>
.rowContainer{
    height: 720px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
   .table-container {
  height: 370px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
   .table-otc {
  height: 720px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
.table_otc_products{
     height: 350px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
.table_product_commission{
  height: 300px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
.table_service_commission{
     height: 200px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
.cardHeader { 
     height: 80px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
.subTotalcontainer{
  height: 80px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
.floating-card {
  position: relative;
  float: right;
  top: 120px;
  width: 300px; /* Adjust width as needed */
  margin: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Box shadow for the floating effect */
  transition: transform 0.3s ease-in-out; /* Smooth transition */
  transform: translateY(0); /* Initial position */
}

.floating-card:hover {
  transform: translateY(-10px); /* Adjust translateY for the hover effect */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Increase shadow on hover */
}
</style>