<template>
  <section>
    <!-- loading -->
    <div v-if="loading" class="flex justify-center items-center opacity-25">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    <template v-if="favoritos && favoritos.length > 0 && loading===false">
      <h2 class="text-2xl font-bold mb-5 tracking-wide">Lista de favoritos</h2>
      <button class="border-2 border-primary mb-5 text-primary font-bold rounder-md px-3 py-2" @click="listaJson()">Descargar a EXCEL</button>
      <table class="w-full overflow-hidden">
          <thead>
              <tr class="bg-gray-200 uppercase border">
                  <th class="mx-2 text-center py-2 visible w-auto"></th>
                  <th class="mx-2 text-center py-2 visible w-auto">Título</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Área</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Precio</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Provincia</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Cantón</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Distrito</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Tipo de frente</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Inclinación</th>
                  <th class="mx-2 text-center py-2 hidden lg:table-cell">Nivel</th>
              </tr>
          </thead>
          <tbody>
            <tr  v-for="propiedad in propiedadesAll" :key="propiedad.propId">
                <td class="border-b text-left pl-5 visible"><Favorito :propId="propiedad.propId" /></td>
                <td class="border-b text-left pl-5 visible">
                  <router-link :to="'/perfil-propiedad/'+ propiedad.propId"><i class="fas fa-link"></i> {{ propiedad.s1_title }}</router-link>
                </td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s1_area | numberFormat }} {{ propiedad.s1_areaUn }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s1_price | numberFormat }} ₡</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s2_namePrvSelected }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s2_nameCtnSelected }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s2_nameDttSelected }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s3_frontType }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s4_inclination }}</td>
                <td class="border-b text-left pl-5 hidden lg:table-cell">{{ propiedad.s5_nivel }}</td>
            </tr>
          </tbody>
      </table>
    </template>

    <template v-else-if="!favoritos  && loading===false">
      <h2 class="text-2xl font-bold mb-5 tracking-wide">Lista de favoritos</h2>
      <p>No tiene ninguna propiedad como favorita.</p>
    </template>
    
    <template v-else-if="favoritos.length===0  && loading===false">
      <h2 class="text-2xl font-bold mb-5 tracking-wide">Lista de favoritos</h2>
      <p>No tiene ninguna propiedad como favorita.</p>
    </template>
  </section>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main";
import Favorito from "@/components/Favorito"
export default {
    name:"listaFavoritos",
    components: { Favorito },
    props:["uid"],
    data(){
        return {
            idUser: '',
            status: false,
            favoritos: [],
            propiedadesAll: [],
            loading: true,
            myStr: '',
            todos: []
        }
    },
    created() {
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          this.idUser = user.uid
        } else {
          this.idUser = this.uid
        }
      })
      
    },

    filters: {
      numberFormat: function(value){
        let val = (value/1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
    },

    mounted() {
      let self = this
        // Lista de favoritos
        let favoritos = db.collection('users');
        favoritos
            .get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                if(doc.id === self.uid) {
                    self.favoritos = doc.data().favoritos

                    // Seleccionar solo las propiedades que están en favorito
                    let propiedades = db.collection('props');
                    
                    if(self.favoritos && self.favoritos.length > 0) {
                      propiedades
                        .get()
                        .then(function(querySnapshot) {
                          querySnapshot.forEach(function(doc) {
                              if(self.favoritos.includes(doc.data().propId)) {
                                self.propiedadesAll.push(doc.data())
                                
                                self.todos.push([
                                                  doc.data().s1_title,
                                                  doc.data().s1_area,
                                                  doc.data().s1_areaUn,
                                                  doc.data().s1_price,
                                                  doc.data().s2_namePrvSelected,
                                                  doc.data().s2_nameCtnSelected,
                                                  doc.data().s2_nameDttSelected,
                                                  doc.data().s3_frontType,
                                                  doc.data().s4_inclination,
                                                  doc.data().s5_nivel
                                              ])
                              }
                          });
                        })
                    }
                }
              });
              
              self.loading = false
            })

    },

    methods: {
      listaJson: function (ReportTitle = 'FAVORITOS', ShowLabel = true) {	
            this.myStr = JSON.stringify(this.todos);
            let arrData = typeof this.myStr != 'object' ? JSON.parse(this.myStr) : this.myStr;

            let CSV = 'sep=,' + '\r\n\n';
            if (ShowLabel) {
                let row = "";
                for (let index in arrData[0]) {
                    row += index + ',';
                }

                row = ['Título', 'Medida', 'Unidad de medida', 'Precio', 'Provincia', 'Canton', 'Distrito', 'Tipo de frente', 'Inclinación', 'Nivel', '']

                row = row.slice(0, -1);
                CSV += row + '\r\n';
            }
            for (let i = 0; i < arrData.length; i++) {
                let row = "";
                for (let index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);
                CSV += row + '\r\n';
            }
             if (CSV == '') {
                alert("Invalid data");
                return;
            }   
            let fileName = "Favoritos_CR_LOTES_";
            fileName += ReportTitle.replace(/ /g,"_");   
            
            let uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
            let link = document.createElement("a");    
            link.href = uri;
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
</script>