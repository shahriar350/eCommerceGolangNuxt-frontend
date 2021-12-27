<template>
  <div class="mt-4">
    <loading_page v-if="$fetchState.pending"></loading_page>
    <div v-else-if="$fetchState.error">
      <v-card-text>Something is wrong. Please refresh.</v-card-text>
    </div>
    <v-row v-else>
      <v-col md="2" sm="3">
        <v-card>
          <v-card-subtitle>Total active products</v-card-subtitle>
          <v-card-text>{{ total_product }}</v-card-text>
        </v-card>
      </v-col>
      <v-col md="2" sm="3">
        <v-card>
          <v-card-subtitle>Total active shops</v-card-subtitle>
          <v-card-text>{{ total_shops }}</v-card-text>
        </v-card>
      </v-col>
      <v-col md="2" sm="3">
        <v-card>
          <v-card-subtitle>Total income</v-card-subtitle>
          <v-card-text>{{ total_selling_price }}</v-card-text>
        </v-card>
      </v-col>
      <v-col md="2" sm="3">
        <v-card>
          <v-card-subtitle>Today income</v-card-subtitle>
          <v-card-text>{{ today_selling_price }}</v-card-text>
        </v-card>
      </v-col>

    </v-row>
    <v-row>
      <v-col>
        <GChart v-if="chart.sellVdate.length"
                type="BarChart"
                :data="chart.sellVdate"
                :options="chartOptions"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {GChart} from 'vue-google-charts'
import loading_page from '@/components/loading_page'
export default {

  data() {
    return {
      total_product: 0,
      total_shops: 0,
      total_selling_price: 0,
      today_selling_price: 0,
      chartOptions: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        }
      },
      chart: {
        sellVdate: []
      }
    }
  },

  components: {
    GChart,loading_page
  },
  async fetch() {
    const data = await this.$axios.get('/api/seller/dashboard/basicinfo/')
    if (data.status === 200) {
      this.total_product = data.data.products;
      this.total_shops = data.data.shops;
      this.total_selling_price = data.data.total_selling_price;
      this.today_selling_price = data.data.today_selling_price;
    }
  },
  // async asyncData({$axios}) {
  //   let data = await $axios.get('/api/seller/dashboard/basicinfo/')
  //   // let data_earning = await $axios.get('/api/seller/total_earning/')
  //   return {
  //     total_product: data.data.products,
  //     total_shops: data.data.shops,
  //     total_selling_price: data.data.total_selling_price,
  //     today_selling_price: data.data.today_selling_price,
  //   }
  // },
  created() {
    this.set_breadcrumbs()
    this.get_chart_data_sellvsdate()
  },

  methods: {
    get_chart_data_sellvsdate() {
      this.$axios.get('/api/seller/chart/totalsell/date/')
        .then(res => {
          this.chart.sellVdate = res.data
        })
    },
    set_breadcrumbs() {
      const data = [
        {
          text: 'Dashboard',
          disabled: true,
          href: '/seller'
        },
      ]
      this.$store.commit('set_breadcrumbs', data)
      this.$store.commit('set_breadcrumbs_name', null)
    }
  }
}
</script>

<style scoped>

</style>
