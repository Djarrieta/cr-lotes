<template>
	<section class="mt-5">
		<h2 class="text-2xl text-gray-800 uppercase font-bold">Lista Propiedades Desactivadas</h2>
		<table >
			<thead>
				<tr class="bg-gray-200 uppercase border">
					<th class="mx-2 text-center py-4">ID</th>
					<th class="mx-2 text-left pl-5">Fecha en que se desactivó</th>
					<th class="mx-2 text-left pl-5">Fecha para eliminar definitivamente</th>
					<th class="mx-auto text-left pl-5">Opciones</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(p,n) in props" 
					:key=n
					class="hover:bg-gray-300 cursor-pointer">
					<td class="border-b font-bold text-green-800 bg-green-300 text-center">
						<router-link :to="'/perfil-propiedad/'+ p.propId">
								{{ p.propId }}
						</router-link>
					</td>
					<td class="border-b text-left pl-5">{{ p.dateDesac | fecha }} </td>
					<td class="border-b text-left pl-5">{{ p.dateDesac | fecha4 }} </td>
					<td class="border-b pl-5 py-2">
						<button @click="borrarPropiedad(p.propId)"  class="py-1 px-5 rounded bg-red-900 text-red-100 text-base">Borrar</button>
					</td>
				</tr>
			</tbody>
		</table>
	</section>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
import moment from 'moment';
import Swal from 'sweetalert2'

export default {
	name:"ListaPropiedadesDesactivadas",
	data(){
		return{
			props: []
		}
	},

	mounted() {
		let query = db.collection('props').where("status","==",'desactivar');

		query.onSnapshot(querySnapshot => {
			let props = querySnapshot.docs
			this.props = []
			props.forEach( prop => {
					this.props.push(prop.data())
			})
		}, err => {
			console.log(`Error: ${err}`);
		});
	},

		filters:{
				fecha: function(value){
						let fecha = new Date( value.seconds * 1000 )
						return moment(fecha).format('DD-MM-YYYY');
				},

				fecha4: function(value){
						let fecha = new Date( value.seconds * 1000 )
						return moment(fecha).add(4, 'months').format('DD-MM-YYYY');
				}
	},

	methods: {
		borrarPropiedad(id) {
			let self = this
			let storage = firebase.storage();
			let storageRef = storage.ref();

			function recorrerPropiedad() {
				self.props.forEach(e => {
					if(e.propId === id) {
						e.s8_pictures.forEach(titulos => {
							let desertRef = storageRef.child(`props/${id}/pics/${titulos.title}`);
							desertRef.delete().then(function() {
							}).catch(function(error) {
									console.log(error)
							});
						})
						e.s7_files.forEach(titulos => {
								let desertRef = storageRef.child(`props/${id}/docs/${titulos.code}`);
								desertRef.delete().then(function() {
								}).catch(function(error) {
										console.log(error)
								});
						})
					}
				})
			}

			async function asyncCall() {
				await recorrerPropiedad()
				db.collection('props').doc(id.toString()).delete();
			}

			Swal.fire({
				title: '¿Desea eliminar esta propiedad?',
				text: "Se borrará definitivamente junto a sus fotos y documentos.",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sí, deseo borrarla'
				}).then((result) => {
				if (result.isConfirmed) {
						asyncCall();
				}
				})
		}
	}
}
</script>

<style>

</style>