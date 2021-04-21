import Vue      from 'vue'
import Home     from '../components/Home.vue'
import BackPack from '../modules/backpack'

Vue.use(BackPack)

new Vue({
  render: h => h(Home),
}).$mount('#app')
