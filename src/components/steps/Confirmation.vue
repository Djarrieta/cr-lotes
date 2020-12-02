<template>
  <div>
    <Buttons @save="save" @prev="prev" last="true"/>
    <PerfilPropiedad :infoConfirmacion="data"/>
  </div>
</template>

<script>
import Buttons from "@/components/steps/Buttons"
import PerfilPropiedad from "@/views/PerfilPropiedad"
export default {
  name: 'Confirmation',
  props:["data"],
  components:{Buttons,PerfilPropiedad},
  data() {
    return {
      selectedCenter: { lat: this.data.s2_lat, lng: this.data.s2_lng },
      selectedZoom: 16
    }
  },
  filters:{
      numberFormat: function(value){
          let val = (value/1).toFixed(0).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
  },
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