import Home from './components/Home.vue';
import Dashboard from './components/Dashboard.vue';

const routes = [
  {
    path: '/',
    component: Home,
    name: 'home'
  },
  {
    path: '/meetings/:meeting_slugname',
    component: Dashboard,
    name: 'meeting'
  },
];

export default routes;