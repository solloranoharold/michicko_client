<template>
  <v-app>
    <v-app-bar
      app v-if="userInfo!=null"
    >
    <v-icon @click="drawer=!drawer">mdi-menu</v-icon>
    <v-toolbar-title class="mainbarTitle"> <h5>{{ userInfo.organization_name ? userInfo.organization_name : 'MICHIKO SALON SUPER ADMINISTRATOR' }}</h5></v-toolbar-title>
    <v-spacer/>
      <v-menu
        bottom
        min-width="200px"
        rounded
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-badge color="error" :content="notificationCount">
             <v-icon large color="black"  v-on="on">mdi-bell-outline</v-icon>
          </v-badge>
        </template>
        <v-card>
          <v-list dense  class="textTitle">
            <v-list-item v-for="( notif , i ) in notifications" :key="i" @click="updateNotification( notif)">
             <v-list-item-icon >
               <v-icon  >mdi-message</v-icon>
             </v-list-item-icon>
              <v-list-item-title>
               {{ notif.message }}
              </v-list-item-title>
              <v-list-item-icon >
                <v-img max-width="50" src='./assets/new.gif' v-if="notif.isRead"></v-img>
              <!-- <v-icon large v-if="notif.isRead == 1 ">mdi-circle-small</v-icon> -->
             </v-list-item-icon>
            </v-list-item>
        
            <v-divider/>
            <!-- <center>
              <v-btn text small ><v-icon>{{ !hasMore ? 'mdi-arrow-down-thin' : 'mdi-arrow-up-thin' }}</v-icon>{{ !hasMore ? 'Show more': "Hide" }}</v-btn>
            </center> -->
          </v-list>
        </v-card>
      </v-menu>
    <v-menu
        bottom
        min-width="200px"
        rounded
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-icon large color="black"  v-on="on">mdi-cog-outline</v-icon>
        </template>
        <v-card>
          <v-list dense  class="textTitle">
            <v-list-item @click="editAccount()">
              <v-list-item-icon>
                <v-icon>mdi-pencil-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Edit Account
              </v-list-item-title>
            </v-list-item>
            <v-list-item  @click="logout()">
              <v-list-item-icon>
                <v-icon>mdi-exit-to-app</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
               Logout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
        app dark
        color="#BCAAA4"
        v-model="drawer"
        v-if="userInfo!=null && userInfo.position_id != 0 "
        class="textTitle"
      >
        <v-list>

          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                 {{ userInfo.last_name }} {{ userInfo.first_name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list
          nav
          dense
        >
          <v-list-item link v-for="(item , i ) in navigationDrawer" :key="i" :to="item.path">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
           <v-list-group
           v-if="userInfo.position_id != 0"
              :value="true"
              prepend-icon="mdi-bottle-soda-classic-outline"
              no-action
             color="white"
          >
              <template v-slot:activator>
              <v-list-item-title>Inventory</v-list-item-title>
              </template>
                  <v-list-item  sub-group v-for="( path , a ) in groupModules" :key="a"  :to="path.name" >
                   <v-list-item-title  >
                          {{ path.text }}
                      </v-list-item-title>
                  </v-list-item>
          </v-list-group>
        
        </v-list>
      </v-navigation-drawer>
          <v-navigation-drawer
        app dark
        color="#BCAAA4"
        v-model="drawer"
        v-else-if="userInfo!= null "
        class="textTitle"
      >
        <v-list>

          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                {{ userInfo.last_name }} {{ userInfo.first_name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{  userInfo.account_position }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list
          nav
          dense
          v-if="masterDrawer.length"
        >
 
          <v-list-item link v-for="(item , i ) in masterDrawer" :key="i" :to="{
            name: item.name, 
            params: JSON.parse(JSON.stringify(item.item))
          }">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
           <v-list-group
           v-if="groupModules.length"
              :value="true"
              prepend-icon="mdi-bottle-soda-classic-outline"
              no-action
             color="white"
          >
              <template v-slot:activator>
              <v-list-item-title>Inventory</v-list-item-title>
              </template>
                  <v-list-item  sub-group v-for="( path , a ) in groupModules" :key="a"  :to="{
                      name: path.name, 
                      params: JSON.parse(JSON.stringify(path.item))
                    }"> 
                   <v-list-item-title>
                          {{ path.text }}
                      </v-list-item-title>
                  </v-list-item>
          </v-list-group>
        
        </v-list>
      </v-navigation-drawer>
      <EditProfileDialog :dialog="profileDialog" :saveObj="profileObj" @closeDialog="closeDialog"/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Cookies from 'js-cookie';
import Transactions from './class/transactions';
import Swal from 'sweetalert2'

import { io } from "socket.io-client";
import Accounts from './class/accounts';
import EditProfileDialog from './EditProfileDialog.vue';

export default {
  name: 'App',
  components:{EditProfileDialog},
  data: () => ({
    socket: null,
    profileDialog: false,
    profileObj:{},
    classTransaction: new Transactions(),
    classAccount: new Accounts(),
    notifications:[],
    drawer: true,
    hasMore:false ,
    menus:[
    { name:"Dashboard" ,path:'/' , 'icon':"mdi-home"},
    { name: "Transactions", path: '/transactions', 'icon': "mdi-account-multiple" },
    { name:"Inventory" ,path:'/inventory' , 'icon':"mdi-account-multiple"},
    { name: "Services", path: '/services', 'icon': "mdi-account-multiple" },
    { name:"Organizations" ,path:'/organization' , 'icon':"mdi-account-multiple"},
    { name:"Employees" ,path:'/employees' , 'icon':"mdi-account-multiple"},
    { name:"Clients" ,path:'/clients' , 'icon':"mdi-account-multiple"},
    { name:"Accounts" ,path:'/accounts' , 'icon':"mdi-account-multiple"},
    { name:"Reports" ,path:'/reports' , 'icon':"mdi-account-multiple"}
    ],
    
  }),
  async created() {
    let host = process.env.VUE_APP_API_URL
    if(this.userInfo!=null && Cookies.get('token')) await this.loadNotifications()
    this.socket = io(host,{
      transports: ['polling'],
    });
    this.socket.on("connect_error", (err) => {
    // the reason of the error, for example "xhr poll error"
        console.log(err.message);
        // some additional description, for example the status code of the initial HTTP response
        console.log("HTTP response"+err.description);
        // some additional context, for example the XMLHttpRequest object
        console.log( err.context);
    });
    this.socket.on('load notification', async() => { 
      await this.loadNotifications()
    })
    this.socket.on('update notification', async() => { 
      await this.loadNotifications()
    })
     
  },
  computed: {
    notificationCount() {
      return this.notifications.filter(rec => {
        return rec.isRead == 1 
      }).length 
    }
  },
  methods: {
    editAccount() {
      this.profileDialog = true
      let obj = { 
        account_id: this.userInfo.account_id,
        username: this.userInfo.username, 
      }
      this.profileObj = JSON.parse(JSON.stringify(obj))
    },
    closeDialog(val) {
      this.profileDialog = val 
    },
    async loadNotifications() {
      this.notifications = await this.classTransaction.loadNotifications( this.userInfo.organization_id)
      let a = this.notifications.filter(item => {
        return item.isRead == 1 
      })
      if (a.length) {
         Swal.fire({
                toast: true,
                position:'bottom-end',
                title: `You have ${a.length} new notification/s`,
                icon: "info",
                timer: 5000,
                showConfirmButton:false
         })
      }
      console.log(this.notifications, 'loadNotifications')
    },
    async updateNotification( item ) {
      let obj = { 
        notification_id: item.notification_id,
        path: item.path, 
        organization_id: item.organization_id,
        message: item.message, 
        isRead: 0 
      }
      await this.classTransaction.updateNotification(obj)
      await this.$router.push(item.path)
      this.socket.emit('update notification')
   },
// For master administrator 
    directToPath(data) {
      console.log(data, 'master administrator')
      try {
        this.$router.push({name:data.name ,params: JSON.parse(JSON.stringify(data.item))})  
      } catch (error) {
        console.log(error , 'master administrator')
      }
    },
    logout() {
      if (confirm('Are you sure you want to logout ? ')) {
        let obj = { account_id: this.userInfo.account_id, isSignIn: 0 }
        this.classAccount.updateSessionAccountStatus(obj)
        Cookies.remove('token')
        this.$store.commit('STORE_USERINFO', null)
        alert('You are now logout!')
        this.$router.push('/login')
      }
    }
  }
};
</script>
