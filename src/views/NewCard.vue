<template>
    <div>
        <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="container">
                <StepsIndicator :indicator="indicator"/>
                <Step1 v-if="indicator===1" @sendStep1="getStep1"/>
            </div>
        </div>
    </div>
</template>

<script>
import StepsIndicator from "@/components/steps/StepsIndicator"
import Step1 from "@/components/steps/Step1"
export default {
    name:"NewCard",
    components:{StepsIndicator,Step1},
    data(){
        return{
            indicator:1,
            data:{}
        }
    },
    methods:{
        getStep1(dataStep1){
            this.indicator++
            this.data={...dataStep1}
            console.log(this.data)
        }
    }

}
</script>
