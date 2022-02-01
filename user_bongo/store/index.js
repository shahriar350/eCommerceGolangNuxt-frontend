export const state = () => ({
  is_user: false,
  user: null,
  apiHost: "http://127.0.0.1:8000",
  cart_count: 0,
  targetPage: '',
})
export const getters = {
  get_target_page(state){
    return state.targetPage
  },
  get_cart_count(state) {
    return state.cart_count
  },
  userCheck(state) {
    return state.is_user
  },
  userGet(state) {
    return state.user
  }
}
export const mutations = {
  set_target_page(state,data){
    state.targetPage = data
  },
  set_cart_count(state, data) {
    state.cart_count += parseInt(data)
  },
  replace_cart_count(state, data) {
    state.cart_count = parseInt(data)
  },
  user_set(state, data) {
    state.is_user = data[0]
    if (data[1]) {
      state.user = data[1]
    }
  }
}

export const actions = {
  async nuxtServerInit({commit}) {
    let data = await this.$axios.get('/api/auth/user')
    if (data.status === 200) {
      commit('user_set', [true, data.data])
    }
  }
}
