<template>
  <div class="w-full" style="height:400px">
      <!-- Título -->
      <div>
        <label class="label ml-2">
          Título
        </label>
        <input 
          v-model="title"
          type="text" 
          class="inputText"
          placeholder="TÍTULO PUBLICACIÓN">
      </div>
      <!-- Descripción -->
      <div>
        <label class="label ml-2">
          Descripción
        </label>
        <textarea
        v-model="description"
          class="rounded-lg w-full h-32"
          style="resize:none"
          placeholder="Descripción corta"/>
      </div>
      <!-- Precio -->
      <div>
        <label class="label ml-2 ">
          Precio
        </label>
        <div class="flex overflow-hidden">
          <input 
            v-model="price"
            class="text-right my-1 ml-1 p-2 rounded-l-full"
            placeholder="0.00"
            type="number">
            <span
              class="bg-white my-1 mr-1 py-2 pr-2 rounded-r-full">₡</span>
        </div>
      </div>
      <!-- Area -->
      <div>
        <label class="label ml-2 ">
          Área
        </label>
        <div class="flex">
          <input 
            v-model="area"
            class="text-right my-1 ml-1 p-2 rounded-l-full"
            type="number"
            placeholder="0">
          <select 
            v-model="unArea"
            class="my-1 mr-1 py-2 pr-2 rounded-r-full">
            <option value="m²">m²</option>
            <option value="ha">ha</option>
          </select>
        </div>
      </div>
      <!-- Problems -->
      <p v-if="problems" class="group relative w-full flex justify-center bg-red-100 text-red-600 font-bold text-lg my-5 p-4 rounded-sm">
        <span class="absolute flex-auto left-0 inset-y-0 flex items-center pl-3">  
          <svg class="h-5 w-5 text-red-600 group-hover:text-red-600 transition ease-in-out duration-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </span>
        <span class="flex-auto ml-6">{{ problems }}</span>
      </p>
      <!-- button -->
      <div class="flex justify-between m-2">
        <div/>
        <button 
          class="boton-indigo"
          @click="next">
            Siguiente</button>
      </div>
  </div>
</template>

<script>
export default {
    name:"Step2",
    props:{},
    data(){
      return{
        title:"title",
        description:"descripción",
        price:1000,
        area:200,
        unArea:"m²",
        problems:""
      }
    },
    computed:{
      dataStep1(){
        return {
          title:this.title,
          description:this.description,
          price:this.price,
          area:this.area,
          unArea:this.unArea
        }
      }
    },
    methods:{
      next(){
        if(!this.title){
          this.problems="Título inválido."
          return
        }
        if(!this.description){
          this.problems="Descripción inválida."
          return
        }
        if(!this.price){
          this.problems="Precio inválido."
          return
        }
        if(!this.area){
          this.problems="Área inválida."
          return
        }
        this.$emit("get-data-step1",this.dataStep1)
      }
    }
}
</script>