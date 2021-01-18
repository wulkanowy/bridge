import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import pl from 'vuetify/src/locale/pl';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#d32f2f',
        secondary: '#d32f2f',
        accent: '#d32f2f',
        error: '#ff5722',
      },
    },
  },
  lang: {
    locales: { pl },
    current: 'pl',
  },
});
