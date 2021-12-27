<template>
  <v-list>
    <v-list-item :nuxt="true" to="/">
      <v-list-item-icon>
        <v-icon>{{ icons.mdiHome }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Dashboard</v-list-item-title>
    </v-list-item>
    <v-list-group
      :value="$route.path.split('/')[1] === 'category'"
      :prepend-icon="icons.mdiFormatAlignCenter"
    >
      <template v-slot:activator>
        <v-list-item-title>Category</v-list-item-title>
      </template>
      <v-list-item to="/category/shop_category" :nuxt="true">
        <v-list-item-title>Shop Category</v-list-item-title>
      </v-list-item>
      <v-list-item to="/category/product_category" :nuxt="true">
        <v-list-item-title>Product Category</v-list-item-title>
      </v-list-item>
    </v-list-group>
    <!--    product start-->
    <v-list-group
      :value="$route.path.split('/')[1] === 'product'"
      :prepend-icon="icons.mdiTable"
    >
      <template v-slot:activator>
        <v-list-item-title>Product</v-list-item-title>
      </template>
      <v-list-item to="/product/dashboard" :nuxt="true">
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>
      <v-list-item to="/product/variations" :nuxt="true">
        <v-list-item-title>Variations</v-list-item-title>
      </v-list-item>
      <v-list-item to="/product/brand" :nuxt="true">
        <v-list-item-title>Brand</v-list-item-title>
      </v-list-item>

    </v-list-group>
    <!--    product end-->
    <!--    seller end-->
    <v-list-group
      :value="$route.path.split('/')[1] === 'seller'"
      :prepend-icon="icons.mdiTable"
    >
      <template v-slot:activator>
        <v-list-item-title>Seller</v-list-item-title>
      </template>
      <v-list-item to="/seller/dashboard" :nuxt="true">
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>
      <v-list-item to="/seller/requests" :nuxt="true">
        <v-list-item-title>Requests</v-list-item-title>
      </v-list-item>
      <v-list-item to="/seller/shops" :nuxt="true">
        <v-list-item-title>Shops</v-list-item-title>
      </v-list-item>
    </v-list-group>
    <!--    seller end-->
  </v-list>
</template>

<script>
import {mdiHome, mdiFormatAlignCenter,mdiTable} from "@mdi/js"

export default {
  name: "sidebar_menus",
  data() {
    return {
      icons: {
        mdiHome, mdiFormatAlignCenter,mdiTable,
      }
    }
  },
}
</script>
