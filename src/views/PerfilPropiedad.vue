<template>
    <main>
    <!-- Migas de pan -->
    <section class="container mx-auto mt-5">
    </section>

    <section class="lg:flex my-5 container m-auto">
      <!-- Fotos -->
      <div id="fotos" class="lg:w-3/6 object-center">
        <ul class="" id="slideshowFotos">
          <li v-for="foto in info.s8_pictures" :key="foto">
            <img
            class="w-full h-40 object-scale-down"
            :src="foto.fileUrl"
            :alt="foto.title"
            />
          </li>
        </ul>
      </div>

      <!-- Datos -->
      <div class="lg:w-3/6 lg:ml-10">
        <div class="rounded overflow-hidden shadow-lg px-10 py-10">
          
          <h1 class="text-lg uppercase">{{ info.s1_title }}</h1>
          <p>{{ info.s1_description }}</p>
          <p>
            <span class="block"><b>Provincia:</b> {{ info.s2_namePrvSelected }}</span> 
            <span class="block"><b>Cantón:</b> {{ info.s2_nameCtnSelected }}</span>
            <span class="block"><b>Distrito:</b> {{ info.s2_nameDttSelected }}</span>
            <span class="block"><b>Dirección:</b> {{ info.s2_address }}</span>
            <span class="block"><b>Precio:</b> {{ info.s1_price | precio }}</span>
          </p>
          <h3 class="block text-lg">Esta propiedad cuenta con:</h3>
            <ul class="grid grid-cols-3 gap-x-4 gap-y-2">
              <li class="min-h-8 px-2 bg-gray-200 py-2 px-2" v-for="contaran in info.s6_assets" :key="contaran">
                {{contaran}}
              </li>
            </ul>
        </div>
      </div>
    </section>

    <!-- mapa -->
    <section class="container mx-auto mt-10">
      <GmapMap
              :center="selectedCenter"
              :zoom="selectedZoom"
              mapTypeControl="false"
              streetViewControl="false"
              class="w-full h-64"
              ref="mapRef"
            >
              <GmapMarker
                :position="selectedCenter"
                :draggable="false"
                ref="GoogleMrkr"
              />
            </GmapMap>
    </section>

    <!-- Detalles -->
    <section class="container mx-auto mt-10">
      <ul uk-tab>
        <li class=""><a href="">Detalles</a></li>
        <li><a href="">Documentos</a></li>
      </ul>
      <ul class="">
        <li class="">
          <table class="">
            <tbody>
                <tr v-if="info.s2_namePrvSelected">
                    <td class="font-bold">Provincia</td>
                    <td>{{info.s2_namePrvSelected}}</td>
                </tr>
                <tr v-if="info.s2_nameDttSelected">
                    <td class="font-bold">Distrito</td>
                    <td>{{info.s2_nameDttSelected}}</td>
                </tr>
                <tr  v-if="info.s2_nameCtnSelected">
                    <td class="font-bold">Cantón</td>
                    <td>{{info.s2_nameCtnSelected}}</td>
                </tr>
                <tr v-if="info.s1_area">
                  <td class="font-bold">Área de terreno</td>
                  <td>{{info.s1_area}} {{ info.s1_areaUn }}</td>
                </tr>
                <tr v-if="info.s6_assets">
                  <td class="font-bold">La propiedad cuenta con:</td>
                  <td>
                    <ul class="pl-0">
                      <li v-for="cuenta in info.s6_assets" :key="cuenta">{{ cuenta }}</li>
                    </ul>
                  </td>
                </tr>
                <tr v-if="info.s4_inclination">
                  <td class="font-bold">Inclinación del terreno:</td>
                  <td>
                    <!-- <img class="h-40 bg-white" :src="'/images/'+info.topografia+'.png'" /> -->
                    {{info.s4_inclination}}
                  </td>
                </tr>
            </tbody>
        </table>
        </li>
        <li>
          <table class="">
            <tbody>
              <tr v-for="file in info.s7_files" :key="file">
                <td>
                  {{file.title}}
                </td>
                <td>
                  <a class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 ml-5 rounded" target="_blank" :href="file.fileUrl">Ver documento</a>
                </td>
              </tr>
            </tbody>
          </table>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
export default {
    name: "PerfilPropiedad",
    data() {
    return {
      uid: "",
      datosUser: "",
      info: [],
      selectedCenter: { lat: 0, lng:0 },
      selectedZoom: 14,
    };
  },
  filters: {
    precio: function(value){
      let precioFormateado = new Intl.NumberFormat().format(value)
      return precioFormateado + "₡"
    }
  },
  mounted: function () {
    let self = this
    self.datosUser = firebase.auth().currentUser;
    const getId = this.$route.params.id;
    console.log(getId)

    // Capturar datos de la propiedad
    let dPropiedad = db.collection("props").doc(getId);
    dPropiedad
      .get()
      .then(function (docProp) {
        self.info = { ...docProp.data() };
        self.selectedCenter = { lat: docProp.data().s2_lat, lng: docProp.data().s2_lng };
      })
  }
}
</script>

<style>

</style>