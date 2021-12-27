<template>
  <div>
    <v-card>
      <v-btn to="/seller/requests" :nuxt="true">Non active Requests</v-btn>
    </v-card>
    <v-card>
      <v-card-title>
        All request <small>only accepted</small>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="requests"
          :items-per-page="5"
          class="elevation-1"
        >
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>
        All trashes request
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="requests_trash"
          :items-per-page="5"
          class="elevation-1"
        >
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requests: [],
      requests_trash: [],
      headers: [
        {text: 'ID', sortable: true, value: 'id'},
        {text: 'Name', value: 'seller_name'},
        {text: 'Contact Number', value: 'contact_number'},
        {text: 'Category', value: 'shop_category.name'},
        {text: 'Shop name', value: 'shop_name'},
        {text: 'Location', value: 'shop_location'},
        {text: 'Actions', value: 'actions'},
      ],
    }
  },
  async fetch(){
    const data = await this.$axios.get("/api/seller/seller/request/all")
    if (data.status === 200){
      this.requests = data.data.complated
      this.requests_trash = data.data.trashes
    }
  }
}
</script>

<style scoped>


</style>
