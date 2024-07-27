<template>
    <v-container fluid>
            <line-chart :chartdata="transactionData" :options="options"/>
    </v-container> 

</template>

<script>
import moment from 'moment'
import LineChart from './Charts/LineChart.vue';
export default {
  components: { LineChart },
    props: {
        transactions: {
            type: Array,
            required: true 
        },
        date1: {
            type: String,
            required: true 
        },
        date2: {
            type: String,
            required: true 
        }
        
    },
    data: () => ({
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
    computed: {
        transactionData() { 
            let computedData= []
            let startDate = new Date(this.date1)
            let endDate = new Date(this.date2)
            let dates=[]
             while (startDate <= endDate) {
                 dates.push(moment(startDate).format('MMMM DD'));
                 computedData.push({
                     day: moment(startDate).format('YYYY-MM-DD'),
                     total_service: 0,
                     total_service_net: 0, 
                     total_otc: 0,
                     total_otc_net:0
                })
                startDate.setDate(startDate.getDate() + 1);
            }
            let totalServiceSales = []
            let totalServiceNetSales = []
            let totalOTCSales = []
            let totalOTCNetSales=[]
            computedData.forEach( m  => {
                this.transactions.forEach(item => { 
                    if (item.transaction_created_date.includes(m.day)) {
                        m.total_service = parseFloat(m.total_service) + parseFloat(item.service_total_amount)
                        m.total_service_net = parseFloat(m.total_service_net) + parseFloat(item.transaction_net_sales_services)
                        m.total_otc = parseFloat(m.total_otc) + parseFloat(item.otc_total_amount)
                        m.total_otc_net = parseFloat(m.total_otc_net) + parseFloat(item.transaction_net_sales_otc)
                    }
                })
                totalServiceSales.push(m.total_service.toString())
                totalServiceNetSales.push(m.total_service_net.toString())
                totalOTCSales.push(m.total_otc.toString())
                totalOTCNetSales.push(m.total_otc_net.toString())
            });
            return {
                labels: dates,
                datasets: [
                    {
                        label: `Total Service Sales`,
                        borderColor: `#ECEFF1`,
                        fill:false , 
                        data: totalServiceSales,
                    },
                    {
                        label: `Service Net Sales`,
                        borderColor: `#BCAAA4`,
                         fill:false ,
                        data: totalServiceNetSales,
                    },
                     {
                        label: `Total OTC Sales`,
                         borderColor: `#ECEFF1`,
                         fill:false ,
                        data: totalOTCSales,
                    },
                    {
                        label: `OTC Net Sales`,
                        borderColor: `#BCAAA4`,
                         fill:false ,
                        data: totalOTCNetSales,
                    }
                ],
                
            }
        }
    }
}
</script>