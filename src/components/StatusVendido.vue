<template>
  <section>
      <button @click="vendido" v-if="status != 'vendido'">Marcar vendido</button>
      <button @click="vender" v-else>Propiedad vendida</button>
  </section>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
export default {
    name:"StatusVendido",
    props:["propId"],
    data(){
        return {
            status: ''
        }
    },
    mounted() {
        let self = this
        let prop = db.collection('props').where('propId', '==', self.propId);
        prop.get()
            .then(function (docProp) {
                docProp.forEach(function(doc) {
                    self.status = doc.data().status
                });
            })
    },
    methods:{
        vender() {
            db.collection('props').doc(this.propId.toString()).update({
                'status': 'complete',
                'dateVenta': ''
            });
            this.status = 'complete'
        },
        vendido() {
            let docRef = db.collection('props').doc(this.propId.toString());
            docRef.update({
                'status': 'vendido',
                'dateVenta': firebase.firestore.FieldValue.serverTimestamp()
            });
            this.status = 'vendido'
        }
    }
}
</script>