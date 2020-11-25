<template>
  <div>
    <Buttons @save="save" @prev="prev" last="true"/>
    <div class="flex flex-col">
      <span>Confirmación</span>
      <p>¿Está seguro que desea guardar esta nueva nueva publicación?</p>
      
      <!-- {{data}} -->

      <h1 class="text-xl md:text-2xl font-bold">
        {{data.s1_title}}
      </h1>
      <h2>
        {{data.s1_description}}
      </h2>
      <p>
        Área: {{data.s1_area | numberFormat}} {{data.s1_areaUn}}
      </p>
      <p>
        Precio: {{data.s1_price | numberFormat}}  ₡
      </p>
      <p>
        Provincia: {{data.s2_namePrvSelected}}
      </p>
      <p>
        Cantón: {{data.s2_nameCtnSelected}}
      </p>
      <p>
        Distrito: {{data.s2_nameDttSelected}}
      </p>
      <p>
        Dirección: {{data.s2_address}}
      </p>
      <p>
        Tipo de frente: {{data.s3_frontType}}
      </p>
      <p>
        Inclinación: {{data.s4_inclination}}
      </p>
      <p>
        Nivel de terreno: {{data.s5_nivel}}
      </p>
      
      <ul>La propiedad cuenta con:
        <li v-for="asset in data.s6_assets" :key="asset">{{asset}}</li>
      </ul>
      
      <p>Documentos:</p>
      <ul class="flex">
        <li v-for="file in data.s7_files" :key="file.title"><a class="bg-gray-300 text-blue-800 px-5 py-1" :href="file.fileUrl" target="_blank">{{file.title}}</a></li>
      </ul>

      <p>Fotos:</p>
      <ul class="flex">
        <li v-for="foto in data.s8_pictures" :key="foto.title">
          <img class="h-40 w-40 object-cover mx-2" :src="foto.fileUrl" :alt="foto.title">
        </li>
      </ul>

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
    </div>
  </div>
</template>

<script>
import Buttons from "@/components/steps/Buttons"
export default {
  name: 'Confirmation',
  props:["data"],
  components:{Buttons},
  data() {
    return {
      selectedCenter: { lat: this.data.s2_lat, lng: this.data.s2_lng },
      selectedZoom: 16
    }
  },
  filters:{
      numberFormat: function(value){
          let val = (value/1).toFixed(0).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
  },
  methods:{
    save(){
      this.$emit("save")
    },
    prev(){
      this.$emit("prev")
    }
  }
}
</script>