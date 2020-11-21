<template>
  <section @click="favoritoMet">
      <i class="fas fa-heart text-gray-900 cursor-pointer" :class="{ 'text-red-700' : status }"> </i>
  </section>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
import Swal from 'sweetalert2'
export default {
    name:"favorito",
    props:["propId"],
    data(){
        return {
            idUser: '',
            status: false,
            info: []
        }
    },
    created() {
        let self = this
        //si no hay usuario registrado no hace nada.
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                this.idUser=user.uid
                let dUser = db.collection("users").doc(this.idUser);
                dUser
                .get()
                .then(function (docProp) {
                    self.info = docProp.data().favoritos
                    if(self.info && self.info.includes(self.propId) === true) { self.status = true }
                })
            }
            else{
                self.idUser=''
            }
        })
    },
    methods: {
        async favoritoMet() {
            if(this.idUser){
                this.status = !this.status
                if(this.status === true) {
                    await db.collection('users').doc(this.idUser).update({
                        favoritos: firebase.firestore.FieldValue.arrayUnion(this.propId)
                    });
                } else {
                    await db.collection('users').doc(this.idUser).update({
                        favoritos: firebase.firestore.FieldValue.arrayRemove(this.propId)
                    });
                }
            }else{
              Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Debes estar registrado para marcar favoritas.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    }
}
</script>