<template>
<!-- fotos -->
<div>
    <p>
         Te recomendamos subir las mejores fotografías de mejor vista, el acceso, de frente y desde arriba. Escoge cuidadosamente!
    </p>
    <Buttons @next="next" @prev="prev"/>
    <div  v-if="problems" class="text-sm text-left text-red-600 bg-red-200 border border-red-400 h-12 flex items-center p-4 m-4 rounded-sm" role="alert"> {{problems}} </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        <label 
            v-for="(i,n) in info"
            :key="n"
            class="flex flex-col items-center justify-center text-center px-4 py-6 m-2 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-blue hover:text-white">
            <!-- upload icon -->
            <svg v-if="!i.fileUrl" class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <!-- ok icon -->
            <img 
                v-if="i.fileUrl" 
                :src="i.fileUrl"
                class="object-cover w-full h-full">
            
            <!-- Title -->
            <span class="mt-2">
                {{i.title}}
            </span>
            <!-- delete -->
            <a href="#" 
                class="bg-red-400 text-xs text-gray-100 rounded-full px-2"
                v-if="i.fileUrl"
                @click="deleteFile(n)">x</a>
            <input 
                v-if="!i.fileUrl"
                type='file' 
                class="hidden" 
                :id=n
                @change="getFiles(n)"
                accept="image/png, image/jpeg"/>
            <progress
                v-if="i.progress"
                :value="i.progress"
                class="w-full"/> 
        </label>
        
    </div>
</div>
</template>

<script>
import Buttons from "@/components/steps/Buttons"
import firebase  from "firebase"
import {db} from "@/main.js"
export default {
    name:"Step8",
    props:["data"],
    components:{Buttons},
    data(){
        return{
            info:[
                {
                    title:"Mejor",
                    fileUrl:"",
                    fileName:"",
                    progress:0,
                    code:"Mejor"
                },
                {
                    title:"Acceso",
                    fileUrl:"",
                    fileName:"",
                    progress:0,
                    code:"Acceso"
                },
                {
                    title:"Frente",
                    fileUrl:"",
                    fileName:"",
                    progress:0,
                    code:"Frente"
                },
                {
                    title:"Arriba",
                    fileUrl:"",
                    fileName:"",
                    progress:0,
                    code:"Arriba"
                },
            ],
            problems:"",
            currentUser:"",
            propId:""
        }
    },
    created(){
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                this.currentUser=user
            }else{
                this.currentUser=""
            }
        })
    },
    computed:{
        generalProgress(){
            let gp=0
            this.info.forEach(i=>{
                gp+=parseFloat(i.progress)
            })
            //emitir al padre gp para que desabilitar botones cuando hay progreso>0
            return gp
        },

        s8_pictures(){
            let fulled=[]
            this.info.forEach(i=>{
                if(i.fileUrl){
                    fulled.push(i)
                }
            })
            return fulled
        }
    },
    methods:{
        getFiles(id){
            const self=this
            //incrementar y retorna el número de consecutivo único de la propiedad con una transacción
            const counterRef = db.collection("propCounter").doc("counter");

            return db.runTransaction(transaction=>{
                return transaction.get(counterRef).then(lastProp=>{
                    if (!lastProp.exists) {
                        throw "Document does not exist!";
                    }
                    if(!self.propId){
                        self.propId = lastProp.data().counter + 1;
                        transaction.update(counterRef, { counter: self.propId});
                    }
                });
            })
            .then(()=>{
                //guarda en el storage con el código de la nueva propiedad como carpeta y el código del archivo como nombre de archivo
                //el propId también será el nombre del documento de esta propiedad en firestore
                self.info[id].fileUrl=""
                const fileDir=document.getElementById(id).files[0]
                if(!fileDir){return}
                const fileSize=fileDir.size/1024/1024
                if(fileSize>1){
                    this.problems="Escoge archivos de menos de 1Mb"
                    return
                }
                const fileName=`props/${self.propId}/pics/${self.info[id].code}`
                const storageRef = firebase.storage().ref()
                const fileRef=storageRef.child(fileName);
                const uploadTask=fileRef.put(fileDir)

                uploadTask.on("state_changed",
                (x)=>{
                        //Progreso
                        self.info[id].progress=x.bytesTransferred/x.totalBytes
                    },
                    (error)=>{
                        //error
                        console.error(error)
                    },
                    ()=>{
                        //Carga con éxito
                        self.info[id].progress=0
                        uploadTask.snapshot.ref.getDownloadURL()
                        .then(downloadURL=>{
                            self.info[id].fileUrl=downloadURL
                            self.info[id].fileName=fileName
                        })      
                    }
                )
            }).catch(function(error) {
                console.log("Transaction failed: ", error);
            });
        },
        deleteFile(id){
            let storage = firebase.storage()
            let storageRef = storage.ref();
            let desertRef = storageRef.child(this.info[id].fileName);
            desertRef.delete()
            .then(()=>{
                this.info[id].fileName=""
                this.info[id].fileUrl=""
            }).catch(e=>console.error(e))
        },
        next(){
            this.problems=""
            if(this.generalProgress>0){this.problems="Espera que termine la carga"}
            //Emite solo cuando no hay problemas
            if(!this.problems){
                this.$emit("next",{s8_pictures:this.s8_pictures,propId:this.propId})
            }
        },
        prev(){
            this.problems=""
            if(this.generalProgress>0){this.problems="Espera que termine la carga"}
            //Emite solo cuando no hay problemas
            this.$emit("prev",{s8_pictures:this.s8_pictures,propId:this.propId})
        },
    },
    mounted(){
        if(this.data.propId){this.propId=this.data.propId}
        if(this.data.s8_pictures){
            let newInfo=[]
            this.info.forEach(i=>{
                let match=false
                this.data.s8_pictures.forEach(j=>{
                    if(i.code===j.code){
                        newInfo.push(j)
                        match=true
                    }
                })
                if(!match){
                    newInfo.push(i)
                }
            })
            this.info=newInfo
        }
    },

}
</script>