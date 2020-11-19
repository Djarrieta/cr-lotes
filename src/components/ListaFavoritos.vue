<template>
  <section>
      <h2>Lista de favoritos</h2>
      <table>
          <thead>
              <tr>
                  <th></th>
                  <th>Título</th>
                  <th>Área</th>
                  <th>Precio</th>
                  <th>Provincia</th>
                  <th>Distrito</th>
                  <th>Cantón</th>
                  <th>Tipo de frente</th>
                  <th>Inclinación</th>
                  <th>Nivel</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="propiedad in propiedades" :key="propiedad.propId">
                <td><Favorito :propId="propiedad.propId" /></td>
                <td>{{ propiedad.s1_title }}</td>
                <td>{{ propiedad.s1_area }} {{ propiedad.s1_areaUn }}</td>
                <td>{{ propiedad.s1_price }}</td>
                <td>{{ propiedad.s2_namePrvSelected }}</td>
                <td>{{ propiedad.s2_nameDttSelected }}</td>
                <td>{{ propiedad.s2_nameCtnSelected }}</td>
                <td>{{ propiedad.s3_frontType }}</td>
                <td>{{ propiedad.s4_inclination }}</td>
                <td>{{ propiedad.s5_nivel }}</td>
            </tr>
          </tbody>
      </table>
  </section>
</template>

<script>
import { db } from "@/main";
import Favorito from "@/components/Favorito"
export default {
    name:"listaFavoritos",
    components: { Favorito },
    props:["uid", "prop"],
    data(){
        return {
            idUser: '',
            status: false,
            favoritos: [],
            propiedades: []
        }
    },
    mounted() {
    let self = this
    // Lista de favoritos
    let favoritos = db.collection('users');
    favoritos.onSnapshot(function (snapshot)  {
      snapshot.forEach(doc => {
        self.favoritos = doc.data().favoritos
      })
    })
    
    // Seleccionar solo las propiedades que están en favorito
    let propiedades = db.collection('props');
    propiedades
        .get()
        .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if(self.favoritos.includes(doc.data().propId)) {
            self.propiedades.push(doc.data())
        }
        });
    })
  },
}
</script>