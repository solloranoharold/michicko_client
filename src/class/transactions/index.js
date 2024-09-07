
import AxiosRequest from '../axiosRequest'
const axios = new AxiosRequest()

export default class Transactions { 
    async generateDashBoardCards(organization_id, date1, date2) {
        console.log(organization_id, date1, date2)
        let a = axios.getRequest(`/reports/generateDashBoardCards/${organization_id}/${date1}/${date2}`)
        return await a 
    }
    async generateYearlyActualNet(organization_id) {
        let a = axios.getRequest(`/reports/generateYearlyActualNet/${organization_id}`)
        return await a 
    }
    async generateYearServiceSales(organization_id) {
         let a = axios.getRequest(`/reports/generateYearServiceSales/${organization_id}`)
        return await a 
    }
    async generateYearOTCSales(organization_id) {
          let a = axios.getRequest(`/reports/generateYearOTCSales/${organization_id}`)
        return await a 
    }

    async loadAllCommissions(organization_id , date1 , date2) {
         let a = await axios.getRequest(`transactions/loadAllCommissions/${organization_id}/${date1}/${date2}` )
        return await a 
    }
    async loadTransactionData( organization_id , date1 , date2 ) {
        let a = await axios.getRequest(`transactions/loadTransactionData/${organization_id}/${date1}/${date2}` )
        return await a 
    }

    async loadNotifications( organization_id ) {
        let a = await axios.getRequest(`transactions/loadNotifications/${organization_id}`)
        return await a
    }
    async updateNotification(data) {
         let a = await axios.postRequest(`transactions/updateNotification` , data )
        return await a
    }

    async createTransaction(data) {
        console.log('createTransaction' , data )
        let a = await axios.postRequest('transactions/createTransactions', data)
        return await a 
    }
    async createTransactionServices( data ) {
       console.log('/createTransactionServices' , data )
        data.forEach(item => {
            for (let key in item) {
                let hasDelete = key!='additional' && key!='price' && key != 'service_id' &&   key!='transaction_id' && key!='organization_id'&& key != 'client_id'&& key != 'total_commissions'
                if (hasDelete) {
                    delete item[key]
                }
            }
        });
        let a = await axios.postRequest('/transactions/createTransactionsServices', data)
        return await a 
    }
    async createTransactionServicesProduct(data) {
        console.log('/createTransactionServicesProduct', data)
         data.forEach(item => {
            for (let key in item) {
                let hasDelete = key != 'inventory_id' && key != 'updated_by' &&  key!='transaction_id' && key!='organization_id' &&  key!='less_quantity' 
                if (hasDelete) {
                    delete item[key]
                }
            }
         });
         let a = await axios.postRequest('/transactions/createTransactionsServicesProducts', data)
        return await a 
    }
    async createTransactionsOTCProducts(data) {
        console.log('/createTransactionsOTCProducts', data)
        data.forEach(item => {
            for (let key in item) {
                let hasDelete = key != 'product_id' && key != 'updated_by' && key!='product_total_amount' &&  key!='transaction_id' && key!='organization_id' &&  key!='less_quantity' && key != 'client_id'&& key != 'total_commissions'
                if (hasDelete) {
                    delete item[key]
                }
            }
         });
          let a = await axios.postRequest('/transactions/createTransactionsOTCProducts', data)
        return await a 
    }
    async createTransactionsCommissions(data) {
        console.log('/createTransactionsCommissions', data)
        data.forEach(item => {
            for (let key in item) {
                let hasDelete =key != 'commission_type' &&  key!='transaction_id' && key!='organization_id' &&  key!='tip' &&  key!='employee_id' &&  key!='commission_total_amount'
                if (hasDelete) {
                    delete item[key]
                }
            }
        });
        let a = await axios.postRequest('/transactions/createTransactionsCommissions', data)
        return await a 
    }

    async evaluateAffectedServicesProduct(data) {
      data.forEach(item => {
            for (let key in item) {
                let hasDelete = key != 'inventory_id' &&  key!='transaction_id' && key!='organization_id' &&  key!='less_quantity'
                if (hasDelete) {
                    delete item[key]
                }
            }
         });
        let a = await axios.postRequest('/transactions/getAffectedServicesProduct', data)
        return await a 
    }
    async evaluateAffectedOTCProduct( data ) {
        data.forEach(item => {
            for (let key in item) {
                let hasDelete = key != 'product_id'  && key != 'product_id' &&  key!='product_total_amount' &&  key!='transaction_id' && key!='organization_id' &&  key!='less_quantity'
                if (hasDelete) {
                    delete item[key]
                }
            }
         });
          let a = await axios.postRequest('/transactions/evaluateAffectedOTCProduct', data)
        return await a 
    }
    async createTransactionsOtherFees(data) {
         let a = await axios.postRequest('/transactions/createTransactionsOtherFees', data)
        return await a 
    }

    async loadCommissions( organization_id ,employee_id,  date1 , date2 ) {
        let a = await axios.getRequest(`/transactions/loadCommissions/${organization_id}/${employee_id}/${date1}/${date2}`)
        return await a 
    }
    async loadAllEmployeesCommission( organization_id ,  date1 , date2 ) {
        let a = await axios.getRequest(`/transactions/loadEmployeesCommission/${organization_id}/${date1}/${date2}`)
        return await a 
    }
    
    async getClientTransactions(organization_id,client_id , date1 , date2) {
         let a = await axios.getRequest(`/transactions/getClientTransactions/${organization_id}/${client_id}/${date1}/${date2}`)
        return await a 
    }
    async loadAllTransactionsPerPage(organization_id , page, itemsPerPage) {
       let a = await axios.getRequest(`/transactions/loadAllTransactionsPerPage/${organization_id}/${page}/${itemsPerPage}`)
        return await a 
    }
    async updateHistoryTransactions(data) {
        // console.log(data ,'updateHistoryTransactions')
         let a = await axios.postRequest('/transactions/updateHistoryTransactions', data)
        return await a 
    }
    async loadTransactionCount(organization_id , search ) {
        let a = await axios.getRequest(`/transactions/loadTransactionCount/${organization_id}/${search}`)
        return await a 
    }
    async searchTransaction(organization_id, search) {
         let a = await axios.getRequest(`/transactions/searchTransaction/${organization_id}/${search}`)
        return await a 
    }
    async loadAllServicesSalesPerPage(organization_id, page, itemsPerPage) {
         let a = await axios.getRequest(`/transactions/loadAllServicesSalesPerPage/${organization_id}/${page}/${itemsPerPage}`)
        return await a 
    }
}