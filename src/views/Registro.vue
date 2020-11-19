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
        <form
        @submit.prevent="registro"
        class="w-full max-w-xl text-left bg-gray-100 md:shadow-xl rounded-xl px-5 md:px-20 pt-10 pb-10 mb-4"
        >
            <!-- Nombre -->
            <div class="form-group w-full">
            <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="nombre"
            >Nombre</label>
            <input
                class="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight"
                id="nombre"
                type="text"
                placeholder="Nombre"
                v-model="nombre"
            />
            </div>

        <!-- email -->
        <div class="mb-4">
            <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="email"
            >Correo electrónico</label>
            <input
            class="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight"
            id="email"
            type="text"
            placeholder="Correo electrónico"
            v-model="email"
            />
        </div>

        <!-- contraseña -->
        <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full px-3 mb-6 md:mb-0">
            <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="contrasena"
            >Contraseña</label>
            <input
                class="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight"
                id="contrasena"
                type="password"
                placeholder="******************"
                v-model="contrasena"
            />
            </div>

            <!-- confirmación contraseña -->
            <div class="w-full px-3 mb-6 md:mb-0">
            <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="confirmar_contrasena"
            >Confirmar contraseña</label>
            <input
                class="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight"
                id="confirmacion_contrasena"
                type="password"
                placeholder="******************"
                v-model="confirmacion_contrasena"
            />
            </div>
        </div>
        <!-- Problems -->
        <p v-if="problems" class="group relative w-full flex justify-center bg-red-100 text-red-600 font-bold text-lg my-5 px-2 py-4 rounded-sm">
          <span class="flex-auto ml-6 text-red-800">{{ problems }}</span>
        </p>

        <div>
            <button
            type="submit"
            class="w-full bg-gray-800 hover:bg-gray-900 text-gray-300 hover:text-gray-100 font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded uppercase tracking-widest"
            >Quiero registrarme</button>
        </div>

            <div class="mt-6 flex items-center justify-between ">
                <div class="text-lg leading-5 w-full flex justify-around">
                    <router-link :to="{ name: 'Login' }" class="text-gray-600 hover:text-gray-500 hover:underline focus:outline-none focus:underline transition ease-in-out duration-150 text-center text-sm font-extrabold">
                        Ya tengo una cuenta
                    </router-link>
                </div>
            </div>
        </form>
    </div>
  </div>
</template>

<script>
import { db } from "@/main";
import "firebase/auth";
import firebase from "firebase"
import Swal from "sweetalert2"

export default {
  name: "Registro",
  data() {
    return {
      errors: [],
      email: "",
      contrasena: "",
      confirmacion_contrasena: "",
      nombre: "",
      submitStatus: null,
      problems: ''
    };
  },

  created: function () {
    var user = firebase.auth().currentUser;
    if (user != null) {
      this.$router.replace("/");
    }
  },

  methods: {
    registro() {
      let self = this;
        if(this.contrasena != this.confirmacion_contrasena) {
            this.problems = "La contraseñas no coinciden"
            Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'La contraseñas no coinciden',
                    showConfirmButton: false,
                    timer: 1500
                });
        } else {
            this.problems = "";
        }
        if(this.problems === '') {
            firebase.auth()
            .createUserWithEmailAndPassword(self.email, self.contrasena)
            .then( (data) => {
                let uid = data.user.uid;
                const user = firebase.auth().currentUser;
                db.collection("users").doc(uid).set({
                    uid: uid,
                    nombre: self.nombre,
                    email: self.email
                });
                return user.updateProfile({
                    displayName: self.nombre
                })
            })
            .then(() => this.$router.replace("/"))
            .catch( (e) => {
                console.log(e.code)
                
                switch(e.code){
                case "auth/invalid-email":
                this.problems="Correo electrónico inválido."
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Correo electrónico inválido',
                    showConfirmButton: false,
                    timer: 1500
                });
                break;
                case "auth/user-not-found":
                this.problems="El correo ingresado no existe."
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'El correo ingresado no existe',
                    showConfirmButton: false,
                    timer: 1500
                });
                break;
                case "auth/email-already-in-use":
                this.problems="El correo ingresado ya está en uso."
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'El correo ingresado ya está en uso',
                    showConfirmButton: false,
                    timer: 1500
                });
                break;
                case "auth/weak-password":
                this.problems="Contraseña débil."
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Contraseña débil',
                    showConfirmButton: false,
                    timer: 1500
                });
                break;
                case "distinta-password":
                this.problems="La contraseña debe ser igual que su confirmación"
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'La contraseña debe ser igual que su confirmación',
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
            });
        }
    },
  }
};
</script>

<style></style>
