<template>
  <section class="w-full shadow-lg overflow-hidden rounded-lg border">
      <!-- Foto -->
      <img
            v-if="prop.s8_pictures[0].fileUrl"
            class="w-full h-48 object-scale-down object-center bg-gray-100"
            :src="prop.s8_pictures[0].fileUrl"
        /> 
        <!-- Detalles -->
        <div class="pl-2 py-2 bg-gradient-to-r from-gray-900 via-gray-700 w-full">
            <p class="px-5 rounded-lg text-white font-poppins flex justify-between">
                <span class="text-white"><i class="fas fa-map-marked-alt text-white"></i> {{ prop.s2_namePrvSelected }} - {{ prop.s2_nameCtnSelected }}</span>
                <span class="flex">
                    <router-link :to="'/publicar/'+ prop.propId"> <i v-if="prop.uid === idUser.uid" class="fas fa-edit text-gray-900 cursor-pointer mr-2"></i></router-link>
                    <Favorito v-if="prop.uid != idUser.uid" :propId="prop.propId" /> 
                </span>
            </p>
        </div>
        <div class="px-6 py-5 bg-gray-200">
            <p class="font-bold text-md mb-2 uppercase">
                {{ prop.s1_title }}
            </p>
            <p class="font-medium text-md text-orange-600 mb-2">
                {{ prop.s1_price  | precio }}
            </p>
            <p class="text-gray-700 text-xs">

                {{ prop.s1_description.substring(0,70)+" ..." }}
            </p>
            <div class="flex justify-between mt-5">
                <p>
                    <i class="fas fa-ruler-combined"></i> {{prop.s1_area}} {{prop.s1_areaUn}}
                </p>
                <div>
                    <router-link :to="'/perfil-propiedad/'+prop.propId" class="bg-gray-900 px-4 py-2 rounded-sm mr-5 text-white hover:text-white h-6">Detalles</router-link>
                    <a :href="'https://api.whatsapp.com/send?text=CR-Lotes%20https://localhost:8080/perfil-propiedad/'+prop.propId" class="text-gray-900 hover:text-orange-700" target="_blank"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
        </div>
        <div class="px-6 py-5 flex justify-between bg-gray-200" v-if="prop.uid===idUser.uid">
            <StatusProp :propId="prop.propId"></StatusProp>
            <StatusVendido :propId="prop.propId"></StatusVendido>
        </div>
  </section>
</template>

<script>
import firebase from "firebase"
import Favorito from "@/components/Favorito"
import StatusProp from "@/components/StatusProp"
import StatusVendido from "@/components/StatusVendido"
export default {
    name:"Card",
    components: { Favorito, StatusProp, StatusVendido },
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
        precio: function(val){
            let precioFormateado = new Intl.NumberFormat().format(val)
            return precioFormateado + "₡"
        }
    }
}
</script>

<style>

</style>