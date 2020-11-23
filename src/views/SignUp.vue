<template>
  <div class="flex items-center justify-center sm:px-6 lg:px-8 mt-10">
    <div class="max-w-2xl caja-sombreada">
      <div class="flex flex-col w-full">
        <h1 class="w-auto text-5xl font-extrabold text-gray-700 text-center uppercase">
          CR-Lotes
        </h1>
        <h2 class="text-center text-lg leading-9 text-gray-500 uppercase tracking-widest font-extrabold">
          Registro de cuenta
        </h2>
      </div>

      <form @submit.prevent class="w-full max-w-xl text-left bg-gray-100 md:shadow-xl rounded-xl md:px-20 pt-10 pb-10 mb-4">
        <!-- Inputs -->
        <div class="rounded-md shadow-sm">
          <!-- Nombre -->
          <div>
            <label 
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="name">Nombre</label>
            <input 
              v-model="name" 
              type="text"  
              placeholder="Nombre Apellido"
              class=" block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight"
            >
          </div>
          <!-- WhatsApp -->
          <div class="mt-2">
            <label 
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"> WhatsApp</label>            
            <div class="flex bg-white border rounded ">
              <!-- indicative -->
              <input 
                v-model="indicative"
                class="focus:outline-none block w-20 bg-white text-gray-700  rounded py-3 px-4 leading-tight">
                <!-- number -->
              <input 
                v-model="phoneNumber" 
                type="text" 
                class="focus:outline-none block w-full bg-white text-gray-700  rounded py-3 px-4  leading-tight" 
                placeholder="WhatsApp" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" >
            </div>
          </div>
          <!-- Correo  -->
          <div class="mt-2">
            <label 
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Correo electrónico</label>
            <input 
              v-model="email" 
              type="email" 
              class=" block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight"
              placeholder="Correo electrónico">
          </div>
          <!-- password -->
          <div class="mt-2">
            <label 
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Contraseña</label>
            <input 
              v-model="password" 
              type="password" 
              class=" block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight" 
              placeholder="Contraseña">
          </div>
          <!-- password 2-->
          <div class="mt-2">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
              Contraseña</label>
            <input 
              v-model="password2" 
              type="password" 
              class="block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight" 
              placeholder="Repite tu contraseña">
          </div>
        </div>
        
        <!-- Problems -->
        <p v-if="problems" class="group relative w-full flex justify-center bg-red-100 text-red-600 font-bold text-lg my-5 p-4 rounded-sm">
          <span 
            class="flex-auto ml-6 text-red-800">
            {{ problems }}</span>
        </p>

        <!-- SignUp button -->
        <div class="flex flex-col mt-8">
          <button @click="signUp" class="bg-gray-800 hover:bg-gray-900 text-gray-300 hover:text-gray-100 font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded uppercase tracking-widest">
            Registrarse
          </button>
        </div>

        <div class="mt-6 flex items-center justify-between">
          <div class="text-sm leading-5 w-full flex justify-around">
            <router-link :to="{ name: 'Login' }" class="font-medium text-base text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150 text-center">
              Ya tengo una cuenta
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
import {db} from "@/main.js"
import Swal from "sweetalert2";

export default {
    name:"SignUp",
    data(){
      return{
        name: "",
        email: "",
        indicative:"+506",
        phoneNumber: "",
        password: "",
        password2: "",
        problems: ""
      }
    },
    computed: {
      whatsApp() {
        return this.indicative + this.phoneNumber
      }
    },
    async created() {
        //user
        await firebase.auth().onAuthStateChanged(user=>{
            if(user){
                this.$router.replace("/")
            }
        })
    },

    methods:{
      signUp(){
        const self=this
        if(!this.name){
          this.problems="Nombre inválido."
          Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: this.problems,
              showConfirmButton: false,
              timer: 1500
          });
          return
        }
        if(!this.phoneNumber){
            this.problems="Número de teléfono no válido."
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: this.problems,
                showConfirmButton: false,
                timer: 1500
            });
            return
        }
        if(this.password!=this.password2){
            this.problems="Las contraseñas no coinciden."
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: this.problems,
                showConfirmButton: false,
                timer: 1500
            });
            return
        }
        firebase.auth()
        .createUserWithEmailAndPassword(this.email,this.password)
        .then((u)=>{
          const uid=u.user.uid
          db.collection("users").doc(uid.toString()).set({
            name:this.name,
            email:this.email,
            phoneNumber:self.whatsApp,
          })
        })
        .catch(e=>{
          // self.currentUser.delete()
          console.error(e)
          switch(e.code){
            case "auth/invalid-email":
              this.problems="Correo inválido."
              Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: this.problems,
                  showConfirmButton: false,
                  timer: 1500
              });
              break;
            case "auth/email-already-in-use":
              this.problems="Ya hay una cuenta vinculada a este correo."
              Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: this.problems,
                  showConfirmButton: false,
                  timer: 1500
              });
              break;
            case "auth/weak-password":
              this.problems="Coloca una contraseña más dificil de adivinar."
              Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: this.problems,
                  showConfirmButton: false,
                  timer: 1500
              });
              break;
            default:
              this.problems="Hubo un problema, vuelve a intentarlo."
              Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: this.problems,
                  showConfirmButton: false,
                  timer: 1500
              });
          }
        })
      },
    },
}
</script>