import Vue from 'vue'
import App from './App.vue'
import { initializeApp } from 'firebase/app'

Vue.config.productionTip = false

var config = {
  apiKey: "AIzaSyAidQ4LnvFBCBU6Q1VbTPVivfJZ_E6APbQ",
  authDomain: "quickscan-2f853.firebaseapp.com",
  projectId: "quickscan-2f853",
  storageBucket: "quickscan-2f853.appspot.com",
  messagingSenderId: "361465475773",
  appId: "1:361465475773:web:45dc4aace1a0962ffbbdd4",
  measurementId: "G-V91KRP3H7K"
};
initializeApp(config);

new Vue({
  render: h => h(App),
}).$mount('#app')
