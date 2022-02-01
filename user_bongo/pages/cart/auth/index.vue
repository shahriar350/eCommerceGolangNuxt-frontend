<template>
  <div class="container">
    <div v-if="$fetchState.pending" class="flex w-full justify-center">
      <ProgressSpinner/>
    </div>
    <div v-else>
      <div v-if="Object.keys(cart).length < 1">
        <Card>
          <template #content>No cart product is available.</template>
        </Card>
      </div>
      <div v-else class="grid grid-cols-12 md:gap-4 gap-2">
        <div class="md:col-span-8 col-span-full">
          <div v-for="(cartProduct,index) in cart.edges.cart_products" :key="index"
               class="grid grid-cols-12 md:gap-4 gap-2 mb-3">
            <div class="col-span-3">
              <nuxt-link :to="`/product/${cartProduct.edges.seller_product.slug}/${cartProduct.edges.seller_product.id}`">
                <v_image :name="cartProduct.edges.seller_product.edges.seller_product_images[0].image"/>
              </nuxt-link>

            </div>

                        <div class="col-span-9">
                          <!--            {{ product.seller_product_variation[0]}}-->
<!--                          {{ cartProduct.edges }}-->
                          <nuxt-link :to="`/product/${cartProduct.edges.seller_product.slug}/${cartProduct.edges.seller_product.id}`">
                            <p class="text-blue-700">{{ cartProduct.edges.seller_product.name |capfirst }}</p>
                          </nuxt-link>
                          <p>{{
                              offer(cartProduct.edges.seller_product.selling_price, cartProduct.edges.seller_product_variation, cartProduct.edges.seller_product.offer_price, cartProduct.edges.seller_product.offer_price_start, cartProduct.edges.seller_product.offer_price_end)
                            }} * {{ cartProduct.quantity }} = {{
                              (offer(cartProduct.edges.seller_product.selling_price, cartProduct.edges.seller_product_variation, cartProduct.edges.seller_product.offer_price, cartProduct.edges.seller_product.offer_price_start, cartProduct.edges.seller_product.offer_price_end) * cartProduct.quantity).toFixed(2)
                            }} /Taka</p>
                          <div v-if="'seller_product_variation' in  cartProduct.edges">
                            <div class="flex">
                              <p
                                v-for="(variation,varIndex) in cartProduct.edges.seller_product_variation.edges.seller_product_variation_values">

                                <span class="mr-2">{{ variation.name | capfirst }} </span>
                              </p>
                            </div>

                          </div>
                          <Button @click="removeFromCart(index,cartProduct.id)" icon="pi pi-trash" iconPos="right"
                                  class="p-button-sm mt-1"/>
                        </div>
          </div>
        </div>
        <div class="md:col-span-4 col-span-full">
          <p><span class="font-bold">Total</span>: {{ totalCartPrice }} /Taka</p>
          <nuxt-link to="/checkout">
            <Button label="Checkout"/>
          </nuxt-link>
        </div>
      </div>
      <ConfirmDialog></ConfirmDialog>
    </div>
  </div>
</template>

<script>
import v_image from "@/components/v_image";
// import ConfirmDialog from 'primevue/confirmdialog';
import ProgressSpinner from 'primevue/progressspinner';

export default {
  name: 'cart_auth',
  middleware({store, redirect}) {
    // If the user is not authenticated
    if (!store.state.is_user) {
      return redirect('/cart/non_auth')
    }
  },
  components: {
    v_image, ProgressSpinner
  },
  data() {
    return {
      total_price: 0,
      loading: false,
      cart: {}
    }
  },
  fetch() {
    this.$axios.get('/api/user/cart/product/all')
      .then(res => {
        if (res.status === 200) {
          this.cart = res.data
        }
      }).catch(err => {
      console.log(err.response.data)
    })
  },
  fetchOnServer: false,
  mounted() {
    // this.loading = true
    // if (localStorage.hasOwnProperty('bong_cart')) {
    //   const carts = JSON.parse(this.$CryptoJS.AES.decrypt(localStorage.getItem("bong_cart"), process.env.localEncrypt).toString(this.CryptoJS.enc.Utf8))
    //   console.log(carts)
    //   for (const [key, value] of Object.entries(carts)) {
    //     this.$axios.get(`/api/nonuser/cart/product/${key}/${value['variation']}`)
    //       .then(res => {
    //         this.products.push({data: res.data, quantity: value['quantity']})
    //         this.total_price += (this.offer(res.data.selling_price, res.data.seller_product_variation, res.data.offer_price, res.data.offer_price_start, res.data.offer_price_end) * value['quantity'])
    //       })
    //   }
    //   this.$store.commit('replace_cart_count', Object.keys(carts).length)
    // }
    // this.loading = false
  },
  computed: {
    totalCartPrice() {
      let totalPrice = 0
      if (this.cart.edges.cart_products.length > 0) {
        this.cart.edges.cart_products.forEach(res => {
          totalPrice += (this.offer(res.edges.seller_product.selling_price, res.edges.seller_product_variation, res.edges.seller_product.offer_price, res.edges.seller_product.offer_price_start, res.edges.seller_product.offer_price_end) * res.quantity)
        })
      }
      return totalPrice.toFixed(2)
    }
  },
  methods: {
    offer(value, variation, offer_percent, start, end) {
      variation = variation === undefined ? {} : variation
      offer_percent = offer_percent === undefined ? 0 : offer_percent
      start = start === undefined ? null : start
      end = end === undefined ? null : end
      let price = 0
      // if (variation === undefined) {
      //   price = parseFloat(value) + parseFloat(variation.selling_price)
      // }
      const todaydate = new Date()
      const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) //new Date(2011,8,20)
      //
      // let price = 0
      if (Object.keys(variation).length > 0) {
        price = parseFloat(value) + parseFloat(variation.selling_price)
      } else {
        price = parseFloat(value)
      }
      // price = parseFloat(value) + parseFloat(variationPrice)
      if (start === null && end === null) {
        return price
      } else {
        const date_start = new Date(start)
        const date_end = new Date(end)
        if (today >= new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate())
          && today <= new Date(date_end.getFullYear(), date_end.getMonth(), date_end.getDate())) {
          return price - (price * (parseInt(offer_percent) / 100))
        } else {
          return price
        }
      }
    },
    removeFromCart(index, id) {
      this.$confirm.require({
        message: 'Are you sure you want to delete from cart?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.$axios.delete(`/api/user/cart/product/remove/${id}`)
            .then(res => {
              if (this.cart.edges.cart_products.length > 1) {
                this.cart.edges.cart_products.splice(index, 1)
              } else {
                this.cart = {}
              }
              this.$store.commit('set_cart_count', -1)
              this.$toast.add({severity: 'success', summary: 'Removed successfully', life: 3000});
            }) .catch(err => {
            console.log(err.response.data)
            this.$toast.add({severity: 'error', summary: 'Try again', life: 3000});
          })

          // const carts = JSON.parse(this.$CryptoJS.AES.decrypt(localStorage.getItem("bong_cart"), process.env.localEncrypt).toString(this.CryptoJS.enc.Utf8))
          // if (Object.keys(carts).length > 1) {
          //   delete carts[this.products[index]['data']['id']]
          //   localStorage.setItem("bong_cart", this.$CryptoJS.AES.encrypt(JSON.stringify(carts).toString(), process.env.localEncrypt))
          // } else {
          //   localStorage.removeItem("bong_cart")
          // }
          // this.$store.commit('set_cart_count', -1)
          // this.products.splice(index, 1)

        },
        reject: () => {
          //callback to execute when user rejects the action
        }
      });
    }
  },
}
</script>
