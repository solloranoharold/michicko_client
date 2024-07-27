import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import myMixins from './plugins/myMixins'
require('./plugins/myCss.css')

Vue.config.productionTip = false
Vue.use(myMixins)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
