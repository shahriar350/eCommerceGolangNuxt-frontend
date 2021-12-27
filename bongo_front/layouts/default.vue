<template>
  <v-app>
    <v-main>
      <v-container class="d-flex justify-end p-0 m-0">
        <a v-if="auth && user.seller" href="/seller" class="text-end mb-0 d-inline-block">Seller</a>
        <nuxt-link class="p-0 m-0" to="/auth/seller/login" v-else>Sell on <em>BongoBitan</em></nuxt-link>
        <v-btn to="/auth/user/login" :nuxt="true">User login</v-btn>
      </v-container>
      <v-container fluid>
        <v-row class="py-2">
          <v-col lg="2" md="3" sm="4" cols="6">
            <nuxt-link to="/" class="d-flex align-center">
              <!--              Logo-->
              <logo></logo>
              <!--              <v-img contain alt="bongobitan"-->
              <!--                     :src="require('~/static/logo.png')"-->
              <!--                     :lazy-src="require('~/static/logo.png')"-->
              <!--                     ></v-img>-->
            </nuxt-link>
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="search"
              :items="items"
              outlined
              deletable-chips
              :dense="screenWidth < 600"
              chips
              small-chips
              label="Search..."
              multiple
            >
              <v-icon
                slot="append"
                color="red"
              >
                {{ icon.mdiMagnify }}
              </v-icon>
            </v-autocomplete>
          </v-col>
          <client-only>
            <v-col md="4" cols="12" v-if="screenWidth > 600" class="d-none d-md-block">
              <div class="d-flex justify-space-between align-center grey lighten-5 py-2">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      Dropdown
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>Profile</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/user/order" :nuxt="true">
                      <v-list-item-title>Orders</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <div class="d-inline-block mr-4">
                  <nuxt-link to="/cart">
                    <v-badge
                      color="green"
                      :content="`${total_cart_products}`"
                    >
                      <v-icon>{{ icon.mdiCartVariant }}</v-icon>
                    </v-badge>
                  </nuxt-link>
                </div>
              </div>

            </v-col>
          </client-only>
        </v-row>

        <div class="py-2">

          <nuxt/>
        </div>

        <v-overlay :value="overlay">
          <v-progress-circular
            indeterminate
            size="64"
          ></v-progress-circular>
        </v-overlay>
        <v-snackbar
          :value="snackbar"
        >
          {{ snackbar }}
        </v-snackbar>
        <client-only v-if="screenWidth < 600">
          <div class="overflow-hidden">
            <v-bottom-navigation
              app
              fixed
              color="primary"
              class="p-0"
            >
              <v-btn class="white" style="height: 100% !important;" to="/cart" :nuxt="true">
                <span>Cart</span>

                <v-icon>{{ icon.mdiCartMinus }}</v-icon>
              </v-btn>


            </v-bottom-navigation>
          </div>
        </client-only>
      </v-container>

    </v-main>

  </v-app>
</template>

<script>
import {mapGetters} from 'vuex'
import {mdiMapMarker, mdiMagnify, mdiHistory, mdiHeart, mdiAccount, mdiCartVariant, mdiCartMinus} from '@mdi/js'

export default {
  created() {
    // this.get_cart_total()
  },

  data() {
    return {
      value: 1,
      active: true,
      icon: {
        mdiMagnify, mdiMapMarker, mdiHistory, mdiHeart, mdiAccount, mdiCartVariant, mdiCartMinus
      },
      search: '',
      items: [
        {title: 'Profile', link: '/user'},
        {title: 'User Login', link: '/auth/user/login'},
      ],
      auth_user_actions: [
        {title: 'Profile', link: '/user'},
        {title: 'Cart', link: '/cart'},
      ]
    }
  },
  methods: {
    async get_cart_total() {
      this.$store.commit('replace_cart_count', 0)
      if (this.auth) {
        await this.$axios.get('/api/user/cart/total/')
          .then(res => {
            this.$store.commit('set_cart_count', res.data)
          })
      } else {
        if (this.$cookies.get('bongo_cart') !== undefined) {
          const carts = Object.keys(this.$cookies.get('bongo_cart')).length
          this.$store.commit('set_cart_count', carts)
        }
      }

    }
  },

  computed: {
    ...mapGetters({
      overlay: 'get_overlay',
      snackbar: 'get_snackbar',
      total_cart_products: 'get_cart_count'
    })
  }
}
</script>

<style scoped>

</style>
