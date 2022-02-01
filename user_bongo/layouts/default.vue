<template>
  <div class="mb-5">
    <div class="grid md:grid-cols-4 grid-cols-2 container py-3 md:gap-4 gap-2">
      <nuxt-link to="/" class="py-3">
        <nuxt-logo width="100%"></nuxt-logo>
      </nuxt-link>
      <div class="md:col-span-3 flex justify-end md:gap-4 gap-2">
        <nuxt-link to="/auth/login" class=" self-center  cursor-pointer">
          <i class="pi pi-user self-center text-xl cursor-pointer"></i>
        </nuxt-link>
        <nuxt-link to="/cart" class=" self-center  cursor-pointer">
          <i class="pi pi-shopping-cart text-xl" v-badge.success="total_cart_products"></i>
        </nuxt-link>


        <!--        <i class="pi pi-shopping-cart self-center text-xl cursor-pointer"><Badge value="2" severity="success"></Badge></i>-->
        <!--        <i class="pi pi-bell" ><Badge value="New"></Badge></i>-->
      </div>
      <p></p>
      <p></p>
      <p></p>
    </div>
    <nuxt/>
    <Toast position="top-right"/>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'

export default {

  mounted() {
    this.get_cart_total()
  },
  computed: {
    ...mapGetters({
      total_cart_products: 'get_cart_count'
    })
  },
  methods: {
    async get_cart_total() {
      this.$store.commit('replace_cart_count', 0)
      if (this.auth) {
        await this.$axios.get('/api/user/cart/count')
          .then(res => {
            if (res.status === 200) {
              this.$store.commit('replace_cart_count', res.data)
            } else {
              this.$store.commit('replace_cart_count', 0)
            }
          })
      } else {
        if (localStorage.hasOwnProperty('bong_cart')) {
          const carts = JSON.parse(this.$CryptoJS.AES.decrypt(localStorage.getItem("bong_cart"), process.env.localEncrypt).toString(this.CryptoJS.enc.Utf8))
          this.$store.commit('replace_cart_count', Object.keys(carts).length)
        }
      }

    }
  }
}
</script>
