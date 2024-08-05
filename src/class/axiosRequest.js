import axios from 'axios'
// require('dotenv').config()
const api_path = process.env.VUE_APP_API_URL
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: api_path, // Replace with your backend URL
  withCredentials: true, // Enable sending cookies
});
import Swal from 'sweetalert2'

let token =''
export default class AxiosRequest {
    async getRequest(path) {
        console.log('getRequest')
        try {
            token = Cookies.get('token')
         let response = await apiClient.get(path, {
            headers: {
                Authorization: token 
            }
        })
        return  response.data 
       } catch (error) {
            Swal.fire({
                toast: true,
                position:'top-end',
                title: error.message,
                icon: "error",
                timer: 2000,
                showConfirmButton:false
            })
            return false 
       }
    }
    async postRequestReport( path , body ) {
        console.log('postRequest')
        try {
            token = Cookies.get('token')
            let response = await apiClient.post(path, body, {
            responseType: 'arraybuffer',
            headers: {
                Authorization: token 
                },
                
            })
            if (response.data.error) {
                Swal.fire({
                    title: `${response.data.error} OR ACCOUNT HAS BEEN DEACTIVATED CONTACT BRANCH ADMINISTRATOR`,
                    toast: true, 
                    position:"top-end",
                    icon: "error",
                    timer:2000
                })
                return false 

            }
          
            
        return  response.data 
        } catch (error) {
        Swal.fire({
            title: error.message,
            icon: "error",
            toast: true, 
            position:"top-end",
            timer:2000
        })
            throw error;
        }
    }
    async postRequest(path, body  ) {
        console.log('postRequest')
        try {
            token = Cookies.get('token')
            let response = await apiClient.post(path,body, {
            headers: {
                Authorization: token 
            }
            })
            console.log(response , 'postRequest')
            // if (response.data.error) {
            //     Swal.fire({
            //         title: `${response.data.error} OR ACCOUNT HAS BEEN DEACTIVATED CONTACT BRANCH ADMINISTRATOR`,
            //         toast: true, 
            //         position:"top-end",
            //         icon: "error",
            //         timer:2000
            //     })
            //     return false 

            //  }
             return  response.data 
        } catch (error) {
        Swal.fire({
            title: error.message,
            icon: "error",
            toast: true, 
            position:"top-end",
            timer:2000
        })
             throw error;
        }
    }
}


