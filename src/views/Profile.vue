<template>
    <div class="container mx-auto">
        <section class="grid md:grid-cols-2 mt-10 md:m-2 w-full">
            <label
                class="flex flex-col w-full px-5 py-5 md:w-2/3 m-auto items-center justify-center text-center cursor-pointer">
                <img 
                    :src="img"
                    class="object-cover w-full h-full rounded-md shadow-lg">
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

            <div class="flex flex-col px-5 py-5 lg:mx-6 w-full md:w-2/3">
                <label for="nombre" class="font-bold">Nombre:</label>
                <input type="text" v-model="name" id="nombre" class="focus:outline-none w-full p-3 border-2 mb-5">
                 
                <label for="whatsapp" class="font-bold">WhatsApp:</label>
                <input type="text" v-model="tel" id="whatsapp" class="focus:outline-none w-full p-3 border-2">
                <p class="text-xs mb-5 tracking-widest">Recuerda agregar el prefijo del país.</p>

                <label for="email" class="font-bold">Correo:</label>
                <input type="text" v-model="email" id="email" class="focus:outline-none w-full p-3 border-2 mb-5">
                

                <button @click="save" class="border-2 border-primary rounded p-2 text-primary font-bold shadow-sm hover:shadow-md">Guardar cambios</button>
            </div>
        </section>

        <ListaFavoritos :uid="uid" class="border-b-2 border-t-2 m-auto mt-10 py-10 my-5 px-5"></ListaFavoritos>

        <ListaPropiedades :uid="uid" class="px-5"></ListaPropiedades>

        <div class="border-t-2 m-auto mt-20 py-10 my-5 px-5 flex-col">
            <p class="font-bold">¿Quieres eliminar tu cuenta en CR-LOTES?</p>
            <EliminarCuenta :uid="uid"></EliminarCuenta>
        </div>

    </div>
</template>

<script>
import firebase from "firebase"
import {db} from "@/main.js"
import Swal from 'sweetalert2'
import ListaFavoritos from "@/components/ListaFavoritos"
import ListaPropiedades from "@/components/ListaPropiedades"
import EliminarCuenta from "@/components/EliminarCuenta"
export default {
    name:"Profile",
    components: { ListaFavoritos, ListaPropiedades, EliminarCuenta },
    data(){
        return{
            user: "",
            img: "https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FProfilePic.png?alt=media&token=bdb5182c-1ad1-425e-b754-62fdcec57006",
            name: "",
            email: "",
            tel: "",
            uid: "",

            favs:[],
            progress:0
        }
    },
    created() {
        //user
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                this.user=user
                if(user.photoURL){
                    this.img=user.photoURL
                }
                this.email=user.email
                this.uid=user.uid

                db.collection("users")
                .doc(this.uid)
                .get()
                .then((x)=>{
                    if(x.data().phoneNumber){this.tel=x.data().phoneNumber}
                    if(x.data().name){this.name=x.data().name}
                    if(x.data().favoritos){this.favs=x.data().favoritos}
                })
            } else {
                this.$router.push({ name: 'Home' })
            }
        })
    },
    methods:{

        save(){
            db.collection("users").doc(this.uid).update({name:this.name, phoneNumber:this.tel, email:this.email})
            .then(Swal.fire({
                title: 'Cambios guardados con éxito',
                confirmButtonText: `OK`,
            }))
            .catch(e=>console.error(e));
        },

        getFiles(){
            this.progress=0.01
            const fileDir=document.getElementById("inpImg").files[0] 
            if(!fileDir){return}
            const fileName = `profilePics/${this.uid}`
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
                        this.user.updateProfile({
                            photoURL: this.img
                        });
                    })
                })
        }
    }
}
</script>