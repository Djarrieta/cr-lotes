<template>
    <Header></Header>
    <div>
        {{ cardData }}
    </div>
</template>

<script>
import {db} from "@/main.js"
import Header from "@/components/Header"
export default {
    components:{Header},
    data(){
        return{
            cardId:"",
            cardData:{}
        }
    },
    created(){
        this.cardId=this.$route.params.id

        db.collection("prueba")
            .doc(this.cardId)
            .onSnapshot(x=>this.cardData=x.data())
    }
}
</script>
