<template>
    <div class="container mx-auto flex flex-col justify-items-center">
        <!-- Tabs -->
        <ul class="flex space-x-2 my-3">
            <li :class="{'border-primary text-primary':usuariosAct}" class="cursor-pointer border-2 px-2 py-1 rounded-md" @click="activar('usuarios')">Usuarios</li>
            <li :class="{'border-primary text-primary':desactivadasAct}" class="cursor-pointer border-2 px-2 py-1 rounded-md" @click="activar('desactivadas')">Prop. desactivadas</li>
        </ul>

        <!-- Usuarios -->
        <div v-if="usuariosAct">
            <section class="flex flex-col">
                <h1 class="text-4xl text-gray-600">Usuarios</h1>
                <table>
                    <thead>
                        <tr class="bg-gray-200 uppercase border ">
                            <th class="mx-2 text-left py-2 pl-5">Nombre</th>
                            <th class="mx-2 text-left pl-5">Correo</th>
                            <th class="mx-2 text-left pl-5">Teléfono</th>
                            <th class="mx-2 text-left pl-5">Opciones</th>
                        </tr>
                    </thead>
                
                    <tbody>
                        <tr v-for="(u,n) in users" 
                            :key=n
                            class="hover:bg-gray-300 cursor-pointer"
                                @click="selectUser(n)"
                        >
                            <td class="border-b text-left pl-5">{{u.name}}</td>
                            <td class="border-b text-left pl-5">{{u.email}}</td>
                            <td class="border-b text-left pl-5">{{u.phoneNumber}}</td>
                            <td class="border-b py-2 pl-5">
                                <button 
                                    @click="userRole(n)"
                                    class="m-1 px-1 rounded  text-xs"
                                    :class="u.admin ? 'bg-blue-900 text-blue-100 text-base py-1 px-3' : 'bg-gray-900 text-gray-100 text-base py-1 px-3'">
                                        {{ u.admin ? "Administrador" : "Colaborador" }}
                                </button>
                                <button 
                                    @click="userDelete(n)"
                                    v-if="!u.admin"
                                    class="m-1 rounded bg-red-600 text-white text-base py-1 px-3">Borrar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Propiedades -->
            <section v-if="selectedUser"  class="flex flex-col">
                <h1 class="text-4xl text-gray-600">Propiedades de {{ selectedUser.name}}</h1>
                <table >
                    <thead>
                        <tr class="bg-gray-200 uppercase border">
                            <th class="mx-2 text-center py-2">Id</th>
                            <th class="mx-2 text-left pl-5">Estado</th>
                            <th class="mx-2 text-left pl-5">Precio</th>
                            <th class="mx-2 text-left pl-5">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(p,n) in props" 
                            :key=n
                            class="hover:bg-gray-300 cursor-pointer">
                            <td class="border-b font-bold text-green-800 bg-green-300 text-center py-2">
                                <router-link :to="'/perfil-propiedad/'+ p.propId">
                                    {{ p.propId }}
                                </router-link>
                            </td>
                            <td class="border-b text-left pl-5">{{ p.status | aliasEstado }}</td>
                            <td class="border-b text-left pl-5">{{ p.s1_price | numberFormat }}  ₡</td>
                            <td class="border-b pl-5">
                                <!-- <button class="m-1 px-1 rounded bg-red-600 text-xs">Borrar</button> -->
                                <StatusProp v-if="p.status != 'vendido'" :propId="p.propId"></StatusProp>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>

        <ListaPropiedadesDesactivadas v-if="desactivadasAct" class="flex flex-col"></ListaPropiedadesDesactivadas>
    </div>
</template>

<script>
import {db} from "@/main.js"
import Swal from 'sweetalert2'
import ListaPropiedadesDesactivadas from "@/components/ListaPropiedadesDesactivadas"
import StatusProp from "@/components/StatusProp"

export default {
    name:"Admin",
    components: { ListaPropiedadesDesactivadas, StatusProp },
    data(){
        return{
            users: [],
            props: [],
            selectedUser: null,
            usuariosAct: true,
            desactivadasAct: false
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

    filters: {
        numberFormat: function(value){
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },

        aliasEstado: function (value) {
            switch (value) {
                case 'vendido':
                    return 'Propiedad vendida';
                case 'complete':
                    return 'A la venta';
                case 'desactivar':
                    return 'Desactivada';
                case 'deleted':
                    return 'Eliminada por el vendedor';
                default:
                    return 'asd';
            }
        }
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
            let query = db.collection('props').where("uid","==", this.selectedUser.uid);

            query.onSnapshot(querySnapshot => {
                let props = querySnapshot.docs
                this.props = []
                props.forEach( prop => {
                    this.props.push(prop.data())
                })
            }, err => {
                console.log(`Encountered error: ${err}`);
            });

        },

        activar(value) {
            if(value === 'usuarios') {
                console.log(value)
                this.usuariosAct = true
                this.desactivadasAct = false
            }
            if(value === 'desactivadas') {
                console.log(value)
                this.usuariosAct = false
                this.desactivadasAct = true
            }
        }
    }
}
</script>
