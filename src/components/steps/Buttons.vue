<template>
      <!-- buttons -->
    <div class="flex justify-around m-4">
        <button v-if="!first " @click="prev" class="border border-primary rounded  bg-white hover:bg-gray-300 font-bold focus:outline-none py-1 px-2 md:py-2 text-primary "><i class="fas fa-angle-left text-primary"></i> Anterior</button>
        <button v-if="!last"  @click="next" class="border border-primary rounded  bg-white hover:bg-gray-300 font-bold focus:outline-none py-1 px-2 md:py-2 text-primary ">Siguiente <i class="fas fa-angle-right text-primary"></i></button>
        <button v-if="last"  @click="save" class="border border-primary rounded  bg-white hover:bg-gray-300 font-bold focus:outline-none py-1 px-2 md:py-2 text-primary ">Guardar</button>
    </div>
</template>

<script>
export default {
    name:"Buttons",
    props:["first","last"],
    methods:{
        prev(){
            this.$emit("prev")
        },
        next(){
            this.$emit("next")
        },
        save(){
            this.$emit("save")
        }
    }
    
}
</script>