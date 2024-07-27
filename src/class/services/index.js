
import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()
export default class Services{ 
    async addUpdateService(data) {
        console.log(data , 'addUpdateCLient')
        const { method } = data 
        if (method == 0) {
            let clients = await apiReadExistingService(data)
            if (clients.length > 0) {
                 Swal.fire({
                    title: `Service already exists!`,
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
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Yes, ${method == 0 ? 'add' : 'update'} it!`,
            }).then(async(result) => {
                if (result.isConfirmed) {
                    let result = await addUpdateService(  data )
                    console.log(result ,'result')
                    Swal.fire({
                        title: `Data has been ${method == 0 ? 'added' : 'updated'}`,
                        icon: "success",
                    })
                    return result;
                }
            })
        )
    }
    // searchServices , loadServices
     async getServicesTotalCount( organization_id , search ) {
         console.log('/getClientTotalCount')
         let a = await axios.getRequest(`services/getServicesTotalCount/${organization_id}/${search ? search : undefined}`)
        return await a 
    }
    async loadServices(organization_id, page, itemsPerPage) {
         let a = await axios.getRequest(`services/loadServices/${organization_id}/${page}/${itemsPerPage}`)
            return await a 
    }
    async searchServices( organization_id , search) {
        let a = await axios.getRequest(`services/searchServices/${organization_id}/${search}`)
         return await a
    }
    async loadAllServices(organization_id) {
        console.log('/loadAllServices' , organization_id)
        let a = await axios.getRequest(`services/loadAllServices/${organization_id}`)
            return await a
    }
}
async function addUpdateService(data) {
    let a = await axios.postRequest(`services/addUpdateService`, data)
    return await a 
}
async function apiReadExistingService(data) {
    const { service_name, organization_id } = data 
    let a =await axios.getRequest(`services/readExistingService/${service_name}/${organization_id}`)
    return await a 
}
