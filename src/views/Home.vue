<template>
  <v-container fluid class="container">
    <v-row>
      <v-col cols="9" xs="12">
        <system-information />
      </v-col>
      <v-col cols="3" xs="12">
        <device-information />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <cpu-line-chart :labels="labels" :handler-name="handlerName" />
      </v-col>
      <v-col>
        <ram-line-chart :labels="labels" :handler-name="handlerName" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ipcRenderer } from 'electron';
import CpuLineChart from '@/components/home/CpuLineChart.vue';
import DeviceInformation from '@/components/DeviceInformation.vue';
import RamLineChart from '@/components/home/RamLineChart.vue';
import SystemInformation from '@/components/home/SystemInformation.vue';

export default {
  name: 'Home',
  components: {
    CpuLineChart,
    DeviceInformation,
    RamLineChart,
    SystemInformation,
  },
  data() {
    return {
      handlerId: -1,
      handlerName: 'subscribe-usage-handler',
      labels: ['', '', '', '', '', '', '', '', '', ''],
      usage: {},
    };
  },
  computed: {},
  mounted() {
    this.handlerId = ipcRenderer.sendSync('subscribe-usage', this.handlerName);
  },
  destroyed() {
    ipcRenderer.send('unsubscribe-usage', this.handlerId);
    ipcRenderer.removeAllListeners('subscribe-usage-handler');
  },
};
</script>

<style scoped>
.container {
  overflow-y: scroll;
  max-height: 100vh;
}

.coso {
  color: var(--v-secondary-base);
}
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  background: var(--v-secondary-base);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--v-secondary-darken4);
}
</style>
