<template>
<nav class="bg-gray-800">
  <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div class="relative flex items-center justify-between h-16">
        <!-- left menu -->
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- small logo -->
          <span class="block lg:hidden text-blue-50 text-2xl  font-bold mr-2">
            CR
          </span>

        <button @click="showLeftMenu" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out" aria-label="Main menu" aria-expanded="false">

            <!-- sandwitch Icon when menu is open -->
          <svg v-if="!leftMenuVisible" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <!-- Close Icon when menu is open -->
          <svg v-if="leftMenuVisible" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Logos -->
      <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
        <div class="flex-shrink-0">
          <!-- small logo -->
          <span class="hidden sm:block lg:hidden h-8 w-auto text-blue-50 text-2xl  font-bold">
            CR-Lotes
          </span>

          <!-- big logo -->
          <span  class="hidden lg:block h-8 w-auto text-blue-50 text-2xl font-bold">
              CR-Lotes
          </span>
        </div>
        <!-- Left menu visible on md and bigger-->
        <div class="hidden sm:block sm:ml-6">
          <div class="flex">
            <a href="#" class="px-3 py-2 rounded-md text-sm font-medium leading-5 text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Nosotros</a>
            <a href="#" class="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Contacto</a>
          </div>
        </div>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <!-- Notifications bell -->
        <button class="p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out" aria-label="Notifications">
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <!-- Profile menu -->
        <div class="ml-3 relative">
          <div @click="ShowProfileMenu">
            <button class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out" id="user-menu" aria-label="User menu" aria-haspopup="true">
                <!-- profile picture -->
              <img class="h-8 w-8 rounded-full" :src="profilePic">
            </button>
          </div>
          <div 
            v-if="profileMenuVisible" 
            @mouseleave="ShowProfileMenu"
            class="origin-top-right absolute right-0 mt-1 w-48 rounded-md shadow-lg">
            <div class="py-1 rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                <router-link 
                    :to="{ name: 'SignIn' }" 
                    v-if="!currentUser"
                    class="profileMenuElement">
                    Ingresar</router-link>
                <router-link
                    :to="{ name: 'SignUp' }" 
                    v-if="!currentUser"
                    class="profileMenuElement">
                    Registrarse</router-link>
                <router-link
                    :to="{ name: 'Home' }"
                    v-if="currentUser"
                    class="profileMenuElement">
                    {{ currentUser.displayName }}</router-link>
                <router-link
                    :to="{ name: 'NewCard' }"
                    v-if="currentUser"
                    class="profileMenuElement">
                    Publicar</router-link>
                <a 
                    :to="{ name: 'Home' }"
                    v-if="currentUser"
                    class="profileMenuElement"
                    @click="signOut">
                    Salir</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

   <!--  Left Menu only visible on sm -->
  <div v-if="leftMenuVisible" class="md:hidden">
    <div class="px-2 pt-2 pb-3">
      <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Nosotros</a>
      <a href="#" class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out">Contacto</a>
    </div>
  </div>
</nav>

</template>

<script>
import firebase from "firebase"
export default {
    name:"Header",
    data(){
        return{
            profileMenuVisible:false,
            leftMenuVisible:false,
            currentUser:"",
        }
    },
    computed:{
        profilePic(){
            
            return this.currentUser ? "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FuserColor_40px.png?alt=media&token=47c3b3a4-9de5-42a8-91fa-53857aea0526" :

            "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Fuser_40px.png?alt=media&token=3a5e7134-b699-492d-8e65-78c34e59e893"
        }
    },
    created(){
        const self=this
        //user
        firebase.auth().onAuthStateChanged(user=>{
          console.log("cambia user")
            if(user){
                self.currentUser=user
            }else{
                self.currentUser=""
            }
        })
    },
    methods:{
        showLeftMenu(){
            this.leftMenuVisible=!this.leftMenuVisible
        },
        ShowProfileMenu(){
            this.profileMenuVisible=!this.profileMenuVisible
        },
        signOut(){
            firebase.auth().signOut()
            .catch(e=>console.error(e))
            this.currentUser=""
            this.$router.replace("/")
        },
    }
}
</script>
<style scoped>
@layer base {
    .profileMenuElement {
        @apply block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out cursor-pointer
    }
    .profileMenuElement:hover{
        @apply bg-gray-100
    }
    .profileMenuElement:focus{
        @apply outline-none bg-gray-100
    }
}
</style>