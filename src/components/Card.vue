<template>
  <section class="text-left w-full shadow-lg overflow-hidden rounded-lg border">
      <!-- Foto -->
      <img
            v-if="prop.s8_pictures[0].fileUrl"
            class="w-full h-48 object-cover object-center bg-white"
            :src="prop.s8_pictures[0].fileUrl"
        /> 
        <!-- Detalles -->
        <div class="pl-2 py-2 bg-gradient-to-r from-gray-900 via-gray-700 w-full">
            <p class="px-5 rounded-lg text-white font-poppins flex justify-between">
                <span class="text-white"><i class="fas fa-map-marked-alt text-white"></i> {{ prop.s2_namePrvSelected }} - {{ prop.s2_nameCtnSelected }}</span>
                <span class="flex">
                    <router-link :to="'/publicar/'+ prop.propId"> <i v-if="prop.uid === idUser.uid" class="fas fa-edit text-primary cursor-pointer mr-2" title="Editar"></i></router-link>
                    <Favorito v-if="prop.uid != idUser.uid" :propId="prop.propId" title="Favorito" /> 
                </span>
            </p>
        </div>
        <div class="px-6 py-5 bg-white text-left">
            <p class="font-bold text-md uppercase">
                {{ prop.s1_title }}
            </p>
            <p class="text-xs"><span class="font-bold">ID:</span> {{ prop.propId }}</p>
            <p class="font-medium text-md text-primary flex flex-col md:flex md:flex-row md:justify-between">
               <span :class="[prop.s1_price_off > 0 ? 'line-through text-primary' : ' text-primary']"> ₡ {{ prop.s1_price  | precio }} </span>  
               <span>{{ prop.s1_price_off }}% descuento</span>
               <span>₡ {{ Math.round(prop.s1_price - ((prop.s1_price * prop.s1_price_off) / 100)) | numberFormat }}</span>
            </p>
            <p class="text-gray-700 text-base">
                {{ prop.s1_description.substring(0,70)+" ..." }}
            </p>
            <p>
                <span class="font-bold">Propiedad vista:</span> {{ prop.counterVisitas }} {{ prop.counterVisitas | pluralize(prop.counterVisitas) }}
            </p>
            <div class="flex flex-col md:flex-row justify-between mt-5">
                <p>
                    <i class="fas fa-ruler-combined"></i> {{prop.s1_area | numberFormat}} {{prop.s1_areaUn}}
                </p>
                <div class="mt-5 lg:mt-0">
                    <router-link :to="'/perfil-propiedad/'+prop.propId" class="px-4 py-2 rounded-md mr-5 border-2 border-primary text-primary h-6">Detalles</router-link>
                    <a :href="'https://api.whatsapp.com/send?text=CR-Lotes%20https://localhost:8080/perfil-propiedad/'+prop.propId" class="text-gray-900 hover:text-primary" target="_blank" title="Compartir en WhatsApp"><i class="fas fa-share-alt"></i></a>
                </div>
            </div>
        </div>
        <div class="px-6 py-5 flex justify-between bg-white" v-if="prop.uid===idUser.uid">
            <StatusProp :propId="prop.propId"></StatusProp>
            <StatusVendido :propId="prop.propId"></StatusVendido>
            <Subastar :propId="prop.propId"></Subastar>
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
    name:"Card",
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