<template>
  <div>
    <Buttons @save="save" @prev="prev" last="true"/>
    <div class="flex flex-col">
      <span>Confirmación</span>
      <p>Está seguro que desea guardar esta nueva nueva publicación?</p>
      {{data}}
    </div>
  </div>
</template>

<script>
import Buttons from "@/components/steps/Buttons"
export default {
  name: 'Confirmation',
  props:["data"],
  components:{Buttons},
  methods:{
    save(){
      this.$emit("save")
    },
    prev(){
      this.$emit("prev")
    }
  }
}
</script>