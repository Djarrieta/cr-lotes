<template>
    <main>
    <!-- Migas de pan -->
    <section class="container mx-auto mt-5">
    </section>

    <section class="lg:flex my-5 container m-auto">
      <!-- Fotos -->
      <div id="fotos" class="lg:w-3/6 object-center">
        <ul class="" id="slideshowFotos">
          <li v-for="foto in info.s8_pictures" :key="foto.title">
            <img
            class="w-full h-40 object-scale-down"
            :src="foto.fileUrl"
            :alt="foto.title"
            />
          </li>
        </ul>
        <!-- botones -->
        <div v-if="ownProp"  class="flex justify-center">
          <button @click="activateProp" class="rounded p-2 m-2 text-gray-400 bg-gradient-to-t from-gray-600 to-gray-700 shadow-sm hover:shadow-md hover:text-white">{{info.status==="complete" ? "Inactivar" : "Activar"}} </button>
          <router-link :to="'/publicar/'+ idPropiedad" class="rounded p-2 m-2 text-gray-400 bg-gradient-to-t from-gray-600 to-gray-700 shadow-sm hover:shadow-md hover:text-white">Editar</router-link>
        </div>
      </div>

      <!-- Datos -->
      <div class="lg:w-3/6 lg:ml-10">
        <div class="rounded overflow-hidden shadow-lg px-10 py-10">

          <Favorito :propId="info.propId" />

          <h1 class="text-lg uppercase">{{ info.s1_title }} - {{info.propId}}</h1>
          <p>{{ info.s1_description }}</p>
          <p>
            <span class="block"><b>Provincia:</b> {{ info.s2_namePrvSelected }}</span> 
            <span class="block"><b>Cantón:</b> {{ info.s2_nameCtnSelected }}</span>
            <span class="block"><b>Distrito:</b> {{ info.s2_nameDttSelected }}</span>
            <span class="block"><b>Dirección:</b> {{ info.s2_address }}</span>
            <span class="block"><b>Precio:</b> {{ info.s1_price | precio }}</span>
          </p>
          <h3 class="block text-lg">Esta propiedad cuenta con:</h3>
            <ul class="grid grid-cols-3 gap-x-4 gap-y-2">
              <li class="min-h-8 px-2 bg-gray-200 py-2" v-for="contaran in info.s6_assets" :key="contaran">
                {{ contaran }}
              </li>
            </ul>
        </div>
      </div>
    </section>

    <!-- Datos del vendedor -->
    <section class="container mx-auto mt-10 rounded shadow-lg px-10 py-10 bg-gray-200">
        <button @click="datosVendedor" v-if="!showInfoVendedor">Datos del vendedor</button>
        <div v-else>
          <h2>Datos del vendedor</h2>
          <div class="flex">
            <span>Nombre: {{dataVendedor.nombre}}</span>
            <span>Email: {{dataVendedor.email}}</span>
            <span>WhatsApp: {{dataVendedor.phoneNumber}}</span>
          </div>
        </div>
    </section>

    <!-- mapa -->
    <section class="container mx-auto mt-10">
      <GmapMap
              :center="selectedCenter"
              :zoom="selectedZoom"
              mapTypeControl="false"
              streetViewControl="false"
              class="w-full h-64"
              ref="mapRef"
            >
              <GmapMarker
                :position="selectedCenter"
                :draggable="false"
                ref="GoogleMrkr"
              />
            </GmapMap>
    </section>

    <!-- Detalles -->
    <section class="container mx-auto mt-10">
      <ul>
        <li class=""><a href="">Detalles</a></li>
        <li><a href="">Documentos</a></li>
      </ul>
      <ul class="">
        <li class="">
          <table class="">
            <tbody>
                <tr v-if="info.s2_namePrvSelected">
                    <td class="font-bold">Provincia</td>
                    <td>{{info.s2_namePrvSelected}}</td>
                </tr>
                <tr v-if="info.s2_nameDttSelected">
                    <td class="font-bold">Distrito</td>
                    <td>{{info.s2_nameDttSelected}}</td>
                </tr>
                <tr  v-if="info.s2_nameCtnSelected">
                    <td class="font-bold">Cantón</td>
                    <td>{{info.s2_nameCtnSelected}}</td>
                </tr>
                <tr v-if="info.s1_area">
                  <td class="font-bold">Área de terreno</td>
                  <td>{{info.s1_area}} {{ info.s1_areaUn }}</td>
                </tr>
                <tr v-if="info.s6_assets">
                  <td class="font-bold">La propiedad cuenta con:</td>
                  <td>
                    <ul class="pl-0">
                      <li v-for="(cuenta, indexCuenta) in info.s6_assets" :key="indexCuenta">{{ cuenta }}</li>
                    </ul>
                  </td>
                </tr>
                <tr v-if="info.s4_inclination">
                  <td class="font-bold">Inclinación del terreno:</td>
                  <td>
                    <!-- <img class="h-40 bg-white" :src="'/images/'+info.topografia+'.png'" /> -->
                    {{info.s4_inclination}}
                  </td>
                </tr>
            </tbody>
        </table>
        </li>
        <li>
          <table class="">
            <tbody>
              <tr v-for="file in info.s7_files" :key="file.code">
                <td>
                  {{file.title}}
                </td>
                <td>
                  <a class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 ml-5 rounded" target="_blank" :href="file.fileUrl">Ver documento</a>
                </td>
              </tr>
            </tbody>
          </table>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
import Favorito from "@/components/Favorito"
import Swal from 'sweetalert2'
export default {
    name: "PerfilPropiedad",
    components: { Favorito },
    data() {
    return {
      datosUser: "",
      ownProp:false,
      info: [],
      selectedCenter: { lat: 0, lng:0 },
      selectedZoom: 14,
      idPropiedad: '',
      showInfoVendedor: false,
      propsInteres: [],
      dataVendedor: []
    };
  },
  filters: {
    precio: function(value){
      let precioFormateado = new Intl.NumberFormat().format(value)
      return precioFormateado + "₡"
    }
  },
  created () {
    let self = this
    //datos propiedad
    this.idPropiedad = this.$route.params.id;
    let dPropiedad = db.collection("props").doc(this.idPropiedad);
    dPropiedad
      .get()
      .then(docProp=> {
        self.info =docProp.data()
        self.selectedCenter = { lat: docProp.data().s2_lat, lng: docProp.data().s2_lng };
      }).catch(e=>console.error(e))

    // Capturar datos usuario
    firebase.auth().onAuthStateChanged(user=>{
        if(user){
            self.datosUser=user
            db.collection("users").doc(this.datosUser.uid).get().then(userInfo=>{
                //es propia?
                if (self.info.uid===self.datosUser.uid){
                  self.ownProp=true
                }else{
                  self.ownProp=false
                }
                //marcada como propiedad de interes
                const propsInteres=userInfo.data().propsInteres
                if(propsInteres && propsInteres.includes(this.idPropiedad)){
                  self.showInfoVendedor=true
                }
                //datos del vendedor
                db.collection("users")
                  .doc(self.info.uid)
                  .get()
                  .then(x=>self.dataVendedor=x.data())
            }).catch(e=>console.error(e))
        }else{
            self.datosUser=""
        }
    })
  },

  methods:{
    activateProp(){
      if(this.info.status==="complete"){
        this.activatePropFirebase("inactive")       
      }else if(this.info.status==="inactive"){
        this.activatePropFirebase("complete")
      }
    },
    
    activatePropFirebase(newStatus){
      Swal.fire({
        title: '¿Estás seguro que quieres modificar el estado de la propiedad?',
        text:"Si está inactiva no será visible para los compradores. Inactívala cuando la hayas vendido.",
        showDenyButton: true,
        confirmButtonText: `Modificar`,
        denyButtonText: `No modificar`,
      }).then((result)=>{
        if (result.isConfirmed){
          const ref=db.collection("props").doc(this.idPropiedad.toString())
          ref.update({status:newStatus}).then(()=>{
            this.info.status=newStatus
          }).then(()=>{
            Swal.fire('Guardado!', '', 'success')
          }).catch((e)=>{
            console.log(e)
            Swal.fire('No se guardaron los cambios.', '', 'info')
          })
        }else{
          Swal.fire('No se guardaron los cambios.', '', 'info')
        }
      })
    },
    datosVendedor() {
      this.infoVendedor = !this.infoVendedor
      db.collection('users').doc(this.datosUser.uid).update({
          'propsInteres': firebase.firestore.FieldValue.arrayUnion(this.idPropiedad)
      });
    }

  }
}
</script>
