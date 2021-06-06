import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  dark: true,
  theme: {
    default: 'dark',
    dark: true,
    options: {
      customProperties: true,
    },
    themes: {
      dark: {
        primary: {
          ...colors.grey,
          base: colors.grey.darken4,
          darken4: colors.shades.black,
        },
        secondary: { ...colors.blue, base: colors.blue.darken2 },
        accent: { ...colors.lightBlue, base: colors.lightBlue.darken3 },
        error: { ...colors.red, base: colors.red.darken4 },
        anchor: { ...colors.blue, base: colors.blue.darken4 },
      },
    },
  },
  icons: {
    iconfont: 'mdiSvg',
  },
});
