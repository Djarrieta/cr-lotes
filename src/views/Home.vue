<template>
  <div class="bg-gray-500 h-full flex flex-col justify-between">
    <div v-if="!showLoading" class="container m-auto pt-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card 
        v-for="(dato,i) in datos" 
        :key="i"
        :dato="dato" ></Card>
    </div>
    <Loading v-if="showLoading"/>
    <div class="w-full p-2 text-center">
      <button class="text-xs" 
        @click="seeMore">Ver más</button>
    </div>
  </div>
</template>

<script>
import {db} from "@/main.js"
import firebase from "firebase"
import Card from "@/components/Card"
import Loading from "@/components/Loading"

export default {
  name: 'Home',
  components: {
    Card,Loading
  },
  props:["dato"],
  data(){
    return{
      userId:"",
      userEmail:"",
      datos:[],
      inicialLoad:10,
      loadMore:5,
      showLoading:false
    }
  },
  created(){
    const self=this
    //user
    firebase.auth().onAuthStateChanged(function(user) {
      if(user){
        self.userId=user.id
        self.userEmail=user.email
      }
    })
    this.showLoading=true
    //database onSnaptshot
    db.collection("prueba")
      .orderBy("cod","desc")
      .limit(this.inicialLoad)
      .onSnapshot(x=>{
        this.datos=[]
        x.forEach(x=> {
          this.datos.push(x.data())
        });
        this.showLoading=false
      })
  },
  methods:{
    seeMore(){
      const lastCod= this.datos[this.datos.length-1].cod
      db.collection("prueba")
        .orderBy("cod","desc")
        .startAfter(lastCod)
        .limit(this.loadMore)
        .get()
        .then(x=>{x.forEach(x=>{
          this.inicialLoad++
          this.datos.push(x.data())
        })})
    }
  }
}
</script>
