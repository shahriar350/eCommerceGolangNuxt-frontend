<template>
  <div>
    <v-card>
      <v-btn to="/seller/requests/all" :nuxt="true">All requests</v-btn>
    </v-card>
    <v-card v-if="server_errors !== null">
      <v-card-text>
        <div  v-for="(items,index) in server_errors">
          <p>{{index}}: {{items}}</p>
        </div>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>Seller Request <small class="mx-2"> non-accepted</small></v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="seller_requests"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item, index }">
            <v-icon
              small
              class="mr-2"
              @click="showItem(item, index)"
            >
              {{icons.mdiCropLandscape}}
            </v-icon>
<!--            <v-icon-->
<!--              small-->
<!--              @click="deleteItem(item)"-->
<!--            >-->
<!--              mdi-delete-->
<!--            </v-icon>-->
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-if="show_full_info" v-model="show_full_info" max-width="600">
      <v-card>
        <v-card-title>Details</v-card-title>
        <v-card-text>
          <p ><span class="subtitle-2">Seller ID:</span> <span class="subtitle-1">{{ seller_requests[showDetailIndex].id }}</span> </p>
          <p ><span class="subtitle-2">Seller name:</span> <span class="subtitle-1">{{ seller_requests[showDetailIndex].seller_name | capfirst }}</span> </p>
          <p ><span class="subtitle-2">Contact number:</span> <span class="subtitle-1">{{ seller_requests[showDetailIndex].contact_number }}</span> </p>
          <p ><span class="subtitle-2">Category:</span> <span class="subtitle-1">{{ seller_requests[showDetailIndex].shop_category.name | capfirst  }}</span> </p>
          <p ><span class="subtitle-2">Shop name:</span> <span class="subtitle-1">{{ seller_requests[showDetailIndex].shop_name  | capfirst }}</span> </p>
          <p ><span class="subtitle-2">Shop location:</span> <span class="subtitle-1">{{ seller_requests[showDetailIndex].shop_location | capfirst  }}</span> </p>
          <p ><span class="subtitle-2">Tax ID:</span> <span class="subtitle-1">{{ seller_requests[showDetailIndex].tax_id }}</span> </p>
          <p ><span class="subtitle-2">Accepted:</span> <span class="subtitle-1">{{ seller_requests[showDetailIndex].accepted }}</span> </p>
          <p ><span class="subtitle-2">Created At:</span> <span class="subtitle-1">{{ new Date(seller_requests[showDetailIndex].CreatedAt).toString() }}</span> </p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="activeSeller(seller_requests[showDetailIndex].id)" block>Active this seller</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <confirm ref="confirm" />
  </div>
</template>

<script>
import {mdiCropLandscape} from '@mdi/js'
import Confirm from "@/components/confirm";
export default {
  components: {Confirm},
  data() {
    return {
      icons: {mdiCropLandscape},
      show_full_info: false,
      headers: [
        {text: 'ID', sortable: true, value: 'id'},
        {text: 'Name', value: 'seller_name'},
        {text: 'Contact Number', value: 'contact_number'},
        {text: 'Category', value: 'shop_category.name'},
        {text: 'Shop name', value: 'shop_name'},
        {text: 'Location', value: 'shop_location'},
        {text: 'Actions', value: 'actions'},
      ],
      seller_requests: [],
      showDetailIndex : '',
      server_errors: null,
    }
  },
  async fetch() {
    const data = await this.$axios.get("/api/admin/seller/request")
    if (data.status === 200) {
      this.seller_requests = data.data
    }
  },
  methods: {
    async activeSeller(id){
      if (await this.$refs.confirm.open("Want to active this seller")){
        const data = await this.$axios.post(`/api/admin/seller/request/accepted/${id}`)
        this.show_full_info = false
        if (data.status === 201){
          this.$toast.success("Active successfully.")
          this.seller_requests.splice(this.showDetailIndex,1)
        } else {
          this.$toast.error("Try again")
          this.server_errors = data.data
        }
      }
    },
    showItem(data,index) {
      this.show_full_info = true
      this.showDetailIndex = index
    }
  },
}
</script>
