<template>
  <div>
    <loading_page v-if="$fetchState.pending"></loading_page>
    <p v-else-if="$fetchState.error">Error while fetching mountains</p>
    <div v-else class="mt-4">
<!--      <div class="d-flex justify-end mb-2">-->
<!--        <v-btn to="/shop/create">Create shop</v-btn>-->
<!--      </div>-->
      <!--    active shops start-->
      <v-card :loading="loadingactive" :disabled="loadingactive">
        <v-card-title>
          Active Shops
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col lg="3" md="4" sm="6" v-for="(shop,index) in active_shops" :key="index">
              <v-card
                class="mx-auto"
                max-width="344"
              >
                <img-mine :thumbnail="shop.banner"/>

                <v-card-title>
                  {{ shop.name }}
                </v-card-title>

                <v-card-subtitle>
                  <p>{{ shop.business_location }}</p>
                  <p>{{ shop.contact_number }}</p>
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn
                    @click="openUpdateDialog(shop,index,'active')"
                    color="orange lighten-2"
                    text
                  >
                    Update
                  </v-btn>

                  <v-spacer></v-spacer>

                  <v-btn
                    text
                    color="blue lighten-2"
                    :nuxt="true"
                    :to="`/shop/products/${shop.id}`"
                  >
                    Products
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <!--    active shops end-->

      <!-- non active shops start-->
      <v-card :loading="loadingnonactive" :disabled="loadingnonactive" class="mt-4">
        <v-card-title>
          Non-Active Shops
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col lg="3" md="4" sm="6" v-for="(shop,index) in non_active_shops" :key="index">
              <v-card
                class="mx-auto"
                max-width="344"
              >
                <img-mine :thumbnail="shop.banner"/>

                <v-card-title>
                  {{ shop.name }}
                </v-card-title>

                <v-card-subtitle>
                  <p>{{ shop.business_location }}</p>
                  <p>{{ shop.contact_number }}</p>
                </v-card-subtitle>

              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <!-- non active shops end-->

      <!--    delele shops start-->
      <v-card :loading="delete_loading" :disabled="delete_loading" class="mt-4">
        <v-card-title>
          Deleted Shops
        </v-card-title>
        <v-card-text>
          <v-row v-if="delete_shops !== null || delete_shops.length > 0">
            <v-col lg="3" md="4" sm="6" v-for="(shop,index) in delete_shops" :key="index">
              <v-card
                class="mx-auto"
                max-width="344"
              >
                <img-mine :thumbnail="shop.banner"/>

                <v-card-title>
                  {{ shop.name }}
                </v-card-title>

                <v-card-subtitle>

                </v-card-subtitle>

                <v-card-actions>
                  <v-btn
                    @click="restoreShop(shop, index)"
                    color="orange lighten-2"
                    text
                  >
                    Restore
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="hardDelete(shop, index)"
                    color="orange lighten-2"
                    text
                  >
                    Permanent Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <p v-else>
            No shop is available in trash section.
          </p>
        </v-card-text>
      </v-card>
      <!--    delele shops end-->
      <!--    dialog start-->
      <v-dialog
        :persistent="true"
        v-model="updateDialog"
        width="500"
      >

        <v-card :loading="loadingactive || loadingnonactive" :disabled="loadingactive || loadingnonactive">
          <v-card-title class="headline grey lighten-2">
            Update {{ this.updateForm.name }}
          </v-card-title>
          <ValidationObserver ref="shop_validate"
                              v-slot="{ invalid }">
            <form @submit.prevent="updateShop" method="post">
              <v-card-text class="mt-4">
                <validation-provider
                  v-slot="{ errors }"
                  name="Shop name"
                  rules="required"
                >
                  <v-text-field
                    v-model="updateForm.name"
                    :error-messages="errors"
                    :counter="100"
                    label="Shop name"
                    required
                    outlined
                    chips
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Shop business address"
                  rules="required"
                >
                  <v-text-field
                    v-model="updateForm.business_location"
                    :error-messages="errors"
                    label="Shop business address"
                    required
                    outlined
                    chips
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Shop image"
                  rules="image"
                >
                  <v-file-input
                    :error-messages="errors"
                    v-model="updateForm.banner"
                    label="Shop banner"
                    outlined
                    chips
                  ></v-file-input>
                </validation-provider>
              </v-card-text>


              <v-divider></v-divider>

              <v-card-actions>
                <v-btn
                  color="error"
                  text
                  @click="deleteShop"
                >
                  Delete
                </v-btn>
                <v-spacer></v-spacer>
                <v-icon
                  @click="cancelDialog"
                >
                  {{ icons.mdiClose }}
                </v-icon>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  type="submit"
                >
                  Update now
                </v-btn>
              </v-card-actions>
            </form>
          </ValidationObserver>

        </v-card>
      </v-dialog>
      <!--    dialog end-->
      <confirm ref="confirm"/>
    </div>
  </div>

</template>

<script>
import {extend, ValidationObserver, ValidationProvider, setInteractionMode} from 'vee-validate'
import {required, image} from 'vee-validate/dist/rules'
import {mdiClose} from '@mdi/js'
import loading_page from "@/components/loading_page";
setInteractionMode('eager')
extend('required', {
  ...required,
  message: '{_field_} can not be empty.'
})
extend('image', {
  ...image,
  message: '{_field_} field must be a image.'
})
export default {
  components: {
    ImgMine: () => import('@/components/my_img'),
    confirm: () => import('@/components/confirm'),
    ValidationProvider,
    ValidationObserver, loading_page
  },
  data() {
    return {
      active_shops: [],
      non_active_shops: [],
      delete_shops: [],
      icons: {
        mdiClose
      },
      loadingactive: false,
      delete_loading: false,
      loadingnonactive: false,
      updateDialog: false,
      updateForm: {
        id: '',
        shop_cat: '',
        index: '',
        name: '',
        business_location: '',
        banner: null
      }
    }
  },
  mounted() {
    // const socket = new WebSocket("ws://localhost:8000/ws/admin/abc")
    // const data = this.$axios.get('/api/seller/shop/action')
    // .then(res => {
    //   console.log(res)
    // })
  },
  created() {
    this.set_breadcrumbs()
  },
  async fetch() {
    await this.$axios.get("/api/seller/shops/all")
    .then(res => {
      console.log(res.data)
      for (const shop of res.data) {
        console.log(shop.active)
        if ("active" in shop && shop.active){
          this.active_shops = res.data
        } else {
          if ("deleted_at" in shop){
            this.delete_shops = res.data
          } else {
            this.non_active_shops = res.data
          }
        }
      }
    })
    // const active_shop_data = await this.$axios.get('/api/seller/shops/active/all')
    // if (active_shop_data.status === 200) {
    //   this.active_shops = active_shop_data.data
    // }
    // const inactive_shop_data = await this.$axios.get('/api/seller/shops/inactive/all')
    // if (inactive_shop_data.status === 200) {
    //   this.non_active_shops = inactive_shop_data.data
    // }
    // const deleted_shop_data = await this.$axios.get('/api/seller/shops/delete/all')
    // if (deleted_shop_data.status === 200) {
    //   this.delete_shops = deleted_shop_data.data
    // }

  },
  // async asyncData({$axios}) {
  //   const data = await $axios.$get('/api/seller/shop/action/')
  //   return {
  //     active_shops: data.active_shops,
  //     non_active_shops: data.non_active_shops,
  //     delete_shops: data.delete_shops
  //   }
  // },
  fetchOnServer: false,

  methods: {
    cancelDialog() {
      this.updateDialog = false
      this.updateForm.id = ''
      this.updateForm.shop_cat = ''
      this.updateForm.index = ''
      this.updateForm.name = ''
      this.updateForm.business_location = ''
      this.updateForm.banner = null

    },
    async deleteShop() {
      if (
        await this.$refs.confirm.open(
          'Confirm',
          'Are you sure you want to delete this record?'
        )
      ) {
        if (this.updateForm.shop_cat === 'active') {
          this.loadingactive = true
        } else {
          this.loadingnonactive = true
        }
        this.$axios.put(`/api/seller/shop/soft/delete/${this.updateForm.id}`)
          .then(res => {
            if (this.updateForm.shop_cat === 'active') {
              this.delete_shops.push(this.active_shops[this.updateForm.index])
              this.active_shops.splice(this.updateForm.index, 1)
            } else {
              this.delete_shops.push(this.non_active_shops[this.updateForm.index])
              this.non_active_shops.splice(this.updateForm.index, 1)
            }
            this.$store.commit('set_snackbar', 'Succesfully deleted.')
          })
        if (this.updateForm.shop_cat === 'active') {
          this.loadingactive = false
        } else {
          this.loadingnonactive = false
        }
        this.updateDialog = false
      }
    },
    async restoreShop(data, index) {
      console.log(this.delete_shops[index])
      if (
        await this.$refs.confirm.open(
          'Confirm',
          'Are you sure you want to restore this shop?'
        )
      ) {
        this.delete_loading = true
        this.$axios.put(`/api/seller/shop/restore/${data.id}`)
          .then(() => {
            this.delete_shops.splice(index, 1)
            this.active_shops.push(data)
            this.$toast.success("Restored successfully.")
          })
        this.delete_loading = false
      }
    },
    async hardDelete(data, index) {
      if (
        await this.$refs.confirm.open(
          'Confirm',
          'Are you sure you want to permanently delete this shop?'
        )
      ) {
        this.delete_loading = true
        this.$axios.delete(`/api/seller/shop/delete/${data.id}/`)
          .then(() => {
            this.delete_shops.splice(index, 1)
            this.$store.commit('set_snackbar', 'Succesfully deleted permanently.')
          })
        this.delete_loading = false
      }
    },
    async updateShop() {
      const isValid = await this.$refs.shop_validate.validate()
      if (isValid) {
        if (this.updateForm.shop_cat === 'active') {
          this.loadingactive = true
        } else {
          this.loadingnonactive = true
        }

        let formdata = new FormData()
        formdata.set('name', this.updateForm.name)
        formdata.set('business_location', this.updateForm.business_location)
        if (this.updateForm.banner !== null) {
          formdata.append('banner', this.updateForm.banner)
        }
        const data = await this.$axios.put(`/api/seller/shop/update/${this.updateForm.id}`, formdata)
        console.log(data)
        if (data.status === 200) {
          if (this.updateForm.shop_cat === 'active') {
            this.active_shops[this.updateForm.index].name = this.updateForm.name
            this.active_shops[this.updateForm.index].business_location = this.updateForm.business_location
            if (this.updateForm.banner !== null) {
              this.active_shops[this.updateForm.index].banner = data.data
            }
          } else {
            this.non_active_shops[this.updateForm.index].name = this.updateForm.name
            this.non_active_shops[this.updateForm.index].business_location = this.updateForm.business_location
            if (this.updateForm.banner !== null) {
              this.non_active_shops[this.updateForm.index].banner = data.data
            }
          }
          this.$toast.success("Successfully updated.")
          this.loadingactive = false
          this.loadingnonactive = false
          if (this.updateForm.shop_cat === 'active') {
            this.loadingactive = false
          } else {
            this.loadingnonactive = false
          }
          this.updateDialog = false
          this.updateForm = {
            id: '',
            shop_cat: '',
            index: '',
            name: '',
            business_location: '',
            banner: null
          }
        } else {
          this.loadingactive = false
          this.loadingnonactive = false
        }
      }

    },
    openUpdateDialog(data, index, category) {
      this.updateForm.id = data.id
      this.updateForm.shop_cat = category
      this.updateForm.index = index
      this.updateForm.name = data.name
      this.updateForm.business_location = data.business_location
      this.updateDialog = true
    },
    set_breadcrumbs() {
      const data = [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/'
        },
        {
          text: 'Shop',
          disabled: true,
          href: '/shop'
        }
      ]
      this.$store.commit('set_breadcrumbs', data)
      this.$store.commit('set_breadcrumbs_name', {name: 'Create Shop', url: '/shop/create'})
    }
  }
}
</script>

<style scoped>

</style>
