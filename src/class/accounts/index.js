
import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()
export default class Accounts { 
    constructor() {
        this.tries = 0 
    }
  async getManagerApproval( employee_id , password , organization_id) {
         let a = await axios.getRequest(`accounts/getManagerApproval/${employee_id}/${password}/${organization_id}`)
        return await a 
    }
    async evaluateAccountStatus( organization_id , status ) {
        let a = await axios.getRequest(`accounts/evaluateAccountStatus/${organization_id}/${status}`)
        return await a
    }
    async loginAccount( username , password ){
        if(!username || !password ){
            Swal.fire({
                toast: true, 
                position:'bottom-end',
                title: "Please complete details!",
                icon: "error",
                timer: 3000,
                showConfirmButton:false 
              }); 
              return false ; 
        }
        

        return  await apiLogin( username , password  )
    }
    async updateSessionAccountStatus(data) {
        let a = await axios.postRequest(`accounts/updateSessionAccountStatus`, data)
        return await a
    }
    async resetAccountPassword(data) {
          Swal.fire({
            title: `Are you want to  update?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#90CAF9",
            cancelButtonColor: "white",
            confirmButtonText: `Yes, update it!`,
         })
              .then(async (result) => {
                  if (result.isConfirmed) { 
                      return await axios.postRequest(`accounts/resetAccountPassword`, data)
                        .then(( a ) => {
                            Swal.fire({
                                    toast: true, 
                                    position:'bottom-end',
                                    title: `Data has been updated`,
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer:2000
                            })
                            return a 
                        })
                      
                    
                  }
              })
         
    }
    async addUpdateAccount(data) {
        console.log(data, 'addUpdateAccount')
       
        let { username, password, cpassword, method } = data 
        if (method == 0) {
             if (password !== cpassword) {
                 Swal.fire({
                timer:3000,
                toast: true, 
                position:'bottom-end',
                showConfirmButton:false ,
                title: `Password and Confirm Password not matched `,
                icon: "error",
                })
           
                return false 
             }
            let users = await apiReadExistingAccount(username)
            if (users.length) {
                Swal.fire({
                    toast: true, 
                    position:'bottom-end',
                    title: `User already exists!`,
                    icon: "error",
                    showConfirmButton: false,
                     timer:2000
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
            
         })
         .then(async(result) => {
            if (result.isConfirmed) {
                let result = await addUpdateAccount(  data)
                console.log(result ,'result')
                Swal.fire({
                    toast: true, 
                    position:'bottom-end',
                    title: `Data has been ${method == 0 ? 'added' : 'updated'}`,
                    icon: "success",
                    showConfirmButton: false,
                    timer:2000
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
    console.log(username , password )
    let a = await axios.postRequest(`accounts/login`, { username: username, password: password })
    return await a 
}

