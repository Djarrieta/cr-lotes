<template>
  <div id="app" class="min-h-screen" >
    <Header />
    <router-view/>
    <p class="text-center " v-if="this.$route.path!='/'">Copywrights 2021 Grupo Mastermas Ltda</p>
  </div>
</template>
<script>
import Header from "@/components/Header"
import firebase from "firebase"

export default {
  components: { Header },
  data(){
    return{
      currentUser:null
    }
  },
  created(){
    firebase.auth().onAuthStateChanged(user=>{
      this.currentUser=user
    })
  }
}
</script>

<style>
  #app{
    @apply bg-gray-100
  } 
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }
  input[type=number] { -moz-appearance:textfield; }
</style>
