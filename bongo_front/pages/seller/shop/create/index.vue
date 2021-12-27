<template>
  <div>
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
              v-model="form.cat_select"
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
              v-model="form.shop_contact"
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
              v-model="form.address"
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
              name="Shop images"
              rules="required|image"
            >
            <v-file-input
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
        loading: false,
        shop_categories: [],
        form: {
          cat_select: null,
          shop_name: '',
          shop_contact: '',
          banner: null,
          address: ''
        }
      }
    },
    created() {
      this.set_breadcrumbs()
      this.get_shop_categories()
    },
    methods: {
      async submitShopForm() {
        const isValid = await this.$refs.shop_validate.validate()
        if (isValid) {
          let formdata = new FormData()
          formdata.append('banner', this.form.banner)
          formdata.append('category', this.form.cat_select)
          formdata.append('name', this.form.shop_name)
          formdata.append('contact_number', this.form.shop_contact)
          formdata.append('business_location', this.form.address)
          await this.$axios.post('/api/seller/shop/action/', formdata)
            .then(() => {
              this.form = {
                cat_select: null,
                shop_name: '',
                shop_contact: '',
                banner: null,
                address: ''
              }
              this.$refs.shop_validate.reset()
              this.$toast.success('Successfully created you shop')
            }).catch(err => {
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
