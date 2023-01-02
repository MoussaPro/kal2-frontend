import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/index.scss'
import axios from 'axios'
import { createPinia } from 'pinia';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
const pinia = createPinia();
import vClickOutside from "click-outside-vue3"

createApp(App).use(pinia).use(router).use(vClickOutside).mount('#app');

