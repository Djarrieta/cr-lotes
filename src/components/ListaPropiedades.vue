<template>
  <section>
    <!-- loading -->
    <div v-if="loading" class="flex justify-center items-center opacity-25">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
    <template v-if="propiedades.length > 0 && loading===false">
        <h2 class="text-2xl font-bold mb-5 tracking-wide">Mis propiedades</h2>
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-stretch">
            <li class="w-full" v-for="(prop, n) in propiedades" :key="n">
                <Card :prop="prop"></Card>
            </li>
        </ul>
    </template>
    <template v-else-if="favoritos.length === 0 && loading===false">
        <p>No tiene ninguna propiedad publicada para la venta. 
          <router-link 
            to="/publicar">
            Publicar</router-link>
        </p>
    </template>
  </section>
</template>

<script>
import { db } from "@/main";
import Card from "@/components/Card"
export default {
    name:"ListaPropiedades",
    components: { Card },
    props:["uid"],
    data(){
        return {
            idUser: '',
            status: false,
            favoritos: [],
            propiedades: [],
            userid: '',
            loading: true
        }
    },
    mounted() {
    let self = this
    // Seleccionar las propiedades
    let propiedades = db.collection('props');
    propiedades
        .get()
        .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if(doc.data().uid === self.uid) {
                self.propiedades.push(doc.data())
            }
            self.loading = false
        });
    })
  },
}
</script>