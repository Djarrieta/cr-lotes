<template>
    <div class="container mx-auto">
        <ListaFavoritos :uid="uid" class="m-auto mt-10 py-10 my-5 px-5"></ListaFavoritos>
    </div>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main.js"
import ListaFavoritos from "@/components/ListaFavoritos"
export default {
    name: "Favoritos",
    components: { ListaFavoritos },
    data(){
        return{
            user: "",
            uid: "",
            favs:[],
            progress:0
        }
    },
    created() {
        //user
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                this.user=user
                if(user.photoURL){
                    this.img=user.photoURL
                }
                this.email=user.email
                this.uid=user.uid

                db.collection("users")
                .doc(this.uid)
                .get()
                .then((x)=>{
                    if(x.data().phoneNumber){this.tel=x.data().phoneNumber}
                    if(x.data().name){this.name=x.data().name}
                    if(x.data().favoritos){this.favs=x.data().favoritos}
                })
            } else {
                this.$router.push({ name: 'Home' })
            }
        })
    },
}
</script>