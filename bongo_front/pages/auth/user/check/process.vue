<template>
  <div>
    Processing...
  </div>
</template>

<script>
  export default {
    middleware: ['is_auth'],
    async asyncData({app, store, $axios, redirect}) {
      //cart update to server start
      const bongo_cart = app.$cookies.get('bongo_cart')
      if (bongo_cart !== undefined) {
        store.commit('replace_cart_count', 0)
        for (const [key, value] of Object.entries(bongo_cart)) {
          const data = await $axios.$post(`/api/user/cart/${key}/`, {
            quantity: value.q,
            variation: value.v === null || value.v === '' ? null : value.v
          })
          if (data.status === 201){
            store.commit('set_cart_count', 1)
          }
        }
      }
      app.$cookies.remove('bongo_cart')
      //cart update to server end
      const redirect_data = app.$cookies.get('bongobitan_target')
      if (redirect_data) {
        app.$cookies.remove('bongobitan_target')
        return redirect(redirect_data)
      } else {
        return redirect('/')
      }
    },
    mounted() {

    }
  }
</script>

<style scoped>

</style>
