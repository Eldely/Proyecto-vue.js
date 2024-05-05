<template>
    <div id="actividad01" >
        <!-- breadcrumb -->
        <nav class="text-sm font-semibold mb-6" aria-label="Breadcrumb">
            <ol class="list-none p-0 inline-flex">
                <li class="flex items-center text-blue-500">
                    <a href="#" class="text-gray-700">Inicio</a>
                    <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path
                            d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                    </svg>
                </li>
                <li class="flex items-center">
                    <a href="#" class="text-gray-600">Actividad 01</a>
                </li>
            </ol>
        </nav>
        <!-- breadcrumb end -->

        <div class="lg:flex justify-between items-center mb-6">
            <p class="text-2xl font-semibold mb-2 lg:mb-0">¡Bienvenido!</p>
        </div>

        <div class="flex flex-wrap -mx-3 mb-20">
            <div class="w-full px-3">
                <div class="bg-white p-8 rounded-lg shadow-xl">
                    <div class="mb-8">
                        <!-- Filtros con ajustes para mejor visualización -->
                        <div class="flex flex-wrap gap-4 mb-4">
                            <select v-model="selectedPeriodo"
                                class="border border-gray-300 rounded px-4 py-2 text-sm flex-grow">
                                <option disabled value="">Periodo</option>
                                <option v-for="periodo in periodos" :key="periodo" :value="periodo">{{ periodo }}</option>
                            </select>
                            <select v-model="selectedFacultad"
                                class="border border-gray-300 rounded px-4 py-2 text-sm flex-grow">
                                <option disabled value="">Facultad</option>
                                <option v-for="facultad in facultades" :key="facultad" :value="facultad">{{ facultad }}
                                </option>
                            </select>
                            <button @click="filtrarDatos"
                                class="bg-blue-400 text-black px-4 py-2 rounded hover:bg-blue-600 text-sm flex-shrink-0">
                                Buscar
                            </button>
                            <button @click="limpiarFiltros" class="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-600 text-sm flex-shrink-0">
                                Limpiar
                            </button>
                            <select v-model="selectedPrograma"
                                class="border border-gray-300 rounded px-4 py-2 text-sm flex-grow">
                                <option disabled value="">Programa</option>
                                <option v-for="programa in programas" :key="programa" :value="programa">{{ programa }}
                                </option>
                            </select>
                            
                          
                        </div>
                        <!-- Tabla de datos filtrados con estilos más compactos y desplazamiento horizontal -->
                        <div class="overflow-x-auto rounded-lg shadow">
                            <table class="w-full text-xs">
                                <thead class="bg-blue-300">
                                    <tr>
                                        <th class="p-2 text-left font-semibold">Periodo</th>
                                        <th class="p-2 text-left font-semibold">Facultad</th>
                                        <th class="p-2 text-left font-semibold">Programa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="datosFiltrados.length === 0">
                                        <td colspan="3" class="p-2 text-center text-gray-500">No hay datos para mostrar.
                                        </td>
                                    </tr>
                                    <tr v-else v-for="(item, index) in datosFiltrados" :key="index">
                                        <td class="p-2 border-t border-gray-300">{{ item.periodo }}</td>
                                        <td class="p-2 border-t border-gray-300">{{ item.facultad }}</td>
                                        <td class="p-2 border-t border-gray-300">{{ item.programa }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            datos: [],
            datosFiltrados: [],
            selectedPeriodo: '',
            selectedFacultad: '',
            selectedPrograma: '',
            periodos: [],
            facultades: [],
            programas: []
        };
    },
    mounted() {
        this.cargarDatos();
    },
    methods: {
        async cargarDatos() {
            try {
                const response = await axios.get('https://www.datos.gov.co/resource/r86y-229a.json');
                this.datos = response.data;
                this.periodos = [...new Set(this.datos.map(item => item.periodo))];
                this.facultades = [...new Set(this.datos.map(item => item.facultad))];
                this.programas = [...new Set(this.datos.map(item => item.programa))];
                this.datosFiltrados = this.datos; // Muestra todos los datos inicialmente
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        },
        filtrarDatos() {
            this.datosFiltrados = this.datos.filter((dato) => {
                return (!this.selectedPeriodo || dato.periodo === this.selectedPeriodo) &&
                    (!this.selectedFacultad || dato.facultad === this.selectedFacultad) &&
                    (!this.selectedPrograma || dato.programa === this.selectedPrograma);
            });
        },
        limpiarFiltros() {
            this.selectedPeriodo = '';
            this.selectedFacultad = '';
            this.selectedPrograma = '';
            this.datosFiltrados = this.datos; // Vuelve a mostrar todos los datos
        }
    }
};
</script>