<template>
<div>
  <Buttons @next="next"/>
  <div class="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="mt-8">
        <!-- Inputs -->
        <div class="rounded-md shadow-sm">
          <!-- Titulo -->
          <div>
            <input v-model="title" type="text" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="TITULO">
          </div>
          <!-- Descripcion -->
          <div class="-mt-px">
            <textarea v-model="description" class="w-full h-32 appearance-none rounded-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" style="resize:none" placeholder="Descripción corta"></textarea>
          </div>
          <!-- Tipo -->
          <div class="-mt-px">
            <select v-model="type" class="w-full h-10 appearance-none rounded-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5">
              <option value="Lote">Lote</option>
              <option value="Vivienda">Vivienda</option>
            </select>
          </div>
          <!-- Area -->
          <div class="-mt-px flex border border-gray-300">
            <input v-model="area" type="number" class="appearance-none rounded-none relative block w-full px-3 py-2  placeholder-gray-500 text-gray-900  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5 text-right" placeholder="Área">
            <select v-model="unArea" class="text-gray-500">
              <option value="Metros cuad.">Metros cuad.</option>
              <option value="Hectareas">Hectareas</option>
            </select>
          </div>
          <!-- Medida Frente -->
          <div class="my-1">
            <label class="w-16 ml-2 pl-1 bg-gray-100  text-xs font-bold">Medida del Frente</label>
            <div class="border  border-gray-300  px-1 rounded bg-white">
              <input 
                class="focus:outline-none w-full bg-white px-2"
                v-model="s1_frontSize"
                type="number">
              <span class=" text-xs text-gray-400">{{ s1_frontSize | numberFormat }} metros </span>
            </div>
          </div>
          <!-- Precio -->
          <div class="-mt-px -mt-px flex border border-gray-300 items-center">
            <input v-model="price" type="number" class=" w-full px-3 py-2  placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5 text-right" placeholder="Precio">
            <span class="px-2 text-gray-500">₡</span>
          </div>
        </div>
        <!-- Problems -->
        <p v-if="problems" class="bg-red-300 w-full text-red-600 text-xs my-2 p-2 rounded-sm">
          {{ problems }}
        </p>
        <!-- buttons -->
        <div class="flex w-full justify-between">
          <div>

          </div>
          <button @click="next" class="boton-indigo m-2">
            Siguiente
          </button>
        </div>
        
      </div>
    </div>
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
    problems:""
  }
  },
  filters:{
    numberFormat: function(value){
      let val = (value/1).toFixed(2).replace('.', ',')
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
