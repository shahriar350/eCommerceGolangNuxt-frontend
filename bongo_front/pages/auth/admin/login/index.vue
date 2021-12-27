<template>
  <v-row class="justify-center">
    <v-col lg="5" md="7" sm="9" cols="12">
      <v-card>

        <validation-observer
          ref="create_product_validation"
          v-slot="{ invalid }"
        >
          <validation_error></validation_error>
          <form @submit.prevent="login_now">
            <v-card-title class="d-flex justify-space-between">
              <p>Seller login</p>
              <v-btn :nuxt="true" depressed to="/auth/seller/register">I want to be a seller</v-btn>
            </v-card-title>
            <v-card-subtitle v-if="response_error.length" class="red lighten-5 px-2 py-2 mt-1 mb-5">
              <p v-for="(error,index) in response_error" class="mb-2">
                {{ error }}
              </p>
            </v-card-subtitle>
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
import validation_error from "../../../../components/validation_error";

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
  components: {
    ValidationProvider,
    ValidationObserver,
    validation_error
  },
  data() {
    return {
      response_error: [],
      show_password: false,
      form: {
        phone_number: '',
        password: ''
      }
    }
  },

  methods: {
    async login_now() {
      const isValid = await this.$refs.create_product_validation.validate()
      if (isValid) {
        await this.$axios.post('/api/auth/admin/login/', this.form)
          .then(res => {
            this.$toast.success('Login Successful')
            window.location.replace('/control')
          }) .catch(err => {
            this.$toast.error(err.response.data)
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
