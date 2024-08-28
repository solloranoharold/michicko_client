<template>
    <v-container fluid>
         <v-toolbar flat dense class="toolbarTitle">
            <v-toolbar-title>Discounts  <v-chip v-if="userInfo.position_id==0 || userInfo.position_id==1">{{ $route.params.organization_name}}</v-chip></v-toolbar-title>
            <v-spacer/>
             <v-btn class="textTitle" @click="addUpdateDiscounts()"  rounded dark color="#BCAAA4"><v-icon>mdi-percent</v-icon>Add Discounts</v-btn>
        </v-toolbar>
        <discounts-dialog :dialog="dialog" :save-data-obj="getObj" @closeDialog="closeDialog"/>
    </v-container>
</template>


<script>
import DiscountsDialog from './DiscountsDialog.vue';
export default {
    components:{DiscountsDialog},
    data: () => ({
        getObj: {},
        dialog:false 
    }),
    async created() {
        if ((this.userInfo.position_id == 0 || this.userInfo.position_id == 1) && !this.$route.params.organization_id) {
            this.$router.push('/organization')
            return
        }
    },
    methods: {
        addUpdateDiscounts( item={}) {
            this.getObj = JSON.parse(JSON.stringify(item))
            this.dialog = !this.dialog
        },
        closeDialog(val) {
            this.dialog = val
        }
    }
}
</script>