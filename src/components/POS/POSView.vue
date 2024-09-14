<template>
    <v-container fluid  v-if="!loading">
                <!-- DRAFTS  -->
        <v-flex v-if="posDraftTransactions.length > 0">
            <v-expansion-panels accordion class="textTitle" >
                <v-expansion-panel>
                    <v-expansion-panel-header><label><v-icon>mdi-file</v-icon> DRAFT TRANSACTIONS</label> </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-simple-table>
                            <thead>
                                <tr style="background-color: #BCAAA4;">
                                    <th style="color:white">Transaction</th>
                                    <th style="color:white"> Client</th>
                                    <th style="color:white"> Work Done</th>
                                    <th style="color:white">Date</th>
                                    <th style="color:white"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item , i ) in posDraftTransactions" :key="i">
                                    <td>{{item.transaction_id}}</td>
                                    <td>{{getClientName(item)}}</td>
                                    <td>{{ item.data.tableServices.length }}</td>
                                    <td>{{ item.date_saved }}</td>
                                    <td> 
                                        <v-btn x-small dark color="success" rounded @click="selectDraft(item)"><v-icon>mdi-select</v-icon> Select</v-btn>
                                        <v-btn x-small dark color="red" rounded @click="deleteDraft(item)"><v-icon>mdi-delete</v-icon>Delete</v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>  
             <br/>
        </v-flex>
      
       
       
        
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
         <v-card  :class=" !isMobile ? 'floating-card textTitle' : ' textTitle'" >
            <v-card-text>
                <div>
                    <v-expansion-panels accordion class="textTitle" flat>
                        <v-expansion-panel>
                        <v-expansion-panel-header>
                             <h3 class="text-center "> PAYMENT COMPUTATIONS</h3>
                         </v-expansion-panel-header>
                          <v-expansion-panel-content>
                                  <!-- <h2 class="text-center "> PAYMENT COMPUTATIONS</h2> -->
                            <v-list dense>
                                <v-list-item >
                                    <v-list-item-title> Service Total Amount</v-list-item-title>
                                    <v-list-item-icon> ₱{{ totalAmountServices }}</v-list-item-icon>
                                </v-list-item>
                                <!-- <v-list-item v-for="( service , i ) in tableServiceCommissions" :key="i+'a'">
                                    <v-list-item-title> Employee Service Commission</v-list-item-title>
                                    <v-list-item-icon> {{ service.commissions }}%</v-list-item-icon>
                                </v-list-item> -->
                            
                                <v-list-item>
                                    <v-list-item-title> OTC Products Total Amount</v-list-item-title>
                                    <v-list-item-icon> ₱{{ totalAmountOTC }}</v-list-item-icon>
                                </v-list-item>
                                <!-- <v-list-item v-for="( otc , i ) in tableOTCProductCommissions" :key="i+'b'">
                                    <v-list-item-title>  Employee OTC Product Commission</v-list-item-title>
                                    <v-list-item-icon> {{ otc.commissions }}%</v-list-item-icon>
                                </v-list-item> -->
                                
                            </v-list>
                            <v-list dense v-if="tableOtherFees.length > 0 && validateOtherFees ">
                                <v-list-item-title>Other Fees</v-list-item-title>
                                <v-list-item v-for="(item , i ) in tableOtherFees" :key="i">
                                    <v-list-item-title>{{ item.description }}</v-list-item-title>
                                    <v-list-item-icon>₱{{ item.amount  }}{{ item.operation }}</v-list-item-icon>
                                </v-list-item>
                            </v-list>
                            <v-list dense  v-if="Object.keys(selectedDiscount).length > 0 && selectedDiscount!=null ">
                                <v-list-item-title>Discount</v-list-item-title>
                                <v-list-item>
                                    <v-list-item-title>Discount( {{ selectedDiscount.description}} ) </v-list-item-title>
                                    <v-list-item-icon> {{ selectedDiscount.percent  }}%</v-list-item-icon>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-title>Original Total Amount </v-list-item-title>
                                    <v-list-item-icon> ₱{{  totalAmount }}</v-list-item-icon>
                                </v-list-item>
                            </v-list>
                            </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                      
                        <br/>
                        <tr> 
                            <strong>Total Amount to Pay :  <h1> ₱{{ Object.keys(selectedDiscount).length > 0  ? totalDiscountedAmount :totalAmount}}</h1> </strong>
                        </tr>
                        <tr> </tr>
                         <h4 class="text-center">Discounts</h4>
                         <v-divider style="border:1px solid;"/>
                         <br/>
                         <v-select clearable label="Discounts" outlined dense :items="discounts" item-text="description" return-object v-model="selectedDiscount"></v-select>
                        <h4 class="text-center">Payment Methods</h4>
                        <v-divider style="border:1px solid;"/>
                        <v-radio-group
                            v-model="transactionObj.payment_method"
                            row 
                            >
                            <v-radio
                                label="Cash"
                                value="cash"
                                @click="changeTipValue()"
                                
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
                    <!-- <v-card-actions>
                        
                        
                    </v-card-actions> -->
                    <v-btn @click="saveAsDraft()"  block :disabled="!this.transactionObj.client_id || !this.tableServices.length || !this.tableServicesProduct.length"   dark color="#BCAAA4"  x-large> <v-icon large>mdi-file</v-icon>save as draft</v-btn>
                    <br/>
                    <v-btn @click="submitPOSData()" :disabled="!this.transactionObj.client_id || !this.tableServices.length || !this.tableServicesProduct.length" dark color="#BCAAA4"  block x-large> <v-icon large>mdi-database-settings</v-icon>Submit Transaction</v-btn>
                    
                    
                        
            </v-card-text>
         </v-card>
         <br/>
       <v-row  class="textTitle">
      
        <v-col cols="12" md="12 " lg="12" xs="12" sm="12">
             <v-card  color="#ECEFF1" >
            <v-card-text style="height: 750px;">
                <v-row class="rowContainer">
                    <v-col lg="7" md="7" xs="6" sm="6">
                       <v-card class="table-container textTitle"> 
                            <v-simple-table dense >
                               <thead >
                                    <tr style="background-color: #BCAAA4;">
                                        <th style="color:white">SERVICE</th>
                                        <th style="color:white">UNIT PRICE</th>
                                        <th style="color:white">Additional</th>
                                    </tr>
                               </thead>
                               <tbody>
                                <tr style="border:1px solid;" v-for="(item , i) in tableServices" :key="i" >
                                    <td>{{ item.service_name }}</td>
                                    <td>₱{{ parseFloat(item.price).toFixed(2) }}</td>
                                    <td style="width:150px"> <v-text-field type="number" dense prepend-inner-icon="mdi-currency-php" v-model="item.additional"></v-text-field></td>

                                </tr>
                               </tbody>
                            </v-simple-table>
                       </v-card>
                    </v-col>
                    <v-col cols="12" md="5" sm="6" xs="6">
                        <v-card class="table-container">
                             <v-simple-table dense  style="width: 100%;" >
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
                        </v-card>
                        <br/>
                         
                    </v-col>
                   
                   
                    <v-col cols="12" md="12" lg="12" sm="12" xs="12">
                        <v-card>
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
                                     <v-list-item-subtitle>Remaining : {{serviceProductObj.total_value ? serviceProductObj.total_value : 0 }} {{serviceProductObj.unit  }}</v-list-item-subtitle>
                                    </v-form>
                             </v-card-text>
                              <v-card-actions class="justify-end">
                                <v-btn @click="evaluateServiceProduct()" rounded block :disabled="!valid || !serviceProductObj.less_quantity" color="#BCAAA4" large dark><v-icon>mdi-plus-circle-outline</v-icon>ADD ITEM</v-btn>
                               
                            </v-card-actions>
                        </v-card>
                    </v-col>
                    <!-- <v-col cols="12" md="12" sm="6" xs="6">
                         <v-card class="textTitle"> 
                            <v-card-text>
                                <v-toolbar flat dense>
                                     <v-toolbar-title class="toolbarTitle">
                                     Other Fees
                                    </v-toolbar-title>
                                    <v-spacer/>
                                     <v-btn :disabled="tableOtherFees.length==0" small dark color="#BCAAA4" @click="tableOtherFees.push({})"> validate </v-btn>
                                    <v-btn small dark color="#BCAAA4" @click="tableOtherFees.push({})"> add </v-btn>
                                </v-toolbar>
                                <v-simple-table dense >
                                    <thead>
                                       <tr style="background-color: #BCAAA4;">
                                        <th style="color:white">Description</th>
                                        <th style="color:white">Operation</th>
                                        <th style="color:white">Price</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item , i ) in tableOtherFees" :key="i">
                                            <td>
                                                <v-text-field v-model="item.description" :rules="nameRules" color="#BCAAA4" label="Description" placeholder="Description"></v-text-field>
                                            </td>
                                            <td style="width: 100px;" align="center">
                                            <v-select  :items="operations" v-model="item.operation"></v-select>
                                            </td>
                                            <td>
                                                <v-text-field v-model="item.amount" :rules="nameRules" color="#BCAAA4" type="number" label="Price" placeholder="Price"></v-text-field>
                                            </td>
                                            <td align="center">
                                                <v-icon  dark color="red" @click="tableOtherFees.splice(i , 1 )">mdi-delete-outline</v-icon>
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-simple-table>
                            </v-card-text>
                         </v-card>
                    </v-col> -->
                     <v-col cols="12" md="12" lg="12" sm="12" xs="12">
                    <v-card > 
                        <v-card-text>
                             <v-autocomplete label="Employee Service Commissions" v-model="tableServiceCommissions" return-object item-text="fullname" multiple dense outlined deletable-chips small-chips :items="employeesService"></v-autocomplete>
                             <v-simple-table dense >
                                <thead>
                                    <tr style="background-color: #BCAAA4;">
                                        <th  style="color:white">Stylist</th>
                                        <th  style="color:white">Service</th>
                                        <!-- <th  style="color:white">Commission</th> -->
                                        <th  style="color:white">Total Amount</th>
                                        <th  style="color:white">Tip</th>
                                    </tr>
                                </thead>
                                <tbody >
                                   
                                    <tr style="border:1px solid;" v-for="(item , i ) in JSON.parse(JSON.stringify(serviceCommissions))" :key="i+'a'">
                                        <td> {{item.fullname }}</td>
                                        <!-- <td> 
                                            <v-autocomplete :items="tableServices"  label="Select Service" item-text="service_name" item-value="service_id"  v-model="item.service_id" @change="parseServicesValue(item)"></v-autocomplete>
                                        </td> -->
                                        <td> {{ item.commissions }}%</td>
                                        <td>₱{{ item.commission_total_amount }}</td>
                                        <td style="width: 120px;" ><v-text-field :disabled="transactionObj.payment_method == 'cash'"  type="number" min="1"  @input="parseServicesValue(item)" v-model="item.tip"></v-text-field></td>
                                        
                                    </tr>
                                </tbody>
                            </v-simple-table>
                            
                        </v-card-text>
                    </v-card>
                     <v-switch
                        v-model="switchOtc"
                        flat
                        :label="`Add OTC Products ?`"
                    ></v-switch>
                </v-col>
                
                <v-col v-if="switchOtc">
                    <v-toolbar flat dense>
                        <h3 class="text-center">OTC PRODUCTS </h3>
                        <v-spacer/>
                         <v-btn small :disabled="tableOTCProducts.length == 0 " @click="tableOTCProducts=[]" rounded   color="#BCAAA4"  dark><v-icon>mdi-close</v-icon>clear otc </v-btn>
                        <v-btn small @click="addOTCProduct()" rounded   color="#BCAAA4"  dark><v-icon>mdi-plus-circle-outline</v-icon>add OTC </v-btn>
                        
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
                                    <td>₱{{ parseFloat(item.srp).toFixed(2) }}</td>
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
                                        <!-- <th  style="color:white">Product</th> -->
                                        <th  style="color:white">Commission</th>
                                        <th  style="color:white">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    <tr style="border:1px solid;" v-for="(item , i ) in JSON.parse(JSON.stringify(OTCCommissions))" :key="i+'b'">
                                       <td> {{  item.fullname }}</td>
                                       <!-- <td> 
                                            <v-autocomplete :items="tableOTCProducts"  label="Select Product" item-text="product_name" item-value="product_id"  v-model="item.product_id" @change="parseOTCValue(item)"></v-autocomplete>
                                        </td> -->
                                        <td> {{ item.commissions }}%</td>
                                        <td>₱{{ item.commission_total_amount }}</td>
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
    
        <v-dialog v-model="totalDialog"  persistent
        transition="dialog-top-transition"
        max-width="500">
            <v-card>
                <v-toolbar color="#BCAAA4" dark  class="toolbarTitle">
                <v-icon>mdi-currency-php</v-icon>SALES INVOICE
            </v-toolbar>
            <v-card-text>
                <br/>
                <h2 class="text-center "> PAYMENT COMPUTATIONS</h2>
                 <v-list dense class="textTitle">
                    <!-- <v-autocomplete v-model="transactionObj.client_id" :items="clients" item-value="client_id" item-text="fullname" append-icon="mdi-account"   color="#BCAAA4" label="Client Name" dense outlined clearable ></v-autocomplete> -->
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title> {{ clientName }}</v-list-item-title>
                                <v-list-item-subtitle>Client Name</v-list-item-subtitle>
                            </v-list-item-content>
                            
                        </v-list-item>
                        <v-list-title>Services</v-list-title>
                            <v-list-item v-for="(item , i ) in tableServices" :key="i">
                                <v-list-item-title> {{  item.service_name }}</v-list-item-title>
                                <v-list-item-icon> ₱{{ parseFloat(item.price).toFixed(2) }}</v-list-item-icon>
                            </v-list-item>
                            <v-list-item >
                                <v-list-item-title> <strong>Total Amount</strong></v-list-item-title>
                                 <v-list-item-icon> <strong>₱{{ totalAmountServices }}</strong></v-list-item-icon>
                            </v-list-item>
                             <!-- <v-list-item v-for="( service , i ) in tableServiceCommissions" :key="i+'a'">
                                <v-list-item-title> Employee Service Commission</v-list-item-title>
                                 <v-list-item-icon> {{ service.commissions }}%</v-list-item-icon>
                            </v-list-item> -->
                            <v-list-title v-if="tableOTCProducts.length">OTC Products</v-list-title>
                            <v-list-item v-for="(item , i ) in tableOTCProducts" :key="i" >
                                <v-list-item-title> {{  item.product_name }}</v-list-item-title>
                                <v-list-item-icon> ₱{{ parseFloat(item.srp).toFixed(2) }}</v-list-item-icon>
                            </v-list-item>
                            <v-list-item v-if="tableOTCProducts.length">
                                <v-list-item-title> <strong>Total Amount</strong></v-list-item-title>
                                 <v-list-item-icon><strong> ₱{{ totalAmountOTC }}</strong></v-list-item-icon>
                            </v-list-item>
                              <!-- <v-list-item v-for="( otc , i ) in tableOTCProductCommissions" :key="i+'b'">
                                <v-list-item-title>  Employee OTC Product Commission</v-list-item-title>
                                 <v-list-item-icon> {{ otc.commissions }}%</v-list-item-icon>
                            </v-list-item> -->
                            
                        </v-list>
                        <v-list dense v-if="tableOtherFees.length > 0 && validateOtherFees ">
                            <v-list-item-title>Other Fees</v-list-item-title>
                            <v-list-item v-for="(item , i ) in tableOtherFees" :key="i">
                                <v-list-item-title>{{ item.description }}</v-list-item-title>
                                 <v-list-item-icon>₱{{ item.amount  }}{{ item.operation }}</v-list-item-icon>
                            </v-list-item>
                        </v-list>
                         <v-list dense  v-if="Object.keys(selectedDiscount).length > 0 && selectedDiscount!=null ">
                            <v-list-item-title>Discount</v-list-item-title>
                            <v-list-item>
                                <v-list-item-title>Discount( {{ selectedDiscount.description}} ) </v-list-item-title>
                                 <v-list-item-icon> {{ selectedDiscount.percent  }}%</v-list-item-icon>
                            </v-list-item>
                             <v-list-item>
                                <v-list-item-title>Original Total Amount </v-list-item-title>
                                 <v-list-item-icon> ₱{{  totalAmount }}</v-list-item-icon>
                            </v-list-item>
                        </v-list>
                        <br/>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-title>Payment Method</v-list-item-title>
                                <v-list-item-icon> {{  transactionObj.payment_method }}</v-list-item-icon>
                            </v-list-item>
                             <v-list-item>
                                <v-list-item-title>Transaction Details</v-list-item-title>
                                <v-list-item-icon> {{  transactionObj.transaction_details }}</v-list-item-icon>
                            </v-list-item>
                        </v-list>  
                        <br/>
                        <tr> 
                            <strong>Total Amount to Pay :  <h1> ₱{{ Object.keys(selectedDiscount).length > 0  ? totalDiscountedAmount :totalAmount}}</h1> </strong>
                        </tr>
                
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                    <v-btn small dark color="success" @click="submitPOSDialogData()">Submit</v-btn>
                     <v-btn small dark color="red" @click="totalDialog = !totalDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
import Discounts from '@/class/discounts';
import Swal from 'sweetalert2'
// decreasing qty 
import { io } from "socket.io-client";


import moment from 'moment'
import _ from 'lodash'
export default {
    components:{LoaderView , OTCProductsDialogVue},
    data: () => ({
        switchOtc:false, 
        socket: null,
        totalDialog:false , 
        classClients: new Clients(),
        classService: new Services(), 
        classProduct: new Product(),
        classInventory: new Inventory(),
        classEmployee: new Employees(),
        classTransaction: new Transactions(),
        classEpayments: new Epayments(),
        classDiscount: new Discounts(),
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
        tableOtherFees: [],
        operations: ['+', '-'],
        commissionsData:[],
        nameRules: [
            v => !!v || 'This field is required'
        ],
        loadingText:'',
        services: [],
        loading: false, 
        otcDialog: false, 
        transactionID: "",
        discounts: [],
        selectedDiscount: {},
        
        // obj:{}
    }),
    
    watch: { 
        selectedDiscount(val) {
            if (val == null) this.selectedDiscount = {}  
        },
        totalAmount(val) {
            this.transactionObj.transaction_total_amount = parseFloat(val).toFixed(2)
            
        }, 
        totalDiscountedAmount(val) {
            this.transactionObj.original_total_amount = this.transactionObj.transaction_total_amount
            this.transactionObj.transaction_total_amount = parseFloat(val).toFixed(2)
            this.transactionObj.discount_id = this.selectedDiscount.discount_id
            this.transactionObj.discount = this.selectedDiscount.percent
        },
        otherFees(val) {
            this.transactionObj.other_fees_total=  parseFloat(val).toFixed(2)
        },
        totalAmountServices(val) {
            this.transactionObj.service_total_amount = parseFloat(val).toFixed(2)
        },
        totalAmountOTC(val) {
            this.transactionObj.otc_total_amount = parseFloat(val).toFixed(2)
        }, 
    },
    computed: {
        totalAmountServices() {
            let total = 0
            this.tableServices.forEach(data => { 
                total= Number(total) + Number( data.price ) + Number(data.additional)
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
            total = Math.floor(Number(this.totalAmountServices) +  Number(this.totalAmountOTC) +  Number(this.otherFees))
            console.log(total, 'totalAmount')
            return parseFloat(total).toFixed(2)
        },

        totalDiscountedAmount() {
            let total = 0 
            console.log(this.totalAmountOTC, this.totalAmountServices)
            total = Math.floor(Number(this.totalAmountServices) + Number(this.totalAmountOTC) +  Number(this.otherFees)) 
            if (Object.keys(this.selectedDiscount).length > 0) {
                let percent = (this.selectedDiscount.percent / 100)
                let discount = parseFloat(total).toFixed(2) * parseFloat(percent).toFixed(2)
                total = parseFloat(total).toFixed(2) - parseFloat(discount).toFixed(2)
            }
            return parseFloat(total).toFixed(2)
        },
        otherFees() {
            let total = 0 
            this.tableOtherFees.forEach(data => { 
                if (data.amount && data.operation) {
                    let expression = `${parseFloat(total).toFixed(2)} ${data.operation} ${parseFloat(data.amount).toFixed(2)}`
                    total = eval(expression)
                }
                
            })
            console.log(total ,'otherFees')
           return parseFloat(total).toFixed(2)
        },
        serviceCommissions() {
            this.tableServiceCommissions.forEach(item => {
                let percent = item.commissions / 100 
                item.commission_total_amount = parseFloat(this.totalAmountServices * percent).toFixed(2)
                item.service_id = null
            })
            return this.tableServiceCommissions
        },
         OTCCommissions() {
            this.tableOTCProductCommissions.forEach(item => {
                let percent = item.commissions / 100 
                item.commission_total_amount = parseFloat(this.totalAmountOTC * percent).toFixed(2)
                item.product_id = null
            })
            return this.tableOTCProductCommissions
        },
        validateOtherFees() {
            let hasBlank = false 
            this.tableOtherFees.forEach(data => { 
                hasBlank = data.description && data.amount && data.operation ? true : false 
            })  
            return hasBlank
        },
         clientName() {
            let i = this.clients.findIndex(x => x.client_id == this.transactionObj.client_id)
             if (i > -1) return this.clients[i].fullname
            return ''
        },
    },
    async created() {
        this.handleResize()
        let host = process.env.VUE_APP_API_SOCKET
        console.log(host)
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
       
        changeTipValue() {
            this.tableServiceCommissions.forEach(item => {
                item.tip = 0
                 this.parseServicesValue( item)
            })
            this.tableOTCProductCommissions.forEach(item => {
                item.tip = 0 
                this.parseOTCValue( item)
            })
        },
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
            await this.loadDiscounts()
            
        },
      
        getCommissionTotalAmountService( item ) {
            let percent = item.commissions / 100 
            return parseFloat( this.totalAmountServices * percent).toFixed(2)
           
        },
         getCommissionTotalAmountOTCProduct( item ) {
            let percent = item.commissions / 100 
           return parseFloat(this.totalAmountOTC * percent).toFixed(2)
             
        },
        async loadDiscounts() {
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id : this.userInfo.organization_id
            this.loading = true
            this.loadingText= "DISCOUNTS"
            await this.classDiscount.readDiscounts(organization_id).then(data => { 
                this.discounts = data 
                this.loading=false 
            })
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
                        showConfirmButton: false,
                        });
                        this.$router.push('/cashless')
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
                data.forEach( item=> item.additional = 0)
                this.services =  _.orderBy(data ,['service_name'],['asc'])
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
            console.log(this.serviceProductObj, 'evaluateServiceProduct')
            // let value = this.serviceProductObj.less_quantity / 100 
            console.log(parseFloat(this.serviceProductObj.less_quantity) , parseFloat(this.serviceProductObj.total_value))
            if (parseFloat(this.serviceProductObj.less_quantity) > parseFloat(this.serviceProductObj.total_value)) {
                alert(`${this.serviceProductObj.product_name} quantity is not enough`)
                return false 
            }
            let qty = this.serviceProductObj.less_quantity

            let i = this.tableServicesProduct.findIndex(x=> x.inventory_id == this.serviceProductObj.inventory_id)
            if (i < 0) this.tableServicesProduct.push(JSON.parse(JSON.stringify(this.serviceProductObj)))
            else {
                let new_qty = parseInt(this.tableServicesProduct[i].less_quantity) + parseInt( qty) 
                 if (new_qty > this.serviceProductObj.total_value) {
                    alert(`${this.serviceProductObj.product_name} quantity is not enough`)
                    return false 
                }
               this.tableServicesProduct[i].less_quantity = new_qty
            }
            this.serviceProductObj.less_quantity=0
            this.serviceProductObj=JSON.parse(JSON.stringify({}))
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
                    item.fullname = item.nickname ? `${item.nickname} (${item.position})` : `${item.last_name} ${item.first_name} ${item.middle_name ? item.middle_name : ""} (${item.position})`
                    item.commission_total_amount = 0
                    item.commission_type = 'service'
                    item.tip=0
                    return item.position !='Manager' && item.status == 1 
                })))
                this.employeesOTC = JSON.parse(JSON.stringify(data.filter(item => { 
                    item.fullname = item.nickname ? `${item.nickname} (${item.position})` :`${item.last_name} ${item.first_name} ${item.middle_name ? item.middle_name : ""} (${item.position})`
                    item.commission_total_amount = 0
                    item.commission_type = 'otc'
                    item.tip=0
                    return item.position !='Manager' && item.position !='Junior' && item.status == 1 
                })))
                //  console.log(this.employees , 'loadAllEmployees')
                this.loading = false 
            })
          
        },
        //FOR DRAFTS 
        selectDraft(item) {
            Swal.fire({
                title: `Are you want to select this draft transaction?`,
                 text: "Data will be deleted after selected!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#90CAF9",
                cancelButtonColor: "white",
                confirmButtonText: `Yes, select it!`,
            }).then(async (result) => { 
                if (result.isConfirmed) {
                    this.transactionObj = JSON.parse(JSON.stringify(item.data.transactionObj))
                    this.tableOTCProductCommissions = JSON.parse(JSON.stringify(item.data.tableOTCProductCommissions))
                    this.tableOTCProducts = JSON.parse(JSON.stringify(item.data.tableOTCProducts))
                    this.tableServiceCommissions = JSON.parse(JSON.stringify(item.data.tableServiceCommissions))
                    this.tableServices = JSON.parse(JSON.stringify(item.data.tableServices))
                    this.tableServicesProduct = JSON.parse(JSON.stringify(item.data.tableServicesProduct))
                    let i = this.posDraftTransactions.findIndex(x => x.transaction_id == item.transaction_id)
                    if (i > -1) {
                        this.posDraftTransactions.splice(i, 1)
                         this.$store.commit('DRAFT_TRANSACTIONS', this.posDraftTransactions)
                        await Swal.fire({
                            icon: "success",
                            title: "Transaction has been saved as draft!",
                            timer:3000,
                            toast: true, 
                            position:'bottom-end',
                            showConfirmButton:false , 
                            
                        });
                    }
                 }
            })
        },
        getClientName(item) {
            let i = this.clients.findIndex(x => x.client_id == item.data.transactionObj.client_id)
            if(i>-1 ) return this.clients[i].fullname
        },
        async deleteDraft( item ) {
            Swal.fire({
                title: `Are you want to delete this transaction in draft?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#90CAF9",
                cancelButtonColor: "white",
                confirmButtonText: `Yes, delete it!`,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let i = this.posDraftTransactions.findIndex(x => x.transaction_id == item.transaction_id)
                    if (i > -1) this.posDraftTransactions.splice(i, 1)
                    await Swal.fire({
                            icon: "success",
                            title: "Transaction has been deleted!",
                            timer:3000,
                            toast: true, 
                            position:'bottom-end',
                            showConfirmButton:false , 
                            
                        });
                 }

            })
        },
        async saveAsDraft() {
             this.transactionObj.total_commissions_otc = 0
             this.transactionObj.total_commissions_service=0
            Swal.fire({
                title: `Are you want to save this transaction as draft?`,
                icon: "warning",
                showCancelButton: true,
                 confirmButtonColor: "#90CAF9",
                cancelButtonColor: "white",
                confirmButtonText: `Yes, save it!`,
            }).then(async (result) => {
                if (result.isConfirmed) { 
                    if (!this.transactionObj.transaction_id) {
                        await this.generateTransactionID()
                        this.transactionObj.transaction_id = this.transactionID
                    }
                    this.transactionObj.updated_by = this.userInfo.employee_id
                    this.transactionObj.organization_id = this.userInfo.organization_id
                    let commission_services = 0
                    let commission_otc = 0
                     for (let x = 0; x< this.tableOTCProductCommissions.length; x++){
                        let item = this.tableOTCProductCommissions[x]
                        console.log(item , 'tableOTCProductCommissions')
                        item.transaction_id = this.transactionID
                        // if (item.tip) this.transactionObj.total_commissions_otc += Number(item.tip)
                        this.transactionObj.total_commissions_otc+= Number(item.commission_total_amount) 
                        commission_otc = Number(commission_otc) + Number(item.commissions)
                         item.date_created = moment().format('YYYY-MM-DD HH:mm:ss')
                     }
                    
                    this.tableServiceCommissions.forEach(item => {
                        item.transaction_id = this.transactionID
                        //  if (item.tip) this.transactionObj.total_commissions_service += Number(item.tip) 
                        this.transactionObj.total_commissions_service+= Number(item.commission_total_amount)
                        commission_services = Number(commission_services) + Number(item.commissions)
                         item.date_created = moment().format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.tableServices.forEach(item => {
                        item.transaction_id = this.transactionID
                        item.client_id = this.transactionObj.client_id
                        item.total_commissions = commission_services
                         item.created_date = moment().format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.transactionObj.no_of_service = this.tableServices.length
                    this.tableServicesProduct.forEach(item => {
                        item.transaction_id = this.transactionID
                        item.client_id = this.transactionObj.client_id
                        item.updated_by = this.userInfo.employee_id
                        item.date_created = moment().format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.tableOTCProducts.forEach(item => {
                        item.transaction_id = this.transactionID
                        item.client_id = this.transactionObj.client_id
                        item.updated_by = this.userInfo.employee_id
                        item.total_commissions = commission_otc
                          item.date_created = moment().format('YYYY-MM-DD HH:mm:ss')
                    })
                    console.log(this.transactionObj.total_commissions_otc , 'otc commissions')
                    console.log(this.transactionObj.total_commissions_service , 'services commissions')
                    let obj = { 
                        transaction_id: this.transactionObj.transaction_id,
                        date_saved: moment().format('YYYY-MM-DD HH:mm:ss A'), 
                        data: { 
                            transactionObj: this.transactionObj,
                            tableOTCProductCommissions: this.tableOTCProductCommissions, 
                            tableServiceCommissions: this.tableServiceCommissions,
                            tableServices: this.tableServices,
                            tableServicesProduct: this.tableServicesProduct, 
                            tableOTCProducts: this.tableOTCProducts,
                            tableOtherFees: this.tableOtherFees,
                            selectedDiscount: this.selectedDiscount
                        }
                    }
                    let i = this.posDraftTransactions.findIndex(x => x.transaction_id == obj.transaction_id)
                    if (i > -1) {
                        this.posDraftTransactions[i].data = obj.data
                    } else {
                        this.posDraftTransactions.push(obj)
                    }
                    this.$store.commit('DRAFT_TRANSACTIONS', this.posDraftTransactions)
                        await Swal.fire({
                            icon: "success",
                            title: "Transaction has been saved as draft!",
                            timer:3000,
                            toast: true, 
                            position:'bottom-end',
                            showConfirmButton:false , 
                            
                        });
                       await this.loadAllClass()   
                }
            })
        },
        submitPOSData() {
            console.log(this.transactionObj, 'submitPOSData')
            if (!this.transactionObj.payment_method) {
                Swal.fire({
                        icon: "error",
                        title: "Select payment method",
                        showConfirmButton: false,
                        toast: true, 
                        position: 'bottom-end',
                        timer:3000,
                    });
                return false 
            }
            // if (this.transactionObj.payment_method == 'cashless' && !this.transactionObj.referrence_no) {
            //      Swal.fire({
            //             icon: "error",
            //             title: "Please input referrence no!",
            //              showConfirmButton: false,
            //              toast: true, 
            //             position: 'bottom-end',
            //             timer:3000,
            //         });
            //     return false 
            // }
            
             if (this.transactionObj.payment_method !== 'cashless') {
                this.transactionObj.referrence_no = null
                this.transactionObj.e_payment=null
            }
            if (this.tableOtherFees.length > 0 && !this.validateOtherFees) {
                 Swal.fire({
                        icon: "error",
                        title: "Other Fees has blank inputs",
                         showConfirmButton: false,
                         toast: true, 
                        position: 'bottom-end',
                        timer:3000,
                    });
                return false 
            }
            this.transactionObj.total_commissions_otc = 0
            this.transactionObj.total_commissions_service = 0
             this.totalDialog = !this.totalDialog
  
        },
        async submitPOSDialogData() {
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
                    if (!this.transactionObj.transaction_id) {
                        await this.generateTransactionID()
                        this.transactionObj.transaction_id = this.transactionID
                    } else {
                        this.transactionID = this.transactionObj.transaction_id 
                    }
                     this.transactionObj.updated_by = this.userInfo.employee_id
                        this.transactionObj.organization_id = this.userInfo.organization_id
                        let commission_services = 0
                        let commission_otc= 0


                        for (let x = 0; x< this.tableOTCProductCommissions.length; x++){
                            let item = this.tableOTCProductCommissions[x]
                            console.log(item , 'tableOTCProductCommissions')
                            item.transaction_id = this.transactionID
                            // if (item.tip) this.transactionObj.total_commissions_otc += Number(item.tip) di kasama sa dashboard
                            this.transactionObj.total_commissions_otc+= Number(item.commission_total_amount) 
                            commission_otc = Number(commission_otc) + Number(item.commissions)
                            item.date_created = moment().format('YYYY-MM-DD HH:mm:ss')
                        }
                        
                        this.tableServiceCommissions.forEach(item => {
                            item.transaction_id = this.transactionID
                            // if (item.tip) this.transactionObj.total_commissions_service += Number(item.tip)  di kasama sa dashboard
                            this.transactionObj.total_commissions_service+= Number(item.commission_total_amount)
                            commission_services = Number(commission_services) + Number(item.commissions)
                             item.date_created = moment().format('YYYY-MM-DD HH:mm:ss')
                        })
                        this.tableServices.forEach(item => {
                            item.transaction_id = this.transactionID
                            item.client_id = this.transactionObj.client_id
                            item.total_commissions = commission_services
                             item.created_date = moment().format('YYYY-MM-DD HH:mm:ss')
                        })
                        this.transactionObj.no_of_service = this.tableServices.length
                        this.tableServicesProduct.forEach(item => {
                            item.transaction_id = this.transactionID
                            item.client_id = this.transactionObj.client_id
                            item.updated_by = this.userInfo.employee_id
                            item.date_created = moment().format('YYYY-MM-DD HH:mm:ss')
                        })
                        this.tableOTCProducts.forEach(item => {
                            item.transaction_id = this.transactionID
                            item.client_id = this.transactionObj.client_id
                            item.updated_by = this.userInfo.employee_id
                            item.total_commissions = commission_otc
                            item.date_created = moment().format('YYYY-MM-DD HH:mm:ss')
                        })
                        this.tableOtherFees.forEach(item => { 
                            item.transaction_id = this.transactionID
                            item.organization_id = this.userInfo.organization_id
                            item.date_created = moment().format('YYYY-MM-DD HH:mm:ss')
                        })
                     console.log(this.transactionObj)
                    
                   

                    try {
                       
                    
                        console.log(this.transactionObj.total_commissions_otc , 'otc commissions')
                         console.log(this.transactionObj.total_commissions_service , 'services commissions')
                        // INSERTING TRANSACTIONS DATA 
                    
                        await this.createTransaction().then(async () => { 
                            await this.createTransactionServices()
                            await this.createTransactionServicesProduct()
                            await this.evaluateAffectedServicesProduct()
                            await this.createTransactionsOTCProducts()
                            await this.createTransactionsServicesCommissions()
                            await this.createTransactionsOTCCommissions()
                            await this.createTransactionsOtherFees()
                            await this.loadAllClass()   
                       })
                      
                    this.totalDialog = false  
                     await  this.socket.emit('load notification')
                       await Swal.fire({
                        icon: "success",
                        title: "Transaction has been completed!",
                        timer:3000,
                        toast: true, 
                        position:'bottom-end',
                        showConfirmButton:false , 
                        
                       });
                     
                    //   window.location.reload()
                     
                   } catch (error) {
                    // Swal.fire({
                    //     position: "bottom-end",
                    //     icon: "error",
                    //     title: error.message,
                    //     showConfirmButton: false,
                    //     timer: 1500
                        // });
                    console.log(error.message)
                    await Promise.resolve(this.submitPOSData())
                   }

                    
                }
            })
        },

        async createTransaction() {
            this.loading = true
            try {
                 return await this.classTransaction.createTransaction(this.transactionObj).then(() => { 
                        this.loadingText = 'INSERTING TRANSACTION DATA'
                        this.loading = false 
                })
            } catch (error) {
               return await Promise.resolve(this.createTransaction())
            }
        },
        async createTransactionServices() {
            this.loading=true
            return await this.classTransaction.createTransactionServices(this.tableServices).then(() => {
                this.loadingText = 'INSERTING  TRANSACTION SERVICES '
                this.loading=false
            })
        },
         async createTransactionServicesProduct() {
            this.loading=true
            return await this.classTransaction.createTransactionServicesProduct(this.tableServicesProduct).then(() => {
                this.loadingText = 'INSERTING TRANSACTION SERVICES PRODUCT'
                this.loading=false
            })
        },
        async createTransactionsOTCProducts() {
            this.loading = true
            return await this.classTransaction.createTransactionsOTCProducts(this.tableOTCProducts).then(() => {
                this.loadingText = 'INSERTING TRANSACTION OTC PRODUCTS'
                this.loading=false
            })
        },
        async createTransactionsServicesCommissions() {
            this.loading = true
            return await this.classTransaction.createTransactionsCommissions(this.serviceCommissions).then(() => {
                this.loadingText = 'INSERTING TRANSACTION COMMISSIONS'
                this.loading=false
            })
        },
        async createTransactionsOTCCommissions() {
            this.loading = true
           return await this.classTransaction.createTransactionsCommissions(this.OTCCommissions).then(() => {
                this.loadingText = 'INSERTING TRANSACTION COMMISSIONS'
                this.loading=false
            })
        },
        async createTransactionsOtherFees() {
             this.loading = true
           return await this.classTransaction.createTransactionsOtherFees(this.tableOtherFees).then(() => {
                this.loadingText = 'INSERTING OTHER FEES'
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
            return await this.classTransaction.evaluateAffectedServicesProduct(this.tableServicesProduct).then(() => { 
            this.loadingText='DECREASING SELECTED SERVICES ITEM'
                this.loading = false 
            })
        },
        async evaluateAffectedOTCProduct() {
            this.loading = true
            return await this.classTransaction.evaluateAffectedOTCProduct(this.tableOTCProducts).then(() => { 
             this.loadingText='DECREASING SELECTED OTC PRODUCT/S'
                 this.loading = false 
            })
        },

        
    
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

@media (min-width: 300px) {
  .floating-card{
    
  /* position: relative; */
  /* float: right; */
  /* top: 120px; */
  /* width: 300px;  */
  margin: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Box shadow for the floating effect */
  transition: transform 0.3s ease-in-out; /* Smooth transition */
  transform: translateY(0); /* Initial position */
  }
}
@media (max-width:600px) {
    .floating-card{
        /* position: relative; */
        /* float: right; */
        /* top: 120px; */
        /* width: 300px;  */
        margin: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Box shadow for the floating effect */
        transition: transform 0.3s ease-in-out; /* Smooth transition */
        transform: translateY(0); /* Initial position */
    }
}
</style>