<template>
<!-- Nivel -->
<div>
    <p>¿Tu terreno está en su mayoría por encima, por debajo o al nivel de la calle?</p>
    <Buttons @next="next" @prev="prev"/>
    <div  v-if="problems" class="text-sm text-left text-red-600 bg-red-200 border border-red-400 h-12 flex items-center p-4 m-4 rounded-sm" role="alert"> {{problems}} </div>
    <span> {{ s5_nivel }} </span>
    <div class="grid grid-cols-1 md:grid-cols-2 ">
        <div v-for="(i,n) in info" :key="n" class="p-4 m-2  rounded-lg shadow" :class="i.value==s5_nivel ? ' bg-gray-600' : 'bg-white'">
            <label >
                <input type="radio" v-model="s5_nivel" :value="i.value" class="hidden">
                <img :src="i.url" :alt="i.value" class=" rounded-lg">
            </label>
        </div>
    </div>
</div>
</template>

<script>
import Buttons from "@/components/steps/Buttons"
export default {
    name:"Step5",
    props:["data"],
    components:{Buttons},
    data(){
        return{
            s5_nivel:null,
            info:[
                {
                    url:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Fnivel%2Fnivel_%2B1.jpeg?alt=media&token=acfa1ed1-c1e1-437a-aa55-913ebaa034a9",
                    value:"Nivel por encima de la calle"
                },
                {
                    url:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Fnivel%2Fnivel_0.jpeg?alt=media&token=47ef33c5-bbcb-443c-ab33-efc684033b80",
                    value:"Nivel igual al de la calle"
                },
                {
                    url:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Fnivel%2Fnivel_-1.jpeg?alt=media&token=65a7a949-44f2-45eb-aea5-b07f0e6d265b",
                    value:"Nivel por debajo de la calle"
                },
                                
            ],
            problems:""

        }
    },
    mounted(){
    
        if(this.data.s5_nivel){
            this.s5_nivel=this.data.s5_nivel}
        },
    methods:{
        next(){
            this.problems=""
            if(!this.s5_nivel){this.problems="Selección inválida"}
            //Emite solo cuando no hay problemas
            if(!this.problems){
                this.$emit("next",{s5_nivel:this.s5_nivel})
            }
        },
        prev(){
            this.$emit("prev",{s5_nivel:this.s5_nivel})
        },
    }

}
</script>
