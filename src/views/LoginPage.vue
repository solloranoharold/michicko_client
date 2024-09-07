<template>
     <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12" v-if="!loading">
                     <v-toolbar dark color="#BCAAA4">
                        <v-toolbar-title class="toolbarTitle">Login form</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form class="textTitle">
                           <v-text-field color="#BCAAA4"
                             v-model="username"
                              prepend-icon="mdi-account"
                              name="login"
                              label="Username"
                              type="text"
                           ></v-text-field>
                           <v-text-field color="#BCAAA4"
                              v-model="password"
                              prepend-icon="mdi-lock"
                              name="password"
                              label="Password"
                              type="password"
                              @keypress.enter="loginUser()"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn dark class="textTitle" color="#BCAAA4" @click="loginUser()"><v-icon>mdi-location-enter</v-icon>Login</v-btn>
                     </v-card-actions>
                  </v-card>
                  <LoaderView v-else/>
               </v-flex>
            </v-layout>
         </v-container>
</template>
<script>
import Cookies from 'js-cookie';
import Accounts from '@/class/accounts'
import LoaderView from './LoaderView.vue';
import Swal from 'sweetalert2'
export default { 
      components:{ LoaderView} , 
        data:()=>({
            account: new Accounts(), 
          username: "", password: "",
            loading:false 
        }),
        methods:{
           async loginUser() {
               this.loading=true
              let data =  await this.account.loginAccount( this.username , this.password )
              console.log(data, 'asdsadas')
             if (data.error ) {
               Swal.fire({
                  title: `${data.error} OR \nACCOUNT HAS BEEN DEACTIVATED CONTACT BRANCH ADMINISTRATOR`,
                  toast: true, 
                  position:"bottom-end",
                  icon: "error",
                  timer: 10000,
                  showConfirmButton:false 
               })
               this.loading = false 
               return false 
               } else {
               
               //   if (data.isSignIn == true) {
               //    Swal.fire({
               //       position: "top-end",
               //       title: `Account already login`,
               //       showConfirmButton: false,
               //       icon:'info',
               //       timer: 5000
               //    });
               //     this.username = ''
               //      this.password = ''
               //     this.loading=false
               //    return false 
               //   }
               // data.isSignIn = true 
               await Cookies.set('token', data.token , { expires: 7 })
                 delete data.token 
               //   let obj = { account_id: data.account_id, isSignIn: 1 }
               
               // await this.account.updateSessionAccountStatus(  obj )
                 setTimeout(async () => {
                  this.$store.commit('STORE_USERINFO', data)
                    Swal.fire({
                     toast: true,
                     position: "bottom-end",
                     title: `You are now Login : ${data.last_name} ${data.first_name}`,
                     showConfirmButton: false,
                     timer: 1500
                   });
                  console.log(data , 'account')
                    this.loading = false 
                   
                    if (data.position_id != 0 && data.position_id != 1 && data.position_id != 2) {
                       let navbar = [ 
                            { name: "Dashboard", path: '/', 'icon': "mdi-home" },
                           { name: "Point of Sale", path: '/pos', 'icon': "mdi-currency-php" },
                          { name: "Clients", path: '/clients', 'icon': "mdi-account-multiple" },
                        { name: "Employees", path: '/employees', 'icon': "mdi-account-multiple" },
                        ]
                        this.$store.commit('STORE_NAVBAR' , navbar )
                      this.$store.commit('GROUP_MODULES' , [ 
                           { text: 'Services', icon: 'mdi-bottle-soda-classic-outline', name: '/inventory' },
                           { text:'OTC Products ', icon: 'mdi-bottle-soda-classic-outline', name: '/products' },
                      ])
                        await this.$router.push('/pos')
                    }
                    else if (data.position_id == 2) {
                      let navbar = [ 
                         { name: "Dashboard", path: '/', 'icon': "mdi-home" },
                         { name: "Transactions", path: '/transactions', 'icon': "mdi-currency-php" },
                        //  { name: "Expenses", path: '/expenses', 'icon': "mdi-currency-php" },
                         { name: "Accounts", path: '/accounts', 'icon': "mdi-account-multiple" },
                         { name: "Employees", path: '/employees', 'icon': "mdi-account-multiple" },
                         { name: "Clients", path: '/clients', 'icon': "mdi-account-multiple" },
                         { name: "Services", path: '/services', 'icon': "mdi-content-cut" },
                         { name: "Reports", path: '/reports', 'icon': "mdi-account-multiple" },
                         { name: "Cashless Methods", path: '/cashless', 'icon': "mdi-credit-card-marker" }
                         
                       ]
                       this.$store.commit('GROUP_MODULES' , [ 
                           { text: 'Service Products', icon: 'mdi-bottle-soda-classic-outline', name: '/inventory' },
                           { text:'OTC Products ', icon: 'mdi-bottle-soda-classic-outline', name: '/products' },
                        ])
                       this.$store.commit('STORE_NAVBAR' , navbar )
                        await this.$router.push('/')
                    }
                    else if(data.position_id ==0 ) {
                       let navbar = [ 
                          { name: "Organizations", path: '/organization', 'icon': "mdi-account-multiple" },
                          { name: "Super Administrators", path: '/super_administrators', 'icon': "mdi-account-multiple" },
                          { name: "Administrators Accounts", path: '/super_administrators_accounts', 'icon': "mdi-account-multiple" }
                       ]
                       this.$store.commit('STORE_NAVBAR', navbar)
                         await this.$router.push('/organization')
                       
                    } else {
                     let navbar = [ 
                        { name: "Organizations", path: '/organization', 'icon': "mdi-account-multiple" },
                      ]
                       this.$store.commit('STORE_NAVBAR', navbar)
                         await this.$router.push('/organization')
                    }
                  //   if(data.position_id != 0 && data.position_id!= 1 )await this.$router.push('/pos')
                  //    else await this.$router.push('/')
               }, 1000);
             
            }
               this.username = ''
               this.password=''
            //   console.log(data , 'data')
            }
        }
    }
</script>