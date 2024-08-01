
import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()
export default class Employees { 
    constructor(){}

    async addUpdateEmployee( data ){
        console.log('/addUpdateEmployee' , data)
        let { last_name , first_name , method , organization_id } = data 
       
        // eslint-disable-next-line
        if(method == 0 ){
            let users = await readExistingEmployees( last_name , first_name , organization_id )
            if(users.length){
                Swal.fire({
                    timer:3000,
                    toast: true, 
                    position:'bottom-end',
                    showConfirmButton:false ,
                    title: "Employee data exists",
                    icon: "error"
                  });
                return ;
            }
        }

      return  Promise.resolve(
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
                let result = await addUpdateDataEmployee( data)
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

    async getEmployeesTotalCount(employee_id,  organization_id , search  ){
        console.log('/getEmployeesTotalCount' , search , 'search')
        let a =  await getApiEmployeesTotalCount(employee_id,  organization_id , search )
        return await a 
        // console.log(a , 'getEmployeesTotalCount')
    }
    async loadEmployees( employee_id , organization_id , page , itemsPerPage){
        console.log('/getEmployeesTotalCount')
        let a =  await getApiEmployees( employee_id , organization_id , page , itemsPerPage)
        return await a 
    }  

    async loadEmployeesOption(  organization_id ){
        let a = await getApiEmployeesOptions( organization_id)
        return await a 
    } 
    async searchEmployee(organization_id, search) {
        console.log(organization_id, search , ' searchEmployee')
         let response = await axios.getRequest(`employees/searchEmployee/${organization_id}/${search}`)
        return await response
    }

    
}
async function getApiEmployees(employee_id , organization_id , page , itemsPerPage){
    let response = await axios.getRequest(`employees/loadEmployees/${employee_id}/${organization_id}/${page}/${itemsPerPage}`)
    return await response
}
async function getApiEmployeesOptions( organization_id ){
    let response = await axios.getRequest(`employees/loadEmployeesOption/${organization_id}`)
    return await response
}
async function getApiEmployeesTotalCount(employee_id ,organization_id , search ){
    let response = await axios.getRequest(`employees/employeeTotalCount/${employee_id}/${organization_id}/${search}`)
    return await response
}
async function addUpdateDataEmployee(data) {
    let response = await axios.postRequest(`employees/addUpdateEmployees`, data)
    return await response 
}
async function readExistingEmployees(  last_name , first_name , organization_id ){
    let response = await axios.getRequest(`employees/readExistingEmployee/${last_name}/${first_name}/${organization_id}`)
    return await response
}