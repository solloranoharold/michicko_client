
import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()

export default class Epayments { 
    async addUpdateEPayment(data) {
        const { method } = data 
        if (method == 0) {
            let epayments = await this.readExistingEPayment(data)
            if (epayments.length > 0) {
                Swal.fire({
                    timer:3000,
                    toast: true, 
                    position:'bottom-end',
                    showConfirmButton:false ,
                    title: `Payment Method  already exists!`,
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
                    let result = await this.addUpdateEpayment(  data )
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
    async readExistingEPayment(data) {
        const { payment_method , organization_id } = data 
        let a =await axios.getRequest(`epayment/readExistingEPayment/${payment_method}/${organization_id}`)
        return await a 
    }
    async  addUpdateEpayment(data) {
        let a = await axios.postRequest(`epayment/addUpdateEpayment`, data)
        return await a 
    }
    async loadEpayments( organization_id) {
        let a = axios.getRequest(`epayment/loadEpayments/${organization_id}`)
        return await a 
    }

}
