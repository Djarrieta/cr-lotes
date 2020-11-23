<template>
  <section>
      <button @click="eliminarCuenta" class="rounded p-2 m-2 text-red-100 bg-gradient-to-t from-red-600 to-red-700 shadow-sm hover:shadow-md hover:text-white">Eliminar cuenta</button>
  </section>
</template>

<script>
import firebase from "firebase"
import Swal from 'sweetalert2'
import { db } from "@/main";
export default {
    name:"EliminarCuenta",
     data(){
        return{
            propiedadesEliminar: [],
            idUser: '',
        }
    },
    created() {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.idUser = user.uid
            } else {
                this.idUser = ''
            }
        })
    },
    mounted() {
       
    },
    methods:{
        eliminarCuenta() {
            let self = this
            Swal.fire({
                title: '¿Quieres eliminar tu cuenta en CR-LOTES?',
                text: "Al eliminar tu cuenta, las propiedades publicadas también se eliminarán.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar mi cuenta',
                cancelButtonText: 'No, deseo mantener mi cuenta',
            }).then((result) => {
                if (result.isConfirmed) {
                    
                    // Cambiar estado de las propiedades a "deleted"
                    // Seleccionar las propiedades
                    let propiedadesAEliminar = []
                    let propiedades = db.collection('props');
                    propiedades
                        .get()
                        .then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                if(doc.data().uid === self.idUser) {
                                    propiedadesAEliminar.push(doc.data().propId)
                                    eliminarPropiedad(doc.data().propId)
                                }
                            });
                            borrarCuenta(self.idUser)
                        })

                    this.$router.push({ name: 'Home' })
                }

                function eliminarPropiedad (id) {
                    let doc = db.collection('props').doc(id.toString());
                    doc.update({
                        'status': 'deleted',
                        'dateDesac': firebase.firestore.FieldValue.serverTimestamp()
                    });
                }

                function borrarCuenta(idUser) {
                    let usuario = firebase.auth().currentUser;

                    db.collection('users').doc(idUser).delete();

                    usuario.delete().then(function() {
                        Swal.fire(
                            'Cuenta eliminada',
                            'Tus propiedades también han sido eliminadas.',
                            'success'
                        )
                    }).catch(function(error) {
                        console.log(error)
                    });
                }

            })
        },
    }
}
</script>

<style>

</style>