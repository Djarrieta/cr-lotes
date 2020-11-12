<template>
  <div>
    home
    <ul class="grid grid-cols-3 gap-10 justify-items-stretch">
        <li class="w-full" v-for="(propiedad, n) in propiedades" :key="n">
            <Card :propiedad="propiedad"></Card>
        </li>
    </ul>
  </div>
</template>

<script>

import Card from "@/components/Card"
import { db } from "@/main";
export default {
  name:"Home",
  data(){
    return{
        propiedades: [],
    }
  },
  components: { Card },
  created(){
    db.collection('props')
      .get()
      .then((props)=>{
          props.forEach(  prop => {
              let data = { ...prop.data(), propid: prop.id };
              this.propiedades.push(data)
          })
      })
  }
}
</script>
