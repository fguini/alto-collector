<template>
  <v-card tile :loading="loading">
    <v-card-title>
      {{ $t('settings.local.title') }}
    </v-card-title>
    <v-card-text>
      <v-switch
        v-model="settings.startWithSystem"
        name="startWithSystem"
        color="secondary"
        flat
        :label="$t('settings.local.startWithSystem')"
        v-on:change="changeStartWithSystem"
      ></v-switch>
      <v-select
        :items="times"
        :label="$t('settings.local.pushTime')"
        v-model="settings.pushTime"
        @change="changeSetting('pushTime', $event)"
      ></v-select>
      <v-select
        :items="times"
        :label="$t('settings.local.collectTime')"
        v-model="settings.collectTime"
        @change="changeSetting('collectTime', $event)"
      ></v-select>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment';
import {
  getSettings,
  setStartWithSystem,
  upsertSetting,
} from '../../services/settingService';

const TIMESPANS = [5000, 60000, 300000, 900000, 1800000];

export default {
  name: 'LocalSettings',
  data() {
    return {
      loading: true,
      settings: {},
    };
  },
  computed: {
    times() {
      return this.getTimes();
    },
  },
  mounted() {
    getSettings()
      .then(settings => {
        settings.forEach(
          setting => (this.settings[setting.key] = setting.value),
        );
        this.loading = false;
      })
      .catch(error => console.error(error));
  },
  methods: {
    changeStartWithSystem(value) {
      setStartWithSystem(value).catch(error => {
        console.error('Updating startWithSystem', error);
        this.startWithSystem = !value;
      });
    },
    changeSetting(key, value) {
      upsertSetting(key, value).catch(error =>
        console.error(`Error updating setting ${key}: ${value}. ${error}`),
      );
    },
    getTimes() {
      return TIMESPANS.map(time => {
        let parsedTime = moment.duration(time).asSeconds();
        let text = this.$t('time.second');
        if (parsedTime >= 60) {
          parsedTime = moment.duration(time).asMinutes();
          text = this.$t('time.minute');
        }
        if (parsedTime > 1) text += 's';
        return {
          text: `${parsedTime} ${text}`,
          value: time,
        };
      });
    },
  },
};
</script>

<style scoped></style>
