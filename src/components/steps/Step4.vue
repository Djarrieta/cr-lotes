<template>
<!-- Inclinación -->
<div>
    <p>
        Mira que fácil... podremos decirle a los compradores la topografía predominante de tu terreno, solo mira en la imagen la posición de la rodilla.
    </p>
    <Buttons @next="next" @prev="prev"/>
    <div  v-if="problems" class="text-sm text-left text-red-600 bg-red-200 border border-red-400 h-12 flex items-center p-4 m-4 rounded-sm" role="alert"> {{problems}} </div>
    <span> {{ s4_inclination }} </span>
    <div class="grid grid-cols-2 md:grid-cols-3">
        <div v-for="(i,n) in info" :key="n" class="p-4 m-2  rounded-lg shadow" :class="i.value==s4_inclination ? ' bg-gray-600' : 'bg-white'">
            <label >
                <input type="radio" v-model="s4_inclination" :value="i.value" class="hidden">
                <img :src="i.url" :alt="i.value" class=" rounded-lg">
            </label>
        </div>
    </div>
</div>
</template>

<script>
import Buttons from "@/components/steps/Buttons"
export default {
    name:"Step4",
    props:["data"],
    components:{Buttons},
    data(){
        return{
            s4_inclination:"",
            info:[
                {
                    url:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_5.jpeg?alt=media&token=77d52d10-1916-459b-aa91-11ddf01a84af",
                    value:"Inclinación hasta 5 grados"
                },
                {
                    url:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_15.jpeg?alt=media&token=5bc66b1e-4635-4cd1-85e5-2dfeee0d4e3d",
                    value:"Inclinación hasta 15 grados"
                },
                {
                    url:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_30.jpeg?alt=media&token=04a358f7-53ab-4702-bc59-878abbc4156a",
                    value:"Inclinación hasta 30 grados"
                },
                {
                    url:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_45.jpeg?alt=media&token=1ea73309-f293-4cc8-978a-04e3fbb6c549",
                    value:"Inclinación hasta 45 grados"
                },
                {
                    url:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_60.jpeg?alt=media&token=bc0f10df-4c4e-44d4-83ca-a46bda5ef60a",
                    value:"Inclinación hasta 60 grados"
                },
                {
                    url:"https://firebasestorage.googleapis.com/v0/b/cr-lotes-firebase.appspot.com/o/assets%2Finclination%2Finclination_90.jpeg?alt=media&token=bd34bcfb-9d2b-4349-b7a9-159891a19625",
                    value:"Inclinación hasta 90 grados"
                },          
            ],
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
    
        if(this.data.s4_inclination){
            this.s4_inclination=this.data.s4_inclination}
        },
    methods:{
        next(){
            this.problems=""
            if(!this.s4_inclination){this.problems="Selección inválida"}
            //Emite solo cuando no hay problemas
            if(!this.problems){
                this.$emit("next",{s4_inclination:this.s4_inclination})
            }
        },
        prev(){
            this.$emit("prev",{s4_inclination:this.s4_inclination})
        },
    }
}
</script>
