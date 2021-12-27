<template>
  <v-row class="justify-center">
    <v-col lg="5" md="7" sm="9" cols="12">
      <v-card>
        <validation-observer
          ref="seller_registration_validation"
          v-slot="{ invalid }"
        >

          <form @submit.prevent="register_now">
            <v-card-title class="d-flex justify-space-between">
              <p>Seller Registration</p>
              <v-btn :nuxt="true" color="primary"  to="/auth/login">Login</v-btn>
            </v-card-title>

            <v-card-text>

              <div v-for="(data,index) of Object.keys(form)" :key="index" v-if="data !== 'contact_number'">
                <validation-provider
                  v-slot="{ errors }"
                  :name="data.split('_').join(' ') | capfirst"
                  rules="required"
                >
                  <v-select v-if="data === 'shop_category_id'"
                            :items="shop_categories"
                            :error-messages="errors"
                            label="Shop Category"
                            outlined item-value="id"  item-text="name" v-model="form.shop_category_id"
                  ></v-select>

                  <v-text-field v-else
                                v-model="form[data]"
                                :error-messages="errors"
                                :label="data.split('_').join(' ') | capfirst"
                                required
                                outlined
                                chips
                  ></v-text-field>
                </validation-provider>
              </div>
              <div v-else>
                <validation-provider
                  v-slot="{ errors }"
                  name="Contact number"
                  rules="required|phone_number"
                >
                  <v-text-field
                    v-model="form.contact_number"
                    :error-messages="errors"
                    label="Contact number"
                    required
                    outlined
                    chips
                  ></v-text-field>
                </validation-provider>
              </div>

            </v-card-text>
            <v-card-actions>
              <v-btn block type="submit" color="primary">Submit</v-btn>
            </v-card-actions>
          </form>
        </validation-observer>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {extend, ValidationObserver, ValidationProvider, setInteractionMode} from 'vee-validate'
import {required, regex} from 'vee-validate/dist/rules'

setInteractionMode('eager')
extend('required', {
  ...required,
  message: '{_field_} can not be empty'
})
extend('phone_number', {
  message: 'This phone number is not valid. 11 digits are required', // the error message
  validate: value => {
    return /(^(01)[3-9]\d{8})$/.test(value)
  } // the validation function
})
export default {
  layout: "non_auth",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      // new start
      shop_categories: [],
      form: {
        seller_name: '',
        shop_category_id: '',
        shop_name: '',
        shop_location: '',
        contact_number: '',
        tax_id: '',
      },
      // new end
      response_error: null,

    }
  },
  async fetch() {
    const data = await this.$axios.get('/api/nonuser/shop/categories/all/')
    if (data.status === 200) {
      this.shop_categories = data.data
    }
  },
  methods: {
    async register_now() {
      const isValid = await this.$refs.seller_registration_validation.validate()
      if (isValid) {
        await this.$axios.post('/api/auth/seller/register/', this.form)
          .then(res => {
            this.response_error = null
            this.$toast.success('We will contact you soon.')
            this.form = {
              seller_name: '',
              shop_category_id: '',
              shop_name: '',
              shop_location: '',
              contact_number: '',
              tax_id: '',
            }
            this.$refs.seller_registration_validation.reset()
          }).catch(err => {
            this.response_error = err.response.data
            this.$vuetify.goTo(0)
          })
        // .then(() => {
        //   this.$toast.success('Login Successful')
        //   window.location.replace('/seller')
        // window.onNuxtReady(() => { window.$nuxt.$router.push('/seller') })
        // this.$router.replace('/seller')
        // })
      }
    }
  }
}
</script>

<style scoped>

</style>
