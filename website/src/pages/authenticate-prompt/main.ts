import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import AuthenticatePromptApp from './app.vue';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(AuthenticatePromptApp),
}).$mount('#app');
