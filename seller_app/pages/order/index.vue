<template>
  <div>
    <client-only>
      <loading_page v-if="$fetchState.pending"></loading_page>
      <v-row v-else class="mt-4">
        <v-col cols="12">
          <v-row>
            <v-col>
              <v-card>
                <v-card-subtitle>Today Income</v-card-subtitle>
                <v-card-title>{{ statistic.today_income }} /Taka</v-card-title>
              </v-card>
            </v-col>
            <v-col>
              <v-card>
                <v-card-subtitle>Total Income</v-card-subtitle>
                <v-card-title>{{ statistic.total_income }} /Taka</v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="checkouts"
            item-key="name"
            class="elevation-1"
            :search="search"
            :custom-filter="filterOnlyCapsText"
          >
            <template v-slot:top>
              <v-text-field
                v-model="search"
                label="Search (UPPER CASE ONLY)"
                class="mx-4"
              ></v-text-field>
            </template>
            <template v-slot:item.seller_product.name="{ item }">
              <my_img style="width: 70px" :thumbnail="item.edges.seller_product.edges.seller_product_images[0].image"/>
              <p>{{ item.seller_product.name }}</p>
            </template>
            <template v-slot:item.edges.checkout.edges.location="{ item }">
              <div class="d-flex">
                <!--                            {{item.edges.checkout.edges}}-->
                <div class="mr-2">
                  <p>House: {{ item.edges.checkout.edges.location.house }}, </p>
                  <p>Street: {{ item.edges.checkout.edges.location.street }}, </p>
                  <p>Area: {{ item.edges.checkout.edges.location.area }}, </p>
                </div>
                <div>
                  <p>Post office: {{ item.edges.checkout.edges.location.post_office }}, </p>
                  <p>Post code: {{ item.edges.checkout.edges.location.post_code }}, </p>
                  <p>Police station: {{ item.edges.checkout.edges.location.police_station }}, </p>
                  <p>City: {{ item.edges.checkout.edges.location.city }}</p>
                </div>
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <v-btn small @click="fetchCheckoutProductDetail(item.id)">Details</v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-dialog
        v-model="dialog"
        max-width="600px"
      >
        <v-card v-if="Object.keys(checkoutProductDetails).length > 0">

          <v-card-title class="text-center">{{ checkoutProductDetails.edges.seller_product.name }}</v-card-title>
          <v-card-subtitle>{{ checkoutProductDetails.selling_price }} * {{ checkoutProductDetails.quantity }} = {{
              (parseFloat(checkoutProductDetails.selling_price) * parseFloat(checkoutProductDetails.quantity)).toFixed(2)
            }}
          </v-card-subtitle>
          <v-card-text>
            <div>
              <v-card>
                <v-card-title>Delivery location</v-card-title>
                <v-card-text>
                  <div class="d-flex">
                    <div class="mr-2">
                      <p>House: {{ checkoutProductDetails.edges.checkout.edges.location.house }}, </p>
                      <p>Street: {{ checkoutProductDetails.edges.checkout.edges.location.street }}, </p>
                      <p>Area: {{ checkoutProductDetails.edges.checkout.edges.location.area }}, </p>
                    </div>
                    <div>
                      <p>Post office: {{ checkoutProductDetails.edges.checkout.edges.location.post_office }}, </p>
                      <p>Post code: {{ checkoutProductDetails.edges.checkout.edges.location.post_code }}, </p>
                      <p>Police station: {{ checkoutProductDetails.edges.checkout.edges.location.police_station }}, </p>
                      <p>City: {{ checkoutProductDetails.edges.checkout.edges.location.city }}</p>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <v-card class="mt-2" v-if="'seller_product_variation' in checkoutProductDetails.edges">
                <v-card-title>Variations:</v-card-title>
                <v-card-text>
                  <div class="d-flex" >
                    <div class="mr-3"
                         v-for="(variation,index) in checkoutProductDetails.edges.seller_product_variation.edges.seller_product_variation_values">
                      <ul>
                        <li>{{ variation.edges.attribute.name }}
                          <ul>
                            <li>{{ variation.name }}</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

            </div>
          </v-card-text>
        </v-card>
        <div v-else class="white">
          <loading_page></loading_page>
        </div>
      </v-dialog>
    </client-only>
  </div>
</template>

<script>
import loading_page from "@/components/loading_page";
import my_img from '@/components/my_img'

export default {
  components: {
    loading_page, my_img
  },
  data() {
    return {
      dialog: false,
      search: '',
      checkouts: [],
      statistic: {},
      checkoutProductDetails: {}
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        {
          text: 'Product Name',
          value: 'edges.seller_product.name',
        },
        {
          text: 'Price(single)',
          value: 'selling_price',
        },
        {
          text: 'Quantity',
          value: 'quantity',
        },
        {
          text: 'Delivery Location',
          value: 'edges.checkout.edges.location',
        },
        {
          text: 'Action',
          value: 'action',
        },


      ]
    },
  },
  created() {
    this.set_breadcrumbs()
  },
  fetch() {
    this.$axios.get('/api/seller/my/order')
      .then(res => {
        this.checkouts = res.data
      })
    this.$axios.get('/api/seller/order/income/statistic')
      .then(res => {
        this.statistic = res.data
      })
  },
  fetchOnServer: false,
  methods: {
    fetchCheckoutProductDetail(id) {
      let go = true
      if (Object.keys(this.checkoutProductDetails).length > 0) {
        if (this.checkoutProductDetails.id !== id) {
          this.checkoutProductDetails = {}
        } else {
          go = false
        }
      }
      this.dialog = true
      if (go) {
        this.$axios.get(`/api/seller/checkout/product/details/${id}`)
          .then(res => {
            this.checkoutProductDetails = res.data
          })
          .catch(() => {
            this.dialog = false
            this.$toast.error("Try again!!")
          })
      }

    },
    filterOnlyCapsText(value, search, item) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
    },
    set_breadcrumbs() {
      const data = [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/'
        },
        {
          text: 'Order',
          disabled: true,
          href: '/order'
        },

      ]
      this.$store.commit('set_breadcrumbs', data)
      this.$store.commit('set_breadcrumbs_name', null)
    }
  },
}
</script>
