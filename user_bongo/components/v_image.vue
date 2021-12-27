<template>
  <div class="my_image">
    <nuxt-img :quality="quality" fit="fill" :src="`http://127.0.0.1:8000/static/images/${name}`" />
  </div>
</template>

<script>
export default {
  name: 'v_image',
  props: {
    name: {
      type: String,
      required: true
    },
    quality: {
      default: 100
    }
  }
}
</script>

<style scoped>
.my_image img{
  width: 100%;
}
</style>
