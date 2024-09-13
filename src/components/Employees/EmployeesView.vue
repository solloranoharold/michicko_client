<template>
    <v-container fluid>
        <v-toolbar flat  dense>
            <v-toolbar-title class="toolbarTitle"><v-icon>mdi-account-multiple</v-icon> Employees Record  <v-chip v-if="userInfo.position_id==0 || userInfo.position_id==1">{{ $route.params.organization_name}}</v-chip></v-toolbar-title>
            <v-spacer/>
            <v-btn :disabled="userInfo.position_id == 3 " class="textTitle" @click="addUpdateEmployee()" rounded dark color="#BCAAA4"><v-icon>mdi-account-plus</v-icon>Add Employee</v-btn>
        </v-toolbar>
        <br/>
        <v-toolbar flat dense>
            <v-flex md3> 
                <v-text-field color="#BCAAA4" prepend-inner-icon="mdi-magnify" placeholder="Search"></v-text-field>
            </v-flex>
            <v-spacer/>
            <v-btn :disabled="userInfo.position_id==3" class="textTitle" small @click="openAllCommission()" rounded dark color="#BCAAA4"><v-icon>mdi-cash-multiple</v-icon> Employees Commission</v-btn>
        </v-toolbar>
         <v-card style="height: 700px;"  v-if="!loading">
        <v-simple-table dense class="textTitle">
            <template v-slot:top>
                <v-toolbar flat dense>
                  <label style="font-size: 13px;">  {{ employees.length }} of {{ totalCountEmployees }} Items in Page {{ page }}</label>
                    
                </v-toolbar>
                <i style="font-size: 11px;">click<v-icon>mdi-magnify</v-icon> to search specific data</i>
                <v-toolbar flat dense>
                    
                    <v-flex md3>
                        <v-text-field v-model="search" color="#BCAAA4" clearable dense label="Search" append-icon="mdi-magnify" @click:append="searchEmployee" @keyup.enter="searchEmployee"></v-text-field>
                    </v-flex>
                </v-toolbar>
            </template>
            <thead>
                <tr>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Address</th>
                    <th>Position</th>
                    <th>Commissions</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item , i  ) in employees" :key="i" style="border:1px solid;">
                    <td>{{ item.employee_id }}</td>
                    <td>{{  `${item.last_name} ${item.first_name} ${item.middle_name ? item.middle_name: ''}`}}</td>
                    <td> {{ item.address }}</td>
                    <td> {{ item.position }}</td>
                        <v-chip small text-color="white" color="indigo">
                            {{ item.commissions }}%
                        </v-chip>
                    <td>
                        <v-chip small text-color="white" :color="item.status == 1 ?'green':'red' ">
                            {{ item.status == 1 ? 'Active': 'Not Active' }}
                        </v-chip>    
                    </td>
                    <td >
                        <v-tooltip bottom v-if="item.employee_id == userInfo.employee_id || userInfo.position_id!=3">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="green" @click="openCommissionDialog(item)"  v-bind="attrs"
                                v-on="on">
                                mdi-cash-multiple
                                </v-icon>
                            </template>
                            <span>Commissions</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="userInfo.position_id!=3">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="blue" @click="addUpdateEmployee(item )"  v-bind="attrs"
                                v-on="on">
                                mdi-pencil-outline
                                </v-icon>
                            </template>
                            <span>Edit Record</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="item.status == 1 && userInfo.position_id!=3">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="red" @click="deleteItem(item , 1 )"  v-bind="attrs"
                                v-on="on">
                                mdi-account
                                </v-icon>
                            </template>
                            <span>Deactivate</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="item.status == 0 && userInfo.position_id!=3">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="green" @click="deleteItem(item ,0 )"  v-bind="attrs"
                                v-on="on">
                                mdi-account-alert
                                </v-icon>
                            </template>
                            <span>Activate</span>
                        </v-tooltip>
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
        </v-card>
        <div class="text-center textTitle" v-if=" !loading">
            <v-pagination 
            color="#BCAAA4"
            v-model="page"
            :length="totalPages"
            @click="loadNewData( )"
            :total-visible="7"
            ></v-pagination>
        </div>
        <LoaderView v-else/>
        <employee-dialog-view-vue :dialog="dialog" :saveDataObj="getObj" @closeDialog="closeDialog" />
        <commissions-dialog-vue :dialog="comDialog" :commissionDataObj="getObj" @closeCommissionDialog = "closeCommissionDialog"/>
        <AllCommissionsDialog :dialog="allComDialog"  @closeCommissionDialog = "closeCommissionDialog"/>
    </v-container>
</template>
<script>
import EmployeeDialogViewVue from './EmployeeDialogView.vue'
import Employees from '../../class/employees'
import LoaderView from '@/views/LoaderView.vue';
import CommissionsDialogVue from './CommissionsDialog.vue';
import AllCommissionsDialog from './AllCommissionsDialog.vue';
export default {
    components: { EmployeeDialogViewVue, LoaderView , CommissionsDialogVue , AllCommissionsDialog},
   data:()=>({
    classEmployee : new Employees(),
       dialog: false,
       comDialog: false, 
    allComDialog:false ,
    totalCountEmployees: 0 ,
    itemsPerPage: 20 ,  
    // totalPages: 0 , 
       totalItems: 0, 
    hasPage:true,
    page: 1 , 
    getObj: {}, 
        headers:[
            {text:"Employee Name" , value:"employee_name"},
            {text:"Address" ,value:"address" },
            { text:"Position" , value:"position"},
            {text:'Status' , value:'status'},
            {text:'Actions' , value:'actions'}
        ],
        employees:[],
       positions: ['Senior', 'Junior'],
       loading: false,
        search:undefined,
   }),
    async created() {
    
    if ((this.userInfo.position_id == 0 || this.userInfo.position_id == 1) && !this.$route.params.organization_id) {
        this.$router.push('/organization')
        return
    }
      await this.evaluateEmployee()
   }, 
   computed:{
    totalPages(){
        return  Math.ceil(this.totalCountEmployees / this.itemsPerPage);
    }
    },  
     watch: {
        page(val) {
            console.log(val, 'sds')
            this.loadNewData(val)
         },
        search(val) {
            if(!val) this.evaluateEmployee()
        }, 
    },
    methods: {
    async searchEmployee() {
             if (!this.search) {
                await this.evaluateEmployee()
                return;
            }
            await this.evaluateEmployee()
            
             let organization_id = this.userInfo.organization_id ? this.userInfo.organization_id : 0
            let searchData= await this.classEmployee.searchEmployee(organization_id , this.search )
            this.employees = searchData
        },
        async deleteItem(item ,type ){
            let obj = JSON.parse(JSON.stringify(item))        
            obj.method = 1 
            if(type == 1 ) obj.status = 0 
            else obj.status = 1

            console.log(obj , type , 'deleteItem')
            await this.classEmployee.addUpdateEmployee( obj )
            await this.evaluateEmployee()
        },
        async evaluateEmployee() {
            this.search = this.search ==null ? undefined : this.search 
            this.page = 1 
            await this.getTotalEmployeeCount()
            await this.loadEmployeesPerPage()
        },
        async getTotalEmployeeCount() {
        this.loading = true 
        let organization_id =this.$route?.params?.organization_id  ?this.$route.params.organization_id: this.userInfo.organization_id
            await this.classEmployee.getEmployeesTotalCount(this.userInfo.employee_id, organization_id, this.search).then(a => { 
                this.totalCountEmployees = a.TOTAL 
                console.log(this.totalCountEmployees, ' this.totalCountEmployees')
             this.loading=false
         })
        
        
        },
        async loadEmployeesPerPage() {
        this.loading=true
        let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
        await this.classEmployee.loadEmployees(this.userInfo.employee_id  , organization_id , this.page , this.itemsPerPage ).then(data => { 
            console.log(data , 'loadEmployeesPerPage')
            this.employees = data
            this.totalItems = this.employees.length 
            this.loading=false 
        })    
        },
        async loadNewData(page) {
            await this.evaluateEmployee()
            this.page = page
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            this.loading=true
            await this.classEmployee.loadEmployees(this.userInfo.employee_id, organization_id, this.page, this.itemsPerPage).then(data => { 
                console.log(data, 'loadNewData')
                this.employees = data
                this.loading=false 
            })
            
        },

        addUpdateEmployee(obj={}){
            this.getObj = obj
            this.dialog = !this.dialog 
        },
        closeDialog(){
            this.dialog = !this.dialog 
            this.getObj = {}
            this.evaluateEmployee()
       },
       openCommissionDialog( item ) {
           this.getObj = JSON.parse(JSON.stringify(item))
            this.comDialog = !this.comDialog
        },
        openAllCommission() {
             this.allComDialog = !this.allComDialog 
        },
       closeCommissionDialog(val) {
           this.comDialog = val 
           this.allComDialog = val 
        }
   }

}
</script>
<style scoped>
   .table-container {
  height: 700px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
</style>
