<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6">
          <v-row no-gutters>
            <v-col cols="12" sm="2" class="pb-0">
              <v-row :dense="true">
                <v-col sm="12" cols="2" v-for="(img,index) in product.get_product_image" :key="index">
                  <div @click="showImageBig(img.image)"
                       class="cursor-pointer mb-2">

                    <img-mine :thumbnail="img.image" height="50"/>
                  </div>
                </v-col>
              </v-row>

            </v-col>

            <v-col cols="12" sm="10" v-if="$vuetify.breakpoint.mdAndUp">
              <client-only>
                <span >
                  <v-zoomer style="width: 100%; height: 500px; border: solid 1px silver;">
                  <img
                    :src="show_product_image"
                    style="object-fit: contain; width: 100%; height: 100%;"
                    :alt="product.name">
                </v-zoomer>
                </span>

                <img

                     :src="show_product_image"
                     style="object-fit: contain; width: 100%; height: 100%;"
                     :alt="product.name">
              </client-only>

              <small>Scroll or zoom in</small>
              <!--              <client-only placeholder="loading...">-->
              <!--                <zoom-on-hover alt="product image" :img-normal="show_product_image" :img-zoom="show_product_image"-->
              <!--                               :scale="1.5"-->
              <!--                ></zoom-on-hover>-->
              <!--              </client-only>-->

              <!--              <v-img :lazy-src="show_product_image" :src="show_product_image"/>-->
            </v-col>
            <v-col cols="12" sm="10" v-else>
              <client-only>
                <img
                  @click="image_full_modal=true"
                  :src="show_product_image"
                  style="object-fit: contain; width: 100%; height: 100%;"
                  :alt="product.name">
              </client-only>
              <!--              <client-only placeholder="loading...">-->
              <!--                <zoom-on-hover alt="product image" :img-normal="show_product_image" :img-zoom="show_product_image"-->
              <!--                               :scale="1.5"-->
              <!--                ></zoom-on-hover>-->
              <!--              </client-only>-->

              <!--              <v-img :lazy-src="show_product_image" :src="show_product_image"/>-->
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <p class="title">{{ product.name }}</p>
          <nuxt-link no-prefetch :to="{path: `/shop/${product.shop.slug}`}">Check our shop</nuxt-link>

          <div>
            <div v-if="parseFloat(product_price) < 1.00">
              <p class="title mr-2" v-text="product.price">
              </p>
            </div>
            <div v-else>
              <div v-if="parseInt(product.selling_price) > 0" class="d-flex">
                <p class="title mr-2">
                  &#2547{{
                    product_price | offer(product.offer_price,product.offer_price_start,product.offer_price_end)
                  }}</p>
                <p class="text-decoration-line-through subtitle-1">&#2547{{
                    product_prev_price |
                      offer(product.offer_price,product.offer_price_start,product.offer_price_end)
                  }}</p>
              </div>
              <div v-else>
                <p class="title">
                  &#2547{{
                    product_price | offer(product.offer_price,product.offer_price_start,product.offer_price_end)
                  }}</p>
              </div>
            </div>
          </div>
          <div v-if="product.get_product_variation.length">
            <v-text-field outlined v-model="variation_search" placeholder="Search your option"></v-text-field>
            <v-card max-width="150" @click="selectOption(variance)" class="d-inline-block mr-4"
                    v-for="(variance,index) in filter_variation" :key="index">
              <img-mine :thumbnail="variance.image">
                <template slot="text">
                  <div style="position: absolute;top:0; left: 0" v-if="select_option === variance.id">
                    <v-btn
                      fab
                      dark
                      small
                      color="primary"
                    >
                      <v-icon>{{ icons.mdiCheck }}</v-icon>
                    </v-btn>
                  </div>
                </template>
              </img-mine>
              <div class="d-flex justify-space-between elevation-0 px-2 flex-wrap align-center">
                <div>
                  <p class="caption d-flex" v-if="variance.color !== null"><span class="font-weight-bold">Color:</span>
                    <span class="font-weight-medium">{{ variance.color }}</span>
                  </p>
                  <p class="caption d-flex" v-if="variance.style !== null"><span class="font-weight-bold">Style:</span>
                    <span class="font-weight-medium">{{ variance.style }}</span>
                  </p>
                  <p class="caption d-flex" v-if="variance.size !== null"><span class="font-weight-bold">Size:</span>
                    <span class="font-weight-medium">{{ variance.size }}</span>
                  </p>
                </div>

              </div>
            </v-card>
          </div>
          <div class="mt-4">
            <v-row>
              <v-col md="3" sm="4" cols="5">
                <v-select
                  :items="items"
                  label="Quantity"
                  v-model="quantity"
                  outlined
                ></v-select>
              </v-col>
            </v-row>

          </div>
          <div class="mt-4">
            <v-btn class="mx-2" @click="addToCart">Add to card</v-btn>
            <v-btn class="mx-2">Buy now</v-btn>
          </div>
        </v-col>
        <v-col>
          <div v-html="product.description">
          </div>
        </v-col>
      </v-row>
    </v-container>
    <!--    image full screen when mobile mode start-->
    <v-dialog
      scrollable
      v-model="image_full_modal"
      max-width="100%"
    >
      <v-card>
        <v-card-text>

          <v-row :dense="true">
            <v-col v-for="(img,index) in product.get_product_image" :key="index">
              <div
                class="cursor-pointer mb-2">

                <img-mine :thumbnail="img.image" height="50"/>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="image_full_modal = false"
          >
            Close
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--    image full screen when mobile mode end-->
  </div>
</template>

<script>
// import Cookies from 'js-cookie'
// import moment from 'moment'
import {mdiCheck} from '@mdi/js'
import ImgMine from "@/components/my_image";

export default {
  components: {ImgMine},
  async asyncData({$axios, params}) {
    const data = await $axios.$get(`/api/user/frontend/single/product/${params.id}/`)
    return {
      product: data
    }
  },
  data() {
    return {
      image_full_modal: false,
      items: [1, 2, 3, 4, 5],
      model: 0,
      product_price: '',
      product_prev_price: '',
      select_option: '',
      select_option_quantity: 0,
      show_product_image: '',
      quantity: 0,
      variation_search: '',
      icons: {
        mdiCheck
      }
    }
  },
  computed: {
    filter_variation() {
      if (this.product.get_product_variation.length > 0) {
        let arr = []
        if (this.variation_search !== '') {
          this.product.get_product_variation.forEach((item) => {
            if (item.color !== null && this.variation_search.toLowerCase().split(' ').every(v => item.color.toLowerCase().includes(v))) {
              arr.push(item)
            }
            if (item.size !== null && this.variation_search.toLowerCase().split(' ').every(v => item.size.toLowerCase().includes(v))) {
              arr.push(item)
            }
            if (item.style !== null && this.variation_search.toLowerCase().split(' ').every(v => item.style.toLowerCase().includes(v))) {
              arr.push(item)
            }
          })
          return arr
        } else {
          return this.product.get_product_variation
        }
      } else {
        return false
      }
    }
  },
  created() {
    this.product_price = this.product.selling_price
    this.product_prev_price = this.product.product_price
    this.show_product_image = this.product.get_product_image[0].image
  },

  methods: {
    // get_brand_names(){
    //   this.$axios.get(`/api/seller/product/brand/${}`)
    // },
    showImageBig(image) {
      this.show_product_image = image
    },
    addToCart() {
      let validate = true
      let messages = []
      if (this.product.get_product_variation.length > 0 && this.select_option === '') {
        this.$store.commit('set_snackbar', 'Please select a product variation.')
        validate = false
        return
      }
      if (this.quantity < 1) {
        this.$store.commit('set_snackbar', 'Please add minimum one quantity.')
        validate = false
        return
      }
      if (validate) {
        if (this.auth) {
          this.$axios.post(`/api/user/cart/${this.product.id}/`, {
            quantity: this.quantity,
            variation: this.select_option !== '' ? this.select_option : null
          }).then(res => {
            if (res.status === 201) {
              this.$store.commit('set_cart_count', 1)
            }
          })
        } else {
          if (this.$cookies.get('bongo_cart')) {
            let carts = this.$cookies.get('bongo_cart')
            carts[this.product.id] = {
              'q': this.quantity,
              'v': this.select_option
            }
            this.$cookies.set('bongo_cart', carts)
          } else {
            let carts = {}
            carts[this.product.id] = {
              'q': this.quantity,
              'v': this.select_option
            }
            this.$cookies.set('bongo_cart', carts, {
              path: '/',
              maxAge: (60 * 60 * 24 * 7) * 7,
              sameSite: 'strict'
            })
          }
          let carttotal = Object.keys(this.$cookies.get('bongo_cart')).length
          this.$store.commit('replace_cart_count', carttotal)
        }
      }
    },
    selectOption(variance) {
      this.select_option = variance.id
      this.product_price = variance.selling_price
      this.product_prev_price = variance.product_price
      this.show_product_image = variance.image
      this.select_option_quantity = parseInt(variance.quantity)
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
}
</script>

<style scoped>

</style>
