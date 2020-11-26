<template>
  <div class="container mx-auto flex flex-col">
    <div class="grid sm:grid-cols-2 w-full h-full bg-gray-200 rounded-lg shadow-inner p-2 my-4">
        <div class="flex flex-col p-4">
            <!-- provincias -->
            <div class="my-1">
                <label class="w-16 ml-2 pl-1 bg-gray-200  text-xs font-bold">Provincia</label>
                <div class="border  border-gray-300 py-2 px-1 rounded">
                    <select 
                        id="selectPrv"
                        class=" focus:outline-none w-full bg-gray-200"
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
                <label class="w-16 ml-2 pl-1 bg-gray-200  text-xs font-bold">Cantón</label>
                <div class="border  border-gray-300 py-2 px-1 rounded">
                    <select 
                        id="selectCtn"
                        class=" focus:outline-none w-full bg-gray-200"
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
                <label class="w-16 ml-2 pl-1 bg-gray-200  text-xs font-bold">Distrito</label>
                <div class="border  border-gray-300 py-2 px-1 rounded">
                    <select 
                        id="selectDtt"
                        class=" focus:outline-none w-full bg-gray-200"
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
        </div>
        <div class="py-4">
          <GmapMap
              class="w-full h-64 sm:h-full"
              ref="gmap"
              :center="center"
              :zoom="zoom"
              
              map-type-id="roadmap"
              :options="{
                  mapTypeControl: false,
                  streetViewControl: false,
                  rotateControl: false,
                }">
              <GmapMarker
                  v-for="(p,i) in props"                  
                  icon="https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FmarkerMap.png?alt=media&token=85c32ae4-bb15-46b3-915e-fe55c5e2835d"
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
                  @closeclick="infoWinOpen=false"
              >
                  <div v-html="infoContent"></div>
              </gmapInfoWindow>    
          </GmapMap>
        </div>
    </div>
    <!-- Cards -->
    <ul v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-stretch">
        <li class="w-full" v-for="(prop, n) in props" :key="n">
            <Card :prop="prop"></Card>
        </li>
    </ul>
    <!-- loading -->
    <div v-if="loading" class="flex justify-center items-center opacity-25">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
    <!-- Alerta sin resultados -->
    <div v-if="!loading && !props.length" class="bg-red-200 rounded-lg shadow-inner p-2 my-4 text-red-600 text-center">No hay propiedades en venta en esta área. 
    Selecciona otra región con los desplegables o mueve el mapa.</div>
    <!-- see more -->
    <button v-if="props.length && showSeeMore"  @click="searchMore" class="w-full p-2 focus:outline-none">
      Ver más
    </button>
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
        inicialLoad:3,
        loadMore:3,

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

        showSeeMore:true,
        loading:true,
        flagSearch:true,
    }
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
        flagSearch(){
          if(!this.flagSearch){
            setTimeout(() => {
              this.flagSearch=true
            }, 2500);
          }
        }
  },
  mounted(){
    //Escucha cuando cambia el zoom, pero al drag cambia muy rápido, así es que solo ejecuta search a lo sumo cada 1.2s 
    const googleMap=this.$refs.gmap
    let doit=true
    googleMap.$on('bounds_changed', () => {
      if(doit){
        doit=false  
        setTimeout(() => {
          //se muestra primero el componente de cargando
          if(this.flagSearch){
            this.loading=true
            this.props=[]
            this.infoWinOpen = false;
            this.search()
          }
          doit=true
        }, 2000);
      }
    })
  },
  methods:{
    toggleInfoWindow: function (marker, idx) {
      this.flagSearch=false
      this.infoWindowPos = {
          lat: marker.s2_lat,
          lng: marker.s2_lng
        };
      
      this.infoContent = this.getInfoWindowContent(marker);

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },

    getInfoWindowContent: function (marker) {
      return (`<div class="card">${marker.s1_title}</div>`);
    },
    SelectPrv(){
        this.loading=true

        this.props= []
        this.ctns=[]
        this.dtts=[]
        this.ctns=cantones.filter(c=>c.provincia_id==this.s2_idPrvSelected.id)
    },
    SelectCtn(){
        this.loading=true
        
        this.props= []
        this.dtts=[]
        this.dtts=distritos.filter(c=>c.canton_id==this.s2_idCtnSelected.id)
    },
    search(){
      this.showSeeMore=true
      //establece los límites del mapa
      this.$refs.gmap.$mapPromise
      .then(map=>{
          let counter=0
          const minLat=map.getBounds().Wa.i
          const maxLat=map.getBounds().Wa.j
          const minLng=map.getBounds().Sa.i
          const maxLng=map.getBounds().Sa.j

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
      const lastCod= this.props[this.props.length-1].propId
      this.$refs.gmap.$mapPromise
      .then(map=>{
          let counter=0
          this.showSeeMore=false
          //establece los límites del mapa
          const minLat=map.getBounds().Wa.i
          const maxLat=map.getBounds().Wa.j
          const minLng=map.getBounds().Sa.i
          const maxLng=map.getBounds().Sa.j

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
    }
  }
}
</script>
