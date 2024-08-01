
import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()
export default class Product{ 
     async productHistoryCreate(data) {
         let a = await axios.postRequest(`products/productHistoryCreate`, data)
         return await a 
    }
    async addUpdateProduct(data) {
        console.log(data , 'addUpdateCLient')
        const { method } = data 
        if (method == 0) {
            let products = await apiReadExistingProducts(data)
            if (products.length > 0) {
                Swal.fire({
                      timer:3000,
                    toast: true, 
                    position:'bottom-end',
                    showConfirmButton:false ,
                    title: `Product already exists!`,
                    icon: "error",
                 })
                return false 
            }
            
        }

        return Promise.resolve(
            Swal.fire({
                title: `Are you want to ${method == 0 ? 'add' : 'update'}?`,
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                 confirmButtonColor: "#90CAF9",
                cancelButtonColor: "white",
                confirmButtonText: `Yes, ${method == 0 ? 'add' : 'update'} it!`,
            }).then(async(result) => {
                if (result.isConfirmed) {
                    let result = await addUpdateProducts(  data )
                    console.log(result ,'result')
                    Swal.fire({
                         timer:3000,
                        toast: true, 
                        position:'bottom-end',
                        showConfirmButton:false ,
                        title: `Data has been ${method == 0 ? 'added' : 'updated'}`,
                        icon: "success",
                    })
                    return result;
                }
            })
        )
    }
     async getProductsTotalCount( organization_id , search ) {
         console.log('/getClientTotalCount')
         let a = await axios.getRequest(`products/getInventoryTotalCount/${organization_id}/${search ? search : undefined}`)
        return await a 
    }
    async loadProducts( organization_id, page, itemsPerPage) {
         let a = await axios.getRequest(`products/loadInventory/${organization_id}/${page}/${itemsPerPage}`)
            return await a 
    }
    async searchProducts( organization_id , search) {
        let a = await axios.getRequest(`products/searchProduct/${organization_id}/${search}`)
        return await a
    }
    async loadAllProducts(organization_id) {
        let a = await axios.getRequest(`products/loadAllProducts/${organization_id}`)
        return await a 
    }
}
async function addUpdateProducts(data) {
    let a = await axios.postRequest(`products/addUpdateProduct`, data)
    return await a 
}
async function apiReadExistingProducts(data) {
    const { product_name, organization_id } = data 
    let a =await axios.getRequest(`products/readProduct/${product_name}/${organization_id}`)
    return await a 
}
