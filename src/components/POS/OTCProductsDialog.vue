<template>
    <v-dialog 
        persistent
        transition="dialog-top-transition"
        max-width="500"
        v-model="value"
      >
          <v-card >
            <v-toolbar
               color="#BCAAA4"
              dark 
            class="toolbarTitle"
            ><v-icon>mdi-bottle-soda</v-icon>OTC PRODUCTS
            <v-spacer/>
            <v-icon  @click="close()">mdi-close</v-icon>
            </v-toolbar>
            <v-card-text  class="textTitle">
                <br/>
                 <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                > 
                <v-autocomplete  v-model="selectedProduct" return-object  color="#BCAAA4"  item-text="product_name" append-icon="mdi-package" :items="products" label="OTC Product" dense outlined  :rules="nameRules"></v-autocomplete>
                <label>Remaining Quantity : x{{ selectedProduct?.quantity ? selectedProduct.quantity: 0  }}</label>
                <v-text-field color="#BCAAA4" :rules="nameRules" outlined type="number" @input="getTotalAmount()" :min="1" required prepend-inner-icon="mdi-plus-box" placeholder="Quantity" v-model="selectedProduct.less_quantity" dense></v-text-field> 
                <v-text-field color="#BCAAA4" :rules="nameRules" outlined type="number"   :min="1" required prepend-inner-icon="mdi-plus-box" placeholder="Price" label="Price" v-model="selectedProduct.srp" dense readonly filled></v-text-field> 
                <v-text-field color="#BCAAA4" :rules="nameRules" outlined type="number" :min="1" required prepend-inner-icon="mdi-plus-box" placeholder="Total Amount" label="Total Amount" v-model="selectedProduct.product_total_amount" dense readonly filled></v-text-field> 
            </v-form>
            <v-card-actions>
                <v-spacer/>
                <v-btn :disabled="!valid || !selectedProduct.less_quantity || !selectedProduct.price " @click="addOTCProduct" rounded dark color="#BCAAA4"> ADD OTC PRODUCT</v-btn>
            </v-card-actions>
            </v-card-text>
          </v-card>
      </v-dialog>
</template>

<script>
export default { 
    data: () => ({
        selectedProduct: {},
         nameRules: [
            v => !!v || 'This field is required'
        ],
        valid:false , 
    }),
    props: {
        dialog:{
            type: Boolean,
            required: true 
        },
        products: {
            type: Array,
            required: true 
        }
    },
     watch: {
         value(val) {
            if(val) this.selectedProduct={}
         }
    },
    async created() {
       
    },
    computed: {
        value(){
            return this.dialog
        },
       
    },  
    methods: { 
        close() {
            this.$emit('closeDialog' , false)
        },
        getTotalAmount() {
            console.log('asdasdasdas')
           
            let less_quantity = this.selectedProduct.less_quantity ? this.selectedProduct.less_quantity : 0
            let price = this.selectedProduct.srp
            if (this.selectedProduct.quantity <  less_quantity) {
                alert('Not Enough Quantity')
                this.valid = false
                return false 
            }
            if (less_quantity > 0) this.selectedProduct.product_total_amount =  parseFloat(price * less_quantity).toFixed(2)
            else this.selectedProduct.product_total_amount=  0
           
        },
        addOTCProduct() {
            this.$emit('OTCProduct', this.selectedProduct)
            this.close()
        }
    }      
}
</script>