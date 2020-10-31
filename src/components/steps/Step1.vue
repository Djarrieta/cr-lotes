<template>
<div>
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
export default {
    name:"Step1",
    props:{},
    data(){
      return{
        title:"",
        description:"",
        type:"Lote",
        area:0,
        unArea:"Metros cuad.",
        price:0,
        problems:""
      }
    },
    computed:{
      dataStep1(){
        return {
          title:this.title,
          description:this.description,
          type:this.type,
          area:this.area,
          unArea:this.unArea,
          price:this.price
        }
      }
    },
    methods:{
      next(){
        /* problems */
        if(!this.title) 
        {
          this.problems="Título no válido"
          return
        } 
        if(!this.description) 
        {
          this.problems="Descripción no válida"
          return
        } 
        if(parseInt(this.area)===0) 
        {
          this.problems="Área no válida"
          return
        } 
        if(parseInt(this.price)===0) 
        {
          this.problems="Precio no válido"
          return
        } 
        this.$emit("send-step1",this.dataStep1)
      }
    }    
}
</script>