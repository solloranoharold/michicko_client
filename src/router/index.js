import Vue from 'vue'
import Cookies from 'js-cookie';
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import EmployeesView from '@/components/Employees/EmployeesView.vue'
import TransactionsView from '@/components/Transactions/TransactionsView.vue'
import AccountsView from '@/components/Accounts/AccountsView.vue'
import ClientsView from '@/components/Clients/ClientsView.vue'
import ReportsView from '@/components/Reports/ReportsView.vue'
import POSView from '@/components/POS/POSView.vue'
import LoginPage from '@/views/LoginPage.vue'
import OrganizationView from '@/components/Organization/OrganizationView.vue'
import ServicesView from '@/components/Services/ServicesView.vue'
import InventoryView from '@/components/Inventory/InventoryView.vue'
import ProductView from '@/components/Products/ProductsView.vue'
import DashboardView from '@/components/Dashboard/DashboardView.vue'
import CashlessView from '@/components/Cashless/CashlessView.vue';
import Swal from 'sweetalert2'
import store from '@/store'
import Accounts from '@/class/accounts';
let accounts = new Accounts()
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/employees',
    name: 'employee',
    component: EmployeesView
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: TransactionsView
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: AccountsView
  },
  { 
    path: '/clients',
    name: 'clients',
    component: ClientsView
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportsView
  },
  {
    path: '/pos',
    name: 'pos',
    component: POSView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/organization',
    name: 'organization',
    component: OrganizationView
  },


 {
    path: '/services',
    name: 'services',
    component: ServicesView
  },
{
    path: '/inventory',
    name: 'inventory',
    component: InventoryView
  },
  {
    path: '/products',
    name: 'products',
    component: ProductView
  },
   {
    path: '/cashless',
    name: 'cashless',
    component: CashlessView
  },
  
  // 
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach(async(to , from , next)=>{
 
  if (to.path === '/login') {
    if (Cookies.get('token')) next('/')
    else next()
    // console.log("Cookies", Cookies.get('token'))
      // if(store.state.userInfo != null ){
      //   next('/')
      // }else{
      //   next()
      // }
  } else {
    if (!Cookies.get('token')) {
      if (store.state.userInfo != null) {
          store.state.userInfo.isSignIn = false
        console.log(store.state)
        store.state.userInfo = null
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Session Expired",
            showConfirmButton: false,
            timer: 1500
          });
        next('/login')
          // let obj = {account_id : store.state.userInfo.account_id,isSignIn : 0 }
          // await accounts.updateSessionAccountStatus(obj).then(() => { 
          //     store.state.userInfo = null
          //     Swal.fire({
          //       position: "top-end",
          //       icon: "warning",
          //       title: "Session Expired",
          //       showConfirmButton: false,
          //       timer: 1500
          //   });
          //   next('/login')
          // })
      } else {
        next('/login')
        }
      
      
     }
    else next()
    // console.log("Cookies", Cookies.get('token'))
    // if(store.state.userInfo == null ){
    //   next('/login')
    // }else{
    //   next()
    // }
  }
  
})

export default router
