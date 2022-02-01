<template>
  <div>
    <loading_page v-if="$fetchState.pending"></loading_page>
    <div v-else-if="$fetchState.error">
      <v-card-text>Something is wrong. Please refresh.</v-card-text>
    </div>
    <div v-else>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shop: {}
    }
  },
  async fetch() {
    await this.$axios.get(`/api/seller/shop/products/${this.$route.params.shopID}`)
      .then(res => {
        this.shop = res.data
      })

  },
  created() {
    this.set_breadcrumbs()
  },

  fetchOnServer: false,
  methods: {
    set_breadcrumbs() {
      const data = [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/'
        },
        {
          text: 'Shop',
          disabled: false,
          href: '/shop'
        },
        {
          text: 'Shop product',
          disabled: true,
          href: '/shop/product/' + this.$route.params.shopID
        }
      ]
      this.$store.commit('set_breadcrumbs', data)
      this.$store.commit('set_breadcrumbs_name', {name: 'Create Shop', url: '/shop/create'})
    }
  }

}
</script>
