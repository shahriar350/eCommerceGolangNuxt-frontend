<template>
  <v-row class="justify-center">
    <v-col lg="5" md="7" sm="9" cols="12">
      <v-card>
      </v-card>
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <div>Seller Login</div>
          <div>
            <v-btn color="primary" to="/auth/register" :nuxt="true">Register</v-btn>
          </div>
        </v-card-title>
        <v-card-subtitle class="mt-2" v-if="response_error !== ''">
          <v-alert type="error">
            {{ response_error }}
          </v-alert>
        </v-card-subtitle>

        <validation-observer
          ref="create_product_validation"
          v-slot="{ invalid }"
        >

          <form @submit.prevent="login_now">

            <v-card-text>
              <validation-provider
                v-slot="{ errors }"
                name="Phone number"
                rules="required|phone_number"
              >

                <v-text-field
                  v-model="form.phone_number"
                  :error-messages="errors"
                  label="Phone number*"
                  required
                  outlined
                  chips
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Password"
                rules="required"
              >
                <v-text-field
                  :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show_password ? 'text' : 'password'"
                  @click:append="show_password = !show_password"
                  v-model="form.password"
                  :error-messages="errors"
                  label="Password*"
                  required
                  outlined
                  chips
                ></v-text-field>
              </validation-provider>
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
    ValidationObserver
  },
  data() {
    return {
      show_password: false,
      form: {
        phone_number: '',
        password: ''
      },
      response_error: ""
    }
  },
  methods: {
    async login_now() {
      const isValid = await this.$refs.create_product_validation.validate()
      if (isValid) {
        const data = await this.$axios.post('/api/auth/seller/login/', this.form)
          .then(res => {
            const bongo_cart = this.$cookies.get('bongo_cart')
            this.response_error = ""
            this.$toast.success('Login Successful')
            window.location.replace("/")
          })
          .catch(error => {
            this.response_error = error.response.data
          })
        // if (data.status === 200) {
        //   const bongo_cart = this.$cookies.get('bongo_cart')
        //
        //   this.response_error.splice(0, this.response_error.length)
        //   this.$toast.success('Login Successful')
        //   window.location.replace("/")
        // } else {
        //   this.response_error = data.data
        // }
      }
    }
  }
}
</script>

<style scoped>

</style>
