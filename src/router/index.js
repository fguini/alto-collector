import Vue from 'vue';
import VueRouter from 'vue-router';
import Splashscreen from '../views/Splashscreen.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Splashscreen',
    component: Splashscreen,
  },
  {
    path: '/home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (home.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: 'home' */ '../views/Home.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () =>
      import(/* webpackChunkName: 'settings' */ '../views/Settings.vue'),
  },
];

const router = new VueRouter({
  routes,
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
});

export default router;
