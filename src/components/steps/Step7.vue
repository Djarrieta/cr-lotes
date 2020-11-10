<template>
<div>
    <Buttons @next="next" @prev="prev"/>
    <div  v-if="problems" class="text-sm text-left text-red-600 bg-red-200 border border-red-400 h-12 flex items-center p-4 m-4 rounded-sm" role="alert"> {{problems}} </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        <label 
            v-for="(i,n) in info"
            :key="n"
            class="flex flex-col items-center justify-center text-center px-4 py-6 m-2 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-blue hover:text-white ">
            <!-- upload icon -->
            <svg v-if="!i.fileUrl" class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <!-- ok icon -->
            <svg v-if="i.fileUrl" class="w-8 h-8 bg-green-400 rounded-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
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
                type='file' 
                class="hidden" 
                :id=n
                @change="getFiles(n)"/>
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
export default {
    name:"Step7",
    props:["data"],
    components:{Buttons},
    data(){
        return{
            info:[
                {
                    title:"Plano de Catastro",
                    fileUrl:"",
                    fileName:"",
                    progress:0,
                    code:"Cata"
                },
                {
                    title:"Uso del Suelo",
                    fileUrl:"",
                    fileName:"",
                    progress:0,
                    code:"Suel"
                },
                {
                    title:"Disponibilidad de Agua",
                    fileUrl:"",
                    fileName:"",
                    progress:0,
                    code:"Agua"
                },
                {
                    title:"Disponibilidad Eléctirca",
                    fileUrl:"",
                    fileName:"",
                    progress:0,
                    code:"Elec"
                },
                {
                    title:"Visado Municipal",
                    fileUrl:"",
                    fileName:"",
                    progress:0,
                    code:"Visa"
                },
            ],
            
            problems:""
        }
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
        s7_files(){
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
            this.info[id].fileUrl=""
            const fileDir=document.getElementById(id).files[0]
            if(!fileDir){return}
            const fileName=`docs/${this.info[id].code}-${fileDir.name}`
            const storageRef = firebase.storage().ref()
            const fileRef=storageRef.child(fileName);
            const uploadTask=fileRef.put(fileDir)

            uploadTask.on("state_changed",
            (x)=>{
                    //Progreso
                    this.info[id].progress=x.bytesTransferred/x.totalBytes
                },
                (error)=>{
                    //error
                    console.error(error)
                },
                ()=>{
                    //Carga con éxito
                    this.info[id].progress=0
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL=>{
                        //metadatos usuario y fullSaved
                        fileRef.updateMetadata({
                            customMetadata:{fullSaved:false}
                            })
                        this.info[id].fileUrl=downloadURL
                        this.info[id].fileName=fileName
                    });                   
                }
            )
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
                this.$emit("next",{s7_files:this.s7_files})
            }
        },
        prev(){
            this.$emit("prev",{s7_files:this.s7_files})
        },
    },
    mounted(){
        if(this.data.s7_files){
            this.data.s7_files.forEach(i=>{
                this.info.forEach((l,n)=>{
                    if(i.code===l.code){
                        this.info[n]=i.code
                    }
                })
            })
        }
    },
}
</script>