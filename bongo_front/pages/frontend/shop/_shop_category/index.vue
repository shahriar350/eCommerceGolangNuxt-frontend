<template>
  <div>
    <loading_page v-if="$fetchState.pending"></loading_page>
    <p v-else-if="$fetchState.error">Something is error !!</p>
    <div v-else>
      <div v-if="all_products.length">
        <div>
          <v-select
            @input="sort_update"
            :items="action_sort"
            v-model="selectedActionSort"
            item-text="name"
            item-value="id"
            label="Filter"
            dense
            solo
          ></v-select>
        </div>
        <v-row>
          <v-col  v-if="sub_categories.length" cols="12" md="2" sm="3">
            <v-card max-height="400" class="overflow-y-auto overflow-x-hidden">

              <v-card-text :style="[$route.query.cat === '' ? {'color': 'black'}:{'color': 'rgba(0,0,0,.6)'} ]" class="pb-1"><p class="cursor-pointer" @click="$fetch">All {{this.$route.params.shop_category.split('-')[0]}} product</p></v-card-text>
              <div v-for="(category,index) in sub_categories" :key="index">

                <p :style="[$route.query.cat ===category.name ? {'color': 'black'}:{'color': 'rgba(0,0,0,.6)'} ]" @click="set_param(category)" class="cursor-pointer px-3 py-1">{{ category.name }}</p>
                <category_loop :child="category.child" @params_child_update="set_param"></category_loop>
              </div>
            </v-card>
          </v-col>
          <v-col  cols="12" md="10" sm="9">
            <v-card elevation="0" :loading="loading_product">
              <v-row dense v-if="products.length">

                <v-col  lg="2" md="3" sm="4" cols="6" v-for="(product,index) in products" :key="index">
                  <v-card max-width="344" :to="{path: `/product/${product.slug}/${product.id}`}" :nuxt="true">
                    <img-mine :thumbnail="product.get_product_image[0].image"/>
                    <v-card-title>{{ product.name | capfirst }}</v-card-title>
                    <v-card-subtitle>
                      <div>
                        <p v-if="product.multi_price">{{ product.multi_price }}</p>
                        <div v-else>
                          <div class="d-inline-block">&#2547{{
                              product.selling_price | offer(product.offer_price,product.offer_price_start,product.offer_price_end)
                            }}
                          </div>
                          <div class="d-inline-block px-2" v-if="parseFloat(product.product_price) > parseFloat(product.selling_price)">
                            <del>&#2547{{
                                product.product_price | offer(product.offer_price,product.offer_price_start,product.offer_price_end)
                              }}
                            </del>
                          </div>
                        </div>
                      </div>
                    </v-card-subtitle>
                  </v-card>
                </v-col>


              </v-row>
              <v-alert  v-else
                        border="left"
                        colored-border
                        color="deep-purple accent-4"
                        elevation="2">
                Sorry, No data is available here.
              </v-alert>
            </v-card>
          </v-col>

        </v-row>
      </div>
      <div v-else>
        <v-alert       border="left"
                       colored-border
                       color="deep-purple accent-4"
                       elevation="2">
          Sorry, No data is available here.
        </v-alert>
      </div>

    </div>

  </div>
</template>

<script>
import ImgMine from "../../../../components/my_image";
import Category_loop from "../../../../components/web/category_loop";
import Loading_page from "../../../../components/loading_page";

export default {
  components: {Loading_page, Category_loop, ImgMine},

  data() {
    return {
      loading_product: false,
      categories: [],
      all_products: [],
      products: [],
      sub_categories: [],
      selectedActionSort: 0,
      action_sort: [
        {
          id: 1,
          name: 'Price low to high'
        }
      ]
    }
  },

  async fetch() {
    await this.$router.push({path: this.$route.path, query: {cat: ''}})
    if (this.all_products.length < 1){

      const data = await this.$axios.get(`/api/nonuser/shop/product/${this.$route.params.shop_category}/all/`)
      this.all_products = data.data
      this.products = data.data
    } else {
      this.products = this.all_products
    }


  },
  mounted() {
    this.getSubCat()
  },
  fetchOnServer: false,

  methods: {
    sort_update(){
      if (this.selectedActionSort === 1){
        console.log('asfdasf')
      }
    },
    async set_param(value) {
      if (value.name !== this.$route.query.cat){
        this.loading_product = true
        await this.$router.push({path: this.$route.path, query: {cat: value.name}})
        const data = await this.$axios.get(`/api/nonuser/shop/product/filter/${value.id}/`)
        this.products = data.data
        this.loading_product = false
      }

    },
    async getSubCat() {

      const data = await this.$axios.get(`/api/nonuser/shop/category/filter/${this.$route.params.shop_category}/all/`)
      this.sub_categories = data.data
    }
  },
  filters: {
    offer: function (value, offer_percent, start, end) {
      const todaydate = new Date()
      const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) //new Date(2011,8,20)

      if (start !== undefined && end !== undefined) {
        if (start === null && end === null) {
          return value
        } else {
          const date_start = new Date(start)
          const date_end = new Date(end)
          if (today >= new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate())
            && today <= new Date(date_end.getFullYear(), date_end.getMonth(), date_end.getDate())) {
            return value - (value * (offer_percent / 100))
          } else {
            return value
          }
        }
      }
    }
  }

}
</script>

<style scoped>

</style>
