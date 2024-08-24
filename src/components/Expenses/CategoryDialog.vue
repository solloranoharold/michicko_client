<template>
    <v-container fluid class="textTitle">
        <v-dialog persistent v-model="value" max-width="900">
        <v-card>
            <v-toolbar dark flat dense class="toolbarTitle" color="#BCAAA4" >
                <v-toolbar-title><v-icon>mdi-cogs</v-icon> Categories Settings </v-toolbar-title>
                <v-spacer/>
                <v-icon @click="close()">mdi-close</v-icon>
            </v-toolbar>
            <v-card-text class="textTitle">
                <!-- List of Category Expenses -->
                <br/>
                <v-card>
                     <h5 class="text-center">List of Category Expenses</h5>
                  <v-toolbar flat dense>
                        <v-spacer/>
                         
                        <v-btn color="#BCAAA4" dark @click="addUpdateCategory('tbl_category_expenses_category1')" x-small rounded> add category 1</v-btn>
                        <v-btn color="#BCAAA4" dark @click="addUpdateCategory('tbl_category_expenses_category2')" x-small> add category 2</v-btn>
                       
                    </v-toolbar>
                 <v-row no-gutters>
                     <v-col cols="6" >
                        <v-card style="height: 300px;">
                        <v-simple-table class="table-container_category textTitle" >
                          
                            <thead>
                                <tr>
                                    <th class="sticky-header">Category 1 <v-btn color="#BCAAA4" dark :disabled="!selectedCategory.length" @click="addUpdateCategory('tbl_category_expenses_category2')" x-small><v-icon >mdi-select</v-icon> select </v-btn></th>
                                    <th class="sticky-header"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item , i ) in categories1" :key="i" :style="{'background-color': item.category1_expense_id == category_expense_id  ? '#B0BEC5' : 'transparent' }">
                                    <td> {{  item.category_name }}</td>
                                     <td align="right"> 
                                        <v-tooltip bottom >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="success" @click="addUpdateCategory('tbl_category_expenses_category2' , item)"  v-bind="attrs"
                                            v-on="on">
                                            mdi-pencil-outline
                                            </v-icon>
                                        </template>
                                        <span class="textTitle">Edit Record</span>
                                    </v-tooltip>
                                     <v-tooltip bottom >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon v-if="category_expense_id==0" color="primary" @click="category_expense_id= item.category1_expense_id , hasSelectedCategory = true "  v-bind="attrs"
                                            v-on="on">
                                            mdi-select
                                            </v-icon>
                                             <v-icon v-else color="red" @click="category_expense_id= 0 , hasSelectedCategory = false "  v-bind="attrs"
                                            v-on="on">
                                            mdi-select
                                            </v-icon>
                                        </template>
                                        <span class="textTitle">{{ category_expense_id == 0 ?  'Select Category 2' :'Deselect Category 1 ' }}</span>
                                    </v-tooltip>
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-card>
                    </v-col>
                    <v-col cols="6"   >
                        <v-card style="height: 300px;">
                         <v-simple-table class="table-container_category textTitle" >
                            <thead>
                                <tr>
                                    <th class="sticky-header">Category 2</th>
                                    <th class="sticky-header">Category 1 </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item , i ) in categories2" :key="i">
                                    <td> {{  item.category_name }}</td>
                                    <td>
                                        {{   item.category1_name }}
                                    </td>
                                    <td> 
                                         <v-tooltip bottom v-if="!hasSelectedCategory">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="success" @click="addUpdateCategory('tbl_category_expenses_category2' , item)"  v-bind="attrs"
                                                v-on="on">
                                                mdi-pencil-outline
                                                </v-icon>
                                            </template>
                                            <span class="textTitle">Edit Record</span>
                                        </v-tooltip>
                                        <v-checkbox v-else v-model="selectedCategory" :value="item"></v-checkbox>
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                        </v-card>
                    </v-col>
                </v-row>
                </v-card>

                
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog persistent v-model="categoryDialog" max-width="300">
        <v-card>
            <v-toolbar dark flat dense class="toolbarTitle" color="#BCAAA4">
             <v-toolbar-title><v-icon>mdi-shape</v-icon>{{ editedObj.method== 0 ? 'Add' : 'Update' }} {{ table=='tbl_category_expenses_category1' ? 'Category 1 ' : 'Category 2' }}  </v-toolbar-title>
                <v-spacer/>
                <v-icon @click="editedObj={} , categoryDialog = !categoryDialog">mdi-close</v-icon>
            </v-toolbar>
                <v-card-text class="textTitle">
                       {{ editedObj }}
                       {{ table  }}
                </v-card-text>
        </v-card>

    </v-dialog>

    </v-container>
</template>
<script>
import Expenses from '@/class/expenses';
export default { 

    props: ['dialog'],
    data: () => ({
        classExpenses: new Expenses(),
        categoryDialog: false, 
        connectionDialog: false, 
        table: '',
        editedObj: {},
        categories1: [],
        categories2: [],
        selectedCategory: [],
        hasSelectedCategory:false, 
        category_expense_id: 0,

        
    }),
    async created() {
       if ((this.userInfo.position_id == 0 || this.userInfo.position_id==1) && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
        }  
    },
    computed:{
        value() {
            return this.dialog
        }
    },
    watch: {
        dialog(val) {
            if(val)  this.loadCategories()
        }  
    },
    methods: {
        async loadCategories() {
            let organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            this.categories1 = await this.classExpenses.readCategory1(organization_id)
            this.categories2 = await this.classExpenses.readCategory2(organization_id)
        },
        addUpdateCategory(table, item = {}) {
           
            this.table = table 
            this.editedObj = JSON.parse(JSON.stringify(item))
             if (Object.keys(item).length === 0) this.editedObj.method = 0 
             else {
                 if(this.editedObj.category1_name) delete this.editedObj.category1_name
                 this.editedObj.method = 1 
            }

            this.editedObj.organization_id =this.$route?.params?.organization_id ?this.$route.params.organization_id: this.userInfo.organization_id
            this.categoryDialog = !this.categoryDialog
            
        },
        close() {
            this.$emit('closeCategory' , false )
        }
    }
}

</script>
<style scoped>
   .table-container_category {
  height: 300px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
</style>
