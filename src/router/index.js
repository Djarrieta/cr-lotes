import { createRouter, createWebHistory } from 'vue-router'
import firebase from "firebase"

import Home from '@/views/Home'
import SignIn from '@/views/SignIn'
import SignUp from '@/views/SignUp'
import About from '@/views/About'
import CardDetail from '@/views/CardDetail'
import NewCard from '@/views/NewCard'
  //////prueba 
import PruebaMap from '@/views/PruebaMap'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/registro',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta:{
      autentificado:true
    }
  },
  {
    path: '/newcard',
    name: 'NewCard',
    component: NewCard,

  },
  {
    path: '/card/:id',
    name: 'CardDetail',
    component: CardDetail,
    meta:{
      autentificado:true
    }
  },

  //////prueba 
  {
    path: '/prueba-map',
    name: 'PruebaMap',
    component: PruebaMap
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

//redirección automática cuando no hay 
router.beforeEach((to, from, next) => {
  let usuario = firebase.auth().currentUser;
  let autorizacion = to.matched.some((record) => record.meta.autentificado);

  if (autorizacion && !usuario) {
    next({ name: "SignIn" });
  } else {
    next();
  }
});

export default router
