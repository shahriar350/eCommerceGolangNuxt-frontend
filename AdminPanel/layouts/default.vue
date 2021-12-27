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
      <sidebar_menus/>

    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
    >
      <div class="d-flex justify-space-between">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer">

          <v-icon>{{ icon.mdiMenu }}</v-icon>
        </v-app-bar-nav-icon>
        <!--      <v-toolbar-title v-text="title"/>-->
        <v-toolbar-title>
          <nuxt-link to="/">Bongobitan Admin</nuxt-link>
        </v-toolbar-title>
        <v-btn @click="logoutAdmin" color="secondary">Logout</v-btn>
      </div>

    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt/>
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
import sidebar_menus from "@/components/sidebar_menus";

export default {
  middleware: 'is_admin',
  components: {
    sidebar_menus
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
          to: '/'
        },
        {
          title: 'Category',
          to: ''
        },

      ],
      title: 'Bongobitan'
    }
  },
  methods: {
    async logoutAdmin() {
      const data = await this.$axios.post("/api/admin/logout")
      if (data.status === 200){
        window.location.reload()
      }

    }
  },
}
</script>


