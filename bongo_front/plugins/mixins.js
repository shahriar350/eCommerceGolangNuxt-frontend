import Vue from 'vue'

import {mapGetters} from "vuex"


const User = {
  install(Vue, option) {
    Vue.directive('delay', {
      params: ['cb'],
      bind: function () {
        setTimeout(this.params.cb, 3000)
      }
    }),
    Vue.filter('capfirst', function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    })
    Vue.mixin({
      computed : {
        screenWidth(){
          if (process.client){
            return window.innerWidth
          }
        },
        ...mapGetters({
          user: 'userGet',
          auth: 'userCheck'
        })
      }
    })
  }
};
Vue.use(User);

