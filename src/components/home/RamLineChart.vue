<template>
  <v-card>
    <v-container fluid>
      <line-chart :chart-data="this.ramChartData" :options="options" />
    </v-container>
  </v-card>
</template>

<script>
import { ipcRenderer } from 'electron';
import { getMemoryInformation } from '../../services/systemInformationService';
import { formatBytes, bytesSizeConverter } from '../../utils/numberUtils';
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

    const ramDataset = {
      label: this.$t('usage.memory.used'),
      borderColor: theme.secondary.base,
      pointBackgroundColor: theme.secondary.lighten2,
      pointBorderColor: theme.secondary.lighten4,
      data: [],
      fill: false,
    };

    const ramFreeDataset = {
      label: this.$t('usage.memory.free'),
      borderColor: theme.accent.lighten4,
      pointBackgroundColor: theme.accent.base,
      pointBorderColor: theme.accent.lighten2,
      data: [],
      fill: false,
    };

    const ramCachedDataset = {
      label: this.$t('usage.memory.cached'),
      borderColor: theme.error.base,
      pointBackgroundColor: theme.error.lighten2,
      pointBorderColor: theme.error.lighten4,
      data: [],
      fill: false,
    };

    return {
      baseSize: 'GB',
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: 0,
                stepSize: 0.1,
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
      ramDataset,
      ramFreeDataset,
      ramCachedDataset,
      ramChartData: {
        labels: this.labels,
        datasets: [ramDataset, ramFreeDataset, ramCachedDataset],
      },
    };
  },
  mounted() {
    this.getTotalRam()
      .then(() => {
        ipcRenderer.on(this.handlerName, (event, data) =>
          this.updateRamDataset(data.usage),
        );
      })
      .catch(error => `Error getting total ram: ${error}`);
  },
  beforeDestroy() {},
  methods: {
    updateRamDataset(usageData) {
      const ramUsage = usageData.ram;
      this.ramDataset = this.parseDataset(
        this.ramDataset,
        ramUsage.used,
        this.$t('usage.memory.used'),
      );
      this.ramFreeDataset = this.parseDataset(
        this.ramFreeDataset,
        ramUsage.free,
        this.$t('usage.memory.free'),
      );
      this.ramCachedDataset = this.parseDataset(
        this.ramCachedDataset,
        ramUsage.cached,
        this.$t('usage.memory.cached'),
      );

      this.ramChartData = {
        ...this.ramChartData,
        datasets: [this.ramDataset, this.ramFreeDataset, this.ramCachedDataset],
      };
    },
    async getTotalRam() {
      const totalRam = (await getMemoryInformation()).total;

      const [value, baseSize] = formatBytes(totalRam, 3).split(' ');
      const options = { ...this.options };
      options.scales.yAxes[0].ticks.max = parseFloat(value);
      this.options = options;
      this.baseSize = baseSize;
    },
    parseDataset(currentDataset, newValue, newLabel) {
      const sliceStart = currentDataset.data.length - 9;
      const data = currentDataset.data.slice(Math.max(0, sliceStart));
      const formattedValue = this.getFormattedValue(newValue);
      data.push(formattedValue);
      return {
        ...currentDataset,
        label: `${newLabel} (${formattedValue} ${this.baseSize})`,
        data,
      };
    },
    getFormattedValue(value) {
      let [formattedValue, size] = formatBytes(value, 3).split(' ');
      if (size !== this.baseSize)
        formattedValue = bytesSizeConverter(
          formattedValue,
          size,
          this.baseSize,
          3,
        );

      return formattedValue;
    },
  },
};
</script>
