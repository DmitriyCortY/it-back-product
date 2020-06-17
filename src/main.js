import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import Vuelidate from 'vuelidate'
import Notifications from 'vue-notification'

Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(Notifications)
    // Vue.use(axios)
Vue.prototype.$http = axios

Vue.use(router)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')