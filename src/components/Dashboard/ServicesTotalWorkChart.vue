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
                     work_done: 0, 
                })
                startDate.setDate(startDate.getDate() + 1);
            }
            let totalServiceSales = []
            let totalWorkDone = []
            computedData.forEach( m  => {
                this.transactions.forEach(item => { 
                    if (item.transaction_created_date.includes(m.day)) {
                        m.total_service = parseFloat(m.total_service) + parseFloat(item.service_total_amount)
                        m.work_done = parseFloat(m.work_done) + parseFloat(item.no_of_service)
                    }
                })
                totalServiceSales.push(m.total_service.toString())
                totalWorkDone.push(m.work_done.toString())
            });
            console.log(computedData)
            return {
                labels: dates,
                datasets: [
                    {
                        type:'line',
                        label: `Work Done`,
                        fill:false,
                        borderColor: `#F44336`,
                        data: totalWorkDone,
                    },
                    {
                        type:"bar",
                        label: `Amount`,
                        backgroundColor: `#BCAAA4`,
                        data: totalServiceSales,
                    },
                    
                    
                ],
                
            }
        }
    }
}
</script>