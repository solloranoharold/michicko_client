

// import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()
export default class Expenses { 


    async readCategory1( organization_id ) {
         let a = await axios.getRequest(`expenses/readCategory1/${organization_id}`)
         return await a 
    }
    async readCategory2( organization_id ) {
         let a = await axios.getRequest(`expenses/readCategory2/${organization_id}`)
         return await a 
    }
}