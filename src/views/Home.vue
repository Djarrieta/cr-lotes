<template>
  <div class="container mx-auto flex flex-col">
    <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-stretch">
        <li class="w-full" v-for="(prop, n) in props" :key="n">
            <Card :prop="prop"></Card>
        </li>
    </ul>
    <button @click="seeMore" class="w-full p-2">
      Ver más
    </button>
  </div>
</template>

<script>

import Card from "@/components/Card"
import { db } from "@/main";
export default {
  name:"Home",
  components: { Card },
  data(){
    return{
        props: [],
        inicialLoad:3,
        loadMore:3
    }
  },
  created(){
    db.collection('props')
      .orderBy("propId", "desc")
      .limit(this.inicialLoad)
      .get()
      .then((props)=>{
          props.forEach(  prop => {
              this.props.push(prop.data())
          })
      })
  },
  methods:{
    seeMore(){
      const lastCod= this.props[this.props.length-1].propId
      db.collection("props")
        .orderBy("propId","desc")
        .startAfter(lastCod)
        .limit(this.loadMore)
        .get()
        .then(x=>{x.forEach(x=>{
          this.inicialLoad++
          this.props.push(x.data())
        })})
    }
  }
}
</script>
