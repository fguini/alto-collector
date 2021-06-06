<template>
  <div class="splash">
    <div class="box">
      <img src="../assets/logo.png" />
      <h3 class="checks" v-if="processing">{{ checkMessage }}...</h3>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import { runInitialChecks } from '../services/setupService';

// TODO translation
const INITIAL_CHECKS_MESSAGE = {
  checkDatabase: 'Checking database',
  checkNetwork: 'Checking network status',
};

export default {
  name: 'splashscreen',
  data() {
    return { checkInProgress: '' };
  },
  computed: {
    processing() {
      return !!this.checkInProgress;
    },
    checkMessage() {
      return INITIAL_CHECKS_MESSAGE[this.checkInProgress];
    },
  },
  mounted() {
    const path = ipcRenderer.sendSync('start-route') || '/home';

    if (this.$route.query.check)
      runInitialChecks(
        null,
        data => this.changeCheckName(data.check),
        null,
        () => this.$router.push(path),
      ).catch(error =>
        console.error(`Error initializing the app: ${error}`, error),
      );
    else if (!this.$route.query.debug)
      setTimeout(() => this.$router.push(path), 1500);
  },
  methods: {
    changeCheckName(name) {
      this.checkInProgress = name;
    },
  },
};
</script>

<style>
html {
  overflow: hidden;
}
.splash {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(
    to bottom left,
    --v-primary,
    --v-primary-darken4
  );
  overflow: hidden;
  margin: 0;
  padding: 0;
}

h3.checks {
  text-align: center;
  color: #6eb6ff;
}
</style>
