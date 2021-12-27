<template>

</template>

<script>
export default {
  data() {
    return {
      products: []
    }
  },
  async fetch(){
    await this.$axios.get()
  }
}
</script>

<style scoped>

</style>
