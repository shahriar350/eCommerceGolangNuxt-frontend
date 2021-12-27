<template>
  <div>
    <loading_page v-if="$fetchState.pending"></loading_page>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else>
      <!--      new order start-->
      <v-card class="my-3">
        <v-card-title class="text-center">Your new available orders</v-card-title>
        <v-card-subtitle>We'll connect you to receive orders or you can delivery products to <strong>BongoBitan</strong>
          office
        </v-card-subtitle>
        <v-card-text>
          <v-data-table
            class="elevation-1"
            :items="new_orders"
            :headers="headers"
          >
            <template #item.total_price="{ item }">
              <span class="font-weight-bold">&#2547 </span> {{
                calculate_order(item.selling_price,item.quantity,item.offer_price) }}
            </template>
            <template #item.created="{ item }">
              {{ new Date(item.created).toJSON().substring(0,19).replace('T',' ') }}
            </template>
            <template #item.action="{ item , index}">
              <v-btn @click="change_order_status(item.id,1,index)" color="blue" class="mb-1" small>Processing</v-btn>
            </template>
            <template slot="no-data">No data is available</template>

          </v-data-table>
        </v-card-text>
      </v-card>
      <!--      new order end-->
<!--      order processing start-->
      <v-card class="my-3">
        <v-card-title>Order processing orders</v-card-title>
        <v-card-subtitle>
          All orders are processing here.
        </v-card-subtitle>
        <v-card-text>
          <v-data-table
            class="elevation-1"
            :items="orders_processing"
            :headers="headers"
          >
            <template #item.total_price="{ item }">
              <span class="font-weight-bold">&#2547 </span> {{
                calculate_order(item.selling_price,item.quantity,item.offer_price) }}
            </template>
            <template #item.created="{ item }">
              {{ new Date(item.created).toJSON().substring(0,19).replace('T',' ') }}
            </template>
            <template #item.action="{ item , index}">
              <v-btn @click="change_order_status(item.id,2,index)" color="blue" class="mb-1" small>Packaging</v-btn>
            </template>
            <template slot="no-data">No data is available</template>

          </v-data-table>
        </v-card-text>
      </v-card>
      <!--      order processing end-->
      <!--      order packaging start-->
      <v-card class="my-3">
        <v-card-title>Order packaging product</v-card-title>
        <v-card-subtitle>
          All orders are packaging.
        </v-card-subtitle>
        <v-card-text>
          <v-data-table
            class="elevation-1"
            :items="orders_packaging"
            :headers="headers"
          >
            <template #item.total_price="{ item }">
              <span class="font-weight-bold">&#2547 </span> {{
                calculate_order(item.selling_price,item.quantity,item.offer_price) }}
            </template>
            <template #item.created="{ item }">
              {{ new Date(item.created).toJSON().substring(0,19).replace('T',' ') }}
            </template>
            <template #item.action="{ item , index}">
              <v-btn @click="change_order_status(item.id,3,index)" color="blue" class="mb-1" small>On-way</v-btn>
            </template>
            <template slot="no-data">No data is available</template>

          </v-data-table>
        </v-card-text>
      </v-card>
<!--      order on-way start-->
      <v-card class="my-3">
        <v-card-title>Order on-way</v-card-title>
        <v-card-subtitle>
          All orders are in road to shop.
        </v-card-subtitle>
        <v-card-text>
          <v-data-table
            class="elevation-1"
            :items="orders_on_way"
            :headers="headers"
          >
            <template #item.total_price="{ item }">
              <span class="font-weight-bold">&#2547 </span> {{
                calculate_order(item.selling_price,item.quantity,item.offer_price) }}
            </template>
            <template #item.created="{ item }">
              {{ new Date(item.created).toJSON().substring(0,19).replace('T',' ') }}
            </template>
            <template #item.action="{ item , index}">
              <v-btn @click="change_order_status(item.id,4,index)" color="blue" class="mb-1" small>Reached destination</v-btn>
            </template>
            <template slot="no-data">No data is available</template>

          </v-data-table>
        </v-card-text>
      </v-card>
<!--      order on-way end-->
      <!--      order reached start-->
      <v-card class="my-3">
        <v-card-title>Order reached</v-card-title>
        <v-card-subtitle>
          All orders are reached at user location.
        </v-card-subtitle>
        <v-card-text>
          <v-data-table
            class="elevation-1"
            :items="orders_reached"
            :headers="headers"
          >
            <template #item.total_price="{ item }">
              <span class="font-weight-bold">&#2547 </span> {{
                calculate_order(item.selling_price,item.quantity,item.offer_price) }}
            </template>
            <template #item.created="{ item }">
              {{ new Date(item.created).toJSON().substring(0,19).replace('T',' ') }}
            </template>
            <template #item.action="{ item ,index }">
              <v-btn color="blue" class="mb-1" small>Waiting for received</v-btn>
            </template>
            <template slot="no-data">No data is available</template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <!--      order reached start-->
      <v-card class="my-3">
        <v-card-title>Order completed</v-card-title>
        <v-card-subtitle>
          User confirmation
        </v-card-subtitle>
        <v-card-text>
          <v-data-table
            class="elevation-1"
            :items="orders_completed"
            :headers="headers"
          >
            <template #item.total_price="{ item }">
              <span class="font-weight-bold">&#2547 </span> {{
                calculate_order(item.selling_price,item.quantity,item.offer_price) }}
            </template>
            <template #item.created="{ item }">
              {{ new Date(item.created).toJSON().substring(0,19).replace('T',' ') }}
            </template>
            <template slot="no-data">No data is available</template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
    <confirm ref="confirm"/>
  </div>
</template>

<script>
  import confirm from "../../../components/confirm";
  import Loading_page from "../../../components/loading_page";
  export default {
    components: {
      Loading_page,
      confirm,
    },
    created() {
      this.set_breadcrumbs()
    },
    data() {
      return {
        new_orders: [],
        orders_completed: [],
        orders_processing: [],
        orders_packaging: [],
        orders_on_way: [],
        orders_reached: [],
        orders: [],
        headers: [
          {text: 'Product order ID', value: 'slug'},
          {text: 'Product', value: 'product.name'},
          {text: 'Price', value: 'selling_price'},
          {text: 'Quantity', value: 'quantity'},
          {text: 'Offer', value: 'offer_price'},
          {text: 'Total price', value: 'total_price'},
          {text: 'Order date', value: 'created'},
          {text: 'Action', value: 'action'},
        ],
      }
    },
    async fetch() {
      const all_datas = (await this.$axios.get('/api/seller/my_orders/')).data
      for (const [key, value] of Object.entries(all_datas)) {
        if (value.status === 0){
          this.new_orders.push(value)
        } else if (value.status === 1){
          this.orders_processing.push(value)
        } else if (value.status === 2){
          this.orders_packaging.push(value)
        } else if (value.status === 3){
          this.orders_on_way.push(value)
        } else if (value.status === 4){
          this.orders_reached.push(value)
        } else {
          this.orders_completed.push(value)
        }
      }
    },
    fetchOnServer: false,
    methods: {
      async change_order_status(checkout_product_id, order_status,index){
        if (
          await this.$refs.confirm.open('Confirmation.')
        ) {
          await this.$axios.post(`/api/seller/order/product/update/status/${checkout_product_id}/`,{
            order_status: parseInt(order_status)
          }) .then(res => {
            if (order_status === 1){
              this.orders_processing.push(this.new_orders[index])
              this.new_orders.splice(index,1)
            } else if (order_status === 2){
              this.orders_packaging.push(this.orders_processing[index])
              this.orders_processing.splice(index,1)
            } else if (order_status === 3){
              this.orders_on_way.push(this.orders_packaging[index])
              this.orders_packaging.splice(index,1)
            } else if (order_status === 4){
              this.orders_reached.push(this.orders_on_way[index])
              this.orders_on_way.splice(index,1)
            }
            this.$toast.success('Status updated.')
          })
        }
      },
      calculate_order(price, quantity, offer) {
        return (Number(price) - (Number(price) * ((offer) / 100))) * quantity
      },
      async confirm_delivery() {
        if (
          await this.$refs.confirm.open('Delivery confirm.', "Delivery confirm to Bongobitan collector.")
        ) {

        }

      },
      set_breadcrumbs() {
        const data = [
          {
            text: 'Dashboard',
            disabled: false,
            href: '/seller'
          },
          {
            text: 'Order',
            disabled: true,
            href: '/seller/order'
          }
        ]
        this.$store.commit('set_breadcrumbs', data)
        this.$store.commit('set_breadcrumbs_name', null)
      }
    },
  }
</script>

<style scoped>

</style>
