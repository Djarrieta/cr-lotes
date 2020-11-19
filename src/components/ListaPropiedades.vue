<template>
  <section>
      <h2>Mis propiedades</h2>
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-stretch">
        <li class="w-full" v-for="(prop, n) in propiedades" :key="n">
            <Card :prop="prop"></Card>
        </li>
    </ul>
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
            userid: ''
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
        });
    })
  },
}
</script>