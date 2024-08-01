
import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()

export default class Clients { 

    async addUpdateClient(data) {
        console.log(data , 'addUpdateCLient')
        const { method } = data 
        if (method == 0) {
            let clients = await apiReadExistingClient(data)
            if (clients.length > 0) {
                Swal.fire({
                    timer:3000,
                    toast: true, 
                    position:'bottom-end',
                    showConfirmButton:false ,
                    title: `Client already exists!`,
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
                    let result = await addUpdateClient(  data )
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
    
    async getClientTotalCount( organization_id , search ) {
         console.log('/getClientTotalCount')
        let a =  await getApiClientTotalCount(organization_id , search)
        return a 
    }
    async loadClients( organization_id, page, itemsPerPage) {
        console.log('/loadClients')
        let a =  await getApiClients(  organization_id , page , itemsPerPage)
        return  a 
    }
    async searchClient( organization_id , search) {
          let a = await getApiSearchClient(  organization_id , search )
        return a 
    }
    async loadAllClients( organization_id) {
        let a = await axios.getRequest(`clients/loadAllClients/${organization_id}`)
        return await a
    }
}
async function getApiSearchClient( organization_id, search) {
    let a = await axios.getRequest(`clients/searchClient/${organization_id}/${search}`)
    return await a
}
async function getApiClients(organization_id , page , itemsPerPage ) {
     let a = await axios.getRequest(`clients/loadClients/${organization_id}/${page}/${itemsPerPage}`)
    return await a 
}
async function getApiClientTotalCount( organization_id , search ) {
    let a = await axios.getRequest(`clients/clientTotalCount/${organization_id}/${search ? search : undefined}`)
    return await a 
}
async function addUpdateClient(data) {
    let a = await axios.postRequest(`clients/addUpdateClient`, data)
    return await a 
}
async function apiReadExistingClient(data) {
    const { last_name, first_name, organization_id } = data 
    let a =await axios.getRequest(`clients/readExistingClient/${last_name}/${first_name}/${organization_id}`)
    return await a 
}