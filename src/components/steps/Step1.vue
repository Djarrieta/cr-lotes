<template>
<!-- Título-->
<div>
  <Buttons @next="next" first="true"/>
  <div  v-if="problems" class="text-sm text-left text-red-600 bg-red-200 border border-red-400 h-12 flex items-center p-4 m-4 rounded-sm" role="alert"> {{problems}} </div>
  <div class="grid sm:grid-cols-2 w-full h-full">
    
    <div class="flex flex-col p-4">
      <!-- Título -->
      <div class="my-1">
        <label class="w-16 ml-2 pl-1 bg-gray-100  text-base font-bold">Título</label>
        <div class="border  border-gray-300 py-2 px-1 rounded bg-white">
          <input 
            class="focus:outline-none w-full bg-white px-2"
            v-model="s1_title"
            type="text"
            placeholder="TÍTULO">
        </div>
         <!-- Descripción -->
      </div>
      <div class="my-1">
        <label class="w-16 ml-2 pl-1 bg-gray-100  text-base font-bold">Descripción</label>
        <div class="border  border-gray-300 py-2 px-1 rounded bg-white">
          <textarea
          v-model="s1_description"
          class="rounded-lg w-full h-32 bg-white focus:outline-none"
          style="resize:none"
          placeholder="Descripción corta"/>
        </div>
      </div>
      <!-- Area -->
      <div class="my-1">
        <label class="w-16 ml-2 pl-1 bg-white  text-base font-bold">Área</label>
        <div class="border  border-gray-300 py-2 px-1 rounded bg-white">
          <div class="flex">
            <input 
              class="focus:outline-none w-full bg-white px-2"
              v-model="s1_area"
              type="number">
            <select 
              class="focus:outline-none"
              v-model="s1_areaUn"> 
              <option value="m²">m²</option>
              <option value="ha">ha</option>
            </select>
          </div>

          <span 
            class=" text-base text-gray-800">
              {{ s1_area | numberFormat }} 
                <span class=" text-base text-gray-800" v-if="s1_areaUn=='m²'">metros cuad.</span> 
                <span class=" text-base text-gray-800" v-if="s1_areaUn=='ha'">hectareas</span> 
          </span>
        </div>
      </div>
      <!-- Frente -->
      <div class="my-1">
        <label class="w-16 ml-2 pl-1 bg-gray-100  text-base font-bold">Medida Frente</label>
        <div class="border  border-gray-300  px-1 rounded bg-white">
          <input 
            class="focus:outline-none w-full bg-white px-2"
            v-model="s1_frontSize"
            type="number">
          <span class=" text-base text-gray-800">{{ s1_frontSize | numberFormat }} metros </span>
        </div>
      </div>
      <!-- Precio -->
      <div class="my-1">
        <label class="w-16 ml-2 pl-1 bg-gray-100  text-base font-bold">Precio</label>
        <div class="border  border-gray-300  px-1 rounded bg-white">
          <input 
            class="focus:outline-none w-full bg-white px-2"
            v-model="s1_price"
            type="number">
          <span class=" text-base text-gray-800">₡ {{ s1_price | numberFormat }} </span>
        </div>
      </div>
      <!-- % descuento -->
      <div class="my-1">
        <label class="w-16 ml-2 pl-1 bg-gray-100  text-base font-bold">Porcentaje de descuento (de 0 a 100)</label>
        <div class="border  border-gray-300  px-1 rounded bg-white">
          <input 
            class="focus:outline-none w-full bg-white px-2"
            v-model="s1_price_off"
            type="number"
            min=0
            max=100> 
          <span class=" text-base text-gray-800">Precio con descuento: ₡ {{ Math.round(s1_price - ((s1_price * s1_price_off) / 100)) | numberFormat }}</span>
        </div>
      </div>
      <!-- Se alquila -->
      <div class="my-1">
        <input type="checkbox" v-model="s1_seAlquila" id="seAlquila" value="seAlquila"> <label for="seAlquila">Se alquila</label>
      </div>
      <!-- Precio de alquiler -->
      <div v-if="s1_seAlquila" class="my-1">
        <label class="w-16 ml-2 pl-1 bg-gray-100  text-base font-bold">Precio de alquiler mensual</label>
        <div class="border  border-gray-300  px-1 rounded bg-white">
          <input 
            :disabled="s1_seAlquila ? false : true"
            class="focus:outline-none w-full bg-white px-2 disabled:bg-gray-200"
            v-model="s1_price_alquiler"
            type="number">
          <span class=" text-base text-gray-800">₡ {{ s1_price_alquiler | numberFormat }} </span>
        </div>
      </div>

    </div>
    <img  class="hiden sm:block" src="https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Fscott-graham-OQMZwNd3ThU-unsplash.jpg?alt=media&token=a26184f0-4a98-404f-8ec9-16f83f8d5843" alt="FormPicture">
  </div>
</div>
</template>

<script>
import Buttons from "@/components/steps/Buttons"
export default {
  name: 'Step1',
  props:["data"],
  components:{Buttons},
  data(){
  return{
    s1_title:"",
    s1_description:"",
    s1_area:null,
		s1_areaUn:"m²",
		s1_frontSize:null,
    s1_price:null,
    s1_price_off: 0,
    s1_price_alquiler: 0,
    s1_seAlquila: false,
    problems:""
  }
  },
  filters:{
    numberFormat: function(value){
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  },
  computed:{
  emitedData(){
    return {
      s1_title:this.s1_title,
      s1_description:this.s1_description,
      s1_area:this.s1_area,
			s1_areaUn:this.s1_areaUn,
			s1_frontSize:this.s1_frontSize,
      s1_price:this.s1_price,
      s1_price_off:this.s1_price_off,
      s1_price_alquiler:this.s1_price_alquiler,
      s1_seAlquila:this.s1_seAlquila,
    }
  }
  },
  watch:{
    problems:function(){
      setTimeout(() => {
        this.problems=""
      }, 2000);
    },
    data(){
      //cuando data cambia por cualquier motivo, incluso cuando carga, se pasan los valores de data del padre a los valores locales del hijo.
      if(this.data.s1_title){this.s1_title=this.data.s1_title}
      if(this.data.s1_description){this.s1_description=this.data.s1_description}
      if(this.data.s1_area){this.s1_area=this.data.s1_area}
			if(this.data.s1_areaUn){this.s1_areaUn=this.data.s1_areaUn}
			if(this.data.s1_frontSize){this.s1_frontSize=this.data.s1_frontSize}
      if(this.data.s1_price){this.s1_price=this.data.s1_price}
      if(this.data.s1_price_off){this.s1_price_off=this.data.s1_price_off}
      if(this.data.s1_seAlquila){this.s1_seAlquila=this.data.s1_seAlquila}
      if(this.data.s1_price_alquiler){this.s1_price_alquiler=this.data.s1_price_alquiler}
    }
  },
  mounted(){
    if(this.data.s1_title){
      this.s1_title=this.data.s1_title
      this.s1_description=this.data.s1_description
      this.s1_area=this.data.s1_area
			this.s1_areaUn=this.data.s1_areaUn
			this.s1_frontSize=this.data.s1_frontSize
      this.s1_price=this.data.s1_price
      this.s1_price_off=this.data.s1_price_off
      this.s1_seAlquila=this.data.s1_seAlquila
      this.s1_price_alquiler=this.data.s1_price_alquiler
    }
  },
  methods:{
    next(){
    this.problems=""
    if(!this.s1_price){this.problems="Precio inválido"}
    if(!this.s1_areaUn){this.problems="TUnidad Área inválida"}
    if(!this.s1_area){this.problems="Área inválida"}
    if(!this.s1_title){this.problems="Título inválido"}

    //Emite solo cuando no hay problemas
    if(!this.problems){
      this.$emit("next",this.emitedData)
    }
    },
  }
}
</script>
