import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from "firebase"
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Publicar from '@/views/Publicar.vue'
import PerfilPropiedad from '@/views/PerfilPropiedad.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/publicar',
    name: 'Publicar',
    component: Publicar,
    meta:{
      autentificado:true
    }
  },
  { 
    path: "/perfil-propiedad/:id", 
    component: PerfilPropiedad, 
    name: 'perfilpropiedad',
    meta: {
      autentificado: true,
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//redirección automática cuando no hay 
router.beforeEach((to, from, next) => {
  let usuario = firebase.auth().currentUser;
  let autorizacion = to.matched.some((record) => record.meta.autentificado);

  if (autorizacion && !usuario) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router
