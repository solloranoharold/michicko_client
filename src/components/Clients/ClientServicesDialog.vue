<template>
     <v-dialog 
        persistent
        transition="dialog-top-transition"
        max-width="800"
        v-model="value"
      >
        <v-card class="textTitle">
            <v-toolbar dark flat dense class="toolbarTitle" color="#BCAAA4">
                <v-toolbar-title><v-icon>mdi-currency-php</v-icon> Clients Record </v-toolbar-title>
                <v-spacer/>
                <v-icon  @click="close()">mdi-close</v-icon>
            </v-toolbar>
            <v-card-title> {{ clientDataObj.last_name }} {{ clientDataObj.first_name}}</v-card-title>
            <!-- {{clientDataObj}} -->
            <v-card-text>
                <v-divider style="border:1px solid;"/>
                <br/>
                <v-row no-gutters>
                    <v-col cols="12" md="3" lg="3" >
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
                        <v-btn @click="getData()" block color="#BCAAA4" dark  ><v-icon>mdi-magnify</v-icon>Search</v-btn>
                    </v-col>
                </v-row>
                 
                <!-- <v-toolbar flat dense>
                    <v-layout>
                    <v-flex md3 sm="6" xs="6" pt-4>
                       
                        
                    </v-flex>
                    <v-flex md3 sm="6" xs="6" pt-4>
                        
                    </v-flex>
                    <v-flex md2 sm="4" xs="4" pt-4>
                        <v-btn @click="getData()" color="#BCAAA4" dark rounded ><v-icon>mdi-magnify</v-icon>Search</v-btn>
                    </v-flex>
                </v-layout>
                </v-toolbar> -->
                <LoaderView :loadingText="loadingText" v-if="loading"/>
                <v-row v-else>
                    <v-col>
                        <v-data-table :headers="headersTransaction" :items="clientTransactions" >
                            <template v-slot:[`item.invoice`]="{item}">
                                <v-tooltip bottom >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn @click="getInvoice(item)" rounded x-small dark v-on="on" color="indigo">
                                            <v-icon    v-bind="attrs" small>
                                                mdi-invoice-arrow-right-outline
                                            </v-icon>
                                            View Sales Invoice
                                        </v-btn>
                                        
                                    </template>
                                    <span>Sales Invoice</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                        <!-- {{ clientTransactions }} -->
                        
                    </v-col>
                </v-row>
                
            </v-card-text>
        </v-card>
        <ClientSalesInvoice :dialog="invoiceDialog" :save-data-obj="clientDataObj" :invoice="invoice" @closeSalesInvoice="closeSalesInvoice"/>
      </v-dialog>
</template>
<script>
import Swal from 'sweetalert2'
import LoaderView from '@/views/LoaderView.vue';
import Transactions from '@/class/transactions';
import ClientSalesInvoice from './ClientSalesInvoice.vue';
export default {
    components:{LoaderView , ClientSalesInvoice},
    props: {
       dialog:{
            type: Boolean,
            required: true 
        },
        clientDataObj:{
            type: Object ,
            required:true
        }
    },
    data: () => ({
        classTransaction: new Transactions(),
        menu: false, menu1: false,
        loadingText: "", loading: false,
        clientTransactions: [],
        invoice: {},
        date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        headersTransaction: [
            { text: "Transaction ID", value: 'transaction_id' },
            { text: "Sales Invoice", value: "invoice" },
            { text:"Date" , value:"date_created",align:'center'}
        ],
        invoiceDialog: false,
        
    }),
    computed: { 
        value() {
            return this.dialog
        },
       
    },
    methods: { 
        async getData() {
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
            this.loading = true
            await this.classTransaction.getClientTransactions(this.clientDataObj.organization_id, this.clientDataObj.client_id,  this.date1, this.date2 ).then((data) => {
                this.loadingText = "CLIENT SERVICES"
                if (!data.length) {
                    Swal.fire({
                        toast: true,
                        position:'bottom-end',
                        title: `No commission found`,
                        icon: "info",
                        timer: 1000,
                        showConfirmButton:false
                    })
                }
                 data.forEach(item => {
                    let i = this.clientTransactions.findIndex(x => x.transaction_id == item.transaction_id)
                    if (i > -1) {
                        this.clientTransactions[i].invoice.push(item)  
                    } else {
                        this.clientTransactions.push({
                            transaction_id: item.transaction_id,
                            date_created: item.transaction_created_date,
                            invoice:[ item ]
                        })
                    }
                });
                this.loading = false 
                console.log(this.clientTransactions,'getClientTransactions')
            })
        },
        getInvoice(item) {
            this.invoice = JSON.parse(JSON.stringify(item))
            this.invoiceDialog=!this.invoiceDialog
        },
        close() {
            this.$emit('closeClientsServicesDialog' , false )
        },
        closeSalesInvoice(val) {
            this.invoiceDialog = val
        }
    }
}
</script>
