
import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()
import moment from 'moment'
export default class Inventory{ 
  
    async productHistoryCreate(data) {
         let a = await axios.postRequest(`inventory/productHistoryCreate`, data)
         return await a 
    }
    async addUpdateProduct(data) {
        console.log(data , 'addUpdateCLient')
        const { method } = data 
        if (method == 0) {
            let clients = await apiReadExistingProducts(data)
            if (clients.length > 0) {
                Swal.fire({
                    timer:3000,
                    toast: true, 
                    position:'bottom-end',
                    showConfirmButton:false ,
                    title: `Service already exists!`,
                    icon: "error",
                 })
                return false 
            }
            
        } else  data.updated_date = moment().format('YYYY-MM-DD HH:mm:ss')
        

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
    // searchServices , loadServices
     async getProductsTotalCount( organization_id , search ) {
         console.log('/getClientTotalCount')
         let a = await axios.getRequest(`inventory/getInventoryTotalCount/${organization_id}/${search ? search : undefined}`)
        return await a 
    }
    async loadProducts( organization_id, page, itemsPerPage) {
         let a = await axios.getRequest(`inventory/loadInventory/${organization_id}/${page}/${itemsPerPage}`)
            return await a 
    }
    async searchProducts( organization_id , search) {
        let a = await axios.getRequest(`inventory/searchProduct/${organization_id}/${search}`)
    return await a
    }
    async loadAllInventory(organization_id) {
        let a = await axios.getRequest(`inventory/loadAllInvetory/${organization_id}`)
    return await a
    }
   
}
async function addUpdateProducts(data) {
    let a = await axios.postRequest(`inventory/addUpdateProduct`, data)
    return await a 
}
async function apiReadExistingProducts(data) {
    const { product, organization_id } = data 
    let a =await axios.getRequest(`inventory/readProduct/${product}/${organization_id}`)
    return await a 
}
