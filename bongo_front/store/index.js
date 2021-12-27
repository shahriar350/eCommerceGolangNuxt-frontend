export const state = () => ({
  validationError: null,
  is_user: false,
  breadcrumbs_name: null,
  user: null,
  breadcrumbs: [],
  overlay: false,
  snackbar: null,
  cart_count: 0,
})
export const getters = {
  get_cart_count(state) {
    return state.cart_count
  },
  get_snackbar(state) {
    return state.snackbar
  },
  get_overlay(state) {
    return state.overlay
  },
  get_breadcrumbs(state) {
    return state.breadcrumbs
  },
  get_breadcrumbs_name(state) {
    return state.breadcrumbs_name
  },
  get_validation_error(state) {
    return state.validationError
  },
  userCheck(state) {
    return state.is_user
  },
  userGet(state) {
    return state.user
  }
}
export const mutations = {
  set_cart_count(state, data) {
    state.cart_count += parseInt(data)
  },
  replace_cart_count(state, data) {
    state.cart_count = parseInt(data)
  },
  set_snackbar(state, data) {
    state.snackbar = data
  },
  set_overlay(state, data) {
    state.overlay = data
  },
  set_breadcrumbs(state, data) {
    state.breadcrumbs.splice(0, state.breadcrumbs.length)
    state.breadcrumbs = data
  },
  set_breadcrumbs_name(state, data) {
    state.breadcrumbs_name = data
  },
  set_validation_error(state, data) {
    if (data === '') {
      state.validationError = null
    } else {
      state.validationError = data
    }
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
    let data = await this.$axios.get('/api/auth/user/')
    console.log(data.data)
    if (data.status === 200) {
      commit('user_set', [true, data.data])
    }
  }
}
