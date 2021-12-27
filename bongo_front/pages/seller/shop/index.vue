<template>
  <div class="mt-4">
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
              <img-mine :thumbnail="shop.banner" />

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
                <img-mine :thumbnail="shop.banner" />

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
          <v-row v-if="delete_shops.length > 0">
            <v-col lg="3" md="4" sm="6" v-for="(shop,index) in delete_shops" :key="index">
              <v-card
                class="mx-auto"
                max-width="344"
              >
                <img-mine :thumbnail="shop.banner" />

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
                  {{icons.mdiClose}}
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
  </div>
</template>

<script>
import {extend, ValidationObserver, ValidationProvider, setInteractionMode} from 'vee-validate'
import {required, image} from 'vee-validate/dist/rules'
import {mdiClose} from '@mdi/js'
import ImgMine from "../../../components/my_image";
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
    ImgMine,
    ConfirmDlg: () => import('../../../components/confirm'),
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
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
  created() {
    this.set_breadcrumbs()
  },
  async asyncData({$axios}) {
    const data = await $axios.$get('/api/seller/shop/action/')
    return {
      active_shops: data.active_shops,
      non_active_shops: data.non_active_shops,
      delete_shops: data.delete_shops
    }
  },
  methods: {
    cancelDialog() {
      this.updateDialog = false
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
        this.$axios.patch(`/api/seller/shop/single/action/${this.updateForm.id}/`)
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
        this.$axios.post(`/api/seller/shop/single/action/${data.id}/`)
          .then(() => {
            this.delete_shops.splice(index, 1)
            this.active_shops.push(data)
            this.$store.commit('set_snackbar', 'Succesfully restored.')
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
        this.$axios.delete(`/api/seller/shop/single/action/${data.id}/`)
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
        this.$axios.put(`/api/seller/shop/single/action/${this.updateForm.id}/`, formdata)
          .then(res => {
            if (res.status === 201) {
              if (this.updateForm.shop_cat === 'active') {
                this.active_shops[this.updateForm.index].name = this.updateForm.name
                this.active_shops[this.updateForm.index].business_location = this.updateForm.business_location
                if (this.updateForm.banner !== null) {
                  this.active_shops[this.updateForm.index].banner = res.data
                }
              } else {
                this.non_active_shops[this.updateForm.index].name = this.updateForm.name
                this.non_active_shops[this.updateForm.index].business_location = this.updateForm.business_location
                if (this.updateForm.banner !== null) {
                  this.non_active_shops[this.updateForm.index].banner = res.data
                }
              }
              this.$toast.success("Successfully updated.")
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

            }

          })
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
          href: '/seller'
        },
        {
          text: 'Shop',
          disabled: true,
          href: '/seller/shop'
        }
      ]
      this.$store.commit('set_breadcrumbs', data)
      this.$store.commit('set_breadcrumbs_name', {name: 'Create Shop', url: '/seller/shop/create'})
    }
  }
}
</script>

<style scoped>

</style>
