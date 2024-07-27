<template>
    <v-container fluid>
            <bar-chart :chartdata="transactionData" :options="options"/>
    </v-container> 

</template>

<script>
// import moment from 'moment'
import BarChart from './Charts/BarChart.vue';
export default {
  components: { BarChart },
    props: {
        transactionsServices: {
            type: Array,
            required: true 
        },
        transactionsOTC: {
            type: Object,
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
            console.log(this.transactionsOTC ,'transactionsOTC', this.transactionsServices ,' transactionsServices')
            let categoryLabelServices = this.transactionsServices.map(rec => { 
                return rec.category_name
            })
            categoryLabelServices.push('OTC')
            let totalSales = this.transactionsServices.map(rec => { 
                return rec.total_sales
            })
            totalSales.push(this.transactionsOTC.total_sales)
         
            let totalNetSales= this.transactionsServices.map(rec => { 
                return rec.total_net_sales
            })
            totalNetSales.push(this.transactionsOTC.total_net_sales)
            console.log(categoryLabelServices , 'categoryLabel',totalSales , 'totalSales' ,totalNetSales,'totalNetSales')
            
            return {
                labels: categoryLabelServices,
                datasets: [
                    {
                        label: `Total Sales`,
                        fill:false,
                        borderColor: `#F44336`,
                        data: totalSales,
                    },
                    {
                        label: `Net Total`,
                        backgroundColor: `#BCAAA4`,
                        data: totalNetSales,
                    },
                    
                    
                ],
                
            }
        }
    }
}
</script>