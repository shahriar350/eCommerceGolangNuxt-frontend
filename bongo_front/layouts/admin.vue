<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="false"
      :clipped="false"
      app
    >
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ user.name }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.phone_number }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          :nuxt="true"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
    >

      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-icon>{{ icon.mdiMenu }}</v-icon>
      </v-app-bar-nav-icon>
      <!--      <v-toolbar-title v-text="title"/>-->
      <v-toolbar-title>
        <nuxt-link to="/">Bongobitan Seller</nuxt-link>
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt/>
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
      </v-container>
    </v-main>
    <v-footer :absolute="true"
              app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex'
import {mdiApps, mdiStore, mdiVectorRectangle, mdiCartCheck, mdiMenu, mdiEyePlus} from "@mdi/js";
export default {
  middleware: 'is_seller',

  computed: {
    ...mapGetters({
      overlay: 'get_overlay',
      snackbar: 'get_snackbar',
    })
  },
  data() {
    return {
      icon: {
        mdiMenu
      },
      fixed: false,
      drawer: false,
      items: [
        {
          icon: mdiApps,
          title: 'Dashboard',
          to: '/seller/dashboard'
        },
        {
          icon: mdiStore,
          title: 'Shops',
          to: '/seller/shop'
        },
        {
          icon: mdiVectorRectangle,
          title: 'Products',
          to: '/seller/product?page=1&tab='
        },
        {
          icon: mdiCartCheck,
          title: 'Order',
          to: '/seller/order'
        },
        {
          icon: mdiEyePlus,
          title: 'Sell',
          to: '/seller/sell'
        },
      ],
      title: 'Bongobitan'
    }
  }
}
</script>


