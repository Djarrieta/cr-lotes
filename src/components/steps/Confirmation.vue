<template>
  <div class="m-2">
    <p class="my-2">Verifica que los datos que quieres guardar están bien y pulsa el botón Guardar, aunque luego podrás editar tu publicación una vez sea revisada por nuestro equipo.</p>
    <p class="my-2">Al pulsar el botón de guardar, estas aceptando nuestras políticas:
      <ol class="ml-3">- El vendedor o el inmueble pagará por transferencia bancaria el 1% de comisión por cada venta concretada y atribuíble a nuestra plataforma.</ol>
      <ol class="ml-3">- Por concepto de comisión, el vendedor recibirá la respectiva factura electrónica.</ol>
      <ol class="ml-3">- En caso de no pago, la cuenta será bloqueada.</ol>
      <ol class="ml-3">- Toda la información suministrada es verdadera y exime a CR-Lotes.</ol>
    </p>
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