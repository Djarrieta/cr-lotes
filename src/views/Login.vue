<template>

  <div class="flex items-center justify-center sm:px-6 lg:px-8">
    <div class="max-w-2xl caja-sombreada">
      <div class="flex flex-col w-full">
        <h1 class="w-auto text-5xl font-extrabold text-blue-900 text-center uppercase tracking-widest">
          CR-Lotes
        </h1>
        <h2 class="text-center text-xl leading-9 text-gray-400 uppercase tracking-widest">
          Ingresar a tu cuenta
        </h2>
        
      </div>
      <form @submit.prevent class="mt-8">
        <!-- Inputs -->
        <div class="rounded-md shadow-sm">
          <div>
            <label class="label" for="email">Correo electrónico</label>
            <input v-model="email" aria-label="Email address" name="email" id="email" type="email" class="inputForm" placeholder="Correo electrónico">
          </div>
          <div class="mt-5">
            <label class="label" for="password">Contraseña</label>
            <input v-model="password" aria-label="Password" name="password" id="password" type="password" class="inputForm" placeholder="Contraseña">
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

        <!-- SignIn button -->
        <div class="mt-6">
          <button @click="signIn" class="boton-indigo relative w-full flex justify-center">
            <!-- py-4 px-4 border border-transparent text-lg leading-5 font-medium rounded-md -->
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            Ingresar
          </button>
        </div>

        <div class="mt-6 flex items-center justify-between">
          <div class="text-lg leading-5 w-full flex justify-around">
            <a @click="resetPass" class="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150 text-center">
              ¿Olvidaste tu contraseña?
            </a>
            <router-link :to="{ name: 'SignUp' }" class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150 text-center">
              Crear una cuenta
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
import "firebase/auth";
import Swal from "sweetalert2";
export default {
    name:"Login",
    data(){
      return{
        currentUser: "",
        email: "",
        password: "",
        problems: ""
      }
    },
    created(){
      firebase.auth().onAuthStateChanged(user=>{
          if(user){
              self.currentUser=user
          }
      })
    },
    methods:{
      signIn(){
        firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
            () => {
              this.problems = "",
              this.$router.replace("/")
            }
          )
        .catch(e=>{
          console.log(e.code)
          switch(e.code){
            case "auth/invalid-email":
              this.problems="Correo electrónico inválido."
              break;
            case "auth/user-not-found":
              this.problems="El correo ingresado no existe."
              break;
            case "auth/wrong-password":
              this.problems="Contraseña incorrecta."
              break;
            default:
              this.problems="Hubo un problema, vuelve a intentarlo."
          }
        })
      },
      async resetPass() {
        const { value: email } = await Swal.fire({
          title: "Recuperación de contraseña",
          text:
            "Coloca la dirección de tu correo electrónico que usas normalmente en CR-Lotes.",
          input: "email",
          inputPlaceholder: "Coloca acá tu email",
        });
        if (email) {
          const u = db.collection("users").where("email", "==", email);
          u.get()
            .then(() => firebase.auth().sendPasswordResetEmail(email))
            .then(function () {
              Swal.fire({
                icon: "info",
                title: "Confirmación",
                text:
                  "Hemos enviado un mensaje a tu correo para recuperar tu contraseña.",
              });
            })
            .catch(function (error) {
              console.log(error.code);
              if (error.code == "auth/user-not-found") {
                Swal.fire({
                  icon: "error",
                  title: "Confirmación",
                  text: "El correo ingresado no está registrado.",
                });
              }
            });
        }
      },
    },
}
</script>
