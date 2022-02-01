<template>
  <div class="container">
    <div v-if="loading" class="flex w-full justify-center">
      <ProgressSpinner/>
    </div>
    <div v-else>
      <div v-if="products.length < 1">
        <Card>
          <template #content>No cart product is available.</template>
        </Card>
      </div>
      <div v-else class="grid grid-cols-12 md:gap-4 gap-2">
        <div class="md:col-span-8 col-span-full">
          <div v-for="(product,index) in products" :key="index" class="grid grid-cols-12 md:gap-4 gap-2 mb-3">
            <div class="col-span-3">
              <v_image :name="product.data.product_image[0].image"/>
            </div>

            <div class="col-span-9">
              <!--            {{ product.seller_product_variation[0]}}-->
              <p>{{ product.data.name |capfirst }}</p>
              <p>{{
                  offer(product.data.selling_price, product.data.seller_product_variation, product.data.offer_price, product.data.offer_price_start, product.data.offer_price_end)
                }} * {{ product.quantity }} = {{
                  (offer(product.data.selling_price, product.data.seller_product_variation, product.data.offer_price, product.data.offer_price_start, product.data.offer_price_end) * product.quantity).toFixed(2)
                }} /Taka</p>
              <Button @click="removeFromCart(index)" icon="pi pi-trash" iconPos="right" class="p-button-sm"/>
            </div>
          </div>
        </div>
        <div class="md:col-span-4 col-span-full">
          <p><span class="font-bold">Total</span>: {{ totalCartPrice }} /Taka</p>
          <nuxt-link to="/checkout"><Button label="Checkout" /></nuxt-link>
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
  name: 'cart_non_auth',
  components: {
    v_image, ProgressSpinner
  },
  data() {
    return {
      total_price: 0,
      loading: false,
      products: []
    }
  },
  mounted() {
    this.loading = true
    if (localStorage.hasOwnProperty('bong_cart')) {
      const carts = JSON.parse(this.$CryptoJS.AES.decrypt(localStorage.getItem("bong_cart"), process.env.localEncrypt).toString(this.CryptoJS.enc.Utf8))
      console.log(carts)
      for (const [key, value] of Object.entries(carts)) {
        this.$axios.get(`/api/nonuser/cart/product/${key}/${value['variation']}`)
          .then(res => {
            this.products.push({data: res.data, quantity: value['quantity']})
            this.total_price += (this.offer(res.data.selling_price, res.data.seller_product_variation, res.data.offer_price, res.data.offer_price_start, res.data.offer_price_end) * value['quantity'])
          })
      }
      this.$store.commit('replace_cart_count', Object.keys(carts).length)
    }
    this.loading = false
  },
  computed: {
    totalCartPrice() {
      let totalPrice = 0
      if (this.products.length > 0) {
        this.products.forEach(res => {
          totalPrice += (this.offer(res.data.selling_price, res.data.seller_product_variation, res.data.offer_price, res.data.offer_price_start, res.data.offer_price_end) * res['quantity'])
        })
      }
      return totalPrice.toFixed(2)
    }
  },
  methods: {
    offer(value, variation, offer_percent, start, end){
      const todaydate = new Date()
      const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) //new Date(2011,8,20)
      let price = 0
      if (variation.length > 0) {
        price = parseFloat(value) + parseFloat(variation[0].selling_price)
      } else {
        price = parseFloat(value)
      }
      // price = parseFloat(value) + parseFloat(variationPrice)

      if (start !== undefined && end !== undefined) {
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
      }
    },
    removeFromCart(index) {
      this.$confirm.require({
        message: 'Are you sure you want to delete from cart?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const carts = JSON.parse(this.$CryptoJS.AES.decrypt(localStorage.getItem("bong_cart"), process.env.localEncrypt).toString(this.CryptoJS.enc.Utf8))
          if (Object.keys(carts).length > 1) {
            delete carts[this.products[index]['data']['id']]
            localStorage.setItem("bong_cart", this.$CryptoJS.AES.encrypt(JSON.stringify(carts).toString(), process.env.localEncrypt))
          } else {
            localStorage.removeItem("bong_cart")
          }
          this.$store.commit('set_cart_count', -1)
          this.products.splice(index, 1)
          this.$toast.add({severity: 'success', summary: 'Removed successfully', life: 3000});
        },
        reject: () => {
          //callback to execute when user rejects the action
        }
      });
    }
  },
}
</script>
