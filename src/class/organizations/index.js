
import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()
export default class Organizations { 
    constructor() { }
    async organizationsTotalCount(employee_id , search) {
         let a = await axios.getRequest(`organizations/organizationsTotalCount/${employee_id}/${search}`)
        return await a
    }
    async searchOrganization(employee_id , search) {
         let a = await axios.getRequest(`organizations/searchOrganization/${employee_id}/${search}`)
        return await a
    }
    async readOrganizationsAdmin( employee_id) {
         let a = await axios.getRequest(`organizations/readOrganizationsAdmin/${employee_id}`)
        return await a
    }
    async readOrganizations() {
        let a = await getApiOrganizations()
        return await a 
    }
    async readOrganizationsPerID( organization_id ) {
        let a = await axios.getRequest(`organizations/readOrganizationsPerID/${organization_id}`)
        return await a
    }
    async addUpdateOrganization( data ) {
        const { method } = data 
        if (method == 0) {
            let organizations = await apiReadExistingOrganization(data)
            if (organizations.length > 0) {
                Swal.fire({
                    title: `Organization  already exists!`,
                    icon: "error",
                     timer:3000,
                    toast: true, 
                    position:'bottom-end',
                    showConfirmButton:false ,
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
                    let result = await addUpdateOrganizations(  data )
                    console.log(result ,'result')
                    Swal.fire({
                        title: `Data has been ${method == 0 ? 'added' : 'updated'}`,
                        icon: "success",
                         timer:3000,
                        toast: true, 
                        position:'bottom-end',
                        showConfirmButton:false ,
                    })
                    return result;
                }
            })
        )
    }
}
async function addUpdateOrganizations(data) {
    let a = await axios.postRequest(`organizations/addUpdateOrganizations`, data)
    return await a 
}
async function getApiOrganizations() {
    let a = await axios.getRequest(`organizations/readOrganizations`)
    return await a
}
async function apiReadExistingOrganization(data) {
    const { organization_name } = data 
    let a =await axios.getRequest(`organizations/readExistingOrganization/${organization_name}`)
    return await a 
}
