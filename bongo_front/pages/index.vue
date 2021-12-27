<template>
  <v-main>
    <loading_page v-if="$fetchState.pending"></loading_page>
    <v-alert :icon="icons.mdiAlertCircle" type="error" border="left" v-else-if="$fetchState.error">Something is error. Please reload.</v-alert>
    <div v-else>
      <v-btn @click="get_data()">get data</v-btn>
      <v-row :dense="dense">
        <v-col lg="2" md="2" sm="3" cols="4" v-for="(product,index) in products" :key="index">
          <v-card max-width="344" :to="{path: `/product/${product.slug}/${product.id}`}" :nuxt="true">
            <img-mine :thumbnail="product.get_product_image[0].image"/>
            <v-card-title class="text-md-subtitle-1 text-subtitle-2 font-weight-medium">{{ product.name | capfirst }}</v-card-title>
            <v-card-subtitle class="text-sm-body-1 text-body-2">
              <div >
                <p v-if="product.multi_price">{{ product.multi_price }}</p>
                <div v-else>
                  <div class="d-inline-block">&#2547{{
                      product.selling_price | offer(product.offer_price,product.offer_price_start,product.offer_price_end)
                    }}
                  </div>
                  <div class="d-inline-block px-2" v-if="parseFloat(product.product_price) > parseFloat(product.selling_price)">
                    <del>&#2547{{
                        product.product_price | offer(product.offer_price,product.offer_price_start,product.offer_price_end)
                      }}
                    </del>
                  </div>
                </div>
              </div>
            </v-card-subtitle>
          </v-card>
        </v-col>

      </v-row>
      <v-row dense class="grey lighten-5 px-2">
        <v-col cols="12" class="py-2 border md:text-xl text-lg gray--text text--lighten-1">Top Shops Categories:
        </v-col>
        <v-col lg="2" sm="3" cols="4" v-for="(category,index) in categories" :key="index">
          <v-card max-width="240" :nuxt="true" :to="`/frontend/shop/${category.slug}?cat=`">
            <img-mine :thumbnail="category.image">
              <template slot="text">
                <v-card-title>
                  <p class="white rounded px-2 py-1 d-inline text-lg-h6 text-sm-subtitle-1 text-subtitle-2 font-weight-medium">{{ category.name | capfirst }}</p>
                </v-card-title>
              </template>
            </img-mine>
          </v-card>
        </v-col>
      </v-row>
    </div>

  </v-main>
</template>

<script>

import Loading_page from "../components/loading_page";
import ImgMine from "../components/my_image";
import {mdiAlertCircle} from '@mdi/js'
export default {
  components: {ImgMine, Loading_page},
  data() {
    return {
      type_variance: [],
      products: [],
      categories: [],
      icons: {
        mdiAlertCircle,
      }
    }
  },

  async fetch() {
    const data = await this.$axios.get('/api/user/frontend/main/product/')
    const category = await this.$axios.get('/api/nonuser/shop/categories/all/')
    this.categories = category.data
    this.products = data.data.products
  },
  fetchOnServer: false,
  mounted() {

    this.$axios.get('/api/user/frontend/category/related/')
      .then(res => {
        this.type_variance = res.data
      })
  },
  methods: {
    get_data(){
      this.$axios.get('/api/seller/total_earning/')
        .then(res => {
          console.log(res.data)
        })
    }
  },
  computed: {
    dense () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return true
        case 'sm': return true
        case 'md': return false
        case 'lg': return false
        case 'xl': return false
      }
    },
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
}
</script>
