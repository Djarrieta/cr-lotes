<template>
  <div id="app" class=" min-h-screen" >
    <Header/>
    <router-view/>
  </div>
</template>
<script>
import Header from "@/components/Header"
export default {
  components: { Header }
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
