export const state = () => ({
  is_user: false,
  user: null,
  apiHost : "http://127.0.0.1:8000"
})
export const getters = {
  userCheck(state) {
    return state.is_user
  },
  userGet(state) {
    return state.user
  }
}
export const mutations = {
  user_set(state, data) {
    state.is_user = data[0]
    if (data[1]) {
      state.user = data[1]
    }
  }
}

export const actions = {
  async nuxtServerInit({commit}) {
    let data = await this.$axios.get('/api/auth/admin/')
    if (data.status === 200) {
      commit('user_set', [true, data.data])
    }
  }
}
