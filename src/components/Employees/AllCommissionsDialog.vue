<template>
    <v-dialog 
        persistent
        transition="dialog-top-transition"
        max-width="1000"
        v-model="value"
      >
        <v-card class="textTitle">
            <v-toolbar dark flat dense class="toolbarTitle" color="#BCAAA4">
                <v-toolbar-title><v-icon>mdi-currency-php</v-icon> Total Employee Commissions </v-toolbar-title>
                <v-spacer/>
                <v-icon  @click="close()">mdi-close</v-icon>
            </v-toolbar>
            <v-card-text>
                <br/>
                <v-row no-gutters>
                    <v-col cols="12" md="4" lg="4">
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
                    <v-col cols="12" md="4" lg="4">
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
                    <v-col cols="12" md="4" lg="4">
                         <v-btn @click="loadAllEmployeesCommission()" color="#BCAAA4" dark  block><v-icon>mdi-magnify</v-icon>Search</v-btn>
                    </v-col>
                </v-row>
                 <v-data-table v-if="!loading" dense :search="search" :headers="headers" :items="commissions">
                        <template v-slot:top>
                            <v-flex md6 lg6>
                                <v-text-field clearable v-model="search"  label="Search Employee" placeholder="Search Employee" prepend-inner-icon="mdi-magnify"></v-text-field>
                            </v-flex>
                        </template>
                        <template v-slot:[`item.total_commission`]="{item}">
                             ₱{{  parseFloat(item.total_commission).toFixed(2) }}

                        </template>
                         <template v-slot:[`item.total_tip`]="{item}">
                             ₱{{  parseFloat(item.total_tip).toFixed(2) }}
                        </template>
                         <template v-slot:[`item.total_amount`]="{item}">
                            <v-chip small color="green" text-color="white">
                             ₱{{  parseFloat(item.total_amount).toFixed(2) }}
                             </v-chip>
                        </template>
                    </v-data-table>
                    <LoaderView :loading-text="loadingText" v-else/>
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
    },
    computed: {
          value() {
            return this.dialog
        },
    },
     data: () => ({
         classTransaction: new Transactions(),
        search:"",
        menu: false, menu1: false,
        loadingText: "", loading: false,
        date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        headers: [
            { text: 'Date Range', value: 'date_range' },
            { text: "Name", value: "fullname" },
            {text: "Position", value: "position" },
            {text:"Total Tip" , value:'total_tip'},
            { text: 'Total Commission', value: 'total_commission' },
            { text: 'Total Amount', value: 'total_amount' },
            
         ],
        commissions:[]
    }),
    methods: {
        async loadAllEmployeesCommission() {
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
            let organization_id = this.userInfo.organization_id ? this.userInfo.organization_id : 0
            await this.classTransaction.loadAllEmployeesCommission(organization_id, this.date1, this.date2).then((data) => {
                this.loadingText = "EMPLOYEE COMMISSIONS"
                this.commissions = data.filter(rec => { 
                    rec.date_range =  `${this.date1} - ${this.date2}`
                    rec.total_amount = parseFloat(rec.total_commission).toFixed(2) + parseFloat(rec.total_tip).toFixed(2)

                    return rec
                }) 
                this.loading = false 
                console.log(this.commissions , 'loadAllEmployeesCommission')
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