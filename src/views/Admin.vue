<template>
  <div class="container mx-auto flex flex-col justify-items-center">
        <!-- Usuarios -->
        <section class="flex flex-col">
            <h1 class="text-4xl text-gray-600">Usuarios</h1>
            <table >
                <thead class="flex">
                    <th class="mx-2 w-56 text-left">Nombre</th>
                    <th class="mx-2 w-56 text-left">Correo</th>
                    <th class="mx-2 w-56 text-left">Teléfono</th>
                    <th class="mx-2">Opciones</th>
                </thead>
            </table>
            <tbody>
                <tr 
                    v-for="(u,n) in users" 
                    :key=n
                    class="hover:bg-gray-300 cursor-pointer"
                        @click="selectUser(n)"
                    >
                    <td class="border-b w-56 text-left">{{u.name}}</td>
                    <td class="border-b w-56 text-left">{{u.email}}</td>
                    <td class="border-b w-56 text-left">{{u.phoneNumber}}</td>
                    <td class="border-b">
                        <button 
                            @click="userRole(n)"
                            class="m-1 px-1 rounded  text-xs"
                            :class="u.admin ? 'bg-blue-600' : 'bg-gray-600'">{{u.admin ?"Administrador" : "Colaborador"}}</button>
                        <button 
                            @click="userDelete(n)"
                            v-if="!u.admin"
                            class="m-1 px-1 rounded bg-red-600 text-xs">Borrar</button>
                    </td>
                </tr>
            </tbody>
        </section>
        <!-- Propiedades -->
        <section  v-if="selectedUser">
          <h1 class="text-4xl text-gray-600">Propiedades de {{ selectedUser.name}}</h1>
            <table >
                <thead class="flex">
                    <th class="mx-2 w-56 text-left">Id</th>
                    <th class="mx-2 w-56 text-left">Estado</th>
                    <th class="mx-2 w-56 text-left">Precio</th>
                    <th class="mx-2">Opciones</th>
                </thead>
            </table>
            <tbody>
                <tr 
                    v-for="(p,n) in props" 
                    :key=n
                    class="hover:bg-gray-300 cursor-pointer">
                    <td class="border-b w-56 text-left">{{p.propId}}</td>
                    <td class="border-b w-56 text-left">{{p.status}}</td>
                    <td class="border-b w-56 text-left">{{p.s1_price}}</td>
                    <td class="border-b">
                        <button 
                            class="m-1 px-1 rounded bg-red-600 text-xs"> Borrar
                        </button>
                    </td>
                </tr>
            </tbody>
        </section>
        <!-- Propiedades a subastar-->
        <section>
          <h1 class="text-4xl text-gray-600">Propiedades de {{ selectedUser.name}}</h1>
            <table >
                <thead class="flex">
                    <th class="mx-2 w-56 text-left">Id</th>
                    <th class="mx-2 w-56 text-left">Estado</th>
                    <th class="mx-2 w-56 text-left">Precio</th>
                    <th class="mx-2">Opciones</th>
                </thead>
            </table>
            <tbody>
                <tr 
                    v-for="(p,n) in props" 
                    :key=n
                    class="hover:bg-gray-300 cursor-pointer">
                    <td class="border-b w-56 text-left">{{p.propId}}</td>
                    <td class="border-b w-56 text-left">{{p.status}}</td>
                    <td class="border-b w-56 text-left">{{p.s1_price}}</td>
                    <td class="border-b">
                        <button 
                            class="m-1 px-1 rounded bg-red-600 text-xs">Borrar
                        </button>
                    </td>
                </tr>
            </tbody>
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
            users:[],
            props:[],
            selectedUser:null
        }
    },
    created(){
        db.collection("users").onSnapshot((users)=>{
            this.users=[]
            users.forEach(user => {
                this.users.push({
                    uid:user.id,
                    ...user.data()
                })
            });
        })
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
            this.selectedUser=this.users[n]
            db.collection("props").where("uid","==",this.selectedUser.uid).get()
            .then(props=>{
                this.props=[]
                props.forEach(prop=>{
                    this.props.push(prop.data())
                })
            }).catch(e=>console.error(e))
        }
    }
}
</script>
