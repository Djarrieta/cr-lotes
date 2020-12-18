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

      <section id="presentacionPropiedad" class="mx-5 md:container md:mx-auto">
        <h1 class="text-xl font-bold uppercase tracking-widest">{{ info.s1_title }}</h1>
        <div class="flex flex-col md:flex-row md:justify-between">
          <p>
            <span title="Provincia">{{ info.s2_namePrvSelected }}</span> / <span title="Cantón">{{ info.s2_nameCtnSelected }}</span> / <span title="Distrito">{{ info.s2_nameDttSelected }}</span>
          </p>
          <div class="flex">
            <a :href="'https://api.whatsapp.com/send?text=CR-Lotes%20https://cr-lotes.com/perfil-propiedad/'+info.propId" target="_blank" class="text-right" title="Compartir por WhatsApp">
              <i class="fab fa-whatsapp"></i> Compartir por WhatsApp
            </a>
            <Favorito v-if="ownProp === false" class="text-left pl-10" :propId="info.propId" title="Favorito" />
          </div>
        </div>
      </section>

      <!-- Fotos se muestran todas -->
      <section class="md:container mx-auto my-5 | max-w-xs  md:gap-4 | overflow-hidden | bg-white shadow-md rounded-xl relative" :class="[info.s8_pictures.length === 1 ? 'md:grid-rows-1 md:grid-cols-4' : 'md:grid md:grid-rows-2 md:grid-cols-4']">
        <div oncontextmenu="return false" class="row-span-2 col-span-2 | h-48 lg:w-full md:h-128">
          <img :src="info.s8_pictures[0].fileUrl" :alt="info.s8_pictures[0].title" class="object-cover | w-full h-full">
          <div 
            oncontextmenu="return false" 
            class="absolute left-0 top-t5% h-full w-full flex justify-center items-center z-50 opacity-25">
            <img src="https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FLogoXS.png?alt=media&token=733feece-c24c-4ccc-b346-c75c0f1660a3" alt="marca de agua">
            <span class="text-2xl sm:text-5xl text-primary font-bold ml-2">CR-Lotes</span> 
          </div>
        </div>
        <div v-for="(foto, index) in fotos1a5" :key="index">
          <div v-if="foto.fileUrl" oncontextmenu="return false" class="row-span-1 col-span-1 | bg-primary | h-48 md:h-64">
            <img :src="foto.fileUrl" :alt="index" class="object-fill | h-full w-full">
          </div>
          <div v-if="!foto.fileUrl" oncontextmenu="return false" class="row-span-1 col-span-1 | bg-gray-100 | h-48 md:h-64 | grid justify-items-center items-center">
            <div class="flex">
              <img src="https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FLogoXS.png?alt=media&token=733feece-c24c-4ccc-b346-c75c0f1660a3" alt="marca de agua">
              <p class="text-center w-full ml-2 pt-1">
                CR-LOTES
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Ubicación y info principal -->
      <section class="lg:flex my-10 md:container mx-auto" >
        <div class="mx-5 lg:w-4/6">
          <h2 class="mx-5 lg:mx-0 text-2xl font-bold pb-5">Ubicación</h2>
          <GmapMap
          :center="selectedCenter"
          :zoom="selectedZoom"
          mapTypeControl="false"
          :options="{
                  mapTypeControl: false,
                  streetViewControl: false,
                  rotateControl: false,
                  fullscreenControl: false,
                }"
          class="w-full h-64 rounded-lg shadow-lg"
          ref="mapRef"
          >
          <GmapMarker
          :position="selectedCenter"
          :draggable="false"
          icon="https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FLogoXS.png?alt=media&token=733feece-c24c-4ccc-b346-c75c0f1660a3"
          ref="GoogleMrkr"
          />
          </GmapMap>
        </div>
      
        <!-- Datos -->
        <div class="lg:w-2/6">
          <div class="px-5 py-5 md:px-10 md:py-12 mx-5 mt-5 lg:mx-0 md:mt-10 lg:mt-0 | rounded-md border bg-white shadow | overflow-hidden">
            <h1 class="text-lg font-bold uppercase">{{ info.s1_title }}</h1>
            <p>{{ info.s1_description }}</p>
            <!-- <p class="font-medium text-lg text-primary my-2" v-if="info.s1_price">{{ info.s1_price | numberFormat }} ₡</p> -->
            <p class="font-medium text-lg text-primary flex flex-col md:flex md:flex-row md:justify-between my-2">
               <span :class="[info.s1_price_off > 0 ? 'line-through text-primary' : ' text-primary']"> ₡ {{ info.s1_price  | numberFormat }} </span>  
               <span v-if="info.s1_price_off">{{ info.s1_price_off }}% descuento</span>
               <span v-if="info.s1_price_off">₡ {{ Math.round(info.s1_price - ((info.s1_price * info.s1_price_off) / 100)) | numberFormat }}</span>
            </p>
            <p v-if="info.s1_price_alquiler > 0" class="font-medium text-lg text-primary flex flex-col md:flex md:flex-row md:justify-between my-2">
               <span> Precio alquiler mensual: ₡ {{ info.s1_price_alquiler  | numberFormat }} </span>  
            </p>
            <p v-if="!info.s1_price_off">
              <b>Valor por {{ info.s1_areaUn }}:</b> ₡ {{ (info.s1_price/info.s1_area)  | numberFormat }}
            </p>
            <p v-if="info.s1_price_off">
              <b>Valor por {{ info.s1_areaUn }}:</b> 
              ₡ {{ (Math.round(info.s1_price - ((info.s1_price * info.s1_price_off) / 100)) / info.s1_area)  | numberFormat }}
            </p>
            <p>
              <span class="block"><b>Provincia:</b> {{ info.s2_namePrvSelected }}</span>
              <span class="block"><b>Cantón:</b> {{ info.s2_nameCtnSelected }}</span>
              <span class="block"><b>Distrito:</b> {{ info.s2_nameDttSelected }}</span>
              <span class="block"><b>Dirección:</b> {{ info.s2_address }}</span>
            </p>
            <p><span class="font-bold">Esta propiedad la han visto:</span> {{ counterVisitas }} {{ counterVisitas | pluralize(counterVisitas)}}</p>
          
          </div>
        </div>
      </section>

      <!-- Opciones vendedor -->
      <template v-if="ownProp === true">
        <section class="my-5 lg:container m-auto mt-10 py-10 border-t-2">
          <h2 class="mx-5 lg:mx-0 text-2xl font-bold pb-5">Opciones de vendedor</h2>
          <div class="mx-5 lg:mx-0 md:flex md:justify-between space-y-4 md:space-y-0">
            <StatusProp :propId="info.propId"></StatusProp>
            <section><router-link :to="'/publicar/'+ idPropiedad">Editar</router-link></section>
            <StatusVendido :propId="info.propId"></StatusVendido>
            <Subastar :propId="info.propId"></Subastar>
          </div>
        </section>
      </template>

      
      <!-- Datos del vendedor si es propia -->
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
      <!-- datos vendedor públicos -->
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
            <!-- Provincia -->
            <tr v-if="info.s2_namePrvSelected" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Provincia</td>
              <td class="p-2">{{info.s2_namePrvSelected}}</td>
            </tr>
            <!-- Cantón -->
            <tr  v-if="info.s2_nameCtnSelected" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Cantón</td>
              <td class="p-2">{{info.s2_nameCtnSelected}}</td>
            </tr>
            <!-- Distrito -->
            <tr v-if="info.s2_nameDttSelected" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Distrito</td>
              <td class="p-2">{{info.s2_nameDttSelected}}</td>
            </tr>
            <!-- Área> -->
            <tr v-if="info.s1_area" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Área de terreno</td>
              <td class="p-2">{{ info.s1_area | numberFormat }} {{ info.s1_areaUn }}</td>
            </tr>
            <!-- Precio de venta -->
            <tr v-if="info.s1_price" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Precio de venta</td>
              <td class="p-2">
                <span :class="[info.s1_price_off > 0 ? 'line-through text-primary' : 'font-bold']"> ₡{{ info.s1_price  | numberFormat }} </span>  
                <span v-if="info.s1_price_off"> {{ info.s1_price_off }}% descuento</span>
                <span v-if="info.s1_price_off" class="font-bold text-green-700"> ₡{{ Math.round(info.s1_price - ((info.s1_price * info.s1_price_off) / 100)) | numberFormat }}</span>
              </td>
            </tr>
            <!-- Precio de venta -->
            <tr v-if="info.s1_price" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Valor por {{ info.s1_areaUn }}</td>
              <td class="p-2">
                <span v-if="!info.s1_price_off">
                  ₡ {{ (info.s1_price/info.s1_area)  | numberFormat }}
                </span>
                <span v-if="info.s1_price_off">
                  ₡ {{ (Math.round(info.s1_price - ((info.s1_price * info.s1_price_off) / 100)) / info.s1_area)  | numberFormat }}
                </span>
              </td>
            </tr>
            <!-- Precio de alquiler -->
            <tr v-if="info.s1_price_alquiler" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Precio mensual de alquiler</td>
              <td class="p-2">₡{{ info.s1_price_alquiler | numberFormat }}</td>
            </tr>
            <!-- Comodidades -->
            <tr v-if="info.s6_assets" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">La propiedad cuenta con:</td>
              <td class="p-2 flex flex-wrap">
                  <div 
                    v-for="(cuenta, indexCuenta) in info.s6_assets" 
                    :key="indexCuenta"
                    class=" text-xs sm:text-base bg-gray-500  shadow-xs rounded-lg sm:rounded-full mb-1 mx-1 px-1 sm:px-2 text-gray-100 text-center" >
                      {{ cuenta }}</div>
              </td>
            </tr>
            <!-- Inclinación -->
            <tr v-if="info.s4_inclination" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Inclinación del terreno:</td>
              <td class="p-2">
              <img class="h-40" :src="fotoInclinacion" />
              En su mayoría el lote está con {{info.s4_inclination}}
              </td>
            </tr>
            <!-- Nivel -->
            <tr v-if="info.s5_nivel" class="border">
              <td class="font-bold w-2/4 md:w-1/4 bg-gray-200 p-2">Altura de la calle:</td>
              <td class="p-2">
              <img :src="fotoNivel" class="w-32 md:max-w-xs"/>
              En su mayoría el lote está con {{info.s5_nivel}}
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
    props:["infoConfirmacion"],
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
      mostrarDocs: false,
      counterVisitas: 1
    };
  },
  filters: {
    numberFormat: function(value){
      if(value) 
      {
        let val = (value/1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
    },

    pluralize: function(amount) {
       return (amount > 1 || amount === 0) ? 'veces' : 'vez'
    }
  },

  created () { 
    let self = this
    //si este componente está metido dentro de confirmación de publicación cargan datos como props si no las busca en con el id
    if(this.infoConfirmacion){
      this.info = this.infoConfirmacion
      this.selectedCenter = { lat: this.info.s2_lat, lng: this.info.s2_lng };
      this.fotoGrande = this.info.s8_pictures[0].fileUrl;
      this.mostrarDocs = this.info.s7_files.length
      this.loading = false;
    } else {
      //datos propiedad si el componente se abre navegando
      this.idPropiedad = this.$route.params.id;
      let dPropiedad = db.collection("props").doc(this.idPropiedad);
      dPropiedad
        .get()
        .then(docProp=> {
          self.info = docProp.data()
          self.selectedCenter = { lat: docProp.data().s2_lat, lng: docProp.data().s2_lng };
          self.fotoGrande = self.info.s8_pictures[0].fileUrl;
          self.mostrarDocs = self.info.s7_files.length
          // this.visitsCounter()
          if(this.info.counterVisitas) {
            this.counterVisitas = this.info.counterVisitas + 1
            this.idPropiedad = this.$route.params.id;
            let doc = db.collection('props').doc(this.idPropiedad);
            doc.update({
                'counterVisitas': this.counterVisitas
            });
          } else {
            this.idPropiedad = this.$route.params.id;
            let doc = db.collection('props').doc(this.idPropiedad);
            doc.update({
                'counterVisitas': this.counterVisitas
            });
          }
           this.loading = false;
        }).catch(e=>console.error(e))
    }

    

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
    // this.loading = false;
    this.showPhoto()
  },
  computed:{
    fotoInclinacion(){
      //obtener link de imágenes de inclinación
      switch (this.info.s4_inclination){
        case "Inclinación hasta 5 grados":
          return "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_5.jpeg?alt=media&token=77d52d10-1916-459b-aa91-11ddf01a84af"
        case "Inclinación hasta 15 grados":
          return "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_15.jpeg?alt=media&token=5bc66b1e-4635-4cd1-85e5-2dfeee0d4e3d"
        case "Inclinación hasta 30 grados":
          return "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_30.jpeg?alt=media&token=04a358f7-53ab-4702-bc59-878abbc4156a"
        case "Inclinación hasta 45 grados":
          return "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_45.jpeg?alt=media&token=1ea73309-f293-4cc8-978a-04e3fbb6c549"
        case "Inclinación hasta 60 grados":
          return "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_60.jpeg?alt=media&token=bc0f10df-4c4e-44d4-83ca-a46bda5ef60a"
        case "Inclinación hasta 90 grados":
          return "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_90.jpeg?alt=media&token=bd34bcfb-9d2b-4349-b7a9-159891a19625"
        default:
          return ""
      }
    },
      fotos1a5: function () {
        return this.info.s8_pictures.slice(1, 5)
      },
    fotoNivel(){
      //obtener link de imágenes del nivel
      switch (this.info.s5_nivel){
        case "Nivel por encima de la calle":
          return "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Fnivel%2Fnivel_%2B1.jpeg?alt=media&token=acfa1ed1-c1e1-437a-aa55-913ebaa034a9"
        case "Nivel igual al de la calle":
          return "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Fnivel%2Fnivel_0.jpeg?alt=media&token=47ef33c5-bbcb-443c-ab33-efc684033b80"
        case "Nivel por debajo de la calle":
          return "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Fnivel%2Fnivel_-1.jpeg?alt=media&token=65a7a949-44f2-45eb-aea5-b07f0e6d265b"
        default:
          return ""
      }
    }
  },
  methods:{
    visitsCounter(){
      //reporta visita si la propiedad no es propia, si hay usuario y si no se llama el componente desde publicar
      const user = firebase.auth().currentUser;
        if(user && user.uid!=this.info.uid){
          db.collection("visitCounter").add({
            date:firebase.firestore.FieldValue.serverTimestamp(),
            propId:this.info.propId,
            uid:user.uid
          })
        }
    },
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
        this.showInfoVendedor = !this.showInfoVendedor
        db.collection('users').doc(this.datosUser.uid).update({
            'propsInteres': firebase.firestore.FieldValue.arrayUnion(this.idPropiedad)
        });
      } else {
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

<style scoped>
  #fotos {
    max-height: calc(100vh - 8rem);
  }

  #marcaDeAgua {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

</style>