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
            <router-link :to="'/publicar/'+ prop.propId"> <i v-if="prop.uid === idUser.uid" class="fas fa-edit text-primary cursor-pointer mr-2" title="Editar"></i></router-link>
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
        <p class="font-medium text-md text-primary">
          ₡ {{ prop.s1_price  | precio }} 
        </p>
        <p class="text-gray-700 text-base">
          {{ prop.s1_description.substring(0,70)+" ..." }}
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
          </div>
        </div>
      </div>
			<!-- Opciones vendendor -->
      <div class="px-6 py-5 flex justify-between bg-white" v-if="prop.uid===idUser.uid">
        <StatusProp :propId="prop.propId"></StatusProp>
        <StatusVendido :propId="prop.propId"></StatusVendido>
        <Subastar :propId="prop.propId"></Subastar>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from "firebase"
import Favorito from "@/components/Favorito"
import StatusProp from "@/components/StatusProp"
import StatusVendido from "@/components/StatusVendido"
import Subastar from "@/components/Subastar"
export default {
  name:"CardHorizontal",
  components: { Favorito, StatusProp, StatusVendido, Subastar },
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
      // let precioFormateado = new Intl.NumberFormat().format(val)
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
  }
}
</script>

<style>

</style>