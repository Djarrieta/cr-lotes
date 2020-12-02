<template>
  <section>
      <i @click="vendido" v-if="status != 'vendido'" class="fas fa-home text-green-500 text-center cursor-pointer" title="Marcar vendido"></i>
      <i @click="vender" v-else class="fas fa-home text-red-500 text-center cursor-pointer" title="Propiedad vendida"></i>
  </section>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
import Swal from 'sweetalert2'
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
        vender() {
            db.collection('props').doc(this.propId.toString()).update({
                'status': 'complete',
                'dateVenta': ''
            });
            this.status = 'complete'
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Propiedad vuelve a la venta.',
                showConfirmButton: false,
                timer: 1500
            })
        },
        vendido() {
            let docRef = db.collection('props').doc(this.propId.toString());
            docRef.update({
                'status': 'vendido',
                'dateVenta': firebase.firestore.FieldValue.serverTimestamp()
            });
            this.status = 'vendido'
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Propiedad vendida.',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
}
</script>