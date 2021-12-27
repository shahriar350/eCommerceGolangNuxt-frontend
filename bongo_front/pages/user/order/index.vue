<template>
  <div>
    <loading_page v-if="$fetchState.pending"></loading_page>
    <v-card v-else v-for="(orders,ordersIndex) in my_orders" :key="ordersIndex" class="mb-3">
      <div class="d-flex justify-space-between w-full">
        <v-card-title class="w-full">Order {{ordersIndex +1}}</v-card-title>
        <p class="text-right w-full align-self-center pr-3"><span class="font-weight-bold subtitle-1">Total: </span>{{orders.total_price}}</p>
      </div>

      <v-card class="d-flex flex-row mb-2"  v-for="(order,index) in orders.checkout_products" :key="index">
        <v-img
          max-width="200"
          :lazy-src="order.product.get_product_image[0].image"
          :src="order.product.get_product_image[0].image"
        ></v-img>
        <v-card-text>
          <span class="font-weight-bold subtitle-1">Status: </span>{{order.status}}
          <div v-if="order.status === 'Reached'">
            <v-btn @click="confirm_product(order.id,ordersIndex,index)" color="blue" small >I received.</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import Loading_page from "../../../components/loading_page";
export default {
  components: {Loading_page},
  middleware: 'is_auth',
  data() {
    return {
      my_orders: []
    }
  },
  methods: {
    async confirm_product(checkout_id,parent,child){
      const data = await this.$axios.post(`/api/user/order/product/confirm/${checkout_id}/`)
      if (data.status === 200){
        this.my_orders[parent].checkout_products[child].status = 'Completed'
        this.$toast.success('Completed.')
      }
    }
  },
  async fetch(){
    const data = await this.$axios.get('/api/user/orders')
    this.my_orders = data.data
  },

}
</script>

<style scoped>

</style>
