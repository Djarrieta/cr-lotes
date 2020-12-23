import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'

import "@/assets/tailwind.css";

import * as VueGoogleMaps from 'vue2-google-maps'

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyD8zLxcVrbpJHPacuBDqclXPMTiOSJB2XE",
  authDomain: "cr-lotes-firebase.firebaseapp.com",
  databaseURL: "https://cr-lotes-firebase.firebaseio.com",
  projectId: "cr-lotes-firebase",
  storageBucket: "cr-lotes-firebase.appspot.com",
  messagingSenderId: "473529319928",
  appId: "1:473529319928:web:93913bed4f1cf8aa50560d"
};

Vue.config.productionTip = false
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAXfjM-ENwQbcfybmC_kSAofPHayGe3rog',
    libraries: 'places',
  },
  installComponents: true
})

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var storage = firebase.storage();

firebase.auth().onAuthStateChanged(()=>{
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})


export { db,storage};
