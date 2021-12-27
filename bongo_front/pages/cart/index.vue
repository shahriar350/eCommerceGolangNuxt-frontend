<template>
  <div>
    <loading_page v-if="$fetchState.pending"></loading_page>

    <div v-else>
      <v-card v-if="carts && carts.cart_products.length > 0">
        <v-row>
          <v-col md="6" sm="8">
            <v-card-title>Shopping cart</v-card-title>
            <v-card-text v-for="(cart_product,index) in carts.cart_products" :key="index">
              <v-row>
                <v-col md="2" cols="4">
                  <img-mine class="rounded elevation-2" :thumbnail="cart_product.product.get_product_image[0].image" />
<!--                  <v-img :src="cart_product.product.get_product_image[0].image"/>-->
                </v-col>
                <v-col md="10" cols="8">
                  <v-card-title>
                    <nuxt-link no-prefetch
                               :to="{path: `/product/${cart_product.product.slug}/${cart_product.product.id}`}">
                      {{ cart_product.product.name | capfirst }}
                    </nuxt-link>
                  </v-card-title>
                  <v-card-text v-if="cart_product.variation">
                    <p v-if="cart_product.variation.color !== null"><span class="font-weight-medium">Color:</span> {{
                        cart_product.variation.color
                      }}</p>
                    <p v-if="cart_product.variation.size !== null"><span class="font-weight-medium">Size:</span> {{
                        cart_product.variation.size
                      }}</p>
                    <p v-if="cart_product.variation.style !== null"><span class="font-weight-medium">Style:</span> {{
                        cart_product.variation.style
                      }}</p>
                  </v-card-text>
                  <v-card-text>
                    <p>Price: {{
                        set_price(cart_product) |
                          offer(cart_product.product.offer_price,cart_product.product.offer_price_start,cart_product.product.offer_price_end)
                      }}</p>
                    <!--                  <p>Price: {{ cart_product.product.selling_price * cart_product.quantity }}</p>-->
                  </v-card-text>
                  <v-card-text>
                    <v-row>
                      <v-col md="3" sm="6" cols="12">
                        <v-select v-model="cart_product.quantity" :items="items"
                                  label="Quantity"
                                  outlined></v-select>
                      </v-col>
                    </v-row>

                    <div class="d-flex flex-row">
                      <v-btn
                        @click="update_cart(cart_product.product.id,index,cart_product.quantity,cart_product.variation)">
                        Update
                      </v-btn>
                      <v-btn class="mx-2" @click="remove_from_cart(cart_product.product.id,index)">Delete</v-btn>
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card-text>
          </v-col>
          <v-col md="6" sm="4">
            <v-card-text>
              <p class="title">Subtotal: {{ total_price }}</p>
            </v-card-text>
            <v-btn color="primary"
                   block :nuxt="true" to="/checkout">Checkout
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-card v-else>
        <v-card-title>
          Your cart is empty
        </v-card-title>
      </v-card>
      <ConfirmDlg ref="confirm"/>
    </div>
  </div>
</template>

<script>

import ImgMine from "@/components/my_image";
import Loading_page from "../../components/loading_page";
export default {
  components: {
    Loading_page,
    ImgMine,
    ConfirmDlg: () => import('../../components/confirm'),
  },
  data() {
    return {
      items: [1, 2, 3, 4, 5],
      carts: null
    }
  },
  created() {
    this.get_data()
  },
  computed: {
    total_price() {
      return this.carts.cart_products.reduce((accumulator, currentValue) => {
        const current_date = new Date()
        const today = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate()) //new Date(2011,8,20)
        let start_date = new Date(currentValue.product.offer_price_start)
        let start = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate())
        let end_date = new Date(currentValue.product.offer_price_end)
        let end = new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDate())
        let selling_price = 0.00
        if (currentValue.variation !== null && currentValue.variation !== undefined) {
          selling_price = currentValue.variation.selling_price * currentValue.quantity
        } else {
          selling_price = currentValue.product.selling_price * currentValue.quantity
        }
        if (start && end && today >= start && end >= today && parseFloat(currentValue.product.selling_price) > 0.00) {
          return parseFloat(accumulator) + (selling_price - (selling_price * (parseFloat(currentValue.product.offer_price) / 100)))
        } else {
          return parseFloat(accumulator) + selling_price
        }
      }, 0)
    }
  },
  filters: {

    offer: function (value, offer_percent, start, end) {
      const current_date = new Date()
      const today = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate()) //new Date(2011,8,20)

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
  },
  async fetch() {
    if (this.$store.state.is_user) {
      const data = await this.$axios.get('/api/user/cart/all/')
      if (data.status === 200){
        this.carts = data.data
      }
        // .then(res => {
        //   this.carts = res.data
        // })
      // this.carts = data
    } else {
      const all_carts = this.$cookies.get('bongo_cart')
      if (all_carts) {
        let carts = {
          cart_products: []
        }
        let items = []
        Object.entries(all_carts).forEach(([key, value]) => {
          let variation = value['v'] ? value['v'] : parseInt(0)
          this.$axios.get(`/api/user/product/${key}/${variation}/`)
            .then(res => {
              carts.cart_products.push({
                product: res.data,
                variation: res.data.get_product_variation[0],
                quantity: value['q']
              })
            })
        })
        this.carts = carts
      } else {

      }
    }
  },
  methods: {
    set_price(cart_product) {
      if (cart_product.variation !== null && cart_product.variation !== undefined) {
        return cart_product.variation.selling_price * cart_product.quantity
      } else {
        return cart_product.product.selling_price * cart_product.quantity
      }
    },
    update_cart(product_id, index, quantity, variation) {
      if (this.auth) {
        this.$axios.post(`/api/user/cart/${product_id}/`, {
          quantity: quantity,
          variation: variation === null ? null : variation.id
        }).then(res => {
          if (res.status === 200) {
            this.$toast.success('Successfully updated')
          }
        })
      }
    },
    async remove_from_cart(product_id, index) {
      if (this.auth) {
        if (
          await this.$refs.confirm.open(
            'Confirm',
            'Are you sure you want to delete this record?'
          )
        ) {
          await this.$axios.delete(`/api/user/cart/remove/${product_id}/`)
            .then(res => {
              this.carts.cart_products.splice(index, 1)
              this.$store.commit('set_cart_count', '-1')
              this.$toast.success('Deleted Successfully')
            })
        }
      } else {
        const all_carts = this.$cookies.get('bongo_cart')
        if (Object.keys(all_carts).length <= 1) {
          this.$cookies.remove('bongo_cart')
          this.$store.commit('replace_cart_count', 0)
        } else {
          delete all_carts[product_id]
          this.$cookies.set('bongo_cart', all_carts, {
            path: '/',
            maxAge: (60 * 60 * 24 * 7) * 7,
            sameSite: 'strict'
          })
          this.$store.commit('set_cart_count', '-1')
        }
        this.carts.cart_products.splice(index, 1)

      }
    },
    get_data() {
      // if (this.$store.state.is_user) {
      //   this.$axios.get('/api/user/cart/all/')
      //     .then(res => {
      //       this.carts = res.data
      //     })
      //   // this.carts = data
      // } else {
      //   const all_carts = this.$cookies.get('bongo_cart')
      //   if (all_carts) {
      //     let carts = {
      //       cart_products: []
      //     }
      //     let items = []
      //     Object.entries(all_carts).forEach(([key, value]) => {
      //       let variation = value['v'] ? value['v'] : parseInt(0)
      //       this.$axios.get(`/api/user/product/${key}/${variation}/`)
      //         .then(res => {
      //           carts.cart_products.push({
      //             product: res.data,
      //             variation: res.data.get_product_variation[0],
      //             quantity: value['q']
      //           })
      //         })
      //     })
      //     this.carts = carts
      //   } else {
      //
      //   }
      // }
    }
  }
}
</script>

<style scoped>

</style>
