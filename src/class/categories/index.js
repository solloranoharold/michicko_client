
// import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()

export default class Category { 

    async loadCategories() {
        let a = axios.getRequest(`categories/loadCategories`)
        return await a 
    }
}