<template>
<main>

  <GoogleMap class="w-full h-full"
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