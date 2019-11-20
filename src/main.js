import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './routes'

import FirstCharCapital from './filters/first-char-capital.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCog)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueRouter)
Vue.use(FirstCharCapital)

const router = new VueRouter({ routes, mode: 'history' })

new Vue({
  el: '#app',
  render: h => h(App),
  router: router
})
