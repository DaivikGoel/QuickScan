import Vue from 'vue'
import App from './App.vue'
import { initializeApp } from 'firebase/app'

Vue.config.productionTip = false

var config = {};
initializeApp(config);

new Vue({
  render: h => h(App),
}).$mount('#app')
