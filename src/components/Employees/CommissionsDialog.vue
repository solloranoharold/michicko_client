<template>
     <v-dialog 
        persistent
        transition="dialog-top-transition"
        max-width="1000"
        v-model="value"
      >
        <v-card class="textTitle">
            <v-toolbar dark flat dense class="toolbarTitle" color="#BCAAA4">
                <v-toolbar-title><v-icon>mdi-currency-php</v-icon> Commissions </v-toolbar-title>
                <v-spacer/>
                <v-icon  @click="close()">mdi-close</v-icon>
            </v-toolbar>
            <v-card-title> {{ commissionDataObj.last_name }} {{ commissionDataObj.first_name}}</v-card-title>
            <v-card-subtitle>{{  commissionDataObj.position }}</v-card-subtitle>
            <!-- {{commissionDataObj}} -->
            <v-card-text>
                <v-divider style="border:1px solid;"/>
                <br/>
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
                         <v-btn @click="getCommissions()" color="#BCAAA4" dark  block><v-icon>mdi-magnify</v-icon>Search</v-btn>
                    </v-col>
                </v-row>
               
                <v-toolbar flat dense>
                   
                <v-spacer/>
                Total Commission + Tip :  <strong style="font-size: 20px;">₱{{ totalCommissions}}</strong>
                </v-toolbar>
                <v-data-table :headers="headers" :items="commissions" v-if="!loading">
                    <template v-slot:[`item.commission_total_amount`]="{item}">
                       <v-chip small color="green" text-color="white">₱{{  parseFloat(item.commission_total_amount).toFixed(2) }}</v-chip>
                    </template>
                </v-data-table>
                <LoaderView :loadingText="loadingText" v-else/>
            </v-card-text>
        </v-card>
      </v-dialog>
</template>
<script>
import Swal from 'sweetalert2'
import LoaderView from '@/views/LoaderView.vue';
import Transactions from '@/class/transactions';
export default {
    components:{LoaderView},
    props: {
       dialog:{
            type: Boolean,
            required: true 
        },
        commissionDataObj:{
            type: Object ,
            required:true
        }
    },
    data: () => ({
        classTransaction: new Transactions(),
        menu: false, menu1: false,
        loadingText: "", loading: false,
        commissions:[],
        date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        headers: [
            { text: "Transaction ID", value: 'transaction_id' },
            { text: "Commission_Total", value: "commission_total_amount" },
            { text: 'Commission Type', value: 'commission_type' },
            { text:"Tip", value:'tip'},
            { text:"Date" , value:"date_created"}
        ]
    }),
    computed: { 
        value() {
            return this.dialog
        },
        totalCommissions() {
            let total = 0 
            this.commissions.forEach(item => { 
                total +=  parseInt(item.commission_total_amount) + parseInt(item.tip)
            })
            return parseFloat(total).toFixed(2) 
        }
    },
    watch: {
        value(val) {
            if(val) this.commissions=[]
        }
    },
    methods: { 
        async getCommissions() {
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
            this.loading=true
            await this.classTransaction.loadCommissions(this.commissionDataObj.organization_id,this.commissionDataObj.employee_id, this.date1, this.date2).then((data) => {
                this.loadingText = "EMPLOYEE COMMISSIONS"
                this.commissions = data 
                this.loading = false 
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
           })
        },
        close() {
            this.$emit('closeCommissionDialog' , false )
        }
    }
}
</script>
