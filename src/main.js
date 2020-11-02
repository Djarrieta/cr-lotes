import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "@/assets/tailwind.css";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import * as VueGoogleMaps from 'vue2-google-maps'

var firebaseConfig = {
    apiKey: "AIzaSyD8zLxcVrbpJHPacuBDqclXPMTiOSJB2XE",
    authDomain: "cr-lotes-firebase.firebaseapp.com",
    databaseURL: "https://cr-lotes-firebase.firebaseio.com",
    projectId: "cr-lotes-firebase",
    storageBucket: "cr-lotes-firebase.appspot.com",
    messagingSenderId: "473529319928",
    appId: "1:473529319928:web:93913bed4f1cf8aa50560d"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const storage=firebaseApp.storage();

createApp(App).use(router).mount('#app')

createApp(App).use(VueGoogleMaps, {
    load: {
      key: "AIzaSyAXfjM-ENwQbcfybmC_kSAofPHayGe3rog",
    },
  });


export { db, storage};
