<template>
    
    <v-container fluid>
        <v-toolbar flat dense class="toolbarTitle">
            <v-toolbar-title>Cashless Methods</v-toolbar-title>
            <v-spacer/>
             <v-btn class="textTitle" @click="addUpdatePaymentMethod()"  rounded dark color="#BCAAA4"><v-icon>mdi-credit-card-marker</v-icon>Add Payment Method</v-btn>
        </v-toolbar>
        <v-simple-table v-if="!loading" dense>
            <thead>
                <tr>
                    <th>Payment Method</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item , i ) in epayments" :key="i">
                    <td>{{item.payment_method}}</td>
                    <td>
                         <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="blue" @click="addUpdatePaymentMethod(item )"  v-bind="attrs"
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
        <LoaderView v-else/>
        <EpaymentDialog :dialog="dialog" :save-data-obj="getObj" @closeEpaymentDialog="closeEpaymentDialog"/>
    </v-container>
</template>
<script>
import EpaymentDialog from './EpaymentDialog.vue';
import Epayments from '@/class/epayments';
import LoaderView from '@/views/LoaderView.vue';
export default {
    components:{  EpaymentDialog , LoaderView },
    data: () => ({
        classEpayment : new Epayments(),
        getObj: {}, dialog: false, loading: false, 
       epayments:[]
    }),
    async created() {
        if (this.userInfo.position_id == 0 && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
        }
         await this.loadEpayments()
    },
    methods: {
        addUpdatePaymentMethod(item = {}) {
            this.getObj = JSON.parse(JSON.stringify(item))
            this.dialog=!this.dialog
        },
        async loadEpayments() {
            this.loading=true
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            await this.classEpayment.loadEpayments(organization_id).then((data) => { 
                this.epayments = data 
                this.loading = false 
                console.log(data , 'loadEpayments')
            })
        },
        closeEpaymentDialog(val) {
            this.dialog = val 
            this.loadEpayments()
        }
    }
}
</script>