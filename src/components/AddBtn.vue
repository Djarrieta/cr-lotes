<template>
  <div class="fixed right-0 bottom-0 m-6 rounded-full bg-white w-16 h-16 flex text-center shadow-lg">
      <img 
        class=" cursor-pointer w-12 m-auto"
        @click="openFileSelector"
        src="https://firebasestorage.googleapis.com/v0/b/scaffold-vue-firebase-tailwind.appspot.com/o/assets%2Fadd-document-icon-add-document-icon-png-512_512.png?alt=media&token=e92613b9-1d29-464e-b97f-aaec86468680" alt="Add">
  </div>
  <input 
        @change="previewFiles"
        type="file" 
        name="filePicker"
        id="filePicker" 
        class="hidden">
    <progress 
        id="progress"
        class="fixed bottom-0 w-full"
        v-if="progress"
        :value="progress"
        max="100"/>
</template>

<script>
import firebase ,{ firestore } from "firebase"
import  {db} from "@/main.js"

export default {
    data(){
        return{
            progress:0
        }
    },
    methods:{
        openFileSelector(){
            document.getElementById("filePicker").click()
        },
        previewFiles(){
            const file=document.getElementById("filePicker").files[0]
            if(!file){return}
            const storageRef = firebase.storage().ref()
            const imagesRef = storageRef.child(`images/${file.name}`);
            const uploadTask=imagesRef.put(file)
            uploadTask.on("state_changed",
            (x)=>{
                    //Progreso
                    this.progress=100*x.bytesTransferred/x.totalBytes
                },
                (error)=>{
                    //error
                    console.error(error)
                },
                ()=>{
                    //Carga con éxito
                    this.progress=0
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL=>{
                        console.log('File available at', downloadURL);
                    });                   
                }
            )
        },
        firebaseSigCod(){
            db.collection("prueba")
                .orderBy("cod","desc")
                .limit(1)
                .get()
                .then(x=>{
                    if(!x.docs.length){
                        const cod=1
                        self.firebaseCreate(cod)
                        return
                    }
                    x.forEach(x => {
                        const cod=parseInt(x.data().cod)+1
                        self.firebaseCreate(cod)
                    });
                }).catch(e=>console.log(e))
        },
        firebaseCreate(cod){
            const newCard=db.collection("prueba").doc()
            newCard.set({
                cod,
                fecha:firestore.FieldValue.serverTimestamp(),
                id:newCard.id
            }).catch(e=>console.log(e))
        }
    }
}
</script>