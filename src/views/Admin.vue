<template>
  <div class="container mx-auto flex flex-col justify-items-center">
      <!-- tabs -->
      <div>
        <button @click="changeTab('usuarios')" class=" border border-primary rounded p-2 bg-white hover:bg-gray-300  focus:outline-none  text-primary text-xl m-2" :class="tab==='usuarios' ? 'bg-blue-100' : 'none'">Usuarios</button>
        <button @click="changeTab('propiedades')" class=" border border-primary rounded p-2 bg-white hover:bg-gray-300  focus:outline-none  text-primary text-xl m-2 " :class="tab==='propiedades' ? 'bg-blue-100' : 'none'">Propiedades</button>
      </div>
			<!-- Usuarios -->
      <section  v-if="tab==='usuarios'" class="flex flex-col mt-5">
        <table>
          <thead>
            <tr class="bg-gray-200 border flex py-1">
              <th class="ml-4 | w-1/2 sm:w-1/4 | text-left" >Usuario</th>
              <th class="hidden sm:block | w-1/4 | text-left">Teléfono</th>
              <th class="hidden sm:block | w-1/4 | text-left">Correo</th>
              <th class="w-1/2 sm:w-1/4 ">Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(u,n) in users" 
              :key=n
              class="hover:bg-gray-300 | flex justify-between items-center | border-b m-1">
                <!-- Datos -->
                <td class="flex flex-col  | w-2/3 sm:w-1/4 | text-left pl-5">
                  <span class="text-2xl sm:text-base">{{u.name}}</span>
                  <span class="text-xs | sm:hidden">{{u.email}}</span>
                  <span class="text-xs | sm:hidden">{{u.phoneNumber}}</span>
                </td>
                  <!-- Datos solo visibles después de sm -->
                <td class="hidden sm:flex  | sm:w-1/4 | text-left pl-5">
                  <span class="text-left">{{u.phoneNumber}}</span>
                </td>
                <td class="hidden sm:block justify-center | sm:w-1/4 | text-left pl-5">
                  <span class="text-xs">{{u.email}}</span>
                </td>

                <!-- opciones -->
                <td class="flex flex-col justify-center items-center | w-1/3 ">
                  <button 
                    @click="userRole(n)"
                    class="w-full sm:w-32 | px-1 mx-2  | rounded text-xs"
                    :class="u.admin ? 'bg-blue-600 text-blue-100 ' : 'bg-gray-400'">
                      {{ u.admin ? "Administrador" : "Colaborador" }}
                  </button>
                  <button 
                    @click="selectUser(n)"
                    class="w-full sm:w-32 | px-1 mx-2 my-1 | rounded text-xs bg-gray-400">Ver Propiedades</button>
                  <button 
                    @click="userDelete(n)"
                    v-if="!u.admin"
                    class="w-full sm:w-32 | px-1 mx-2  | rounded text-xs bg-primary text-white">Borrar</button>
                  
                </td>
            </tr>
          </tbody>
        </table>
      </section>
      <!-- Propiedades -->
      <section v-if="tab==='propiedades'"  class="flex flex-col my-10 ">
        <!-- Filtros -->
        <div class="flex flex-col | bg-gray-200 p-2 rounded m-2 | max-w-md">
          <!-- Usuario -->
          <div class="flex | m-1">
            <label class=" font-bold | m-1">Usuario:</label>
            <select  class="w-full rounded" v-model="propSelectedUser">
              <option value="Todos">Todos</option>
              <option 
                v-for="(u,n) in users" 
                :key="n"
                :value=u.uid >{{ u.name }}</option>
            </select>
          </div>
          <!-- Estado -->
          <div class="flex | m-1">
            <label class=" font-bold | m-1 ">Estado:</label>
            <select 
              class="w-full roundedd" v-model="propSelectedEstado">
                <option value="Todos">Todos</option>
                <option 
                  v-for="(e,n) in estados" 
                  :key="n"
                  :value="e">{{e}}</option>
            </select>
          </div>
        </div>
        <!-- Lista Propiedades -->
        <table >
          <thead>
            <tr class="bg-gray-200 border flex py-1">
              <th class="ml-4 | w-1/2 sm:w-1/5 | text-left" >Propiedad</th>
              <th class="hidden sm:block | w-1/5 | text-left">Fecha</th>
              <th class="hidden sm:block | w-1/5 | text-left">Precio</th>
              <th class="hidden sm:block | w-1/5 | text-left">Estado</th>
              <th class="w-1/2 sm:w-1/5 ">Opciones</th>
            </tr>
          </thead>
          <tbody>
           <tr  
              v-for="(p,n) in propsFiltered" 
              :key=n
              class="hover:bg-gray-300 | flex justify-between items-center | border-b m-1 py-1">
                <!-- Datos -->
                <td class="flex flex-col sm:w-1/5">
                  <span class="text-lg">{{p.propId}}</span>
                  <!-- Precio -->
                  <div>
                    <span 
                      class="text-primary sm:hidden" 
                      :class="p.s1_price_off ? 'line-through text-xs' : 'none'">₡ {{p.s1_price | numberFormat}}  </span> 
                      <span class="sm:hidden" v-if="p.s1_price_off"> {{p.s1_price_off}}% </span>
                  </div>
                  <span v-if="p.s1_price_off" class=" text-green-700 sm:hidden">₡ {{Math.round(p.s1_price - ((p.s1_price * p.s1_price_off) / 100)) | numberFormat }}</span>
                  <!-- Creado -->
                  <div class="text-xs sm:hidden">
                    <span class="font-bold">Creado:</span>
                    <span>{{ p.date | dateFormat }}</span>
                  </div>
                  <!-- Modificado -->
                  <div class="text-xs sm:hidden">
                    <span class="font-bold">Modificado:</span>
                    <span>{{ p.date | dateFormat }}</span>
                  </div>
                </td>
                <!-- Fecha -->
                <td class="hidden | sm:flex flex-col | sm:w-1/5 text-xs">
                  <div>
                    <span class="font-bold text-sx">Creado:</span>
                    <span>{{ p.date | dateFormat }}</span>
                  </div>
                  <div>
                    <span class="font-bold">Modificado:</span>
                    <span>{{ p.date | dateFormat }}</span>
                  </div>
                </td>
                <!-- precio -->
                <td class="hidden sm:block text-primary | sm:w-1/5 ml-2">
                  <div>
                    <span 
                      class="text-primary " 
                      :class="p.s1_price_off ? 'line-through text-xs' : 'none'">₡ {{p.s1_price | numberFormat}}  </span> 
                      <span class="" v-if="p.s1_price_off"> {{p.s1_price_off}}% </span>
                  </div>
                  <span v-if="p.s1_price_off" class=" text-green-700 ">₡ {{Math.round(p.s1_price - ((p.s1_price * p.s1_price_off) / 100)) | numberFormat }}</span>
                </td>
                <!-- Estados -->
                <td class="flex flex-col mx-2 | sm:w-1/5">
                  <select v-model="p.status" class="text-xs rounded">
                    <option 
                      v-for="(s,n) in estados"
                      :key="n"
                      :value="s"
                      class="text-xs">
                        {{s}}
                      </option>
                  </select>
                  <!-- Subastar -->
                  <div>
                    <span class="text-xs font-bold">Subastar:</span>
                    <select v-model="p.subastarTexto" class="text-xs rounded">
                      <option value="Si"
                        class="text-xs">
                          Si
                        </option>
                        <option value="No"
                        class="text-xs">
                          No
                        </option>
                    </select>
                  </div>
                  <button 
                    @click="updateStatus(p.propId)"
                    class="w-full sm:w-32 | px-1 mx-2 my-1 | rounded text-xs bg-gray-400">
                      Guardar
                  </button>
                </td>
                <!-- opciones -->
                <td class="flex flex-col justify-center items-center | w-1/3 mx-1 sm:w-1/5">
                  <router-link 
                    :to="'/publicar/'+ p.propId"
                    class="w-full sm:w-32 | px-1 mx-2 my-1 | rounded text-xs text-center bg-gray-400">
                      Editar</router-link>
                  <router-link 
                    target="_blank"
                    :to="'/perfil-propiedad/'+ p.propId"
                    class="w-full sm:w-32 | px-1 mx-2 my-1 | rounded text-xs text-center bg-gray-400">
                      Ver Detalles</router-link>
                  <button 
                    class="w-full sm:w-32 | px-1 mx-2 my-1 | rounded text-xs bg-primary text-gray-100">
                      Eliminar
                  </button>
                </td>
           </tr>
          </tbody>
        </table>
      </section>
  </div>
</template>

<script>
import {db} from "@/main.js"
import Swal from 'sweetalert2'

export default {
  name:"Admin",
  
  data(){
    return{
      users: [],
      props: [],
      propSelectedUser:"Todos",
      propSelectedEstado:"Todos",
      estados:[
        "En venta",
        "Aprobación",
        "Vendido",
        "Desactivado",
        "Eliminado"
      ],
      tab:"usuarios"
    }
  },
  computed:{
    propsFiltered(){
      let ps=this.props
      if(this.propSelectedUser!="Todos"){
        ps= ps.filter(p=>p.uid===this.propSelectedUser)
      }
      if(this.propSelectedEstado!="Todos"){
        ps= ps.filter(p=>p.status===this.propSelectedEstado)
      }
      return ps
    }
  },
  created(){
    /* Usuarios */
    db.collection("users").onSnapshot((users)=>{
      this.users=[]
      users.forEach(user => {
        this.users.push({
          uid:user.id,
          ...user.data()
        })
      });
    })
    /* Propiedades  */
    db.collection("props").orderBy("propId","desc").get().then(props=>{
      props.forEach(p=>{
        let subastar="No"
        if(p.data().subastar){
          subastar="Si"
        }
        this.props.push({...p.data(),subastarTexto:subastar})
      })
    })
  },

  filters: {
    numberFormat: function(value){
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    dateFormat(date){
      const d=new Date(date.seconds*1000)
      return d.getDay() + "/" + d.getMonth()+ "/" + d.getFullYear()
    },
  },

  methods:{
    userRole(n){
      const user=this.users[n]
      if(user.admin){
        //si es administrador y hay más de un administrador lo cambia
        let adminAmount=this.users.filter(u=>u.admin)
        if(adminAmount.length>1){
          db.collection("users").doc(user.uid).update({admin:false})
        }
      }else{
        //si no es administrador lo cambia
        db.collection("users").doc(user.uid).update({admin:true})
      }
    },
    userDelete(n){
      const user=this.users[n]
      if(!user.admin){
        //si no es administrador lo borra, como Auth() no permite borrar otros usuarios, solo borra en firebase
        Swal.fire({
          title: '¿Quieres borrar este usuario de forma permanente?',
          showDenyButton: true,
          confirmButtonText: `Borrar`,
          denyButtonText: `No borrar`,
        }).then((result) => {
          if (result.isConfirmed) {
            db.collection("users").doc(user.uid)
            .delete().catch(e=>console.error(e))
          }
        }).catch(e=>console.error(e))
      }
    },
    selectUser(n){
      this.propSelectedUser=this.users[n].uid
      this.tab="propiedades"
    },
    updateStatus(propId){
      
      const prop=this.propsFiltered.filter(p=>p.propId===propId)
      let subastar=false
      if(prop[0].subastarTexto=="Si"){subastar=true}

      const status=prop[0].status
      Swal.fire({
          title: '¿Esta Seguro que desea modificar estos datos?',
          showDenyButton: true,
          confirmButtonText: `Modificar`,
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            db.collection("props").doc(propId.toString()).update({subastar,status,}) 
          }
        }).catch(e=>console.error(e))
    },
    changeTab(tab){
      this.tab=tab
    }
  }
}
</script>
