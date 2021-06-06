<template>
  <v-card height="100%" tile :loading="loading">
    <v-card-title>
      {{ deviceName }}
    </v-card-title>
    <v-card-subtitle v-if="localDeviceName">
      {{ localDeviceName }}
    </v-card-subtitle>
    <v-card-text>
      <v-list-item inactive flat>
        <v-list-item-avatar tile size="100">
          <v-img :src="image" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ companyName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ profileName }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script>
import { getDevice } from '../services/deviceService';
import { getOsInformation } from '../services/systemInformationService';

export default {
  name: 'deviceInformation',
  data() {
    return {
      companyName: '',
      deviceName: '',
      image: '',
      loading: true,
      localDeviceName: '',
      machineId: '',
      profileName: '',
    };
  },
  mounted() {
    this.getDeviceName()
      .then(() =>
        this.getDeviceInformation()
          .then(() => (this.loading = false))
          .catch(error => console.error(error)),
      )
      .catch(error => console.error(error));
  },
  methods: {
    async getDeviceName() {
      const osInfo = await getOsInformation();
      this.deviceName = osInfo.hostname;
    },
    async getDeviceInformation() {
      const device = await getDevice();
      if (device.name && device.name !== this.deviceName) {
        this.localDeviceName = this.deviceName;
        this.deviceName = device.name;
      }
      this.companyName = device.companyName;
      this.image = device.image;
      this.machineId = device.machineId;
      this.profileName = device.profileName;
    },
  },
};
</script>

<style scoped>
.device-card {
  height: 100%;
}
</style>
