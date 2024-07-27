<template>
    
    <v-container fluid>
        <bar-chart :chartdata="transactionData" :options="options"/>
    </v-container>
</template>
<script>
import moment from 'moment'
import BarChart from './Charts/BarChart.vue';
export default {
  components: { BarChart }, 
    props: {
        transactions: {
            type: Array,
            required: true 
        },
    },
  
    computed: {
        transactionData() {
            let labels = []
            let totalSales = []
            let totalNetSales = []
            let serviceNetSales = []
            let otcNetSales=[]
            this.months.forEach(m => { 
                this.transactions.forEach(item => { 
                    if (item.transaction_created_date.includes(moment().format(`YYYY-${m.month}`))) {
                        let total_amount = parseFloat(item.transaction_total_amount).toFixed(2)
                        m.total_sales =parseFloat( m.total_sales) + parseFloat(total_amount)
                        m.net_sales += parseFloat(item.transaction_net_sales_otc) + parseFloat(item.transaction_net_sales_services)
                        m.service_net_sales = parseFloat(m.service_net_sales) + parseFloat(item.transaction_net_sales_services)
                        m.otc_net_sales = parseFloat(m.otc_net_sales) + parseFloat(item.transaction_net_sales_otc)
                      
                    }
                })
                labels.push(m.text)
                totalSales.push(m.total_sales.toString())
                totalNetSales.push(m.net_sales.toString())
                serviceNetSales.push(m.service_net_sales.toString())
                otcNetSales.push(m.otc_net_sales.toString())
            })


            return {
                labels: labels,
                datasets: [
                    {
                        label: `Total Sales`,
                        backgroundColor: `#BCAAA4`,
                        data: totalSales,
                    },
                    {
                        label: `Total Net Sales`,
                        backgroundColor: `#BCAAA4`,
                        data: totalNetSales,
                    },
                     {
                        label: `Service Net Sales`,
                        backgroundColor: `#BCAAA4`,
                        data: serviceNetSales,
                    },
                    {
                        label: `OTC Net Sales`,
                        backgroundColor: `#BCAAA4`,
                        data: otcNetSales,
                    }
                ],
                
            }
        } 
   },
    data: () => ({
        months: [
            { month:"01",text:'January' , total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0},
            { month: "02", text: 'February', total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0 },
            { month: "03", text: 'March', total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0 },
            { month: "04", text: 'April', total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0 },
            { month: "05", text: 'May', total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0 },
            { month: "06", text: 'June', total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0 },
            { month: "07", text: 'July', total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0 },
            { month: "08", text: 'August', total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0 },
            { month: "09", text: 'September', total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0 },
            { month: "10", text: 'October', total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0 },
            { month: "11", text: 'November', total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0 },
            { month:"12",text:'December' , total_sales: 0 , net_sales: 0 , service_net_sales: 0 , otc_net_sales: 0},
        ],
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
    }),
    methods: {
      
    }
}
</script>