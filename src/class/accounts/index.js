
import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()
export default class Accounts { 
    constructor() {
        this.tries = 0 
    }

    async loginAccount( username , password ){
        if(!username || !password ){
            Swal.fire({
                title: "Please complete details!",
                icon: "error"
              }); 
              return false ; 
        }
        

        return  await apiLogin( username , password  )
    }
    async updateSessionAccountStatus(data) {
        let a = await axios.postRequest(`accounts/updateSessionAccountStatus`, data)
        return await a
    }
    async addUpdateAccount(data) {
        console.log(data, 'addUpdateAccount')
       
        let { username, password, cpassword, method } = data 
        if (method == 0) {
             if (password !== cpassword) {
                Swal.fire({
                title: `Password and Confirm Password not matched or account is deactivated `,
                icon: "error",
                })
           
                return false 
             }
            let users = await apiReadExistingAccount(username)
            if (users.length) {
                Swal.fire({
                    title: `User already exists!`,
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
         })
         .then(async(result) => {
            if (result.isConfirmed) {
                let result = await addUpdateAccount(  data)
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
    async getAccountTotalCount(employee_id, organization_id) {
         console.log('/getAccountTotalCount')
        let a =  await getApiEmployeesTotalCount( employee_id , organization_id)
        return a 
    }
    async loadAccounts(employee_id, organization_id, page, itemsPerPage) {
        console.log('/loadAccounts')
        let a =  await getApiAccounts( employee_id , organization_id , page , itemsPerPage)
        return  a 
    }
    async searchAccount( employee_id , organization_id , search) {
        let a = await getApiSearchAccounts(employee_id , organization_id , search )
        return a 
    }
    async updateAccountPassword( data ) {
        let a = axios.postRequest('accounts/updateAccountPassword' , data)
        return await a
    }
    
}
async function getApiSearchAccounts(employee_id, organization_id, search ) {
    let a = await axios.getRequest(`accounts/searchAccount/${employee_id}/${organization_id}/${search}`)
    return a 
}
async function getApiAccounts(employee_id , organization_id , page , itemsPerPage){
    console.log(employee_id, organization_id, page, itemsPerPage)
    let a = await axios.getRequest(`accounts/loadAccounts/${employee_id}/${organization_id}/${page}/${itemsPerPage}`)
    return await a 
}
async function getApiEmployeesTotalCount(employee_id, organization_id , search) {
    let a = await axios.getRequest(`accounts/accountTotalCount/${employee_id}/${organization_id}/${search}`)
    return await a 
    }

    
async function apiReadExistingAccount(username) {
    console.log(username)
    let a  = axios.getRequest(`accounts/readExistingAccount/${username}`)
    return await a
}

async function addUpdateAccount(data) {
    let a = axios.postRequest('accounts/addUpdateAccount' , data)
    return await a
}

async function apiLogin(username, password) {
    let a = await axios.postRequest(`accounts/login`, { username: username, password: password })
    return await a 
}

