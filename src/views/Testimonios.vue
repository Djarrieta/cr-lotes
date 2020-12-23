<template>
  <section class="container mx-auto py-2 md:py-10">
    <h1 class="text-center | text-2xl font-bold uppercase tracking-widest">Testimonios</h1>
    
    <form v-if="esAdmin" @submit.prevent class="w-full | text-left | bg-gray-100 md:shadow-xl rounded-xl | mb-4">
        <div class="md:flex bg-white rounded-lg p-6">
            <label
                class="h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto md:mx-0 md:mr-6 cursor-pointer">
                <img 
                    :src="img"
                    class="object-cover w-full h-full rounded-full shadow-lg">
                <input 
                    type='file' 
                    class="hidden" 
                    id="inpImg"
                    @change="getFiles"
                    accept="image/png, image/jpeg"/>
                <progress
                    v-if="progress"
                    :value="progress"
                    class="w-full"/> 
            </label>
            <div class="text-center md:text-left w-full">
                <input 
                    v-model="name" 
                    type="text"  
                    placeholder="Nombre Apellido"
                    class="w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3"
                    >
                <textarea v-model="testimonio" name="testimonio" id="" rows="3" class="w-full bg-white text-gray-700 border rounded py-3 px-4" placeholder="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam, mollitia ipsa excepturi quos amet reprehenderit iure rem adipisci vero nobis? Facilis laboriosam, temporibus delectus incidunt adipisci voluptas aut ea atque!"></textarea>
                <div class="w-full my-2">
                    <button @click="guardar" class="bg-gray-800 hover:bg-gray-900 text-gray-300 hover:text-gray-100 font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded uppercase tracking-widest">
                        Guardar testimonio {{testimonio.id}}
                    </button>
                </div>
            </div>
        </div>
    </form>
    
    <div v-for="(testimonio, index) in allTestimonios" :key="index" class="md:flex bg-white rounded-lg p-6 my-3 shadow-md">
        <label v-if="flagPosicion != index"  class="h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto md:mx-0 md:mr-6">    
            <img class="object-cover w-full h-full rounded-full shadow-lg" :src="testimonio.foto ? testimonio.foto : 'https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FProfilePic.png?alt=media&token=bdb5182c-1ad1-425e-b754-62fdcec57006'">
        </label>
        <!-- Edición de foto -->
        <label v-if="flagPosicion === index" class="h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto md:mx-0 md:mr-6 cursor-pointer">
            <img 
                :src="imgEditar ? imgEditar : 'https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FProfilePic.png?alt=media&token=bdb5182c-1ad1-425e-b754-62fdcec57006'"
                class="object-cover w-full h-full rounded-full shadow-lg">
            <input 
                type='file' 
                class="hidden" 
                id="inpImgEditar"
                @change="getFilesEditar"
                accept="image/png, image/jpeg"/>
            <progress
                v-if="progressEditar"
                :value="progressEditar"
                class="w-full"/> 
        </label>
        <div class="text-center md:text-left">
            <h2 v-if="flagPosicion != index" class="text-lg">
                {{ testimonio.name }}
            </h2>
            <div v-if="flagPosicion != index" class="text-gray-600">{{ testimonio.testimonio }}</div>
            <div v-if="flagPosicion != index && esAdmin" class="flex">
                <button class="text-red-600 font-bold" @click="eliminar(testimonio.id, index)">Eliminar</button>
                <button class="text-green-600 font-bold ml-5" @click="editar(testimonio.id, index)">Editar</button>
            </div>
            <!-- editar-->
            <form v-if="esAdmin" @submit.prevent class="w-full | text-left | bg-gray-100 rounded-xl | mb-4">
                <div class="text-center md:text-left">
                    <input
                        v-if="flagPosicion === index"
                        v-model="nameEditar" 
                        type="text"  
                        placeholder="Nombre Apellido"
                        class="w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3"
                    >
                    <textarea v-if="flagPosicion === index" v-model="testimonioEditar" name="testimonio" id="" rows="3" class="w-full bg-white text-gray-700 border rounded py-3 px-4" placeholder="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam, mollitia ipsa excepturi quos amet reprehenderit iure rem adipisci vero nobis? Facilis laboriosam, temporibus delectus incidunt adipisci voluptas aut ea atque!"></textarea>
                </div>
            </form>
            <div v-if="flagPosicion === index" class="flex">
                <button class="bg-red-100 text-red-600 | font-bold | px-2 py-1" @click="cancelarEdicion">Cancelar</button>
                <button class="bg-green-100 text-green-600 | font-bold ml-5 | px-2 py-1" @click="editarTestimonio(testimonio.id)">Guardar edición</button>
            </div>
        </div>
    </div>


  </section>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main.js"
import Swal from "sweetalert2";

export default {
    name:"Testimonios",
    data(){
      return{
        name: "",
        nameEditar: "",
        testimonio: "",
        testimonioEditar: "",
        allTestimonios: [],
        flagEditar: -1,
        flagPosicion: -1,
        imgEditar: '',
        img: "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FProfilePic.png?alt=media&token=bdb5182c-1ad1-425e-b754-62fdcec57006",
        progress: 0,
        progressEditar: 0,
        datosUser: '',
        esAdmin: false
      }
    },

    created () {
        let self = this
        firebase.auth().onAuthStateChanged( user => {
            if(user){
                self.datosUser = user
                db.collection("users").doc(this.datosUser.uid).get().then( (dataU) => {
                    if (dataU.data().admin === true){
                        self.esAdmin = true
                    } else {
                        self.esAdmin = false
                    }
                }).catch(e=>console.error(e))
            }else{
                self.datosUser = ""
                self.esAdmin = false
            }
        })
    },

    mounted() {
        let allTestimonios = db.collection('testimonios');
        allTestimonios.onSnapshot(docSnapshot => {
            docSnapshot.docChanges().forEach(change => {
                const { newIndex, oldIndex, doc, type } = change
                if (type === "added") {
                    this.allTestimonios.push({...change.doc.data(), id: change.doc.id})
                }
                if (type === 'modified') {
                    console.log(oldIndex)
                    this.allTestimonios.splice(oldIndex, 1)
                    this.allTestimonios.splice(newIndex, 0, doc.data())
                }
            })
        })
    },

    methods: {
        guardar() {
            db.collection("testimonios").add({
                name: this.name,
                testimonio: this.testimonio,
                foto: this.img
            })
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Testimonio guardado.',
                showConfirmButton: false,
                timer: 1500
            });
        },

        editar(id, posicion) {
            this.flagEditar = id;
            this.flagPosicion = posicion;
            this.nameEditar = this.allTestimonios[posicion].name
            this.testimonioEditar = this.allTestimonios[posicion].testimonio
            this.imgEditar = this.allTestimonios[posicion].foto ? this.allTestimonios[posicion].foto : ''
        },

        cancelarEdicion() {
            this.flagEditar = -1;
            this.flagPosicion = -1;
            this.imgEditar = '';
        },

        editarTestimonio(id) {
            db.collection("testimonios").doc(id).update({name:this.nameEditar, testimonio:this.testimonioEditar, foto:this.imgEditar})
            .then(Swal.fire({
                title: 'Cambios guardados con éxito',
                confirmButtonText: `OK`,
            }))
            .catch(e=>console.error(e));
            this.cancelarEdicion()
        },

        eliminar(id, posicion) {
            Swal.fire({
                title: '¿Quieres borrar este testimonio?',
                showDenyButton: true,
                confirmButtonText: `Borrar`,
                denyButtonText: `No borrar`,
            }).then((result) => {
                if (result.isConfirmed) {
                    db.collection('testimonios').doc(id).delete().catch(e => console.error(e))
                    this.$delete(this.allTestimonios, posicion)
                }
            }).catch(e=>console.error(e))
        },

        getFiles(){
            this.progress = 0.01
            const fileDir = document.getElementById("inpImg").files[0]
            if(!fileDir){return}
            const fileName = `testimonios/${document.getElementById("inpImg").files[0].name}`
            const storageRef = firebase.storage().ref()
            const fileRef = storageRef.child(fileName);
            const uploadTask = fileRef.put(fileDir)

            uploadTask.on("state_changed",
                x=>{
                    this.progress=x.bytesTransferred/x.totalBytes
                },
                e=>console.error(e),
                ()=>{
                    this.progress=0
                    uploadTask.snapshot.ref.getDownloadURL()
                    .then((url)=>{
                        this.img=url
                    })
                })
        },

        getFilesEditar(){
            this.progressEditar = 0.01
            const fileDir = document.getElementById("inpImgEditar").files[0]
            if(!fileDir){return}
            const fileName = `testimonios/${document.getElementById("inpImgEditar").files[0].name}`
            const storageRef = firebase.storage().ref()
            const fileRef = storageRef.child(fileName);
            const uploadTask = fileRef.put(fileDir)

            uploadTask.on("state_changed",
                x=>{
                    this.progressEditar=x.bytesTransferred/x.totalBytes
                },
                e=>console.error(e),
                ()=>{
                    this.progressEditar=0
                    uploadTask.snapshot.ref.getDownloadURL()
                    .then((url)=>{
                        this.imgEditar=url
                    })
                })
        }
    }
}
</script>

<style>

</style>