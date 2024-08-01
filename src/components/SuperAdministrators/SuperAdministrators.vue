<template>
    <v-container fluid class="textTitle">
       <v-toolbar flat dense>
            <v-toolbar-title class="textTitle">
                <v-icon>mdi-account-multiple</v-icon>
                Super Administrators
            </v-toolbar-title>
            <v-spacer/>
              <v-btn class="textTitle" @click="addUpdateEmployee()"  rounded dark color="#BCAAA4"><v-icon>mdi-account-plus</v-icon>Add Super Administrator</v-btn>
       </v-toolbar>
        <v-card style="height: 700px;"  v-if="!loading">
        <v-simple-table dense class="textTitle">
            <template v-slot:top>
                <v-toolbar flat dense>
                  <label style="font-size: 13px;">  {{ employees.length }} of {{ totalCountEmployees }} Items in Page {{ page }}</label>
                    
                </v-toolbar>
                 <br/>
                <i style="font-size: 11px;">click<v-icon>mdi-magnify</v-icon> to search specific data</i>
                <v-toolbar flat dense>
                    
                    <v-flex md3>
                        <v-text-field v-model="search" color="#BCAAA4" clearable dense label="Search" append-icon="mdi-magnify" @click:append="searchEmployee"></v-text-field>
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

       <SuperAdministratorDialog :dialog="dialog" :saveDataObj="getObj" @closeDialog="closeDialog"/>
    </v-container>
</template>

<script>
import SuperAdministratorDialog from './SuperAdministratorDialog.vue';
import LoaderView from '@/views/LoaderView.vue';
import Employees from '@/class/employees';
export default { 
    components:{SuperAdministratorDialog , LoaderView},
    data: () => ({
        classEmployee : new Employees(),
        dialog: false,
        getObj: {},
        page: 1, 
        totalItems: 0, 
        totalCountEmployees: 0,
        employees: [],
        itemsPerPage: 20,
        loading: false,
        search:undefined
    }),
    async created() {
        await this.evaluateEmployee()
    },
     computed:{
        totalPages(){
            return  Math.ceil(this.totalCountEmployees / this.itemsPerPage);
        }
    },  
    watch: {
         search(val) {
            if(!val) this.evaluateEmployee()
        },
      page(val) {
            console.log(val, 'sds')
            this.loadNewData(val)
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
            let organization_id = this.userInfo.organization_id ? this.userInfo.organization_id : 0
            let a =  await this.classEmployee.getEmployeesTotalCount( this.userInfo.employee_id , organization_id , this.search )
            this.totalCountEmployees = a.TOTAL 
            console.log( this.totalCountEmployees, ' this.totalCountEmployees')
        },
        async loadEmployeesPerPage() {
        let organization_id = this.userInfo.organization_id ? this.userInfo.organization_id : 0
            let data = await this.classEmployee.loadEmployees(this.userInfo.employee_id  , organization_id , this.page , this.itemsPerPage )
            console.log(data , 'loadEmployeesPerPage')
           this.employees = data
            this.totalItems = this.employees.length 
        },
         async loadNewData( page ){
            await this.evaluateEmployee()
            this.page = page
            let organization_id = this.userInfo.organization_id ? this.userInfo.organization_id : 0
            let data = await this.classEmployee.loadEmployees(this.userInfo.employee_id  , organization_id , this.page , this.itemsPerPage )
            console.log(data , 'loadNewData')
            this.employees = data
        },
        addUpdateEmployee( item={}) {
            this.getObj = JSON.parse(JSON.stringify(item))
            this.dialog = true
        },
        closeDialog(val) {
            this.dialog =val
        }
    }
}


</script>