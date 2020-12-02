<template>
<!-- Frente -->
<div>
    <p>Marca en la imagen cómo es el frente del terreno en relación al acceso.</p>
    <Buttons @next="next" @prev="prev"/>
    <div  v-if="problems" class="text-sm text-left text-red-600 bg-red-200 border border-red-400 h-12 flex items-center p-4 m-4 rounded-sm" role="alert"> {{problems}} </div>
    <span class="pl-2 text-lg text-primary"> Has seleccionado Lote {{ s3_frontType }} </span>
    <div class="relative">
        <img class="z-10" src="https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Ffrente_terreno.jpeg?alt=media&token=0fa7406c-7bb3-414b-bbb5-57debcadb162" alt="TipoFrenteCrLotes" >
        
        <!--1 esquinero -->
        <input v-model="s3_frontType" value="Esquinero" type="radio"  class="pin top-t1 left-l1"  > 
        <!--2 cabecero -->
        <input v-model="s3_frontType" value="Cabecero" type="radio"  class="pin top-t2 left-l2"  > 
        <!--3 medianero -->
        <input v-model="s3_frontType" value="Medianero" type="radio"  class="pin top-t3 left-l3"  > 
        <!--4 cellejonFondo -->
        <input v-model="s3_frontType" value="CallejonFondo" type="radio"  class="pin top-t4 left-l4"  > 
        <!--5 cellejonLateral -->
        <input v-model="s3_frontType" value="CallejonLateral" type="radio"  class="pin top-t5 left-l5"  > 
        <!--6 Medianero2Frentes -->
        <input v-model="s3_frontType" value="Medianero2Frentes" type="radio"  class="pin top-t6 left-l6"  > 
        <!--7 manzanero -->
        <input v-model="s3_frontType" value="Manzanero" type="radio"  class="pin top-t7 left-l7"  > 
        <!--8 cabecero -->
        <input v-model="s3_frontType" value="Cabecero" type="radio"  class="pin top-t8 left-l8"  > 
    </div>
</div>
</template>

<script>
import Buttons from "@/components/steps/Buttons"
export default {
    name:"Step3",
    props:["data"],
    components:{Buttons},
    data(){
        return{
            s3_frontType:"Cabecero",
            problems:""
        }
    },
    watch:{
        problems:function(){
            setTimeout(() => {
                this.problems=""
            }, 2000);
        }
    },
    mounted(){
      if(this.data.s3_frontType){
          this.s3_frontType=this.data.s3_frontType}
    },
    methods:{
        next(){
            this.problems=""
            if(!this.s3_frontType){this.problems="Selección inválida"}
            
            if(!this.problems){
                this.$emit("next",{s3_frontType:this.s3_frontType})
            }
        },
        prev(){
            this.$emit("prev",{s3_frontType:this.s3_frontType})
        },
    }
}
</script>
<style scoped>
    .pin {
        @apply bg-white w-8 h-8 z-20 rounded-full shadow absolute cursor-pointer;
        }
</style>
