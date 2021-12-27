<template>
  <div>
    <v-btn type="primary" @click="$fetch()">Refresh data</v-btn>
    <v-btn :nuxt="true" to="/seller/shops/non_activate">Non-Active Shops</v-btn>
    <v-btn :nuxt="true" to="/seller/shops/activate">Active Shops</v-btn>
    <v-btn :nuxt="true" to="/seller/shops/deleted">Deleted Shops</v-btn>

    <v-text-field v-model="text"></v-text-field>
    <v-card>
      <v-card-title>List shops</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="listShopsHeaders"
          :items="listShops"
          class="elevation-1"
        >
          <template v-slot:item.DeletedAt="{ item }">
<!--            <p>{{ new Date(item.DeletedAt).toUTCString() }}</p>-->
            <p v-if="item.DeletedAt !== null">{{ new Date(item.DeletedAt).toLocaleString() }}</p>
            <p v-else> <em>false</em> </p>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

  </div>
</template>
<script>
import {mdiDelete,mdiArrowUp} from '@mdi/js'
import confirm from '@/components/confirm'

export default {
  components: {
    confirm
  },
  data() {
    return {
      icons: {mdiArrowUp,mdiDelete},
      text: '',
      connection: null,
      listShops: [],
      listShopsHeaders: [
        {text: 'ID', value: 'id'},
        {text: 'Name', value: 'name'},
        {text: 'Category', value: 'shop_category.name'},
        {text: 'Contact', value: 'contact_number'},
        {text: 'Business Location', value: 'business_location'},
        {text: 'Active', value: 'active'},
        {text: 'Delete', value: 'DeletedAt'},
      ]
    }
  },

  async fetch() {
    const data = await this.$axios.get("/api/admin/seller/shops/all")
    if (data.status === 200) {
      this.listShops = data.data
    }
  }
}
</script>

<style scoped>

</style>
