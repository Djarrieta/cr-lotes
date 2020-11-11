<template>
<!-- Título-->
<div>
    <Buttons @next="next" first="true"/>
    <div  v-if="problems" class="text-sm text-left text-red-600 bg-red-200 border border-red-400 h-12 flex items-center p-4 m-4 rounded-sm" role="alert"> {{problems}} </div>
    <div class="grid sm:grid-cols-2 w-full h-full">
        
        <div class="flex flex-col p-4">
            <!-- Título -->
            <div class="my-1">
                <label class="w-16 ml-2 pl-1 bg-gray-100  text-xs font-bold">Título</label>
                <div class="border  border-gray-300 py-2 px-1 rounded">
                    <input 
                        class="focus:outline-none w-full bg-gray-100 px-2"
                        v-model="s1_title"
                        type="text"
                        placeholder="TÍTULO">
                </div>
               <!-- Descripción -->
            </div>
            <div class="my-1">
                <label class="w-16 ml-2 pl-1 bg-gray-100  text-xs font-bold">Descripción</label>
                <div class="border  border-gray-300 py-2 px-1 rounded">
                    <textarea
                    v-model="s1_description"
                    class="rounded-lg w-full h-32 bg-gray-100 focus:outline-none"
                    style="resize:none"
                    placeholder="Descripción corta"/>

                </div>
            </div>
            <!-- Area -->
            <div class="my-1">
                <label class="w-16 ml-2 pl-1 bg-gray-100  text-xs font-bold">Area</label>
                <div class="border  border-gray-300 py-2 px-1 rounded">
                    <div class="flex">
                        <input 
                            class="focus:outline-none w-full bg-gray-100 px-2"
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
                        class=" text-xs text-gray-400">
                            {{ s1_area | numberFormat }} 
                                <span class=" text-xs text-gray-400" v-if="s1_areaUn=='m²'">metros cuad.</span> 
                                <span class=" text-xs text-gray-400" v-if="s1_areaUn=='ha'">hectareas</span> 
                    </span>
                </div>
            </div>
            <!-- Precio -->
            <div class="my-1">
                <label class="w-16 ml-2 pl-1 bg-gray-100  text-xs font-bold">Precio</label>
                <div class="border  border-gray-300  px-1 rounded">
                    <input 
                        class="focus:outline-none w-full bg-gray-100 px-2"
                        v-model="s1_price"
                        type="number">
                    <span class=" text-xs text-gray-400">{{ s1_price | numberFormat }} ₡ </span>
                </div>
            </div>

        </div>
        <img src="https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Fscott-graham-OQMZwNd3ThU-unsplash.jpg?alt=media&token=a26184f0-4a98-404f-8ec9-16f83f8d5843" alt="FormPicture">
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
  mounted(){
      if(this.data.s1_title){this.s1_title=this.data.s1_title}
      if(this.data.s1_description){this.s1_description=this.data.s1_description}
      if(this.data.s1_area){this.s1_area=this.data.s1_area}
      if(this.data.s1_areaUn){this.s1_areaUn=this.data.s1_areaUn}
      if(this.data.s1_price){this.s1_price=this.data.s1_price}
  },
  computed:{
    emitedData(){
        return {
            s1_title:this.s1_title,
            s1_description:this.s1_description,
            s1_area:this.s1_area,
            s1_areaUn:this.s1_areaUn,
            s1_price:this.s1_price,
        }
    }
  },
  methods:{
      next(){
        this.problems=""
        if(!this.s1_price){this.problems="Precio inválido"}
        if(!this.s1_areaUn){this.problems="TUnidad Área inválida"}
        if(!this.s1_area){this.problems="Área inválida"}
        if(!this.s1_description){this.problems="Descripción inválido"}
        if(!this.s1_title){this.problems="Título inválido"}

        //Emite solo cuando no hay problemas
        if(!this.problems){
            this.$emit("next",this.emitedData)
        }
      },
  }
}
</script>
