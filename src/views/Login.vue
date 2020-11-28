<template>
  <div class="flex items-center justify-center sm:px-6 lg:px-8 mt-10">
    <div class="max-w-2xl">
      <div class="flex flex-col w-full">
        <h1 class="w-auto text-5xl font-extrabold text-gray-700 text-center uppercase">
          CR-Lotes
        </h1>
        <h2 class="text-center text-lg leading-9 text-gray-500 uppercase tracking-widest font-extrabold">
          Ingresar a tu cuenta
        </h2>
        
      </div>
      <form @submit.prevent class="w-full max-w-xl text-left bg-gray-100 md:shadow-xl rounded-xl md:px-20 pt-10 pb-10 mb-4">
        
        <!-- Inputs -->
        <div class="rounded-md shadow-sm">
          <div class="w-full mb-6 md:mb-0">
            <label for="email" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Correo electrónico
            </label>
            <input
              class="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight"
              id="email"
              type="text"
              placeholder="Correo electrónico"
              v-model="email"
              aria-label="Email address"
            />
          </div>
          
          <div class="w-full mb-6 md:mb-0 mt-5">
            <label for="password" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Contraseña</label>
            <input v-model="password" aria-label="Password" name="password" id="password" type="password" class="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight" placeholder="Contraseña">
          </div>
        </div>
        
        <!-- Problems -->
        <p v-if="problems" class="group relative w-full flex justify-center bg-red-100 text-red-600 font-bold text-lg my-5 p-4 rounded-sm">
          <span class="flex-auto ml-6 text-red-800">{{ problems }}</span>
        </p>

        <!-- SignIn button -->
        <div class="flex flex-col mt-8">
          <button @click="signIn" class="bg-gray-800 hover:bg-gray-900 text-gray-300 hover:text-gray-100 font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded uppercase tracking-widest">
            <!-- py-4 px-4 border border-transparent text-lg leading-5 font-medium rounded-md -->
            Ingresar
          </button>
        </div>

          <div class="mt-6 text-lg leading-5 w-full md:flex justify-around text-center">
            <div class="mb-5 md:mb-0">
              <a @click="resetPass" class="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus:underline transition ease-in-out duration-150 text-center text-sm mb-10 md:mb-0 md:mr-5">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div class="mt-5 md:mt-0">
              <router-link :to="{ name: 'SignUp' }" class="text-gray-600 hover:text-gray-500 hover:underline focus:outline-none focus:underline transition ease-in-out duration-150 text-center text-sm font-extrabold">
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
              this.currentUser=user
          }
      })
    },
    methods:{
      signIn(){
        firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
            () => {
              this.problems = ""
              this.$router.replace("/")
            }
          )
        .catch(e=>{
          console.log(e.code)
          switch(e.code){
            case "auth/invalid-email":
              this.problems="Correo electrónico inválido."
              Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Correo electrónico inválido.',
                    showConfirmButton: false,
                    timer: 1500
                });
              break;
            case "auth/user-not-found":
              this.problems="El correo ingresado no existe."
              Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'El correo ingresado no existe.',
                    showConfirmButton: false,
                    timer: 1500
                });
              break;
            case "auth/wrong-password":
              this.problems="Contraseña incorrecta."
              Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Contraseña incorrecta.',
                    showConfirmButton: false,
                    timer: 1500
                });
              break;
            default:
              this.problems="Hubo un problema, vuelve a intentarlo."
              Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Hubo un problema, vuelve a intentarlo.',
                    showConfirmButton: false,
                    timer: 1500
                });
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
