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
                <span>
                    <input type="text" v-model="name"><button @click="saveName" class="rounded p-2 m-2 text-gray-400 bg-gradient-to-t from-gray-600 to-gray-700 shadow-sm hover:shadow-md hover:text-white">Guardar</button>
                </span>
                 
                <label>WhatsApp:</label>
                <span>
                    <input type="text" v-model="tel"><button @click="saveNumber" class="rounded p-2 m-2 text-gray-400 bg-gradient-to-t from-gray-600 to-gray-700 shadow-sm hover:shadow-md hover:text-white">Guardar</button>
                </span> 
                <label>Correo:</label>
                <span>{{email}}</span>
                
            </div>
        </section>

        <ListaFavoritos :uid="uid"></ListaFavoritos>
    </div>
</template>

<script>
import firebase from "firebase"
import {db} from "@/main.js"
import Swal from 'sweetalert2'
import ListaFavoritos from "@/components/ListaFavoritos"
export default {
    name:"Profile",
    components: { ListaFavoritos },
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
                this.name=user.displayName
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
                    if(x.data().favoritos){this.favs=x.data().favoritos}
                })
            }
        })
    },
    methods:{
        saveName(){
            this.user.updateProfile({displayName: this.name})
            .then(Swal.fire({
                title: 'Cambios guardados con éxito',
                confirmButtonText: `OK`,
            }))
            .catch(e=>console.error(e));
        },
        saveNumber(){
            db.collection("users").doc(this.uid).update({phoneNumber:this.tel})
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