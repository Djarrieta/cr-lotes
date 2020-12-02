<template>
  <main>
    <!-- loading -->
    <div v-if="loading" class="flex justify-center items-center opacity-25">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    <div v-if="!loading">
      <!-- Migas de pan -->
      <section class="container mx-auto mt-5">
      </section>

      <!-- Fotos -->
      <section class="lg:flex my-5 md:container mx-auto ">
        <div id="fotos" class="mx-5 lg:w-4/6 flex sm:pb-32 sm:max-h-screen ">
          <ul class="w-1/12">
            <li 
              v-for="foto in info.s8_pictures" 
              :key="foto.title"
              >
              <!-- Imagenes pequeñas -->
              <img
                class="w-full object-cover border rounded-lg md:mb-2 cursor-pointer"
                :src="foto.fileUrl"
                :class="foto.fileUrl===fotoGrande ? ' border-primary' : 'none'"
                :alt="foto.title"
                @click="showPhoto(foto.fileUrl)"
              />
            </li>
          </ul>
          <!-- Imagen Grande -->
          <div class="w-11/12 ml-2 lg:ml-0 lg:px-5  max-h-screen">
            <img :src="fotoGrande" alt="" class="w-full sm:h-full sm:w-auto border object-cover rounded-lg shadow ">
          </div>
        </div>
      
        <!-- Datos -->
        <div class="lg:w-2/6">
          <div class="px-5 pt-5 md:px-10 md:pt-10 mx-5 mt-5 lg:mx-0 md:mt-10 lg:mt-0 rounded-md overflow-hidden border bg-white shadow">
            <h1 class="text-lg font-bold uppercase">{{ info.s1_title }}</h1>
            <p>{{ info.s1_description }}</p>
            <p class="font-medium text-lg text-primary my-2" v-if="info.s1_price">{{ info.s1_price | numberFormat }} ₡</p>
            <p>
              <span class="block"><b>Provincia:</b> {{ info.s2_namePrvSelected }}</span>
              <span class="block"><b>Cantón:</b> {{ info.s2_nameCtnSelected }}</span>
              <span class="block"><b>Distrito:</b> {{ info.s2_nameDttSelected }}</span>
              <span class="block"><b>Dirección:</b> {{ info.s2_address }}</span>
            </p>
            <div class="flex mt-3 border-t-2 pt-2 pb-2 md:pb-8">
              <a :href="'https://api.whatsapp.com/send?text=CR-Lotes%20https://cr-lotes.com/perfil-propiedad/'+info.propId" target="_blank" class="flex-1 text-right" title="Compartir por WhatsApp">
                <i class="fab fa-whatsapp"></i>
              </a>
              <Favorito class="flex-1 text-left pl-10" :propId="info.propId" title="Favorito" />
            </div>
          </div>
        </div>
      </section>

      <!-- Opciones vendedor -->
      <template v-if="ownProp === true">
        <section class="my-5 lg:container m-auto mt-10 py-10 border-b-2 border-t-2">
          <h2 class="mx-5 lg:mx-0 text-2xl font-bold pb-5">Opciones de vendedor</h2>
          <div class="mx-5 lg:mx-0 md:flex md:justify-between space-y-4 md:space-y-0">
            <StatusProp :propId="info.propId"></StatusProp>
            <section><router-link :to="'/publicar/'+ idPropiedad">Editar</router-link></section>
            <StatusVendido :propId="info.propId"></StatusVendido>
            <Subastar :propId="info.propId"></Subastar>
          </div>
        </section>
      </template>

      <!-- mapa -->
      <section class="md:container mx-auto mt-10 py-10">
        <h2 class="mx-5 lg:mx-2 text-2xl font-bold pb-5">Ubicación</h2>
        <GmapMap
        :center="selectedCenter"
        :zoom="selectedZoom"
        mapTypeControl="false"
        streetViewControl="false"
        class="w-full h-64 rounded-lg shadow-lg"
        ref="mapRef"
        >
        <GmapMarker
        :position="selectedCenter"
        :draggable="false"
        ref="GoogleMrkr"
        />
        </GmapMap>
      </section>
      
      <!-- Datos del vendedor -->
      <template v-if="ownProp === true">
        <section class="md:container md:mx-auto mt-10 px-5 lg:px-0 py-10 border-b-2 border-t-2">
            <h2 class="text-2xl font-bold pb-5">Datos del vendedor</h2>
            <div class="lg:mx-0 md:flex justify-between space-y-4 md:space-y-0">
              <span class="block"><b class="text-lg"><i class="fas fa-house-user"></i> Nombre:</b> <br> {{dataVendedor.name}}</span>
              <span class="block"><b class="text-lg"><i class="far fa-envelope"></i> Email:</b> <br> {{dataVendedor.email}}</span>
              <span class="block"><b class="text-lg"><i class="fab fa-whatsapp"></i> WhatsApp:</b> <br> {{dataVendedor.phoneNumber}}</span>
            </div>
        </section>
      </template>
      <!-- datos vendedor -->
      <template v-else>
        <section class="lg:container mx-5 lg:mx-auto my-10 py-10 border-b-2 border-t-2">
          <button @click="datosVendedor" v-if="!showInfoVendedor" 
            class="px-5 py-3 border w-full lg:w-auto border-primary rounded-md text-primary font-medium">
              Ver datos del vendedor
          </button>
          <div v-else>
            <h2 class="text-2xl font-bold">Datos del vendedor</h2>
            <div class="lg:mx-0 md:flex justify-between space-y-4 md:space-y-0">
              <span class="block"><b class="text-lg"><i class="fas fa-house-user"></i> Nombre:</b> <br> {{dataVendedor.name}}</span>
              <span class="block"><b class="text-lg"><i class="far fa-envelope"></i> Email:</b> <br> {{dataVendedor.email}}</span>
              <span class="block"><b class="text-lg"><i class="fab fa-whatsapp"></i> WhatsApp:</b> <br> {{dataVendedor.phoneNumber}}</span>
            </div>
          </div>
        </section>
      </template>
      
      <!-- Detalles propiedad -->
      <section class="lg:container mx-5 lg:mx-auto mt-10 py-10">
        <h2 class="text-2xl font-bold pb-5">Detalles de la propiedad</h2>
        <table class="table-fixed w-full">
          <tbody>
            <tr v-if="info.s2_namePrvSelected" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Provincia</td>
              <td class="p-2">{{info.s2_namePrvSelected}}</td>
            </tr>
            <tr v-if="info.s2_nameDttSelected" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Distrito</td>
              <td class="p-2">{{info.s2_nameDttSelected}}</td>
            </tr>
            <tr  v-if="info.s2_nameCtnSelected" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Cantón</td>
              <td class="p-2">{{info.s2_nameCtnSelected}}</td>
            </tr>
            <tr v-if="info.s1_area" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Área de terreno</td>
              <td class="p-2">{{info.s1_area}} {{ info.s1_areaUn }}</td>
            </tr>
            <tr v-if="info.s6_assets" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">La propiedad cuenta con:</td>
              <td class="p-2">
                <ul class="pl-0">
                  <li v-for="(cuenta, indexCuenta) in info.s6_assets" :key="indexCuenta">{{ cuenta }}</li>
                </ul>
              </td>
            </tr>
            <tr v-if="info.s4_inclination" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Inclinación del terreno:</td>
              <td class="p-2">
              <!-- <img class="h-40 bg-white" :src="'/images/'+info.topografia+'.png'" /> -->
              {{info.s4_inclination}}
              </td>
            </tr>
          </tbody>
        </table>

      </section>
      <!-- documentos -->
      <section v-if="mostrarDocs" class="lg:container mx-5 lg:mx-auto mt-10 py-10 border-t-2">
          <!-- <template v-if="datosUser.uid"> -->
          <h2 class="text-2xl font-bold pb-5">Documentos de la propiedad</h2>
          <table class="table-fixed w-full">
            <tbody>
              <tr v-for="file in info.s7_files" :key="file.code" class="border">
                <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">
                  {{file.title}}
                </td>
                <td class="p-2">
                  <a class="text-primary font-medium" target="_blank" :href="file.fileUrl">
                    <i class="far fa-file-alt"></i> Ver documento
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        <!-- </template> -->
      </section>
    </div>
  </main>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
import Favorito from "@/components/Favorito"
import Swal from 'sweetalert2'
import StatusProp from "@/components/StatusProp"
import StatusVendido from "@/components/StatusVendido"
import Subastar from "@/components/Subastar"
export default {
    name: "PerfilPropiedad",
    components: { Favorito, StatusProp, StatusVendido, Subastar },
    data() {
    return {
      datosUser: "",
      ownProp:false,
      info: [],
      selectedCenter: { lat: 0, lng:0 },
      selectedZoom: 16,
      idPropiedad: '',
      showInfoVendedor: false,
      propsInteres: [],
      dataVendedor: [],
      loading: true,
      fotoGrande: '',
      mostrarDocs: false
    };
  },
  filters: {
    numberFormat: function(value){
      if(value) 
      {
        let val = (value/1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
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
        self.info = docProp.data()
        self.selectedCenter = { lat: docProp.data().s2_lat, lng: docProp.data().s2_lng };
        self.fotoGrande = self.info.s8_pictures[0].fileUrl;
        self.mostrarDocs = self.info.s7_files.length
      }).catch(e=>console.error(e))

    // Capturar datos usuario
    firebase.auth().onAuthStateChanged( user => {
        if(user){
            self.datosUser = user
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
            self.datosUser = ""
        }
    })
  },

  mounted() {
    this.loading = false;
    this.showPhoto()
  },

  methods:{
    activateProp(){
      if(this.info.status==="complete"){
        this.activatePropFirebase("inactive")
      }else if(this.info.status==="inactive"){
        this.activatePropFirebase("complete")
      }
    },

    showPhoto(data) {
      this.fotoGrande = data
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
      if(this.datosUser){
        this.infoVendedor = !this.infoVendedor
        db.collection('users').doc(this.datosUser.uid).update({
            'propsInteres': firebase.firestore.FieldValue.arrayUnion(this.idPropiedad)
        });
      }else{
        Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: 'Debes estar registrado para ver la información del vendedor.',
              showConfirmButton: false,
              timer: 1500
          });
      }

    }

  }
}
</script>
