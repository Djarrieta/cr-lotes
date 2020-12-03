<template>
  <section>
    <!-- loading -->
    <div v-if="loading" class="flex justify-center items-center opacity-25">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    <template v-if="favoritos && favoritos.length > 0 && loading===false">
      <h2 class="text-2xl font-bold mb-5 tracking-wide">Lista de favoritos</h2>
      <table class="w-full overflow-hidden">
          <thead>
              <tr class="bg-gray-200 uppercase border">
                  <th class="mx-2 text-center py-2 visible w-auto"></th>
                  <th class="mx-2 text-center py-2 visible w-auto">Título</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Área</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Precio</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Provincia</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Cantón</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Distrito</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Tipo de frente</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Inclinación</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Nivel</th>
              </tr>
          </thead>
          <tbody>
            <tr  v-for="propiedad in propiedadesAll" :key="propiedad.propId">
                <td class="border-b text-left pl-5 visible"><Favorito :propId="propiedad.propId" /></td>
                <td class="border-b text-left pl-5 visible">
                  <router-link :to="'/perfil-propiedad/'+ propiedad.propId"><i class="fas fa-link"></i> {{ propiedad.s1_title }}</router-link>
                </td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s1_area | numberFormat }} {{ propiedad.s1_areaUn }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s1_price | numberFormat }} ₡</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s2_namePrvSelected }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s2_nameCtnSelected }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s2_nameDttSelected }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s3_frontType }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s4_inclination }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s5_nivel }}</td>
            </tr>
          </tbody>
      </table>
    </template>

    <template v-else-if="!favoritos  && loading===false">
      <h2 class="text-2xl font-bold mb-5 tracking-wide">Lista de favoritos</h2>
      <p>No tiene ninguna propiedad como favorita.</p>
    </template>
    
    <template v-else-if="favoritos.length===0  && loading===false">
      <h2 class="text-2xl font-bold mb-5 tracking-wide">Lista de favoritos</h2>
      <p>No tiene ninguna propiedad como favorita.</p>
    </template>
  </section>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
import Favorito from "@/components/Favorito"
export default {
    name:"listaFavoritos",
    components: { Favorito },
    props:["uid"],
    data(){
        return {
            idUser: '',
            status: false,
            favoritos: [],
            propiedadesAll: [],
            loading: true
        }
    },
    created() {
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          this.idUser = user.uid
        } else {
          this.idUser = this.uid
        }
      })
      
    },

    filters: {
      numberFormat: function(value){
        let val = (value/1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
    },

    mounted() {
      let self = this
        // Lista de favoritos
        let favoritos = db.collection('users');
        favoritos
            .get()
            .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              if(doc.id === self.uid) {
                  self.favoritos = doc.data().favoritos

                  // Seleccionar solo las propiedades que están en favorito
                  let propiedades = db.collection('props');
                  
                  if(self.favoritos && self.favoritos.length > 0) {
                    propiedades
                      .get()
                      .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            if(self.favoritos.includes(doc.data().propId)) {
                              self.propiedadesAll.push(doc.data())
                            }
                        });
                      })
                  }
              }
            });
            
            self.loading = false
        })

        // Seleccionar solo las propiedades que están en favorito
        // let propiedades = db.collection('props');
        // console.log(self.favoritos.length)
        // if(self.favoritos.length > 0) {
        //   propiedades
        //     .get()
        //     .then(function(querySnapshot) {
        //       querySnapshot.forEach(function(doc) {
        //           if(self.favoritos.includes(doc.data().propId)) {
        //             self.propiedadesAll.push(doc.data())
        //           }
        //       });
        //     })
        // }
    
    
    
  },
}
</script>