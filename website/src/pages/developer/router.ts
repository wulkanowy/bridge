import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "developer-home" */ './views/home.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: `${process.env.BASE_URL}developer`,
  routes,
});

export default router;