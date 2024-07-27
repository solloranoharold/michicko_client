import axios from 'axios'
// require('dotenv').config()
const api_path = process.env.VUE_APP_API_URL
// import Swal from 'sweetalert2'
const apiClient = axios.create({
  baseURL: api_path, // Replace with your backend URL
  withCredentials: true, // Enable sending cookies
});
export default class Positions { 
    constructor() { }
    

    async loadPositions() {
        let a = await getApiPositions()
        return a 
    }


}

async function getApiPositions() {
    let response = await apiClient.get(`positions/loadPositions`)
    return await response.data
}