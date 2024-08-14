<template>
      <v-dialog 
        persistent
        transition="dialog-top-transition"
        max-width="600"
        v-model="value"
      >
        <v-card>
            <v-toolbar
            class="toolbarTitle"
               color="#BCAAA4"
              dark
            > 
            <!-- <v-icon small>
                mdi-invoice-arrow-right-outline
            </v-icon> CLIENT SALES INVOICE -->
            <v-spacer/>
            <v-icon @click="close()">mdi-close</v-icon>
            </v-toolbar>
          
            <v-card-text class="textTitle">
                <!-- {{ saveDataObj }} -->
                  <v-card-title><h3 class="text-center">SALES INVOICE</h3></v-card-title>
                    <v-card-subtitle>  {{  saveDataObj.organization_name }}</v-card-subtitle>
                  <v-row>
                <v-col>
                    <v-card-subtitle>
                        <strong>To</strong>: {{ saveDataObj.last_name }} {{ saveDataObj.first_name  }}<br/>
                        Contact # : {{ saveDataObj.contact_no }}<br/>
                        Email : {{ saveDataObj.email ? saveDataObj.email : 'no email' }}<br/>
                    </v-card-subtitle>
                </v-col>
                <v-col>
                    <v-card-subtitle>
                        <strong>Date</strong>: {{ invoice.date_created }} <br/>
                        <strong>Invoice #</strong>: {{ invoice.transaction_id }}<br/>
                       <strong>Customer ID</strong>: {{ saveDataObj.client_id}} <br/>
                       <strong>Transaction Details</strong>:  {{  getTotalPayments.transaction_details }}
                    </v-card-subtitle>
                </v-col>
              </v-row>
                <v-divider style="border: 1px solid;"/>
               <v-simple-table>
                    <thead>
                        <tr>
                            <!-- <th>Quantity</th> -->
                            <th>Description</th>
                            <!-- <th>Price</th> -->
                            <th>Total Amount </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item , i ) in getLineItems" :key="i" >
                            <!-- {{ item }} -->
                            <!-- <td>x{{ item.less_quantity ?  item.less_quantity  : 0}}</td> -->
                            <td>{{ item.product_name? `(OTC) ${item.product_name}`:`(Service) ${item.service_name }`  }}</td>
                            <!-- <td>₱{{ parseFloat(item.price).toFixed(2) }}</td> -->
                            <td>₱{{ item.product_total_amount ? parseFloat(item.product_total_amount).toFixed(2) : parseFloat(item.price).toFixed(2)  }}</td>
                        </tr>
                        <tr>
                            <td align="right"><strong>Total:</strong></td>
                            <td>
                                <strong>₱{{parseFloat(getTotalPayments.transaction_total_amount).toFixed(2) }}</strong>
                            </td>
                        </tr>
                    </tbody>
               </v-simple-table>
                
            </v-card-text>
        </v-card>
      
      </v-dialog>
</template>
<script>
export default {
    data: () => ({
        
    }),
     props: {
        dialog:{
            type: Boolean,
            required: true 
         },
         saveDataObj: {
            type: Object ,
            required:true
        },
        invoice:{
            type: Object ,
            required:true
        }
    },
     async created() {
        if ((this.userInfo.position_id == 0 || this.userInfo.position_id == 1) && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
        }  
    },
    computed: {
       
        value() {
            return this.dialog
        },
        getTotalPayments() {
            if(this.invoice?.invoice)
                return this.invoice.invoice[0]
            else return {}
        },
        getLineItems() {
            if (this.invoice?.invoice)
                return this.invoice.invoice.filter((item, i) => {
                    return i!=0 
                })
            else return []
        }
    },
    methods: {
        close() {
            this.$emit('closeSalesInvoice' , false )
        }
    }
}
</script>
