<template>
  <div>
    <div>
      <v-card class="d-flex flex-md-row flex-column align-center justify-md-space-between">

        <v-breadcrumbs v-if="items.length"
                       :items="items"
                       divider=">" class="p-0"
        >
          <template v-slot:item="{ item }">

              <nuxt-link
                :to="item.href"
                class="text-decoration-none text-md-body-2 text-caption"
                no-prefetch
              >
                <v-breadcrumbs-item :disabled="item.disabled" class="text-md-body-2 text-caption">
                  {{ item.text.toUpperCase() }}
                </v-breadcrumbs-item>

              </nuxt-link>
          </template>
        </v-breadcrumbs>

        <div v-if="item_name" class="">
          <v-btn :small="screenWidth < 960" :nuxt="true" :to="item_name.url" depressed color="primary" class="text-md-body-2 text-caption">{{ item_name.name }}</v-btn>
        </div>

      </v-card>
    </div>

    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  layout: 'seller',
  computed: {
    ...mapGetters({
      items: 'get_breadcrumbs',
      item_name: 'get_breadcrumbs_name'
    })
  }
}
</script>

<style scoped>

@media screen and (max-width: 960px) {
  .v-breadcrumbs{
    padding: 5px 0;
  }
}
</style>
