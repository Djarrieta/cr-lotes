<template>
  <div class="container mx-auto max-w-4xl">
    <StepsIndicator :indicator="indicator"/>

    <!-- Título-->
    <Step1 
      :data="data"
      v-if="indicator===1"
      @next="next"/>
    <!-- ubicación -->
    <Step2 
      :data="data"
      v-if="indicator===2"
       @prev="prev"
       @next="next"/>
    <!-- Frente -->
    <Step3 
       :data="data"
       @prev="prev"
       @next="next"
       v-if="indicator===3"/>
    <!-- Inclinación -->
    <Step4 
      :data="data"
       @prev="prev"
       @next="next"
       v-if="indicator===4"/>
    <!-- Nivel -->
    <Step5 
      :data="data"       
      @prev="prev"
      @next="next"
      v-if="indicator===5"/>
    <!-- Comodidades -->
    <Step6  
      :data="data"      
      @prev="prev"
      @next="next"
      v-if="indicator===6"/>
    <!-- Archivos -->
    <Step7  
      :data="data"      
      @prev="prev"
      @next="next"
      v-if="indicator===7"/>
    <!-- Fotos -->
    <Step8 
      :data="data"
      @prev="prev"
      @next="next"
      v-if="indicator===8"/>
    <Confirmation
      :data="data"
      @prev="prev"
      @save="save"
      v-if="indicator===9"/>
  </div>
</template>

<script>
import StepsIndicator from "@/components/steps/StepsIndicator"
import Step1 from "@/components/steps/Step1"
import Step2 from "@/components/steps/Step2"
import Step3 from "@/components/steps/Step3"
import Step4 from "@/components/steps/Step4"
import Step5 from "@/components/steps/Step5"
import Step6 from "@/components/steps/Step6"
import Step7 from "@/components/steps/Step7"
import Step8 from "@/components/steps/Step8"
import Confirmation from "@/components/steps/Confirmation"
import firebase from "firebase"

export default {
  name: 'Home',
  components:{StepsIndicator,Step1,Step2,Step3,Step4,Step5,Step6,Step7,Step8,Confirmation},
  data(){
    return{
      indicator:1,
      data:{},
      currentUser:""
    }
  },
  created(){
      const self=this
      //user
      firebase.auth().onAuthStateChanged(user=>{
          if(user){
              self.currentUser=user
          }else{
              self.currentUser=""
          }
      })
  },
  methods:{
    prev(incominData){
      this.data={...this.data,...incominData}
      this.indicator--
    },
    next(incominData){
      this.data={...this.data,...incominData}
      this.indicator++
      console.log(this.indicator)
      console.log(this.data)
    },
    save(){
      this.data={
        ...this.data,
        uid:this.currentUser.uid,
        date:"firestore.FieldValue.serverTimestamp()"}
    }
  }
}
</script>
