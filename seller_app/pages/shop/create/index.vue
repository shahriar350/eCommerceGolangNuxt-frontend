<template>
  <div>
    <div v-if="server_err !== ''">
      <v-alert type="error" class="mt-3">{{server_err}}</v-alert>
    </div>
    <ValidationObserver ref="shop_validate"
                        v-slot="{ invalid }">
      <form @submit.prevent="submitShopForm" class="my-5">
        <v-card elevation="2" :loading="loading" :disabled="loading">
          <v-card-title>
            New shop
          </v-card-title>
          <v-card-text>
            <validation-provider
              v-slot="{ errors }"
              name="Shop name"
              rules="required"
            >
            <v-text-field
              v-model="form.shop_name"
              :error-messages="errors"
              label="Shop name"
              required
              outlined
              chips
            ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="Shop category"
              rules="required"
            >
            <v-autocomplete
              :error-messages="errors"
              v-model="form.shop_category_id"
              item-text="name"
              item-value="id"
              :items="shop_categories"
              outlined
              chips
              small-chips
              label="Shop category"
            ></v-autocomplete>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="Shop contact number"
              rules="required|phone_number"
            >
            <v-text-field
              v-model="form.contact_number"
              :error-messages="errors"
              :counter="100"
              label="Shop contact number"
              required
              outlined
              chips
            ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="Shop address"
              rules="required"
            >
            <v-textarea
              rows="4"
              v-model="form.business_location"
              :error-messages="errors"
              :counter="300"
              label="Shop address"
              required
              outlined
              chips
            ></v-textarea>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="Tax ID"
              rules="required"
            >
            <v-text-field
              v-model="form.tax_id"
              :error-messages="errors"
              :counter="300"
              label="Tax ID"
              required
              outlined
              chips
            ></v-text-field>
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="Shop images"
              rules="required|image|size:2048"
            >
            <v-file-input messages="Image size 2MB or small and 945X410"
              v-model="form.banner"
              :error-messages="errors"
              label="Shop images"
              required
              outlined
              chips
            ></v-file-input>
            </validation-provider>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block type="submit">Submit now</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </ValidationObserver>

  </div>
</template>

<script>
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import { required, size, image } from 'vee-validate/dist/rules'

  setInteractionMode('eager')
  extend('phone_number', {
    message: 'This phone number is not valid. 11 digits are required', // the error message
    validate: value => {
      return /(^(01)[3-9]\d{8})$/.test(value)
    } // the validation function
  })
  extend("size",size)
  extend('image', {
    ...image,
    message: '{_field_} should be an image'
  })
  extend('required', {
    ...required,
    message: '{_field_} can not be empty'
  })
  // const phone_number = helpers.regex('alpha', /(^(01)[3-9]\d{8})$/)
  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
    },
    head() {
      return {
        server_err: null,
        loading: false,
        title: 'New shop',
        meta: [
          {
            name: 'Bongobitan seller new shop create',
            content: 'bongobitan seller new shop'
          }
        ]
      }
    },
    data() {
      return {
        connection: null,

        server_err: "",
        loading: false,
        shop_categories: [],
        form: {
          shop_category_id: null,
          shop_name: '',
          contact_number: '',
          banner: null,
          business_location: '',
          tax_id: ''
        }
      }
    },
    mounted() {
      console.log("Starting connection to WebSocket Server")
      this.connection = new WebSocket("ws://localhost:8000/ws/admin/shop/created")

      this.connection.onmessage = function(event) {
        console.log();
      }

      this.connection.onopen = function(event) {
        console.log(event)
        console.log("Successfully connected to the echo websocket server...")
      }
    },
    created() {
      this.set_breadcrumbs()
      this.get_shop_categories()
    },
    methods: {
      async submitShopForm() {
        if (this.server_err !== ''){
          this.server_err = ''
        }
        const isValid = await this.$refs.shop_validate.validate()
        if (isValid) {
          let formdata = new FormData()
          formdata.append('image', this.form.banner)
          formdata.append('shop_category_id', this.form.shop_category_id)
          formdata.append('name', this.form.shop_name)
          formdata.append('contact_number', this.form.contact_number)
          formdata.append('business_location', this.form.business_location)
          formdata.append('tax_id', this.form.tax_id)
          await this.$axios.post('/api/seller/shop/create', formdata)
            .then(res => {
              console.log(res.data)
              this.connection.send(JSON.stringify(res.data))
              //
              this.form = {
                shop_category_id: null,
                shop_name: '',
                contact_number: '',
                banner: null,
                business_location: ''
              }
              this.$refs.shop_validate.reset()
              // this.$refs.shop_validate.validate()
              this.$toast.success('Successfully created you shop')
            }).catch(err => {
              this.$vuetify.goTo(0)
              // this.form.banner = null
              this.server_err = err.response.data
              console.log(err.response.data)
            })
        }
      },
      get_shop_categories() {
        this.$axios.get('/api/nonuser/shop/categories/all/')
          .then(res => {
            this.shop_categories = res.data
          })
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
            disabled: false,
            href: '/seller/shop'
          },
          {
            text: 'New shop',
            disabled: true,
            href: '/seller/shop/create'
          }
        ]
        this.$store.commit('set_breadcrumbs', data)
        this.$store.commit('set_breadcrumbs_name', null)
      }
    }
  }
</script>

<style scoped>

</style>
