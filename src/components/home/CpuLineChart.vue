<template>
  <v-card>
    <v-container fluid>
      <line-chart :chart-data="this.cpuChartData" :options="this.options" />
    </v-container>
  </v-card>
</template>

<script>
import { ipcRenderer } from 'electron';
import LineChart from '../LineChart.vue';

export default {
  components: {
    LineChart,
  },
  props: ['labels', 'handlerName'],
  data() {
    const theme = this.$vuetify.theme.dark
      ? this.$vuetify.theme.themes.dark
      : this.$vuetify.theme.themes.light;

    const cpuDataset = {
      label: 'CPU (%)',
      borderColor: theme.secondary.base,
      pointBackgroundColor: theme.secondary.lighten2,
      pointBorderColor: theme.secondary.lighten4,
      data: [],
      fill: false,
    };

    const cpuUserDataset = {
      label: `${this.$t('usage.cpu.currentUserLoad')} (%)`,
      borderColor: theme.accent.lighten4,
      pointBackgroundColor: theme.accent.base,
      pointBorderColor: theme.accent.lighten2,
      data: [],
      fill: false,
    };

    const cpuSystemDataset = {
      label: `${this.$t('usage.cpu.currentSystemLoad')} (%)`,
      borderColor: theme.error.base,
      pointBackgroundColor: theme.error.lighten2,
      pointBorderColor: theme.error.lighten4,
      data: [],
      fill: false,
    };

    return {
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: 100,
                stepSize: 10,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
        animation: {
          duration: 0,
        },
      },
      cpuDataset,
      cpuUserDataset,
      cpuSystemDataset,
      cpuChartData: {
        labels: this.labels,
        datasets: [cpuDataset, cpuUserDataset, cpuSystemDataset],
      },
    };
  },
  mounted() {
    ipcRenderer.on(this.handlerName, (event, data) =>
      this.updateCpuDataset(data.usage),
    );
  },
  beforeDestroy() {},
  methods: {
    updateCpuDataset(dataUsage) {
      const cpuUsage = dataUsage.cpu;
      this.cpuDataset = this.parseDataset(
        this.cpuDataset,
        cpuUsage.currentLoad,
        `CPU (${cpuUsage.currentLoad.toFixed(0)} %)`,
      );
      this.cpuUserDataset = this.parseDataset(
        this.cpuUserDataset,
        cpuUsage.currentUserLoad,
        `${this.$t(
          'usage.cpu.currentUserLoad',
        )} (${cpuUsage.currentUserLoad.toFixed(0)} %)`,
      );
      this.cpuSystemDataset = this.parseDataset(
        this.cpuSystemDataset,
        cpuUsage.currentSystemLoad,
        `${this.$t(
          'usage.cpu.currentSystemLoad',
        )} (${cpuUsage.currentSystemLoad.toFixed(0)} %)`,
      );
      this.cpuChartData = {
        ...this.cpuChartData,
        datasets: [this.cpuDataset, this.cpuUserDataset, this.cpuSystemDataset],
      };
    },
    parseDataset(currentDataset, newValue, newLabel) {
      const sliceStart = currentDataset.data.length - 9;
      const data = currentDataset.data.slice(Math.max(0, sliceStart));
      data.push(newValue);
      return {
        ...currentDataset,
        label: newLabel,
        data,
      };
    },
  },
};
</script>
