<template>
    <div class="container mx-auto">
        <section class="grid md:grid-cols-2 m-2">
            <label
                class="flex flex-col items-center justify-center text-center bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-blue hover:text-white">
                <img 
                    :src="img"
                    class="object-cover w-full h-full">
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

            <div class="flex flex-col  mx-6 ">
                <label>Nombre:</label>
                <input type="text" v-model="name">
                 
                <label>WhatsApp:</label>
                <input type="text" v-model="tel">

                <label>Correo:</label>
                <span> {{email}} </span>

                <button @click="save" class="rounded p-2 m-2 text-gray-400 bg-gradient-to-t from-gray-600 to-gray-700 shadow-sm hover:shadow-md hover:text-white">Guardar</button>
            </div>
        </section>

        <ListaFavoritos :uid="uid"></ListaFavoritos>
        <ListaPropiedades :uid="uid"></ListaPropiedades>
    </div>
</template>

<script>
import firebase from "firebase"
import {db} from "@/main.js"
import Swal from 'sweetalert2'
import ListaFavoritos from "@/components/ListaFavoritos"
import ListaPropiedades from "@/components/ListaPropiedades"
export default {
    name:"Profile",
    components: { ListaFavoritos, ListaPropiedades },
    data(){
        return{
            user:"",
            img:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2FProfilePic.png?alt=media&token=bdb5182c-1ad1-425e-b754-62fdcec57006",
            name:"",
            email:"",
            tel:"",
            uid:"",

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
            }
        })
    },
    methods:{

        save(){
            db.collection("users").doc(this.uid).update({name:this.name, phoneNumber:this.tel})
            .then(Swal.fire({
                title: 'Cambios guardados con éxito',
                confirmButtonText: `OK`,
            }))
            .catch(e=>console.error(e));
        },

        getFiles(){
            this.progress=0.01
            const fileDir=document.getElementById("inpImg").files[0] 
            
            const fileName=`profilePics/${this.uid}`
            const storageRef = firebase.storage().ref()
            const fileRef=storageRef.child(fileName);
            const uploadTask=fileRef.put(fileDir)

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