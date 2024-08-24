<template>
    <v-container fluid>
        <v-toolbar flat  dense>
            <v-toolbar-title class="toolbarTitle"><v-icon>mdi-account-multiple</v-icon> Expenses Record <v-chip v-if="userInfo.position_id==0|| userInfo.position_id==1">{{ $route.params.organization_name}}</v-chip></v-toolbar-title>
            <v-spacer/>
           <v-btn class="textTitle" @click="addUpdateExpenses()" rounded dark color="#BCAAA4"><v-icon>mdi-account-plus</v-icon>Add Expenses</v-btn>
            
            </v-toolbar>
        
         <v-card style="height: 700px;"  v-if="!loading">
             <v-toolbar flat dense>
                <label style="font-size: 13px;">  {{ expenses.length }} of {{ totalCountExpenses }} Items in Page {{ page }}</label>
                </v-toolbar>
                <br/>
                <i style="font-size: 11px;">click<v-icon>mdi-magnify</v-icon> to search specific data</i>
                <v-toolbar flat dense>
                    
                    <v-flex md3>
                        <v-text-field v-model="search"  clearable dense label="Search" append-icon="mdi-magnify" @click:append="searchExpenses" @keyup.enter="searchExpenses"></v-text-field>
                    </v-flex>
                    <v-spacer/>
                      <v-btn class="textTitle" @click="categoryDialog=!categoryDialog" rounded dark  small color="#BCAAA4"><v-icon>mdi-cogs</v-icon>Categories Settings </v-btn>
                     
                </v-toolbar>
                    <v-simple-table dense class="table-container textTitle" color="#BCAAA4">
                        <thead>
                            <tr>
                                <th>Date </th>
                                <th>Category 1 </th>
                                <th>Category 2 </th>
                                <th>Details </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                    </v-simple-table>
         </v-card>
         <category-dialog :dialog="categoryDialog" @closeCategory="closeDialog"/>
    </v-container>




</template>
<script>
import CategoryDialog from './CategoryDialog.vue';
export default {
    components:{CategoryDialog},
    data: () => ({
        dialog: false, 
        categoryDialog:false, 
        totalCountExpenses: 0,
        loading:false , 
        itemsPerPage: 20 ,  
        totalItems: 0, 
        page:1,
        getObj: {},
        expenses: [],
        date1: null,
        date2: null, 
        menu1: false, 
        menu2: false,
        search:undefined
    }),
     async created() {
       if ((this.userInfo.position_id == 0 || this.userInfo.position_id==1) && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
         }  
    },
    methods: {
        closeDialog(val) {
            this.categoryDialog = val 
            this.dialog=val
        },
        searchExpenses() {
            
        },
        addUpdateExpenses( item ={}) {
            this.getObj = JSON.parse(JSON.stringify(item))
            this.dialog = !this.dialog
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