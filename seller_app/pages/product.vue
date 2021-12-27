<template>
  <div>
    <div v-if="available">
      <v-alert type="info">No Shop is available. Please Add a shop first.</v-alert>
    </div>
    <div v-else>
      <nuxt-child></nuxt-child>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      available: false
    }
  },
  async fetch(){
    const data = await this.$axios.get('/api/seller/shop/availability/check')
    if (data.status === 200){
      this.available = true
    }

  }
}
</script>
