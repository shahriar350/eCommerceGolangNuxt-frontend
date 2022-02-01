<template>
  <div class="container ">
    <div class="flex md:basic-6/12 sm:basic-/12 basic-full justify-center">
      <Card class=" ring border">
        <template #title>
          Login
        </template>
        <template #footer class="flex justify-end">
          <nuxt-link to="/auth/register"><Button class="p-button-success p-button-link" label="Registration" /></nuxt-link>
        </template>

        <template #subtitle v-if="serverError !== ''">
          <p class="bg-red-200 p-3 rounded shadow mb-2"> <i class="pi pi-times mr-2"></i> {{ serverError }}</p>
        </template>
        <template #content>
          <validation-observer
            ref="login_validation"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="userLogin">

              <validation-provider
                v-slot="{ errors }"
                name="Phone number"
                rules="required|numeric|phone_number"
              >
                <div  class="flex flex-col mt-2">
                  <label for="phone_number">Phone number</label>
                  <InputText id="phone_number" type="text" v-model="form.phone_number"/>
                  <InlineMessage v-if="errors.length">{{ errors[0] }}</InlineMessage>
                </div>
              </validation-provider>
              <validation-provider
                v-slot="{ validate,errors }"
                name="Password"
                rules="required|min:6"
              >
                <div  class="flex flex-col mt-2">
                  <label for="password">Password</label>
                  <Password  id="password" v-model="form.password" :toggleMask="true" />
                  <span>
                    <InlineMessage v-if="errors.length">{{ errors[0] }}</InlineMessage>
                  </span>
                </div>
              </validation-provider>

              <div class="mt-3 flex justify-center">
                <Button label="Login" type="submit" class=" w-full" />
              </div>
            </form>
          </validation-observer>
        </template>
      </Card>


    </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import {extend, setInteractionMode, ValidationObserver, ValidationProvider,} from 'vee-validate'
import {min, numeric, required} from 'vee-validate/dist/rules'
import Password from 'primevue/password';

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} can not be empty.'
})
extend('min', {
  ...min,
  message: 'Minimum {length} letter is needed.'
})

extend('numeric', {
  ...numeric,
  message: '{_field_} must be numeric.'
})
extend('phone_number', {
  message: 'This phone number is not valid. 11 digits are required', // the error message
  validate: value => {
    return /(^(01)[3-9]\d{8})$/.test(value)
  } // the validation function
})
export default {
  components: {
    InputText, ValidationObserver, ValidationProvider,Password
  },

  name: 'register',
  data() {
    return {
      serverError: '',
      form: {
        phone_number: '',
        password: ''
      }

    }
  },
  mounted() {
    // this.afterLogin()
  },
  methods: {
    afterLogin(){
      if (localStorage.hasOwnProperty('bong_cart')) {
        const carts = JSON.parse(this.$CryptoJS.AES.decrypt(localStorage.getItem("bong_cart"), process.env.localEncrypt).toString(this.CryptoJS.enc.Utf8))
        let data = []
        for (const cart of Object.entries(carts)) {
          let temp = {
            product_id: parseInt(cart[0]),
            variation_id: parseInt(cart[1]['variation']),
            quantity: parseInt(cart[1]['quantity'])
          }
          data.push(temp)
        }
        this.$axios.post('/api/user/cart/localstorage',data)
          .then(() => {
            localStorage.removeItem("bong_cart")
          })
      }
      const target = this.$store.getters.get_target_page
      console.log(target === "")
      if (target === ''){
        // window.location.replace("/")
      } else {
        this.$store.commit('set_target_page','')
        window.location.replace(target)
      }
    },
    async userLogin() {
      const isValid = await this.$refs.login_validation.validate()
      if (isValid) {
        await this.$axios.post('/api/auth/user/login',this.form)
          .then(res => {
            this.$toast.add({severity:'success', summary: 'Successfully Login', life: 5000});
            this.afterLogin()
          }) .catch(err => {
            this.serverError = err.response.data
          })
      }
    }
  },
}
</script>
