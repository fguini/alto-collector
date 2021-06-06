<template>
  <v-container fluid class="container">
    <v-row>
      <v-col col="6" xs="12">
        <local-settings />
      </v-col>
      <v-col col="6" xs="12">
        <device-information />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DeviceInformation from '@/components/DeviceInformation.vue';
import LocalSettings from '@/components/settings/LocalSettings.vue';

export default {
  name: 'Settings',
  components: {
    DeviceInformation,
    LocalSettings,
  },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
