<template>
    <div class="min-h-screen">
        <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full">
                <StepsIndicator :indicator="indicator"/>
                <Step1/>
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
            indicator:3,
            data:{}
        }
    }
}
</script>
