import { createApp } from 'vue'
import store from './plugins/store'
import { router }  from './plugins/router'
import setupPrimeVue from "./plugins/primeVue";
import axios from "axios";
import App from './App.vue'

import 'primevue/resources/themes/saga-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import 'primeflex/primeflex.css'                             //primeflex


const app = createApp(App)

setupPrimeVue(app)

app.use(router)
app.use(store)

app.config.globalProperties.axios = axios
app.mount('#app')