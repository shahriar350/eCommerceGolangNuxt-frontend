<template>
  <div>
    <v-btn type="primary" @click="$fetch()">Refresh data</v-btn>
    <v-btn :nuxt="true" to="/seller/shops/list">List Shops</v-btn>
    <v-btn :nuxt="true" to="/seller/shops/activate">Active Shops</v-btn>
    <v-btn :nuxt="true" to="/seller/shops/deleted">Deleted Shops</v-btn>
    <v-text-field v-model="text"></v-text-field>
    <v-card>
      <v-card-title>Non activate shops</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="nonActivateShopsHeaders"
          :items="nonActivateShops"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item, index }">
            <v-icon
              small
              class="mr-2"
              @click="show_full_info=true;showDetailIndex = index"
            >
              {{ icons.mdiFullscreen }}
            </v-icon>
            <v-icon
              small
              color="red"
              @click="removeShopRequest(item, index)"
            >
              {{ icons.mdiDelete }}
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-if="show_full_info" v-model="show_full_info" max-width="600">
      <v-card>
        <v-card-title>Details</v-card-title>
        <v-card-text>
          <p><span class="subtitle-2">Seller ID:</span> <span class="subtitle-1">{{
              nonActivateShops[showDetailIndex].id
            }}</span></p>
          <p><span class="subtitle-2">Seller name:</span> <span
            class="subtitle-1">{{ nonActivateShops[showDetailIndex].name | capfirst }}</span></p>
          <p><span class="subtitle-2">Contact number:</span> <span
            class="subtitle-1">{{ nonActivateShops[showDetailIndex].contact_number | capfirst }}</span></p>
          <p><span class="subtitle-2">Business location:</span> <span
            class="subtitle-1">{{ nonActivateShops[showDetailIndex].business_location | capfirst }}</span></p>
          <p><span class="subtitle-2">Tax ID:</span> <span
            class="subtitle-1">{{ nonActivateShops[showDetailIndex].tax_id }}</span></p>

          <v-img :lazy-src="`${$store.state.apiHost}/static/images/${nonActivateShops[showDetailIndex].banner}`"
                 :src="`${$store.state.apiHost}/static/images/${nonActivateShops[showDetailIndex].banner}`"/>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="activeShop(nonActivateShops[showDetailIndex].id)" block>Active this shop</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <confirm ref="confirm"/>
  </div>
</template>
<script>
import {mdiDelete, mdiFullscreen} from '@mdi/js'
import confirm from '@/components/confirm'

export default {
  components: {
    confirm
  },
  data() {
    return {
      show_full_info: false,
      showDetailIndex: 0,
      icons: {mdiDelete, mdiFullscreen},
      text: '',
      connection: null,
      nonActivateShops: [],
      nonActivateShopsHeaders: [
        {text: 'ID', value: 'id'},
        {text: 'Name', value: 'name'},
        {text: 'Category', value: 'shop_category.name'},
        {text: 'Contact', value: 'contact_number'},
        {text: 'Business Location', value: 'business_location'},
        {text: 'Actions', value: 'actions', sortable: false},
      ]
    }
  },
  created() {

  },

  mounted() {

    // console.log("Starting connection to WebSocket Server")
    // this.connection = new WebSocket("ws://localhost:8000/ws/admin/shop/created")
    // if (process.client){
    //   this.connection.onmessage = function(event) {
    //     console.log(this.nonActivateShops)
    //     console.log(JSON.parse(event.data))
    //     console.log(typeof JSON.parse(event.data))
    //     this.nonActivateShops.push(JSON.parse(event.data))
    //   }
    // }
    //
    //
    // this.connection.onopen = function(event) {
    //   console.log(event)
    //   console.log("Successfully connected to the echo websocket server...")
    // }

  },
  methods: {
    async activeShop(id) {
      if (await this.$refs.confirm.open('Do you want to active this shop?')) {
        const data = await this.$axios.post('/api/admin/seller/shops/active/' + id)
        console.log(data)
        if (data.status === 200) {
          this.nonActivateShops.splice(this.showDetailIndex, 1)
          this.show_full_info = false
          this.showDetailIndex = 0
          this.$toast.success("Successfully activate.")
        } else {
          this.show_full_info = false
          this.showDetailIndex = 0
          this.$toast.error("Something is error. Please try again.")
        }
      }
    },

    async removeShopRequest(item, index) {
      if (await this.$refs.confirm.open('Do you want to delete?')) {
        const data = await this.$axios.put('/api/admin/seller/shops/soft/delete/' + item.id)
        if (data.status === 200) {
          this.$toast.success("Deleted Successfully.")
          this.nonActivateShops.splice(index, 1)
        }
      }

    }
  },

  async fetch() {
    const data = await this.$axios.get("/api/admin/seller/shops/non/activate")
    if (data.status === 200) {
      this.nonActivateShops = data.data
    }
  }
}
</script>

<style scoped>

</style>
