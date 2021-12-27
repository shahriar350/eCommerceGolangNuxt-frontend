<template>
  <div>
    <v-btn type="primary" @click="$fetch()">Refresh data</v-btn>
    <v-btn :nuxt="true" to="/seller/shops/list">List Shops</v-btn>

    <v-btn :nuxt="true" to="/seller/shops/non_activate">Non-Active Shops</v-btn>
    <v-btn :nuxt="true" to="/seller/shops/activate">Active Shops</v-btn>

    <v-text-field v-model="text"></v-text-field>
    <v-card>
      <v-card-title>Deleted shops</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="deleteShopsHeaders"
          :items="deleteShops"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item, index }">

            <v-icon
              small
              color="red"
              @click="permanentDelete(item, index)"
            >
              {{ icons.mdiDelete }}
            </v-icon>
            <v-icon
              small
              color="red"
              @click="recoverShopRequest(item, index)"
            >
              {{ icons.mdiArrowUp }}
            </v-icon>

          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <confirm ref="confirm"/>
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
      deleteShops: [],
      deleteShopsHeaders: [
        {text: 'ID', value: 'id'},
        {text: 'Name', value: 'name'},
        {text: 'Category', value: 'shop_category.name'},
        {text: 'Contact', value: 'contact_number'},
        {text: 'Business Location', value: 'business_location'},
        {text: 'Actions', value: 'actions', sortable: false},
      ]
    }
  },

  methods: {


    async permanentDelete(item, index) {
      if (await this.$refs.confirm.open('Do you want to delete?')) {
        const data = await this.$axios.delete('/api/admin/seller/shops/permanent/delete/' + item.id)
        if (data.status === 200) {
          this.$toast.success("Permanent Deleted Successfully.")
          this.deleteShops.splice(index, 1)
        }
      }
  },
    async recoverShopRequest(item, index) {
      if (await this.$refs.confirm.open('Do you want to recover?')) {
        const data = await this.$axios.put('/api/admin/seller/shops/recover/delete/' + item.id)
        if (data.status === 200) {
          this.$toast.success("Recovered Successfully.")
          this.$toast.info("Product can be found in Non-Activate Product.")
          this.deleteShops.splice(index, 1)
        }
      }

    }
  },

  async fetch() {
    const data = await this.$axios.get("/api/admin/seller/shops/delete")
    if (data.status === 200) {
      this.deleteShops = data.data
    }
  }
}
</script>

<style scoped>

</style>
