<template>
  <div>
    <v-card>
      <v-card-title>Admin Login</v-card-title>
      <v-card-text>
        <validation-observer
          ref="admin_login_validate"
          v-slot="{ invalid }"
        >
          <form @submit.preven="login_now">
            <div v-for="(data,index) of Object.keys(form)" :key="index">
              <validation-provider
                v-slot="{ errors }"
                :name="data.split('_').join(' ') | capfirst"
                :rules="data === 'phone_number' ? 'required|phone_number' : 'required'"
              >
                <v-text-field
                  v-model="form[data]"
                  :error-messages="errors"
                  :label="data.split('_').join(' ') | capfirst"
                  required
                  outlined
                  chips
                ></v-text-field>
              </validation-provider>
            </div>
            <v-btn type="submit" @click.prevent="login_now()">Login</v-btn>
          </form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </div>
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
      form: {
        phone_number: '',
        password: '',
        admin_user_name: '',
        admin_user_token: '',

      }
    }
  },
  methods: {
    async login_now() {
      const isValid = await this.$refs.admin_login_validate.validate()
      if (isValid){
        const data = await this.$axios.post('/api/auth/admin/login',this.form)
        if (data.status === 200){
          this.$toast.success("Login successfully.")
          window.location.replace("/")
        } else {
          console.log(data.data)
        }

      }

    }
  },
}
</script>
<style scoped>

</style>
