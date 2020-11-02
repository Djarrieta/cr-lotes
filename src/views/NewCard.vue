<template>
    <div>
        <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl w-full">
                <StepsIndicator :indicator="indicator"/>
                <Step1
                    v-if="indicator===1"
                    @get-data-step1="getDataStep1"/>
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
        getDataStep1(dataStep1){
            this.data={...dataStep1}
            this.indicator++
            console.log(this.data)
        }
    }

}
</script>
