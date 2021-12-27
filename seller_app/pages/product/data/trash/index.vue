<template>
  <div>

    <loading_page v-if="$fetchState.pending"></loading_page>
    <div v-else-if="$fetchState.error">
      <v-card-text>Something is wrong. Please refresh.</v-card-text>
    </div>
    <div v-else>
      <v-pagination
        :prev-icon="icon.mdiChevronLeft"
        :next-icon="icon.mdiChevronRight"
        v-model="page"
        :length="products.total_pages" @input="next"
      ></v-pagination>
      active products
      <div class="mt-4">
        <div class="d-flex flex-wrap flex-sm-row flex-column justify-space-between elevation-1 rounded pb-4 px-3">
          <v-card-text class="headline text-md-h6 text-h6">Active products</v-card-text>
          <v-card-text v-if="products.length > 0">No data available</v-card-text>
          <v-card v-else v-for="(data,index) in products.items" :key="index" class="mr-3 my-md-0 my-2">
            <v-card-title class="text-subtitle-2">
              {{ data.name | capfirst }}
            </v-card-title>
            <v-card-subtitle class="text-body-2">
              <p class="">Product price: <span class="font-weight-bold">{{ data.product_price }}/Taka</span></p>
              <p class="">Selling price: <span class="font-weight-bold">{{ data.selling_price }}/Taka</span></p>
              <p class="">Quantity: <span class="font-weight-bold">{{ data.quantity }}</span></p>
            </v-card-subtitle>
            <v-card-actions>
              <nuxt-link class="px-2 " :to="{path: `/seller/product/edit/${data.slug}/basic`}">
                <v-icon>{{ icon.mdiAccountEdit }}</v-icon>
              </nuxt-link>
              <v-icon @click="soft_delete_now(data.id,index)" class="px-2 cursor-pointer">{{ icon.mdiLock }}</v-icon>
            </v-card-actions>
          </v-card>

        </div>
      </div>
      <!--          trash product start-->

      <div class="mt-4">
        <div class="d-flex flex-wrap flex-sm-row flex-column justify-space-between elevation-1 rounded pb-4 px-3">
          <v-card-text class="headline text-md-h6 text-h6">Trash products</v-card-text>
          <v-card-text v-if="trash_products.length < 1" class="text-md-h6">No data available</v-card-text>
          <v-card v-else v-for="(data,index) in trash_products" :key="index" class="mr-3">
            <v-card-title class="text-subtitle-2">
              {{ data.name | capfirst }}
            </v-card-title>
            <v-card-subtitle class="text-body-2">
              <p class="">Product price: <span class="font-weight-bold">{{ data.product_price }}/Taka</span></p>
              <p class="">Selling price: <span class="font-weight-bold">{{ data.selling_price }}/Taka</span></p>
              <p class="">Quantity: <span class="font-weight-bold">{{ data.quantity }}</span></p>
            </v-card-subtitle>
            <v-card-actions>
              <nuxt-link class="px-2" :to="{path: `/seller/product/edit/${data.slug}/basic`}">
                <v-icon>{{ icon.mdiAccountEdit }}</v-icon>
              </nuxt-link>
              <v-icon @click="restoreItem(data.id,index)" class="px-2 cursor-pointer">{{ icon.mdiLockOpenVariant }}
              </v-icon>
              <v-icon @click="deletenow(data.id,index)" class="px-2 cursor-pointer">{{ icon.mdiDelete }}</v-icon>
            </v-card-actions>
          </v-card>

        </div>

      </div>
      inactivate product start
      <div class="mt-4">
        <div class="d-flex flex-wrap flex-sm-row flex-column justify-space-between elevation-1 rounded pb-4 px-3">
          <v-card-text class="headline text-md-h6 text-h6">Inactive products</v-card-text>
          <v-card-text v-if="inactive_products.length < 1" class="text-md-h6">No data available</v-card-text>
          <v-card v-else v-for="(data,index) in inactive_products" :key="index" class="mr-3">
            <v-card-title class="text-subtitle-2">
              {{ data.name | capfirst }}
            </v-card-title>
            <v-card-subtitle class="text-body-2">
              <p class="">Product price: <span class="font-weight-bold">{{ data.product_price }}/Taka</span></p>
              <p class="">Selling price: <span class="font-weight-bold">{{ data.selling_price }}/Taka</span></p>
              <p class="">Quantity: <span class="font-weight-bold">{{ data.quantity }}</span></p>
            </v-card-subtitle>
            <v-card-actions>
              <nuxt-link class="px-2" :to="{path: `/seller/product/edit/${data.slug}/basic`}">
                <v-icon>{{ icon.mdiAccountEdit }}</v-icon>
              </nuxt-link>
              <v-icon @click="soft_delete_now(data.id,index)" class="px-2 cursor-pointer">mdi-delete</v-icon>
            </v-card-actions>
          </v-card>
        </div>

      </div>
    </div>
    <!--    inactivate product end-->
    <!--    trash product end-->
    <!--    shop select to create product start-->
    <v-dialog
      v-if="dialog"
      v-model="dialog"
      width="500"
      :persistent="true"
    >

      <v-card :loading="loading" :disabled="loading">
        <v-card-title class="text-button grey lighten-2">
          Your shops
        </v-card-title>
        <v-card-text class="mt-2">
          <v-card class="my-2" v-for="(shop,index) in shops" :key="index"
                  :to="`/product/create/${shop.slug}?uid=${shop.id}`">
            <v-card-title class="text-md-subtitle-1 text-subtitle-2">
              {{ shop.name | capfirst }}
            </v-card-title>
            <v-card-subtitle class="text-md-subtitle-2 text-caption">
              {{ shop.contact_number }}
              <span class="mt-1 d-block">{{ shop.business_location }}</span>
            </v-card-subtitle>

          </v-card>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    shop select to create product end-->
    <confirm ref="confirm"/>

  </div>
</template>

<script>
import confirm from "@/components/confirm";
import {mdiLockOpenVariant, mdiDelete, mdiChevronRight, mdiChevronLeft, mdiLock, mdiAccountEdit} from '@mdi/js'
import Loading_page from "@/components/loading_page";

export default {
  middleware({redirect, query}) {
    if (!query.page) {
      redirect('/product?page=1&tab=')
    }
  },
  components: {
    Loading_page,
    confirm
  },
  data() {
    return {
      products: [],
      totalPages: 0,
      page: 1,
      icon: {
        mdiLockOpenVariant,
        mdiDelete,
        mdiChevronRight, mdiChevronLeft, mdiLock, mdiAccountEdit,
      },
      headers: [
        {text: 'Name', value: 'name'},
        {text: 'Product price', value: 'product_price'},
        {text: 'Selling price', value: 'selling_price'},
        {text: 'Quantity', value: 'quantity'},
        {text: 'Actions', value: 'actions'},

      ],
      load: {
        product: false,
        inactive: false,
        trash: false
      },
      dialog: false,
      loading: false,
      shops: [],
      inactive_products: [],
      trash_products: [],
    }
  },
  mounted() {
    if (this.inactive_products.length <= 0 || this.trash_products.length <= 0) {
      this.$axios.get('/api/seller/product/min/non/active/all')
        .then(res => {
          this.inactive_products = res.data
        })
      this.$axios.get('/api/seller/product/min/deleted/all')
        .then(res => {
          this.trash_products = res.data
        })
    }
  },
  created() {
    this.set_breadcrumbs()
    console.log(this.$route.query.tab)
    if (this.$route.query.tab && this.$route.query.tab === 'openshop') {
      console.log('hello')
      this.loading = true
      this.dialog = true
      this.$axios.get('/api/seller/shops/active/all')
        .then(res => {
          this.shops = res.data
        })
      this.loading = false
    }
  },
  fetchOnServer: false,
  // watchQuery: ['page'],
  async fetch() {
    const page = this.$route.query.page
    await this.$axios.get('/api/seller/product/min/all?page=' + page)
      .then(res => {
        // this.products = res.data
        this.products = res.data
      })
    // this.products = data.data.items
    // this.totalPages = data.data.total_pages
    // this.page = parseInt(page)
  },
  watch: {
    '$route.query.page': '$fetch',
    '$route.query': function (val) {
      if (val.page) {
        this.$store.commit('set_breadcrumbs_name', {
          name: 'Create Product',
          url: `/product?page=${val.page}&tab=openshop`
        })
      }
      if (val.tab && val.tab === 'openshop') {
        this.dialog = true
        if (this.shops.length <= 0) {
          this.loading = true
          this.$axios.get('/api/seller/shops/active/all')
            .then(res => {
              this.shops = res.data
            })
          this.loading = false
        }
      }
    },
    'dialog': function (val) {
      if (val === false) {
        this.$router.push({path: this.$route.path, query: {...this.$route.query, tab: null}})
        this.loading = false
      }
    }
  },
  methods: {
    async deletenow(id, key) {
      console.log(id)
      if (await this.$refs.confirm.open('Delete', 'You cannot undo this action.')) {
        const data = await this.$axios.delete(`/api/seller/product/delete/${id}/`)
        if (data.status === 200) {
          this.trash_products.splice(key, 1)
          this.$toast.success('Deleted successfully')
        }
      }
    },
    async restoreItem(id, key) {
      if (await this.$refs.confirm.open('Restore now', 'User can buy this product again.')) {
        const data = await this.$axios.patch(`/api/seller/product/recover/${id}/`)
        if (data.status === 200) {
          this.products.push(this.trash_products[key])
          this.trash_products.splice(key, 1)
          this.$toast.success('Restored successfully')
        }
      }
    },
    async soft_delete_now(id, key) {
      if (await this.$refs.confirm.open('Delete', 'You can restore this product again but user cannot buy this product')) {
        await this.$axios.delete(`/api/seller/product/soft/delete/${id}/`)
          .then(res => {
            this.trash_products.push(this.products[key])
            this.products.splice(key, 1)
            this.$toast.success('Deleted successfully')
          }).catch(() => {
            this.$toast.error('Something is wrong. Please try again.')
          })
      }
    },
    next(value) {
      this.$router.push({path: this.$route.path, query: {...this.$route.query, page: value}})
    },
    set_breadcrumbs() {
      const data = [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/'
        },
        {
          text: 'Product',
          disabled: true,
          href: '/product'
        }
      ]
      this.$store.commit('set_breadcrumbs', data)
      this.$store.commit('set_breadcrumbs_name', {
        name: 'Create Product',
        url: `/product?page=${this.$route.query.page}&tab=openshop`
      })
    }
  }
}
</script>

<style scoped>

</style>
