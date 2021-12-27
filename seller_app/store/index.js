export const state = () => ({
  is_user: false,
  user: null,
  apiHost: "http://127.0.0.1:8000",
  breadcrumbs_name: null,
  breadcrumbs: [],
})
export const getters = {
  get_breadcrumbs(state) {
    return state.breadcrumbs
  },
  get_breadcrumbs_name(state) {
    return state.breadcrumbs_name
  },
  userCheck(state) {
    return state.is_user
  },
  userGet(state) {
    return state.user
  }
}
export const mutations = {
  set_breadcrumbs(state, data) {
    state.breadcrumbs.splice(0, state.breadcrumbs.length)
    state.breadcrumbs = data
  },
  set_breadcrumbs_name(state, data) {
    state.breadcrumbs_name = data
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
    let data = await this.$axios.get('/api/auth/seller')
    if (data.status === 200) {
      commit('user_set', [true, data.data])
    }
  }
}
