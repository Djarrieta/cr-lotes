import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from "firebase"
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import SignUp from '@/views/SignUp.vue'
import Publicar from '@/views/Publicar.vue'
import Profile from '@/views/Profile.vue'
import Registro from '@/views/Registro.vue'
import Admin from '@/views/Admin.vue'
import PerfilPropiedad from '@/views/PerfilPropiedad.vue'
import Favoritos from '@/views/Favoritos.vue'
import Error from '@/views/Error.vue'
import Swal from 'sweetalert2'

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
    path: '/registro',
    name: 'Registro',
    component:Registro
  },
  {
    path: '/registrarme',
    name: 'SignUp',
    component: SignUp
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
    path: '/perfil',
    name: 'Perfil',
    component: Profile,
    meta:{
      autentificado:true
    }
  },
  {
    path: '/favoritos',
    name: 'Favoritos',
    component: Favoritos,
    meta:{
      autentificado:true
    }
  },
  {
    path: '/publicar/:id',
    name: 'Publicar',
    component: Publicar,
    meta:{
      autentificado:true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta:{
      autentificado:true
    }
  },
  { 
    path: "/perfil-propiedad/:id", 
    component: PerfilPropiedad, 
    name: 'perfilpropiedad',
  },
  { 
    path: "*", 
    component: Error, 
    name: 'Error',
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
    Swal.fire({
      icon: "warning",
      title: "Autentificación",
      text:
        "Debes estar logueado para continuar. Si no tienes una cuenta puedes crear una, ES GRATIS!",
    });
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router
