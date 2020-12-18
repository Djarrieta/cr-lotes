<template>
  <section class="text-left w-full shadow-lg overflow-hidden rounded-lg border lg:flex lg:flex-row xl:h-64">
    <!-- Foto -->
    <!-- <div class="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"> -->
      <img
      v-if="prop.s8_pictures[0].fileUrl"
      class="w-full lg:w-56 xl:w-64 xl:h-full object-cover object-center bg-white "
      :src="prop.s8_pictures[0].fileUrl"
      /> 
    <!-- </div> -->
    <div class="w-full h-full">
      <!-- Ubicación y botones -->
      <div class="pl-2 py-2 bg-gradient-to-r from-gray-900 via-gray-700 w-full">
        <p class="px-5 rounded-lg text-white font-poppins flex justify-between">
          <span class="text-white"><i class="fas fa-map-marked-alt text-white"></i> {{ prop.s2_namePrvSelected }} - {{ prop.s2_nameCtnSelected }}</span>
          <span class="flex">
            <router-link v-if="prop.uid === idUser.uid" :to="'/publicar/'+ prop.propId" class="font-bold">Editar</router-link>
            <Favorito v-if="prop.uid != idUser.uid" :propId="prop.propId" title="Favorito" /> 
          </span>
        </p>
      </div>
			<!-- Detalles -->
      <div class="px-6 py-3 bg-white text-left">
        <p class="font-bold text-md uppercase">
          {{ prop.s1_title }}
        </p>
        <p class="text-xs"><span class="font-bold">ID:</span> {{ prop.propId }}</p>
        <p class="font-medium text-md text-primary flex flex-col md:flex md:flex-row md:justify-between">
            <span :class="[prop.s1_price_off > 0 ? 'line-through  text-primary' : ' text-primary']"> ₡ {{ prop.s1_price  | precio }} </span>  
            <span v-if="prop.s1_price_off">{{ prop.s1_price_off }}% descuento</span>
            <span v-if="prop.s1_price_off">₡ {{ Math.round(prop.s1_price - ((prop.s1_price * prop.s1_price_off) / 100)) | numberFormat }}</span>
        </p>
        <p v-if="!prop.s1_price_alquiler" class="text-gray-700 text-base">
          {{ prop.s1_description.substring(0,70)+" ..." }}
        </p>
        <p v-if="prop.s1_price_alquiler > 0" class="font-medium flex flex-col md:flex md:flex-row md:justify-between">
            <span> Precio alquiler mensual: ₡ {{ prop.s1_price_alquiler  | numberFormat }} </span>  
        </p>
        <p>
          <span class="font-bold">Propiedad vista:</span> {{ prop.counterVisitas }} {{ prop.counterVisitas | pluralize(prop.counterVisitas) }}
        </p>
        <div class="flex flex-col justify-between my-3">
					<!-- Area -->
          <p class="mb-1">
            <i class="fas fa-ruler-combined"></i> {{prop.s1_area | numberFormat}} {{prop.s1_areaUn}}
          </p>
					<!-- Botones y acciones -->
          <div class="flex w-full justify-between">
						<!-- Botón Detalles -->
            <router-link target="_blank" :to="'/perfil-propiedad/'+prop.propId" class="py-1 mr-5 | text-primary font-bold | rounded-md">
              <i class="fas fa-link"></i> Detalles 
            </router-link>
						<!-- Compartir -->
            <a :href="'https://api.whatsapp.com/send?text=CR-Lotes%20https://localhost:8080/perfil-propiedad/'+prop.propId" class="text-primary font-bold" target="_blank" title="Compartir en WhatsApp">
              <i class="fab fa-whatsapp"></i> Compartir por WhatsApp
            </a>
            <!-- Ubicar En Mapa -->
            <span @click="locateMarker"><i class="fas fa-search-location"></i></span>
          </div>
        </div>
      </div>
			
    </div>
  </section>
</template>

<script>
import firebase from "firebase"
import Favorito from "@/components/Favorito"
export default {
  name:"CardHorizontal",
  components: { Favorito },
  props:["prop"],
  data(){
    return {
      infoVendedor: '',
      idUser: ""
    }
  },
  created(){
    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        this.idUser=user
      }else{
        this.idUser=""
      }
    })
  },
  filters: {
    precio: function(value){
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    numberFormat: function(value){
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    pluralize: function(amount) {
      return (amount > 1 || amount === 0) ? 'veces' : 'vez'
    }
  },
  methods:{
    locateMarker(){
      this.$emit("locateMarker")
    }
  }
}
</script>