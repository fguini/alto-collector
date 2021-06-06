<template>
  <v-card tile>
    <v-card-title>{{ $t('home.systemInformation.title') }}</v-card-title>
    <v-card-text class="column-wrap">
      <v-list-item v-for="info in sysInfo" :key="info.name" inactive flat>
        <v-list-item-content>
          <v-list-item-title>
            {{ info.title || $t(info.key, info.values) }}
          </v-list-item-title>
          <v-list-item-subtitle
            v-for="(subtitle, index) in info.subtitles"
            :key="index"
          >
            {{ subtitle.text || $t(subtitle.key, subtitle.values) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script>
import { getSystemInformation } from '../../services/systemInformationService';
import { formatBytes } from '../../utils/numberUtils';

export default {
  name: 'systemInformation',
  data() {
    return {
      cores: this.$t('systemInformation.cpu.cores'),
      sysInfo: [],
    };
  },
  mounted() {
    this.getSystemInformation().catch(error => console.error(error));
  },
  methods: {
    async getSystemInformation() {
      const sysInfo = await getSystemInformation();

      this.sysInfo = [
        this.getComputerInformation(sysInfo.computer, sysInfo.mother),
        this.getCpuInformation(sysInfo.cpu),
        this.getDisplayInformation(sysInfo.displays),
        this.getOsInformation(sysInfo.os, sysInfo.disk),
        this.getRamInformation(sysInfo.memory),
        this.getGraphicsInformation(sysInfo.graphics),
      ];
    },
    getComputerInformation(computer, mother) {
      return {
        name: 'computer',
        title: `${computer.manufacturer} ${computer.version}`,
        subtitles: [
          {
            key: 'home.systemInformation.motherboard',
            values: [mother.manufacturer, mother.model, mother.version],
          },
        ],
      };
    },
    getCpuInformation(cpu) {
      return {
        name: 'cpu',
        title: `${cpu.manufacturer} ${cpu.brand} (${cpu.speed} GHz)`,
        subtitles: [
          {
            key: 'home.systemInformation.cpuCores',
            values: [cpu.cores, cpu.physicalCores],
          },
        ],
      };
    },
    getRamInformation(memory) {
      return {
        name: 'ram',
        title: `${formatBytes(memory.total)} RAM`,
        subtitles:
          memory.layout.length > 1
            ? memory.layout.map((m, i) => {
                const details = [`#${i + 1}`];
                if (m.bank) details.push(m.bank);
                if (m.manufacturer) details.push(m.manufacturer);
                details.push(formatBytes(m.size));
                if (m.type) details.push(m.type);
                return {
                  key: 'home.systemInformation.ramLayout',
                  values: [details.join(' ')],
                };
              })
            : [],
      };
    },
    getOsInformation(os, disk) {
      return {
        name: 'disk',
        title: `${os.distro} ${os.release} ${os.architecture} (${os.kernel})`,
        subtitles: disk.map(d => ({
          key: 'home.systemInformation.disk',
          values: [d.device, formatBytes(d.size), d.type, d.name],
        })),
      };
    },
    getDisplayInformation(displays) {
      const main = displays.find(display => display.main);
      const mainData = [];
      if (main.builtIn) mainData.push(main.builtIn);
      if (main.manufacturer) mainData.push(main.manufacturer);
      if (main.model) mainData.push(main.model);
      if (main.connection) mainData.push(main.connection);
      const secondaries = displays.filter(display => !display.main);

      return {
        name: 'display',
        key: 'home.systemInformation.displayMain',
        values: [mainData.join(' '), main.resolution],
        subtitles: secondaries.map((secondary, index) => {
          const secondaryData = [];
          if (secondary.builtIn) secondaryData.push(secondary.builtIn);
          if (secondary.manufacturer)
            secondaryData.push(secondary.manufacturer);
          if (secondary.model) secondaryData.push(secondary.model);
          if (secondary.connection) secondaryData.push(secondary.connection);
          return {
            key: 'home.systemInformation.displaySecondary',
            values: [index + 2, secondaryData.join(' '), secondary.resolution],
          };
        }),
      };
    },
    getGraphicsInformation(graphics) {
      const first = graphics.shift();
      return {
        name: 'graphic',
        title: `${first.manufacturer} ${first.model} (vram ${first.vram})`,
        subtitles: graphics.length
          ? graphics.map((graphic, index) => ({
              text: `#${index + 2} ${graphic.manufacturer} ${
                graphic.model
              } (vram ${graphic.vram})`,
            }))
          : [],
      };
    },
  },
};
</script>

<style scoped>
.column-wrap {
  column-count: 2;
}
.column-wrap .v-list-item__content {
  padding: 0;
}
</style>
