import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import DeveloperApp from './app.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: (h) => h(DeveloperApp),
}).$mount('#app');
