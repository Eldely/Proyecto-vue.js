<template>
  <div id="actividad02">
    <!-- Breadcrumb -->
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
          <a href="#" class="text-gray-600">Actividad 02</a>
        </li>
      </ol>
    </nav>

    <div class="lg:flex justify-between items-center mb-6">
      <p class="text-2xl font-semibold mb-2 lg:mb-0">¡Bienvenido!</p>
    </div>

    <div class="flex flex-wrap -mx-3 mb-20">
      <div class="w-full px-3">
        <div class="bg-white p-8 rounded-lg shadow-xl">
          <div class="mb-8">
            <!-- Filtros -->
            <div class="flex flex-wrap gap-4 mb-4 items-center">
              <select v-model="selectedPeriodo" class="border border-gray-300 rounded px-4 py-2 text-sm">
                <option disabled value="">Periodo</option>
                <option v-for="periodo in periodos" :key="periodo" :value="periodo">{{ periodo }}</option>
              </select>

              <select v-model="selectedCategory" class="border border-gray-300 rounded px-4 py-2 text-sm">
                <option disabled value="">Sexo o Total</option>
                <option value="sexo_feme">Femenino</option>
                <option value="sexo_masc">Masculino</option>
                <option value="total_matricula">Total inscritos</option>
              </select>

              <button @click="filtrarDatos" class="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
                Filtrar
              </button>
              <button @click="limpiarFiltros"
                class="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-600 text-sm flex-shrink-0">
                Limpiar
              </button>
            </div>
            <!-- Gráfico -->
            <bar-chart :chart-data="chartData"></bar-chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bar, mixins } from 'vue-chartjs';
import axios from 'axios';
const { reactiveProp } = mixins;

export default {
  components: {
    BarChart: {
      extends: Bar,
      mixins: [reactiveProp],
      props: ['options'],
      mounted() {
        // Renderiza el gráfico con datos y opciones reactivos
        this.renderChart(this.chartData, this.options);
      }
    }
  },
  data() {
    return {
      datos: [],
      selectedPeriodo: '',
      selectedCategory: '',
      periodos: [],
      chartData: null,
      totalMatriculas: 0,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
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
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    },
    filtrarDatos() {
      let filteredData = this.selectedPeriodo ?
        this.datos.filter(d => d.periodo === this.selectedPeriodo) :
        this.datos;

      // Si 'selectedCategory' no está seleccionado, mostrar el total de inscritos
      const categoryKey = this.selectedCategory || 'total_matricula';

      const programs = [...new Set(filteredData.map(item => item.programa))];
      const data = programs.map(program => {
        const programData = filteredData.filter(item => item.programa === program);
        const total = programData.reduce((sum, item) => sum + (parseInt(item[categoryKey], 10) || 0), 0);
        return total;
      });

      this.totalMatriculas = data.reduce((sum, num) => sum + num, 0);

      this.chartData = {
        labels: programs,
        datasets: [{
          label: `Total general: ${this.totalMatriculas} - ${categoryKey.replace(/_/g, ' ')} por Programa`,
          data: data,
          backgroundColor: this.generarColores(programs.length),
          borderColor: this.generarColores(programs.length),
          borderWidth: 1
        }]
      };
    },
    generarColores(num) {
      return Array.from({ length: num }, () => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`);
    },
    limpiarFiltros() {
      this.selectedPeriodo = '';
      this.selectedCategory = '';
    }
  }
};

</script>