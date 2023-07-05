import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    employee_number:""
  },
  mutations: {
    setEmployeeNumber(state, val){
      state.employee_number = val
    }
  },
  actions: {
    // 定义触发mutations的操作
  },
  getters: {
    // 定义计算状态的方法
  }
});
