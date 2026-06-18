import Vue from '@vue/compat'
import { createStore } from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)
export default createStore({
  state,
  mutations,
  actions,
  getters
})
