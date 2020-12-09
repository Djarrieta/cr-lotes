<template>

  <div class="w-full" id="contenedor">
    <!-- filtros -->
    <div class="container mx-auto py-2 md:flex md:items-center">
        <!-- provincias -->
        <div class="my-1 md:w-1/4">
            <label class="w-16 pl-1 text-base font-bold">Provincia</label>
            <div class="px-1">
                <select 
                    id="selectPrv"
                    class="focus:outline-none w-full py-3 border-2"
                    v-model="s2_idPrvSelected"
                    @change="SelectPrv">
                    <option disabled value="0"
                    class="">Selecciona</option>

                    <option v-for="p in prvs"
                      :key="p.id"
                      :value="{ id: p.id,
                                pos:  p.coordenadas
                              }"> {{ p.provincia }}
                    </option>
                </select>
            </div>
        </div>
        <!-- cantones -->
        <div class="my-1 md:w-1/4">
            <label class="w-16 pl-1 text-base font-bold">Cantón</label>
            <div class="px-1">
                <select 
                    id="selectCtn"
                    class="focus:outline-none w-full py-3 border-2"
                    v-model="s2_idCtnSelected"
                    @change="SelectCtn">
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
        <div class="my-1 md:w-1/4">
            <label class="w-16 pl-1 text-base font-bold">Distrito</label>
            <div class="px-1">
                <select 
                    @change="SelectDtt"
                    id="selectDtt"
                    class="focus:outline-none w-full py-3 border-2"
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
        <!-- Botones -->
        <div class="w-full px-2 mt-5 md:w-1/4 flex justify-between">
          <button @click="clear" class="w-10 border border-primary rounded py-1 bg-white hover:bg-gray-300 font-bold focus:outline-none md:py-2 text-primary mr-1" title="Limpiar filtros"><i class="fas fa-eraser text-primary mr-1"></i></button>
          <button @click="search" class="w-full border border-primary rounded py-1 bg-white hover:bg-gray-300 font-bold focus:outline-none md:py-2 text-primary"><i class="fas fa-sync text-primary mr-1"></i> Refrescar lista</button>
        </div>

    </div>
    <div class="w-full md:flex md:h-full ms:mb-16 overflow-hidden ">
      <!-- Mapa -->
      <div class="relative w-full md:w-1/2 lg:w-1/2 h-64 md:h-auto">
        <!-- Buscar en esta área -->
        <button @click="search" class="hidden md:block absolute bottom-0 z-10 bg-white m-2 rounded-lg border border-primary px-4 py-1 text-primary font-bold"><i class="fas fa-sync text-primary mr-1"></i>Buscar en esta área</button>
        <GmapMap
            class="w-full h-full"
            ref="mapRef"
            :center="center"
            :zoom="zoom"
            
            map-type-id="roadmap"
            :options="{
                mapTypeControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
              }">
            
            <GmapMarker
                v-for="(p,i) in props"                  
                icon="https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FLogoXS.png?alt=media&token=733feece-c24c-4ccc-b346-c75c0f1660a3"
                :key=i
                :position="{lat:p.s2_lat,lng:p.s2_lng}"
                :clickable="true"
                :draggable="false"
                @click="toggleInfoWindow(p, i)"
            /> 
            <gmapInfoWindow 
                :options="infoOptions"
                :position="infoWindowPos"
                :opened="infoWinOpen"
                @closeclick="infoWinOpen=false; selectedMarker=''"
            >
                <div v-html="infoContent"></div>
            </gmapInfoWindow>    
        </GmapMap>
      </div>

      <!-- Cards -->
      <div class="w-full md:w-1/2 lg:w-1/2 h-full overflow-y-scroll text-center">
        <ul v-if="!loading" class="grid grid-cols-1 xl:grid-cols-2 2xl:gap-4 gap-2 gap-y-6 justify-items-stretch">
            <li class="w-full px-1" v-for="(prop, n) in props" :key="n">
                <Card :prop="prop"  :class="selectedMarker == prop.propId ? 'bg-primary' : 'none'"></Card>
            </li>
        </ul>
        <!-- loading -->
        <div v-if="loading" class="flex justify-center items-center opacity-25 mt-4">
          <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
        <!-- Alerta sin resultados -->
        <div v-if="!loading && !props.length" class="bg-red-200 rounded-lg shadow-inner p-2 my-4 text-red-600 text-center">No hay propiedades en venta en esta área. 
        Selecciona otra región con los desplegables o mueve el mapa.</div>
        <!-- see more -->
        <button v-if="props.length && showSeeMore"  @click="searchMore" class="w-3/4 p-2 focus:outline-none bg-gray-200 shadow-inner my-2 mx-auto rounded-full">
          Ver más
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import provincias from "@/assets/provinciasCR.js"
import cantones from "@/assets/cantonesCR.js"
import distritos from "@/assets/distritosCR.js"

import Card from "@/components/Card"
import { db } from "@/main";
export default {
  name:"Home",
  components: { Card },
  data(){
    return{
        props: [],
        inicialLoad:6,
        loadMore:6,

        center:{lat: 10,lng: -83},
        zoom:7,

        s2_idPrvSelected:0,
        s2_idCtnSelected:0,
        s2_idDttSelected:0,
        
        prvs:provincias,
        ctns:[],
        dtts:[],

        infoContent: '',
        infoWindowPos: {
          lat: 0,
          lng: 0
        },
        currentMidx: null,
        infoWinOpen: false,
        //optional: offset infowindow so it visually sits nicely on top of our marker
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
        selectedMarker:"",

        showSeeMore:true,
        loading:true,
    }
  },
  mounted(){
    setTimeout(() => {
      this.search()
    }, 1000); 
  },
  watch:{
        s2_idPrvSelected(newId){
            const lat =Number(newId.pos.split(", ")[0])
            const lng =Number(newId.pos.split(", ")[1])
            this.center={lat,lng}
            this.zoom=10
            
            const e=document.getElementById("selectPrv")
            this.s2_namePrvSelected= e.options[e.selectedIndex].text
        },
        s2_idCtnSelected(newId){
            const lat =Number(newId.pos.split(", ")[0])
            const lng =Number(newId.pos.split(", ")[1])
            this.center={lat,lng}
            this.zoom=12

            const e=document.getElementById("selectCtn")
            this.s2_nameCtnSelected= e.options[e.selectedIndex].text
        },
        s2_idDttSelected(newId){
            const lat =Number(newId.pos.split(", ")[0])
            const lng =Number(newId.pos.split(", ")[1])
            this.center={lat,lng}
            this.zoom=14

            const e=document.getElementById("selectDtt")
            this.s2_nameDttSelected= e.options[e.selectedIndex].text
        },
  },
  methods:{
    toggleInfoWindow: function (marker, idx) {
      this.selectedMarker=marker.propId
      this.flagSearch=false
      this.infoWindowPos = {
          lat: marker.s2_lat,
          lng: marker.s2_lng
        };
      
      this.infoContent = this.getInfoWindowContent(marker);

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
        this.selectedMarker=''
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    getInfoWindowContent: function (marker) {
      let precioFormateado = new Intl.NumberFormat().format(marker.s1_price)
      precioFormateado+= "₡"

      return (
        `<div class="text-center">
          <img class="w-32" src="${marker.s8_pictures[0].fileUrl}">
          <div class="flex justify-between items-center mt-2">
            <p class="font-lg text-md text-orange-600 mb-2">
                    ${ precioFormateado }
            </p>

            <a  href="/perfil-propiedad/${marker.propId}" class="bg-blue-800 rounded-full px-2 text-xs text-gray-100">
              Detalles</a>
          </div>
        </div>
        `
      );
    },
    SelectPrv(){
      this.loading=true
      this.props= []
      this.ctns=[]
      this.dtts=[]
      this.ctns=cantones.filter(c=>c.provincia_id==this.s2_idPrvSelected.id)
      setTimeout(() => {
        this.search()
      }, 1000); 
    },
    SelectCtn(){
      this.loading=true
      
      this.props= []
      this.dtts=[]
      this.dtts=distritos.filter(c=>c.canton_id==this.s2_idCtnSelected.id)

      setTimeout(() => {
        this.search()
      }, 1000); 
    },
    SelectDtt(){
      setTimeout(() => {
        this.search()
      }, 1000); 
    },
    search(){
      this.showSeeMore=true
      this.loading=true
      //establece los límites del mapa
      this.$refs.mapRef.$mapPromise
      .then(map=>{
          let counter=0
          const minLat=map.getBounds().Wa.i
          const maxLat=map.getBounds().Wa.j
          const minLng=map.getBounds().Ra.i
          const maxLng=map.getBounds().Ra.j

          //busca según filtros
          this.props= []
          db.collection('props')
            .orderBy("propId", "desc")
            .where("status","==","complete")
            .get()
            .then((props)=>{
                props.forEach(  prop => {
                    const propLat=prop.data().s2_lat
                    const propLng=prop.data().s2_lng
                    if(
                        propLat <= maxLat && 
                        propLng <= maxLng &&
                        propLat >= minLat &&
                        propLng >= minLng && 
                        counter<this.inicialLoad){
                          this.props.push(prop.data())
                          counter++
                        }
                })
                this.loading=false
            })
          })
    },
    searchMore(){
      this.infoWinOpen = false;
      const lastCod= this.props[this.props.length-1].propId
      this.$refs.mapRef.$mapPromise
      .then(map=>{
          let counter=0
          this.showSeeMore=false
          //establece los límites del mapa
          const minLat=map.getBounds().Wa.i
          const maxLat=map.getBounds().Wa.j
          const minLng=map.getBounds().Ra.i
          const maxLng=map.getBounds().Ra.j

          //busca según filtros
          db.collection('props')
            .orderBy("propId", "desc")
            .where("status","==","complete")
            .startAfter(lastCod)
            .get()
            .then((props)=>{
                props.forEach(  prop => {
                    const propLat=prop.data().s2_lat
                    const propLng=prop.data().s2_lng
                    if(
                        propLat <= maxLat && 
                        propLng <= maxLng &&
                        propLat >= minLat &&
                        propLng >= minLng){
                          this.props.push(prop.data())
                          this.showSeeMore=true
                          if(counter==this.inicialLoad){return}
                          counter++
                        }
                })
                this.loading=false
            })
          })
    },
    selectPin(id){
      this.$router.replace("/perfil-propiedad/" +id)
    },
    clear(){
      this.dtts=[]
      this.ctns=[]
      this.s2_idPrvSelected=0
      this.s2_idCtnSelected=0
      this.s2_idDttSelected=0

      this.zoom=7
      setTimeout(() => {
        this.search()
      }, 1000); 
    }
  }
}
</script>

<style scoped>
  #contenedor {
    height: calc(100vh - 10.2rem);
  }
</style>