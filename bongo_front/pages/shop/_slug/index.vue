<template>
  <div class="mt-5">
    <v-card class="mb-4 d-flex justify-center">
      <v-card-title>
        <p  class="h6 text-center mb-0" >{{ shop.name }}</p>
      </v-card-title>
    </v-card>
<!--    <p class="headline text-center grey lighten-4 py-2"></p>-->
    <v-img
      :lazy-src="shop.banner"
      :src="shop.banner"
      height="250px"
    ></v-img>

    <v-row class="mt-5">
      <v-col lg="2" md="3" sm="4" cols="6" v-for="(product,index) in shop.get_product_shop" :key="index">
        <v-card :to="`/product/${product.slug}`" :nuxt="true"
          class="mx-auto"
         >
          <v-img :src="product.get_product_image[0].image" />
          <v-card-title>
            {{ product.name }}
          </v-card-title>
          <v-card-subtitle>
            <div>
              <div class="d-inline-block">&#2547 {{product.selling_price | offer(product.offer_price,product.offer_price_start,product.offer_price_end)}}</div>
              <div class="d-inline-block px-2">
                <del>&#2547 {{product.product_price | offer(product.offer_price,product.offer_price_start,product.offer_price_end)}}</del>
              </div>
            </div>
          </v-card-subtitle>
        </v-card>

      </v-col>
    </v-row>
    <div class="" >

    </div>
  </div>
</template>

<script>
  export default {
    async asyncData({ $axios, params }) {
      const data = await $axios.$get(`/api/user/shop/${params.slug}/all/product/`)
      return {
        shop: data
      }
    },
    filters: {
      offer: function (value, offer_percent, start, end) {
        const todaydate = new Date()
        const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) //new Date(2011,8,20)

        if (start !== undefined && end !== undefined) {
          if (start === null && end === null) {
            return value
          } else {
            const date_start = new Date(start)
            const date_end = new Date(end)
            if (today >= new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate())
              && today <= new Date(date_end.getFullYear(), date_end.getMonth(), date_end.getDate())) {
              return value - (value * (offer_percent / 100))
            } else {
              return value
            }
          }
        }
      }
    }
    // mounted() {
    //   this.$axios.get(`/api/user/shop/${this.$route.params.slug}/all/product/`)
    //     .then(res => {
    //       console.log(res.data)
    //     })
    // }
  }
</script>

<style scoped>

</style>
