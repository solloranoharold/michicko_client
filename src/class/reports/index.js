// import Swal from 'sweetalert2'
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()
export default class Reports { 

    async generateReports(data) {
        let result;
        switch (data.type) {
            case 'INVENTORY':
             result = await this.generateInventoryReports( data )   
            break;
            case 'DAILY_SUMMARY':
               result = await this.generateDailySummaryReports( data )   
                break;
            case 'EXECUTIVE_SUMMARY':
                console.log(data.type )
            break;
        }
        return await result;
    }

    async generateInventoryReports( data ) {
        let a =await axios.postRequestReport('/reports/generateInventoryReports', data)
        return await a
    }
    async generateDailySummaryReports(data) {
         let a =await axios.postRequestReport('/reports/generateDailySummaryReports', data)
        return await a
    }
}
