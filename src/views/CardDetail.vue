<template>
    <div>
        {{ cardData }}
    </div>
</template>

<script>
import {db} from "@/main.js"
export default {
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
