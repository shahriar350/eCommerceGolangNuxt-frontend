<template>
  <div>
    <div class="mt-3 d-flex justify-center">
      <v-btn to="/product/data/active" :nuxt="true">Active</v-btn>
      <v-btn  to="/product/data/non_active" :nuxt="true">Non active</v-btn>
      <v-btn  to="/product/data/trash" :nuxt="true">Deleted</v-btn>
    </div>
    <nuxt-child></nuxt-child>
  </div>
</template>
<script>
export default {
  name: 'data'
}
</script>
