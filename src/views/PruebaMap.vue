<template>
  <main class="w-full h-full">
      <GoogleMap class="w-full h-64"
        :center="{ lat: 38.423733, lng: 27.142826 }"
        :zoom="4"
        :clickActive="true"
        :getLatLng="true"
        :mapType="'hybrid'"
        :moveActive="false"
    />
  </main>
</template>

<script>
    export default {
        name: 'PruebaMap'
    }
</script>