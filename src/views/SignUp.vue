<template>
  <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 lg:py-0">
    <div class="max-w-2xl caja-sombreada lg:mt-5 lg:py-10">
      <div class="flex flex-col w-full">
        <span class="w-auto text-5xl font-extrabold text-blue-900 text-center uppercase tracking-widest">
                CR-Lotes
        </span>
        <h2 class="text-center text-xl leading-9 text-gray-400 uppercase tracking-widest">
          Crea una cuenta nueva
        </h2>
        
      </div>
      <form @submit.prevent class="mt-8">
        <!-- Inputs -->
        <div class="rounded-md shadow-sm">
          <div>
            <label class="label" for="name">Correo electrónico</label>
            <input v-model="name" id="name" name="name" type="text" class="inputForm" placeholder="Nombre Apellido">
          </div>
          <div class="mt-2">
            <label class="label" for="prefixPhoneNumber">Teléfono / WhatsApp</label>            
            <div class="flex">
              <input aria-label="prefixPhoneNumber" name="prefixPhoneNumber" id="prefixPhoneNumber" type="tel" class="inputForm w-20" value="+506">
              <input v-model="phoneNumber" aria-label="phoneNumber" name="phoneNumber" type="text" class="inputForm" placeholder="WhatsApp" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" >
            </div>
          </div>
          <div class="mt-2">
            <label class="label" for="email">Correo electrónico</label>
            <input v-model="email" aria-label="Email address" name="email" id="email" type="email" class="inputForm" placeholder="Correo electrónico">
          </div>

          <div class="mt-2">
            <label class="label" for="password">Contraseña</label>
            <input v-model="password" name="password" id="password" type="password" class="inputForm" placeholder="Contraseña">
          </div>
          <div class="mt-2">
            <label class="label" for="password2">Contraseña</label>
            <input v-model="password2" aria-label="Password2" name="password2" id="Password2" type="password" class="inputForm" placeholder="Repite tu contraseña">
          </div>
        </div>
        
        <!-- Problems -->
        <p v-if="problems" class="group relative w-full flex justify-center bg-red-100 w-full text-red-600 font-bold text-lg my-5 p-4 rounded-sm">
          <span class="absolute flex-auto left-0 inset-y-0 flex items-center pl-3">  
            <svg class="h-5 w-5 text-red-600 group-hover:text-red-600 transition ease-in-out duration-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </span>
          <span class="flex-auto ml-6">{{ problems }}</span>
        </p>

        <!-- SignUp button -->
        <div class="mt-4">
          <button @click="signUp" class="boton-indigo relative w-full flex justify-center">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            Registrarse
          </button>
        </div>

        <div class="mt-6 flex items-center justify-between">
          <div class="text-sm leading-5 w-full flex justify-around">
            <router-link :to="{ name: 'SignIn' }" class="font-medium text-base text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150 text-center">
              Ya tengo una cuenta
            </router-link>
          </div>
        </div>
      </form>
      {{ whatsApp }}
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
        currentUser: "",
        name: "",
        email: "",
        phoneNumber: "",
        whatsApp: '',
        password: "",
        password2: "",
        problems: ""
      }
    },
    watch: {
      phoneNumber() {
        this.whatsApp = '+506' + this.phoneNumber
      }
    },
    created() {
        const self=this
        //user
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                self.currentUser=user
            }
        })
    },
    
    computed: {

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
            phoneNumber:self.whatsApp,
          })
        })
        .catch(e=>{
          // self.currentUser.delete()
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