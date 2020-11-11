<template>
<!-- Comodidades -->
<div>
    <p>¿Con qué cómodidades contarán tus clientes cerca o en la propiedad?</p>
    <Buttons @next="next" @prev="prev"/>
    <div  v-if="problems" class="text-sm text-left text-red-600 bg-red-200 border border-red-400 h-12 flex items-center p-4 m-4 rounded-sm" role="alert"> {{problems}} </div>
    <div class="w-full h-full bg-gray-200 rounded-lg shadow-inner p-8">
        <button
            v-for="(i,n) in info" 
            :key=n
            @click="addAsset(i)"
            class="rounded-full px-2 py-1 mx-1 my-2 focus:outline-none"
            :class="s6_assets.includes(i) ? 'bg-gray-600 ' : 'bg-gray-300 '">
            <span v-if="!s6_assets.includes(i)" class="pr-1 font-bold text-lg">+</span>
            <span v-if="s6_assets.includes(i)" class="pr-1 font-bold text-lg  text-gray-100">x</span>
            <span :class="s6_assets.includes(i) ? ' text-gray-100 ' : 'none'">{{i}}</span>
        </button>

    </div>
</div>
</template>

<script>
import Buttons from "@/components/steps/Buttons"
export default {
    name:"Step6",
    props:["data"],
    components:{Buttons},
    data(){
        return{
            s6_assets:[],
            info:
                [
                    "Acera",
                    "Cordón y caño",
                    "Alumbrado público",
                    "Transporte público",
                    "Teléfono",
                    "Electricidad",
                    "Agua potable",
                    "Cobertura celular",
                    "Cable TV",
                    "Fibra optica",
                    "Internet",
                    "Alcantarillado",
                    "Recolección basura",
                    "Facilidades comunales",
                    "Edificios comerciales",
                    "Escuela primaria",
                    "Educación secundaria",
                    "Tempos religiosos",
                    "Servicios privados", 
                    "Servicios municipales", 
                    "Servicios Financieros",
                    "Servicios de salud",
                    "Áreas recreativas",
                    "Planta de aguas residuales",
                    "Riesgo de inundación",
                    "Riesgo de deslizamiento",
                    "Riesgo por alta tensión",
                    
                ],
            problems:""
        }
    },
    methods:{
        addAsset(i){
            if(this.s6_assets.includes(i)){
                const pos=this.s6_assets.indexOf(i)
                this.s6_assets.splice(pos,1)
            }else{
                this.s6_assets.push(i)
            }
        },
        next(){
            this.problems=""
            if(!this.s6_assets){this.problems="Selección inválida"}
            //Emite solo cuando no hay problemas
            if(!this.problems){
                this.$emit("next",{s6_assets:this.s6_assets})
            }
        },
        prev(){
            this.$emit("prev",{s6_assets:this.s6_assets})
        },
    },
    mounted(){
        if(this.data.s6_assets){
            this.s6_assets=this.data.s6_assets}
    },
}
</script>
