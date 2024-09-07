
import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()

export default class Discount {


    async addUpdateDiscount( data ) {
        
        const { method } = data 
        if (method == 0) {
            let discounts = await this.readExistingDiscount(data.description , data.organization_id )
            if (discounts.length > 0) {
                Swal.fire({
                    timer:3000,
                    toast: true, 
                    position:'bottom-end',
                    showConfirmButton:false ,
                    title: `Discount already exists!`,
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
                    let result = await axios.postRequest(`discounts/addUpdateDiscounts`, data)
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
    async readExistingDiscount( description , organization_id) {
         let a = await axios.getRequest(`discounts/readExistingDiscount/${description}/${organization_id}`)
        return await a 
    }
    async readDiscounts(organization_id) {
        let a = await axios.getRequest(`discounts/readDiscounts/${organization_id}`)
        return await a 
    }
}