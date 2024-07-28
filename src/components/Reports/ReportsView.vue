<template>
     <v-container fluid fill-height class="textTitle">
            <v-layout align-center justify-center>
                <v-card>
                    <v-card-text v-if="!loading">
                        <h2 class="text-center">REPORTS GENERATION</h2> 
                        <v-divider style="border:1px solid"/>
                        <br/>
                        <v-autocomplete v-model="type" label="Type of Reports" outlined dense :items="types"/>
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
                            v-model="dates"
                            label="Date Range"
                            persistent-hint
                            dense outlined
                            prepend-inner-icon="mdi-calendar"
                            v-bind="attrs"
                            v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="dates"
                            no-title
                            color="#BCAAA4"
                            range
                        ></v-date-picker>
                        </v-menu>
                        
                        <v-btn @click="generateReports()" dark color="#BCAAA4" block> GENERATE </v-btn>
                    </v-card-text>
                    <LoaderView :loadingText="loadingText" v-else/>
                </v-card>
            </v-layout>
    </v-container>
</template>
<script>
import Swal from 'sweetalert2'
import Reports from '@/class/reports';
import moment from 'moment'
import LoaderView from '@/views/LoaderView.vue';
export default {
    components:{LoaderView},
    data: () => ({
        classReports: new Reports(),
        types: ['INVENTORY', 'DAILY_SUMMARY'],
        // , 'EXECUTIVE_SUMMARY','SALES_TRACKING'
        dates: [],
        menu: false ,
        type: "",
        loading:false ,loadingText:""
    }),
    methods: {
        async generateReports() {
            if (!this.dates.length || this.dates.length == 1 || !this.type) {
                Swal.fire({
                        toast: true,
                        position:'bottom-end',
                        title: `Please Complete Necessary Fields`,
                        icon: "error",
                        timer: 1000,
                        showConfirmButton:false
                })
                return false 
            }
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            let dates = this.dates.sort()
            let data = { 
                type: this.type, 
                date1: dates[0],
                date2: dates[1],
                organization_id: organization_id,
                filename : `${this.type}_${moment().format('YYYYMMDDHHmmss')}.xlsx`
            }
            this.loading = true
            this.loadingText = this.type
            await this.classReports.generateReports(data)
            .then(response => {
                console.log(data , 'data')
                const blob = new Blob([response], { type: 'application/octet-stream' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = data.filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                this.loading = false
                this.type = ""
                this.dates=[]
            })
        }
    }
}
</script>