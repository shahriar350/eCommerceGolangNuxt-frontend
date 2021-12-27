<template>
<div>
  <v-btn @click="top_selling_product">FEtch</v-btn>
</div>
</template>

<script>
export default {
  created() {
    this.set_breadcrumbs()
    this.top_selling_product()
  },
  data(){
    return {

    }
  },
  methods: {
    async top_selling_product(){
      top_selling = await this.$axios.get('/api/seller/sell/top_selling/product/')
      console.log(top_selling.data)
    },
    set_breadcrumbs() {
      const data = [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/seller'
        },
        {
          text: 'Sell',
          disabled: true,
          href: '/seller/sell'
        }
      ]
      this.$store.commit('set_breadcrumbs', data)
      this.$store.commit('set_breadcrumbs_name', null)
    }
  }
}
</script>

<style scoped>

</style>
