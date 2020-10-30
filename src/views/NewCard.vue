<template>
    <div class="min-h-screen">
        <Header></Header>
        <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full">
                <StepsIndicator :indicator="indicator"/>
            </div>
        </div>
    </div>
</template>

<script>
import Header from "@/components/Header"
import StepsIndicator from "@/components/steps/StepsIndicator"
export default {
    name:"NewCard",
    components:{Header,StepsIndicator},
    data(){
        return{
            indicator:3,
            data:{}
        }
    }
}
</script>
