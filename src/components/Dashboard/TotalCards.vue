<template>
    <v-container fluid class="textTitle">
        <v-row>
            <v-col cols="12" md="12">
               <v-card
                 dark
                color="#BCAAA4"
                >
                <v-card-text>
                    <h3>ACTUAL NET</h3>
                    <v-col cols="3" >
                    <v-layout>
                        <v-spacer />
                        <span style="font-size: 45px">
                        <strong>{{ TotalActualNet }}</strong></span
                        >
                    </v-layout>
                    </v-col>
                </v-card-text>
                </v-card>
            </v-col>
               <v-col cols="12" md="6">
               <v-card
                dark
                color="#BCAAA4"
                >
                <v-card-text>
                    <h3>TOTAL SALES</h3>
                    <v-col cols="3" >
                    <v-layout>
                        <!-- <v-icon x-large>mdi-currency-php</v-icon> -->
                        <v-spacer />
                        <span style="font-size: 45px">
                        <strong>{{ TotalSalesAmount }}</strong></span
                        >
                    </v-layout>
                    </v-col>
                </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
               <v-card
                 dark
                color="#BCAAA4"
                >
                <v-card-text>
                    <h3>NET TOTAL</h3>
                    <v-col cols="3" >
                    <v-layout>
                        <v-spacer />
                        <span style="font-size: 45px">
                        <strong>{{ TotalNetSales }}</strong></span
                        >
                    </v-layout>
                    </v-col>
                </v-card-text>
                </v-card>
            </v-col>
         
             <v-col cols="12" md="6">
               <v-card
                dark
                color="#BCAAA4"
                >
                <v-card-text>
                    <h3>SERVICE TOTAL NET SALES</h3>
                    <v-col cols="3" >
                    <v-layout>
                        <!-- <v-icon x-large>mdi-currency-php</v-icon> -->
                        <v-spacer />
                        <span style="font-size: 45px">
                        <strong>{{ TotalServiceAmount }}</strong></span
                        >
                    </v-layout>
                    </v-col>
                </v-card-text>
                </v-card>
            </v-col>
             <v-col cols="12" md="6">
               <v-card
                dark
                color="#BCAAA4"
                >
                <v-card-text>
                    <h3>OTC TOTAL NET SALES</h3>
                    <v-col cols="3">
                    <v-layout>
                        <!-- <v-icon x-large>mdi-currency-php</v-icon> -->
                        <v-spacer />
                        <span style="font-size: 45px">
                        <strong>{{ TotalOTCAmount }}</strong></span
                        >
                    </v-layout>
                    </v-col>
                </v-card-text>
                </v-card>
            </v-col>
            
        
        </v-row>
    </v-container>
</template>
<script>
    export default { 
    props: {
          TotalActualNet: {
               type: String,
                required: true  
            },
            TotalSalesAmount: {
                type: String,
                required: true 
            },
            TotalServiceAmount: { 
                type: String,
                required: true 
            },
            TotalOTCAmount: {
               type: String,
                required: true  
            },
            TotalNetSales: {
               type: String,
                required: true  
            },
    },
    computed:{
        
    } 

}
</script>