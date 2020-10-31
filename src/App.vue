<template>
  <div class="min-h-screen bg-gray-100">
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