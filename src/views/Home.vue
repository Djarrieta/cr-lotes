<template>

  <div class="w-full" id="contenedor">
    <!-- filtros -->
    <div class="container py-2 mx-auto md:flex md:items-center">
        <!-- provincias -->
        <div class="my-1 md:w-1/4">
            <label class="w-16 pl-1 text-base font-bold">Provincia</label>
            <div class="px-1">
                <select 
                    id="selectPrv"
                    class="w-full py-3 border-2 focus:outline-none focus:shadow-outline"
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
                    class="w-full py-3 border-2 focus:outline-none focus:shadow-outline"
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
                    class="w-full py-3 border-2 focus:outline-none focus:shadow-outline"
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
        <div class="flex justify-between w-full px-2 mt-5 md:w-1/4">
          <button @click="clear" class="w-10 py-1 mr-1 font-bold bg-white border rounded border-primary hover:bg-gray-300 focus:outline-none md:py-2 text-primary" title="Limpiar filtros"><i class="mr-1 fas fa-eraser text-primary"></i></button>
          <button @click="search" class="w-full py-1 font-bold bg-white border rounded border-primary hover:bg-gray-300 focus:outline-none md:py-2 text-primary"><i class="mr-1 fas fa-sync text-primary"></i> Refrescar lista</button>
        </div>

    </div>
    
    <div class="flex flex-col-reverse w-full overflow-hidden md:flex md:flex-row md:h-full ms:mb-16 ">
        <!-- Cards -->
        <div class="w-full md:w-1/2 lg:w-1/2 | h-full  overflow-y-scroll | text-center">
          <!-- <ul v-if="!loading" class="grid grid-cols-1 gap-2 xl:grid-cols-2 2xl:gap-4 gap-y-6 justify-items-stretch"> -->
          <ul v-if="!loading" class="grid grid-cols-1 gap-2 gap-y-6 justify-items-stretch xl:px-5">
              <li class="w-full px-1" v-for="(prop, n) in props" :key="n">
                  <CardHorizontal 
                  @mouseenter="locateMarker(prop.propId)"
                  @locateMarker="locateMarker(prop.propId)" :prop="prop"  :class="selectedMarker == prop.propId ? 'bg-primary' : 'none'"></CardHorizontal>
              </li>
          </ul>
          <!-- loading -->
          <div v-if="loading" class="flex items-center justify-center w-full h-full opacity-25">
            <div class="w-32 h-32 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
          </div>
          <!-- Alerta sin resultados -->
          <div v-if="!loading && !props.length" class="p-2 my-4 text-center text-red-600 bg-red-200 rounded-lg shadow-inner">No hay propiedades en venta en esta área. 
          Selecciona otra región con los desplegables o mueve el mapa.</div>
          <!-- see more -->
          <button v-if="props.length && showSeeMore"  @click="searchMore" class="w-3/4 p-2 mx-auto my-2 bg-gray-200 rounded-full shadow-inner focus:outline-none">
            Ver más
          </button>
        </div>

        <!-- Mapa -->
        <div class="relative w-full h-64 md:w-1/2 lg:w-1/2 md:h-auto">
          <!-- Buscar en esta área -->
          <button @click="search" class="absolute bottom-0 z-10 hidden px-4 py-1 m-2 font-bold bg-white border rounded-lg md:block border-primary text-primary"><i class="mr-1 fas fa-sync text-primary"></i>Buscar en esta área</button>
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
                  :icon= p.markerIcon
                  :label="{
                    text: p.formatedPrice,
                    color: '#E61E50',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    
                  }"
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
    </div>

  </div>
</template>
<script>
import provincias from "@/assets/provinciasCR.js"
import cantones from "@/assets/cantonesCR.js"
import distritos from "@/assets/distritosCR.js"

import CardHorizontal from "@/components/CardHorizontal"
import { db } from "@/main";
export default {
  name:"Home",
  components: { CardHorizontal },
  data(){
    return{
        props: [],
        inicialLoad:4,
        loadMore:4,

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
        selectedCard:"",

        showSeeMore:true,
        loading:true,
    }
  },
  mounted(){
    setTimeout(() => {
      this.search()
    }, 1000); 
  },
  filters: {
      numberFormat: function(value){
        let val = (value/1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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
    selectedCard(newId){
      this.props.forEach((p,i)=>{
        if(p.propId===newId){
          this.props[i].markerIcon="https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FMapMarkerSelected.png?alt=media&token=a7f53c7b-4052-4ca2-b36a-ecdaf54f1b11"
        }else{
          this.props[i].markerIcon="https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FMapMarker.png?alt=media&token=3996fc92-9f31-4b7e-b47e-1ce17f887377"
        }
      })
    }
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
      const priceUn=this.formatPrice(marker.s1_price/marker.s1_area).toString()+"/"+marker.s1_areaUn

      return (
        
        `<div class="text-center">
          <img class="w-32" src="${marker.s8_pictures[0].fileUrl}">
          <div class="flex items-center justify-between mt-2">
            <div class="flex flex-col mr-2">
              <p class="mb-2 font-lg text-md text-primary">
                      ${ this.formatPrice(marker.s1_price) }
              </p>
              <p class="mb-2 font-lg text-md text-primary">
                      ${ priceUn }
              </p>
            </div>
            <a target="_blank" href="/perfil-propiedad/${marker.propId}" class="px-2 text-xs text-gray-100 bg-blue-800 rounded-full">
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
        document.getElementById("selectCtn").focus();
      }, 1000); 
      
    },
    SelectCtn(){
      this.loading=true
      this.props= []
      this.dtts=[]
      this.dtts=distritos.filter(c=>c.canton_id==this.s2_idCtnSelected.id)

      setTimeout(() => {
        this.search()
        document.getElementById("selectDtt").focus();
      }, 1000); 
    },
    SelectDtt(){
      setTimeout(() => {
        this.search()
      }, 1000); 
    },
    formatPrice(price){
      let precioFormateado = new Intl.NumberFormat().format(price)
      precioFormateado+= "₡"
      return precioFormateado
    },
    search(){
      this.showSeeMore=true
      this.loading=true
      //establece los límites del mapa
      this.$refs.mapRef.$mapPromise
      .then(map=>{
          let counter=0
          const limitsObject=map.getBounds()
          
          const minLat=Object.entries(limitsObject)[0][1].i
          const maxLat=Object.entries(limitsObject)[0][1].j
          const minLng=Object.entries(limitsObject)[1][1].i
          const maxLng=Object.entries(limitsObject)[1][1].j

          //busca según filtros
          this.props= []
          db.collection('props')
            .orderBy("propId", "desc")
            .where("status","==","En venta")
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
                          this.props.push({
                            ...prop.data(),
                            formatedPrice:this.formatPrice(prop.data().s1_price),
                            markerIcon:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FMapMarker.png?alt=media&token=3996fc92-9f31-4b7e-b47e-1ce17f887377"})
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
          
          const limitsObject=map.getBounds()
          
          const minLat=Object.entries(limitsObject)[0][1].i
          const maxLat=Object.entries(limitsObject)[0][1].j
          const minLng=Object.entries(limitsObject)[1][1].i
          const maxLng=Object.entries(limitsObject)[1][1].j

          //busca según filtros
          db.collection('props')
            .orderBy("propId", "desc")
            .where("status","==","En venta")
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
                          this.props.push({
                            ...prop.data(),
                            formatedPrice:this.formatPrice(prop.data().s1_price),
                            markerIcon:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FMapMarker.png?alt=media&token=3996fc92-9f31-4b7e-b47e-1ce17f887377"})
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
    },
    locateMarker(propId){
      this.selectedCard=propId
        
        /* const lat =Number(newId.pos.split(", ")[0])
        const lng =Number(newId.pos.split(", ")[1])
        this.center={lat,lng} */
        /* this.zoom=14 */
    }
  }
}
</script>

<style scoped lang="postcss">
  #contenedor {
    height: calc(100vh - 10.2rem);
  }
</style>