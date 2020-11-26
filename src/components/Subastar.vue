<template>
  <section>
      <button @click="activar" v-if="subastar === false">Subastar</button>
      <button @click="desactivar" v-if="subastar === true">Quitar de subasta</button>
  </section>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
export default {
    name: "Subastar",
    props: ["propId"],
    data(){
        return {
            subastar: false
        }
    },
    mounted() {
        let self = this
        if(this.propId) {
            let prop = db.collection('props').where('propId', '==', self.propId);
            prop.get()
                .then(function (docProp) {
                    docProp.forEach(function(doc) {
                        if(doc.data().subastar) {
                            self.subastar = doc.data().subastar
                        } else {
                            self.subastar = false
                        }
                    });
                })
        }
    },

    methods:{
        activar() {
            db.collection('props').doc(this.propId.toString()).update({
                'subastar': true,
                'dateSubastar': firebase.firestore.FieldValue.serverTimestamp()
            });
            this.subastar = true
        },

        desactivar() {
            db.collection('props').doc(this.propId.toString()).update({
                'subastar': false,
                'dateSubastar': ''
            });
            this.subastar = false
        },
    }
}
</script>

<style>

</style>