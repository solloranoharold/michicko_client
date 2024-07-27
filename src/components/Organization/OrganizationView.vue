<template>
    <v-container fluid>
         <v-toolbar flat dense>
            <v-toolbar-title><v-icon>mdi-domain</v-icon> Organizations / Branch</v-toolbar-title>
            <v-spacer/>
            <v-btn @click="addUpdateOrganization()"  rounded dark color="#BCAAA4"><v-icon>mdi-domain</v-icon>Add Branch</v-btn>
        </v-toolbar>
          <v-card style="height: 750px;"  v-if="!loading">
        <v-simple-table dense>
            <thead>
                <tr>
                    <th> Organization / Branch </th>
                    <th> Address </th>
                    <th> Contact # </th>
                    <th> Email </th>
                    <th> Modules </th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="( item , i ) in organizations" :key="i">
                    <td>
                        <v-chip outlined small color="blue">
                            {{ item.organization_name }}
                        </v-chip>
                    </td>
                    <td>{{ item.address  }}</td>
                    <td>{{ item.org_contact_no }}</td>
                    <td>{{ item.email }}</td>
                    <td>
                          <v-icon  color="black"  @click="directToPath( item )">mdi-monitor</v-icon>
                          <!-- <v-menu
                                bottom
                                min-width="200px"
                                rounded
                                offset-y
                            >
                                <template v-slot:activator="{ on }">
                                <v-icon  color="black"  v-on="on">mdi-monitor</v-icon>
                                </template>
                                <v-card>
                                <v-list dense  class="textTitle">
                                    <v-list-item v-for="( path , a ) in modules" :key="a" @click="directToPath(path , item )">
                                        <v-list-item-title  >
                                            <v-list-item-icon>
                                                <v-icon>{{ path.icon }}</v-icon>
                                             </v-list-item-icon>
                                            {{ path.text }}
                                        </v-list-item-title>
                                    </v-list-item>
                                     <v-list-group
                                        :value="true"
                                        prepend-icon="mdi-bottle-soda-classic-outline"
                                        no-action
                                    >
                                        <template v-slot:activator>
                                        <v-list-item-title>Inventory</v-list-item-title>
                                        </template>
                                            <v-list-item  sub-group v-for="( path , a ) in groupModules" :key="a" @click="directToPath(path , item )">
                                                <v-list-item-title  >
                                                    {{ path.text }}
                                                </v-list-item-title>
                                            </v-list-item>
                                    </v-list-group>
                                </v-list>
                                </v-card>
                            </v-menu> -->
                       
                    </td>
                    <td>
                        <v-btn x-small @click="addUpdateOrganization( item)"><v-icon x-small>mdi-pencil</v-icon>edit</v-btn>
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
        </v-card>
        <LoaderView v-else />
        <organization-dialog-vue :dialog="dialog" :saveDataObj="getObj" @closeDialog="closeDialog"/>
    </v-container>
   
</template>
<script>
import Organizations from '@/class/organizations';
import OrganizationDialogVue from './OrganizationDialog.vue';
import LoaderView from '@/views/LoaderView.vue';
export default {
    components:{ OrganizationDialogVue , LoaderView},
    data: () => ({
        classOrg: new Organizations(),
        dialog: false, 
        loading:false , 
        getObj:{},
        organizations: [],
        search:'',
        headers: [
            { text: "Organization / Branch ", value: 'organization_name' },
            { text: 'Address', value: 'address' },
            { text:'Contact #' , value:'org_contact_no'}
        ],
        modules: [
            { text: 'Dashboard', icon: 'mdi-home', name: 'dashboard' },
            { text: "Transactions",icon: "mdi-currency-php", name: 'transactions' },
            { text: 'Employees', icon: 'mdi-account-multiple-outline', name: 'employee' },
            { text: 'Accounts', icon: 'mdi-book-cog-outline', name: 'accounts' },
            { text: 'Services', icon: 'mdi-content-cut', name: 'services' },
            { text: 'Clients', icon: ' mdi-monitor-account', name: 'clients' },
            { text: "Cashless Methods", name: 'cashless', 'icon': "mdi-credit-card-marker" }
        ],
        group_Modules: [ 
            { text: 'Services', icon: 'mdi-bottle-soda-classic-outline', name: 'inventory' },
            { text:'OTC Products ', icon: 'mdi-bottle-soda-classic-outline', name: 'products' },
        ]
    }),
    async created() {
         this.$store.commit('GROUP_MODULES' ,[] )
            this.$store.commit('MASTER_NAVBAR' , [])
      await this.loadOrganizations()  
    },
    methods: { 
        directToPath(item) {
            this.loading=true
            this.group_Modules.forEach(data => { 
                data.item = JSON.parse(JSON.stringify( item ))
            })
            this.modules.forEach(data => { 
                data.item = JSON.parse(JSON.stringify( item ))
            })
            console.log(this.modules , this.group_Modules)
            setTimeout(() => {
                this.$store.commit('MASTER_NAVBAR', this.modules)
                this.$store.commit('GROUP_MODULES', this.group_Modules)
                this.loading = false 
                alert(`Organization ${item.organization_name} SELECTED`)
            }, 1000);
        //   this.$router.push({name:path.name ,params: JSON.parse(JSON.stringify(item))})  
        },
        async loadOrganizations() { 
            this.loading=true
            await this.classOrg.readOrganizations().then(data => {
                this.organizations = data
               this.loading=false 
          })
        },
        addUpdateOrganization(item={}) {
            this.getObj = JSON.parse(JSON.stringify(item))
            this.dialog = !this.dialog
        },
        closeDialog(val) {
            this.dialog = val
            this.loadOrganizations()
        }
    }
}
</script>
<style scoped>
   .table-container {
  height: 750px; /* Set the desired height */
  overflow-y: auto; /* Make the table scrollable */
}
</style>
