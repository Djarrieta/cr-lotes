<template>
<!-- ubicación -->
<div>
    <Buttons @next="next" @prev="prev"/>
    <div  v-if="problems" class="text-sm text-left text-red-600 bg-red-200 border border-red-400 h-12 flex items-center p-4 m-4 rounded-sm" role="alert"> {{problems}} </div>
    <div class="grid sm:grid-cols-2 w-full h-full">
        <div class="flex flex-col p-4">
            <!-- provincias -->
            <div class="my-1">
                <label class="w-16 ml-2 pl-1 bg-gray-100  text-xs font-bold">Provincia</label>
                <div class="border  border-gray-300 py-2 px-1 rounded bg-white">
                    <select 
                        id="selectPrv"
                        class=" focus:outline-none w-full bg-white"
                        v-model="s2_idPrvSelected"
                        @click="SelectPrv">
                        <option disabled value="0"
                        class="">Selecciona</option>

                        <option v-for="p in prvs"
                            :key="p.id"
                            :value="{id:p.id,
                            pos:p.coordenadas}">{{ p.provincia }}</option>
                    </select>
                </div>
            </div>
            <!-- cantones -->
            <div class="my-1">
                <label class="w-16 ml-2 pl-1 bg-gray-100  text-xs font-bold">Cantón</label>
                <div class="border  border-gray-300 py-2 px-1 rounded bg-white">
                    <select 
                        id="selectCtn"
                        class=" focus:outline-none w-full  bg-white"
                        v-model="s2_idCtnSelected"
                        @click="SelectCtn">
                        <option disabled value="0"
                        class="">Selecciona</option>
                        <option v-for="p in ctns"
                            :key="p.id"
                            :value="{id:p.id,
                            pos:p.coordenadas}">{{ p.canton }}</option>
                    </select>
                </div>
            </div>
            <!-- distritos -->
            <div class="my-1">
                <label class="w-16 ml-2 pl-1 bg-gray-100  text-xs font-bold">Distrito</label>
                <div class="border  border-gray-300 py-2 px-1 rounded bg-white">
                    <select 
                        id="selectDtt"
                        class=" focus:outline-none w-full  bg-white"
                        v-model="s2_idDttSelected">
                        <option disabled value="0"
                        class="">Selecciona</option>
                        <option v-for="p in dtts"
                            :key="p.id"
                            :value="{id:p.id,
                            pos:p.coordenadas}">{{ p.distrito }}</option>
                    </select>
                </div>
            </div>
            <!-- Dirección -->
            <div class="my-1">
                <label class="w-16 ml-2 pl-1 bg-gray-100  text-xs font-bold">Dirección</label>
                <div class="border  border-gray-300 py-2 px-1 rounded bg-white">
                    <input 
                        class="focus:outline-none w-full  bg-white px-2"
                        v-model="s2_address"
                        type="text"
                        placeholder="Cl 12#34-56">
                </div>
            </div>
            <!-- Coordenadas -->
            <div class="my-1">
                <label class="w-16 ml-2 pl-1 bg-gray-100  text-xs font-bold">Coordenadas</label>
                <div class="border  border-gray-300 py-2 px-1 rounded flex flex-col  bg-white">
                    <span class="text-gray-500 pl-2">Latitud {{center.lat}} </span>
                    <span class="text-gray-500 pl-2">Longitud {{center.lng}}</span>
                </div>
            </div>
        </div>
        <GmapMap
            class="w-full h-64 sm:h-full"
            ref="mapRef"
            :center="center"
            :zoom="zoom"
            map-type-id="roadmap"
            :options="{
                mapTypeControl: false,
                streetViewControl: false,
                rotateControl: false,}">
            <GmapMarker
                :position="center"
                :clickable="true"
                :draggable="true"
                @dragend="getMarkerPosition($event.latLng)"
            />
        </GmapMap>
    </div>

</div>
</template>

<script>
import provincias from "@/assets/provinciasCR.js"
import cantones from "@/assets/cantonesCR.js"
import distritos from "@/assets/distritosCR.js"
import Buttons from "@/components/steps/Buttons"

export default {
  name: 'Step2',
  components:{Buttons},
  props:["data"],
  data(){
    return{
      center:{lat: 10,lng: -83},
      zoom:7,
      prvs:provincias,
      s2_idPrvSelected:0,
      s2_namePrvSelected:"",
      ctns:[],
      s2_idCtnSelected:0,
      s2_nameCtnSelected:"",
      dtts:[],
      s2_idDttSelected:0,
      s2_nameDttSelected:"",
      s2_address:"",
      problems:""
    }
  },
  mounted(){
      if(this.data.s2_idPrvSelected)
        {
            const p=provincias.filter(p=>p.id==this.data.s2_idPrvSelected)[0]
            this.s2_idPrvSelected={
                id:p.id,
                pos:p.coordenadas
            }
            this.SelectPrv()        
        }
      if(this.data.s2_idCtnSelected)
        {
            const c=cantones.filter(c=>c.id==this.data.s2_idCtnSelected)[0]
            this.s2_idCtnSelected={
                id:c.id,
                pos:c.coordenadas
            }
            this.SelectCtn()
        }
      if(this.data.s2_idDttSelected){
            const d=distritos.filter(d=>d.id==this.data.s2_idDttSelected)[0]
            this.s2_idDttSelected={
                id:d.id,
                pos:d.coordenadas
            }
      }

      if(this.data.s2_address){
          this.s2_address=this.data.s2_address
      }
  },
  computed:{
    dataStep2(){
        return {
            s2_idPrvSelected:this.s2_idPrvSelected.id,
            s2_namePrvSelected:this.s2_namePrvSelected,
            s2_idCtnSelected:this.s2_idCtnSelected.id,
            s2_nameCtnSelected:this.s2_nameCtnSelected,
            s2_idDttSelected:this.s2_idDttSelected.id,
            s2_nameDttSelected:this.s2_nameDttSelected,
            s2_address:this.s2_address,
            s2_lat:this.center.lat,
            s2_lng:this.center.lng
        }
    }
  },
  
  watch:{
      s2_idPrvSelected(newId){
          const lat =Number(newId.pos.split(", ")[0])
          const lng =Number(newId.pos.split(", ")[1])
          this.center={lat,lng}
          this.zoom=10
          
          const p=provincias.filter(p=>p.id==this.data.s2_idPrvSelected)[0]
            if(p){
                this.s2_namePrvSelected= p.provincia
            }else{
                const e=document.getElementById("selectPrv")
                this.s2_namePrvSelected= e.options[e.selectedIndex].text
            }  
      },
      s2_idCtnSelected(newId){
          const lat =Number(newId.pos.split(", ")[0])
          const lng =Number(newId.pos.split(", ")[1])
          this.center={lat,lng}
          this.zoom=12

            const c=cantones.filter(c=>c.id==this.data.s2_idCtnSelected)[0]
            if(c){
                this.s2_nameCtnSelected= c.canton
            }else{
                const e=document.getElementById("selectCtn")
                this.s2_nameCtnSelected= e.options[e.selectedIndex].text
            }  

      },
      s2_idDttSelected(newId){
          const lat =Number(newId.pos.split(", ")[0])
          const lng =Number(newId.pos.split(", ")[1])
          this.center={lat,lng}
          this.zoom=14
            const d=distritos.filter(d=>d.id==this.data.s2_idDttSelected)[0]
            if(d){
                this.s2_nameDttSelected= d.distrito
            }else{
                const e=document.getElementById("selectDtt")
                this.s2_nameDttSelected= e.options[e.selectedIndex].text
            } 
      },
        problems:function(){
            setTimeout(() => {
                this.problems=""
            }, 2000);
        }

  },

  methods:{
    next(){
        this.problems=""
        if(!this.s2_address){this.problems="Dirección inválida"}
        if(!this.s2_nameDttSelected){this.problems="Distrito Inválido"}
        if(!this.s2_nameCtnSelected){this.problems="Cantón Inválido"}
        if(!this.s2_namePrvSelected){this.problems="Provincia Inválida"}

        //Emite solo cuando no hay problemas
        if(!this.problems){
            this.$emit("next",this.dataStep2)
        }
    },
    prev(){
        this.$emit("prev",this.dataStep2)
    },
    SelectPrv(){
        this.ctns=[]
        this.dtts=[]
        this.ctns=cantones.filter(c=>c.provincia_id==this.s2_idPrvSelected.id)
    },
    SelectCtn(){
        this.dtts=[]
        this.dtts=distritos.filter(c=>c.canton_id==this.s2_idCtnSelected.id)
    },
    getMarkerPosition(obj){
      this.center={
        lat: obj.lat(),
        lng: obj.lng()
      }
    },
  }
}
</script>
