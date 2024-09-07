<template>
    <v-container fluid >
         <v-toolbar flat dense class="toolbarTitle">
            <v-toolbar-title>Discounts  <v-chip v-if="userInfo.position_id==0 || userInfo.position_id==1">{{ $route.params.organization_name}}</v-chip></v-toolbar-title>
            <v-spacer/>
             <v-btn class="textTitle" @click="addUpdateDiscounts()"  rounded dark color="#BCAAA4"><v-icon>mdi-percent</v-icon>Add Discounts</v-btn>
        </v-toolbar>
        <v-data-table 
        v-if="!loading"
        :search="search"
        :items="discounts"
        :headers="headers"
        dense
        >
            <template v-slot:top>
                <v-flex md4 xs12 sm12 lg4>
                    <v-text-field v-model="search" placeholder="Search" label="Search" clearable small prepend-inner-icon="mdi-magnify"></v-text-field>
                </v-flex>
            </template>
            <template v-slot:[`item.percent`] = "{item}">
                <v-chip color="indigo" text-color="white">
                    {{ item.percent }}%
                </v-chip>
            </template>
             <template v-slot:[`item.actions`] = "{item}">
                <v-tooltip bottom >
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="blue" @click="addUpdateDiscounts(item )"  v-bind="attrs"
                        v-on="on">
                        mdi-pencil-outline
                        </v-icon>
                    </template>
                    <span>Edit Record</span>
                </v-tooltip>
            </template>
        </v-data-table>
         <LoaderView v-else />
        <discounts-dialog :dialog="dialog" :save-data-obj="getObj" @closeDialog="closeDialog"/>
    </v-container>
   
</template>


<script>
import DiscountsDialog from './DiscountsDialog.vue';
import Discounts from '@/class/discounts';
import LoaderView from '@/views/LoaderView.vue';
export default {
    components:{DiscountsDialog , LoaderView },
    data: () => ({
        discountClass : new Discounts(),
        getObj: {},
        dialog: false,
        loading: false, 
        discounts: [],
        search: "",
        headers: [
            // {text:'ID' , value:'discount_id'},
            {text: 'Description', value: "description" },
            { text: 'Percent', value: 'percent' },
            {text:'Actions' , value:'actions'}
        ]
    }),
    async created() {
        if ((this.userInfo.position_id == 0 || this.userInfo.position_id == 1) && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
        }
        await this.loadDiscounts()
    },
    methods: {
        async loadDiscounts() {
            let organization_id = this.$route?.params?.organization_id ? this.$route.params.organization_id : this.userInfo.organization_id
            this.loading = true 
            await this.discountClass.readDiscounts(organization_id).then((data) => { 
                this.discounts = data 
                console.log('loadDiscounts' , data)
                this.loading = false 
            })
             
        },
        addUpdateDiscounts( item={}) {
            this.getObj = JSON.parse(JSON.stringify(item))
            this.dialog = !this.dialog
        },
        closeDialog(val) {
            this.dialog = val
            this.loadDiscounts()
        }
    }
}
</script>