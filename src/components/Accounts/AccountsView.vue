<template>
    <v-container fluid>
        <v-toolbar flat  dense>
            <v-toolbar-title class="toolbarTitle"><v-icon>mdi-account-multiple</v-icon> Accounts Record <v-chip v-if="userInfo.position_id==0">{{ $route.params.organization_name}}</v-chip></v-toolbar-title>
            <v-spacer/>
            <v-btn class="textTitle" @click="addUpdateAccount()"  rounded dark color="#BCAAA4"><v-icon>mdi-account-plus</v-icon>Add Accounts</v-btn>
        </v-toolbar>
        
        <v-card style="height: 700px;"  v-if="!loading">
        <v-simple-table dense class="table-container textTitle" color="#BCAAA4">
            <template v-slot:top>
                <v-toolbar flat dense>
                  <label style="font-size: 13px;">  {{ accounts.length }} of {{ totalCountAccounts }} Items in Page {{ page }}</label>
                </v-toolbar>
                <br/>
                <i style="font-size: 11px;">click<v-icon>mdi-magnify</v-icon> to search specific data</i>
                <v-toolbar flat dense>
                    
                    <v-flex md3>
                        <v-text-field v-model="search" color="#BCAAA4" clearable dense label="Search" append-icon="mdi-magnify" @click:append="searchAccount"></v-text-field>
                    </v-flex>
                </v-toolbar>
            </template>
            <thead>
                <tr>
                    <th>Account ID </th>
                    <th>Employee Name </th>
                    <th>Username</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item , i ) in accounts " :key="i">
                    <td>{{ item.account_id}}</td>
                    <td>{{  `${item.last_name} ${item.first_name} ${item.middle_name ? item.middle_name: ''}`}}</td>
                    <td> {{ item.username }}</td>
                    <td> 
                        <v-chip small outlined :color="item.position_id == 1 ?'blue':'orange' ">
                           <v-icon>mdi-account</v-icon> {{ item.account_position }}
                        </v-chip>
                    </td>
                    <td>
                        <v-chip small text-color="white" :color="item.account_status == 1 ?'green':'red' ">
                            {{ item.account_status == 1 ? 'Active': 'Not Active' }}
                        </v-chip>    
                    </td>
                    <td>
                        <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="blue " @click="addUpdateAccount(item  )"  v-bind="attrs"
                                v-on="on">
                                mdi-pencil-outline
                                </v-icon>
                            </template>
                            <span>Edit</span>
                        </v-tooltip>
                         <v-tooltip bottom v-if="item.account_status == 1 ">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="red" @click="deleteItem(item , 1 )"  v-bind="attrs"
                                v-on="on">
                                mdi-account
                                </v-icon>
                            </template>
                            <span>Deactivate</span>
                        </v-tooltip>
                        <v-tooltip bottom v-else>
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
          <div class="text-center" v-if="hasPage && !loading ">
            <v-pagination 
                color="#BCAAA4"
                v-model="page"
                :length="totalPages"
                @click="loadNewData( )"
                :total-visible="7"
                ></v-pagination>
            </div>
        <LoaderView v-else/>
        <accounts-dialog :dialog="dialog" :saveDataObj="getObj" @closeDialog="closeDialog"/>
    </v-container>

</template>
<script>
import AccountsDialog from './AccountsDialog.vue'
import Accounts from '@/class/accounts/'
import LoaderView from '@/views/LoaderView.vue';
export default {
  components: { AccountsDialog , LoaderView },
    data: () => ({
        classAccount: new Accounts(),
        accounts:[
            {username : "ADMINISTRATOR" , status: 0 , position: 0}
        ],
        getObj: {},
        dialog: false,
        totalCountAccounts: 0 ,
        itemsPerPage: 20 ,  
        totalItems: 0 , 
        page: 1, 
        search: '',
        hasPage: true,
        loading:false 
    }),
    computed:{
        totalPages(){
            return  Math.ceil(this.totalCountAccounts / this.itemsPerPage);
        }
    }, 
    watch: {
        page(val) {
            console.log(val, 'sds')
            this.loadNewData(val)
        },
         search(val) {
            if(!val) this.evaluteAccounts()
        }   
    },
    async created() {
        if (this.userInfo.position_id == 0 && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
         }

        await this.evaluteAccounts()
   },
    methods: {
        async evaluteAccounts() {
            this.hasPage=true
            await this.getTotalEmployeeCount()
            await this.loadAccountsPerPage()
        },
        async getTotalEmployeeCount() {
            this.loading=true
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            let a =  await this.classAccount.getAccountTotalCount( this.userInfo.employee_id , organization_id ,this.search)
             this.totalCountAccounts = a.TOTAL 
            console.log(this.totalCountAccounts , 'this.totalCountAccounts')
            this.loading=false 
        },
        async loadAccountsPerPage() {
            this.loading=true
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            let data = await this.classAccount.loadAccounts(this.userInfo.employee_id , organization_id , this.page , this.itemsPerPage )
           
            this.accounts = data
            console.log(this.accounts, 'loadAccountsPerPage')
             this.loading=false 
        },
        async loadNewData(page) {
            this.loading=true 
            this.page = page
            //  if (this.search) {
            //     await this.searchAccount()
            //     return 
            //  }
             await this.evaluteAccounts()
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            let data = await this.classAccount.loadAccounts(this.userInfo.employee_id , organization_id , this.page , this.itemsPerPage )
            
            this.accounts = data
            console.log(this.accounts, 'loadNewData')
             this.loading=false 
        },
          async deleteItem(item ,type ){
              let obj = {
                  account_id: item.account_id,
                  position_id: item.position_id,
                  account_status: item.account_status,
                  organization_id: item.organization_id,
                  username: item.username, 
                  password: item.password
            }      
            obj.method = 1 
            if(type == 1 ) obj.account_status = 0 
            else obj.account_status = 1

            console.log(obj , type , 'deleteItem')
            await this.classAccount.addUpdateAccount( obj )
            await this.evaluteAccounts()
        },
        addUpdateAccount(item = {}) {
            let obj = {
                employee_id: item.employee_id,
                account_id: item.account_id,
                position_id: item.position_id,
                account_status: item.account_status,
                organization_id: item.organization_id,
                username: item.username, 
                password: item.password
            }     
            this.getObj = JSON.parse(JSON.stringify(obj))
            this.dialog = !this.dialog
        },
        async searchAccount() {
            console.log(this.search ,' search')
            if (!this.search) {
                await this.evaluteAccounts()
                return;
            }
             await this.evaluteAccounts()
             let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            let searchData= await this.classAccount.searchAccount(this.userInfo.employee_id , organization_id , this.search )
            this.accounts = searchData
            this.hasPage=false 
            console.log(this.accounts , 'searchData')
            
        },
        closeDialog(val) {
            this.dialog = val
            this.getObj={}
             this.searchAccount()
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
