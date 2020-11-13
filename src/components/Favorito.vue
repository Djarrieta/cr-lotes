<template>
  <section @click="favoritoMet">
      <i class="fas fa-heart text-gray-900 cursor-pointer" :class="{ 'text-red-700' : status }"> </i>
  </section>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
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
        this.idUser = firebase.auth().currentUser.uid;

        let dUser = db.collection("users").doc(this.idUser);
        dUser
        .get()
        .then(function (docProp) {
            self.info = docProp.data().favoritos
            if(self.info.includes(self.propId) === true) { self.status = true }
        })
    },
    methods: {
        async favoritoMet() {
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
        }
    }
}
</script>