<template>
  <section>
      <button @click="desactivar" v-if="status != 'desactivar'">Desactivar</button>
      <button @click="activar" v-else>Volver a activar</button>
  </section>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
export default {
    name:"StatusProp",
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
        activar() {
            db.collection('props').doc(this.propId.toString()).update({
                'status': 'complete',
                'dateDesac': ''
            });
            this.status = 'complete'
        },
        desactivar() {
            let docRef = db.collection('props').doc(this.propId.toString());
            docRef.update({
                'status': 'desactivar',
                'dateDesac': firebase.firestore.FieldValue.serverTimestamp()
            });
            this.status = 'desactivar'
        }
    }
}
</script>