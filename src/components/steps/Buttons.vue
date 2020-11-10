<template>
      <!-- buttons -->
    <div class="flex justify-around m-4">
        <button v-if="!first " @click="prev" class="rounded p-2 m-2 text-gray-400 bg-gradient-to-t from-gray-600 to-gray-700 shadow-sm hover:shadow-md hover:text-white">← Anterior</button>
        <button v-if="!last"  @click="next" class="rounded p-2 m-2 text-gray-400 bg-gradient-to-t from-gray-600 to-gray-700 shadow-sm hover:shadow-md hover:text-white">Siguiente →</button>
        <button v-if="last"  @click="save" class="rounded p-2 m-2 text-gray-400 bg-gradient-to-t from-gray-600 to-gray-700 shadow-sm hover:shadow-md hover:text-white">Guardar</button>
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