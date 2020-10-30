<template>
<div class="min-h-screen">
  <div class="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="flex flex-col w-full">
        <span  class="w-auto text-4xl font-extrabold text-blue-900 text-center">
                CR-Lotes
        </span>
        <h2 class="mt-4 text-center text-2xl leading-9  text-gray-400">
          Crea una cuenta nueva
        </h2>
        
      </div>
      <form class="mt-8" action="#" method="POST">
        <!-- Inputs -->
        <div class="rounded-md shadow-sm">
          <div>
            <input v-model="name" type="text" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Nombre Apellido">
          </div>
          <div class="-mt-px">
            <input v-model="phoneNumber" aria-label="phoneNumber" name="phoneNumber" type="text" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="WhatsApp">
          </div>
          <div class="-mt-px">
            <input v-model="email" aria-label="Email address" name="email" type="email" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Correo">
          </div>

          <div class="-mt-px">
            <input v-model="password" name="password" type="password" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Contraseña">
          </div>
          <div class="-mt-px">
            <input v-model="password2" aria-label="Password2" name="password2" type="password" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Repite tu contraseña">
          </div>
        </div>
        
        <!-- Problems -->
        <p v-if="problems" class="bg-red-300 w-full text-red-600 text-xs my-2 p-2 rounded-sm">
          {{ problems }}
        </p>

        <!-- SignUp button -->
        <div class="mt-4">
          <div @click="signUp" class=" cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            Registrarse
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between">
          <div class="text-sm leading-5 w-full flex justify-around">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
              Ya tengo una cuenta
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
import firebase from "firebase"
import {db} from "@/main.js"
export default {
    name:"SignUp",
    data(){
      return{
        currentUser:"",
        name:"",
        email:"",
        phoneNumber:"",
        password:"",
        password2:"",
        problems:""
      }
    },
    created(){
        const self=this
        //user
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                self.currentUser=user
            }
        })
    },
    methods:{
      
      signUp(){
        const self=this
        if(!this.name){
            this.problems="Nombre no válido."
            return
        }
        if(!this.phoneNumber){
            this.problems="Número de teléfono no válido."
            return
        }
        if(this.password!=this.password2){
            this.problems="Las contraseñas no coinciden."
            return
        }
        firebase.auth()
        .createUserWithEmailAndPassword(this.email,this.password)
        .then(()=>{
          firebase.auth().currentUser.updateProfile({displayName: self.name})
          self.currentUser=firebase.auth().currentUser
        })
        .then(()=>{
          const uid=self.currentUser.uid
          db.collection("users").doc(uid).set({
            phoneNumber:self.phoneNumber,
          })
        })
        .catch(e=>{
          self.currentUser.delete()
          console.error(e)
          switch(e.code){
            case "auth/invalid-email":
              this.problems="Correo inválido."
              break;
            case "auth/email-already-in-use":
              this.problems="Ya hay una cuenta vinculada a este correo."
              break;
            case "auth/weak-password":
              this.problems="Coloca una contraseña más dificil de adivinar."
              break;
            default:
              this.problems="Hubo un problema, vuelve a intentarlo."
          }
        })



        

        
        
/* 

        firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(()=>this.problems="")
        .catch(e=>{
          console.log(e.code)
          switch(e.code){
            case "auth/invalid-email":
              this.problems="Correo inválido."
              break;
            case "auth/email-already-in-use":
              this.problems="Ya hay una cuenta vinculada a este correo."
              break;
            case "auth/weak-password":
              this.problems="Coloca una contraseña más dificil de adivinar."
              break;
            default:
              this.problems="Hubo un problema, vuelve a intentarlo."
          }
        }) */
      },
    },
}
</script>