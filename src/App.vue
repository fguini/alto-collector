<template>
  <v-app dark>
    <v-app-bar app color="primary" flat dense v-if="showTopBar">
      <v-img
        alt="Alto IT Collector"
        class="shrink mr-2"
        contain
        src="./assets/icon.png"
        transition="scale-transition"
        width="25"
      />
      <v-tabs align-with-title background-color="primary">
        <!-- <v-tab to="/?debug=true" v-if="isDevelopment">
          {{ $t('menu.tabs.splash') }}
        </v-tab> -->
        <v-tab to="/home">{{ $t('menu.tabs.home') }}</v-tab>
        <v-tab to="/settings">{{ $t('menu.tabs.settings') }}</v-tab>
      </v-tabs>

      <v-spacer></v-spacer>

      <v-select
        class="theme-switch"
        :dark="darkTheme"
        :items="languages"
        v-model="$i18n.locale"
        item-value="value"
        item-text="text"
        dense
        flat
        v-on:change="saveLocale"
      ></v-select>
      <v-switch
        class="theme-switch"
        v-model="darkTheme"
        color="secondary"
        flat
        v-on:change="setDarkMode"
      >
        <template v-slot:label>
          <v-icon>{{ themeIcon }}</v-icon>
        </template>
      </v-switch>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mdiThemeLightDark as themeIcon } from '@mdi/js';
const withoutTopBarRoutes = ['/'];

export default {
  name: 'App',
  data() {
    const languages = [];
    for (let locale in this.$i18n.messages)
      languages.push({
        value: locale,
        text: this.$t(`menu.languages.${locale}`),
      });

    return {
      darkTheme: this.$vuetify.theme.dark,
      isDevelopment: process.env.NODE_ENV !== 'production',
      languages,
      showTopBar: this.checkCurrentPath(this.$router.currentRoute),
      themeIcon,
    };
  },
  mounted() {
    window.addEventListener('focus', () => {
      const path = ipcRenderer.sendSync('start-route');
      if (path) this.$router.push(path);
    });
  },
  watch: {
    $route(to) {
      this.showTopBar = this.checkCurrentPath(to);
    },
  },
  methods: {
    checkCurrentPath(currentRoute) {
      const currentPath = currentRoute.path;
      const debug = currentRoute.query.debug;
      return !withoutTopBarRoutes.some(r => currentPath === r && !debug);
    },
    setDarkMode() {
      this.$vuetify.theme.dark = this.darkTheme;
    },
    saveLocale() {
      localStorage.setItem('language', this.$i18n.locale);
    },
  },
};
</script>

<style>
.theme-switch div.v-input__control {
  max-width: 120px;
  padding-top: 22px;
  margin-left: 20px;
}
</style>
