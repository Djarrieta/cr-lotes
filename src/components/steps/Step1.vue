<template>
  <div class="grid grid-cols-1 sm:grid-cols-2">
    <div >
<!-- -- provincias -- -->
        <div class="mr-10">
          <label class="label ml-2 ">
            Provincia 
          </label>
          <div class="flex">
            <select 
              v-model="provSelected"
              class="my-1 mr-1 py-2 p-2 rounded-full  w-full">
                <option 
                  v-for="prv in prvs"
                  :key="prv.id"
                  :value="prv.id"> {{ prv.provincia }} </option>
            </select>
          </div>
        </div>
<!-- -- Cantones -- -->
        <div class="mr-10">
          <label class="label ml-2 ">
            Cantón
          </label>
          <select 
            v-model="ctnSelected"
            class="my-1 mr-1 py-2 p-2 rounded-full  w-full">
              <option 
                v-for="ctn in ctns"
                :key="ctn.id"
                :value="ctn.id"> {{ ctn.canton }} </option>
          </select>
        </div>
        <!-- -- Distrito -- -->
        <div class="mr-10">
          <label class="label ml-2 ">
            Distrito
          </label>
          <select 
            v-model="dttSelected"
            class="my-1 mr-1 py-2 p-2 rounded-full  w-full">
              <option 
                v-for="dtt in dtts"
                :key="dtt.id"
                :value="dtt.id"> {{ dtt.distrito }} </option>
          </select>
        </div> 
        <!-- -- Dirección -- -->
       <div class="mr-10">
          <label class="label ml-2 ">
            Dirección
          </label>
          <input 
            class="inputText w-full"
            v-model="dir"
            placeholder="Dirección"
            type="text">
        </div> 
    </div>
    <GoogleMap
        class="w-full"
        :center="center"
        :zoom="zoomS"
        :clickActive="true"
        :getLatLng="true"
        :mapType="'roadmap'"
        :moveActive="false"
        :markers="markers"
      />
  </div>
  <!-- -- Problems -- -->
  <p v-if="problems" class="group relative w-full flex justify-center bg-red-100 text-red-600 font-bold text-lg my-5 p-4 rounded-sm">
    <span class="absolute flex-auto left-0 inset-y-0 flex items-center pl-3">  
      <svg class="h-5 w-5 text-red-600 group-hover:text-red-600 transition ease-in-out duration-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    </span>
    <span class="flex-auto ml-6">{{ problems }}</span>
  </p> 
  <!-- -- button -- -->
  <div class="flex justify-between m-2">
    <button 
      class="boton-indigo"
      @click="prev">
        Anterior</button>
    <button 
      class="boton-indigo"
      @click="next">
        Siguiente</button>
  </div>
</template>

<script>
import provincias from "@/assets/provinciasCR.js"
import cantones from "@/assets/cantonesCR.js"
import distritos from "@/assets/distritosCR.js" 

export default {
    name:"Step1",
     data(){
      return{
        provincias:[],
        provSelected:0,
        ctnSelected:0,
        dttSelected:0,
        dir:"",
        prvs:[],
        ctns:[],
        dtts:[],
        center:{ lat: 10.0159394, lng: -84.21417009999999 },
        zoomS:7,
        problems:"",
        markers:[
          {
            lat: 10,
            lng: -83,
            draggable: true,
            title: 'title 1',
          },
        ]
      }
    },
    created(){
      this.prvs=provincias
    },
    watch:{
      provSelected:function(newProvId){
        console.log(newProvId)
        //Inicia en cero
        this.dtts=[]
        //filtra cantones
        this.ctns=cantones.filter(x=>x.provincia_id==newProvId)

        


/*         cantones.forEach(x=> {
          if(x.provincia_id==newProvCodigo){
            this.ctns.push(x)
          }
        }) */
        /* centro del mapa */
/*         const latitud=this.prvs[newProvValue-1].coordenadas.split(", ")[0]
        const longitud=this.prvs[newProvValue-1].coordenadas.split(", ")[1]
        this.center={ lat:latitud, lng:longitud },
        this.zoom=10 */

      },
      ctnSelected:function(newCtnValue){
        
        console.log(this.ctns[newCtnValue-1])
        console.log(distritos)
        //Inicia en cero
        //this.dtts=[]
        //filtra cantones
/*         distritos.forEach(x=> {
          if(x.canton_id==newCtnValue){
            this.dtts.push(x)
          }
        }) */
        /* centro del mapa */
/*         const latitud=this.ctns[newCtnValue-1].coordenadas.split(", ")[0]
        const longitud=this.ctns[newCtnValue-1].coordenadas.split(", ")[1]
        this.center={ lat:latitud, lng:longitud },
        this.zoom=15 */
      }
    },
    computed:{
      dataStep1(){
        return {
          s:"hola"
        }
      }
    },
    methods:{
      prev(){
        this.zoomS=5
        console.log(this.zoomS)
      }
    }
    /* methods:{
      next(){
        if(!this.title){
          this.problems="Título inválido."
          return
        }
        this.$emit("get-data-step1",this.dataStep1)
      }
    } */
} 
</script>