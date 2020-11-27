<template>
  <section>
      <button @click="desactivar" v-if="status != 'desactivar'">Desactivar</button>
      <button @click="activar" v-else>Volver a activar</button>
  </section>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
import Swal from 'sweetalert2'
export default {
    name: "StatusProp",
    props: ["propId"],
    data(){
        return {
            status: ''
        }
    },
    mounted() {
        let self = this
        if(this.propId) {
            let prop = db.collection('props').where('propId', '==', self.propId);
            prop.get()
                .then(function (docProp) {
                    docProp.forEach(function(doc) {
                        self.status = doc.data().status
                    });
                })
        }
    },
    
    methods:{
        activar() {
            db.collection('props').doc(this.propId.toString()).update({
                'status': 'complete',
                'dateDesac': ''
            });
            this.status = 'complete'
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Está propiedad está a la venta nuevamente.',
                showConfirmButton: false,
                timer: 1500
            })
        },
        desactivar() {
            let docRef = db.collection('props').doc(this.propId.toString());
            docRef.update({
                'status': 'desactivar',
                'dateDesac': firebase.firestore.FieldValue.serverTimestamp()
            });
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'Está propiedad se eliminará completamente en 4 meses.',
                showConfirmButton: false,
                timer: 1500
            })
            this.status = 'desactivar'
        }
    }
}
</script>