<template>
  <div>
    <v-row>
      <v-col md="6" cols="12">
        <v-radio-group v-model="select_location">
          <template v-slot:label>
            <p class="title">Select a location</p>
          </template>
          <v-radio :value="Number(-1)">
            <template v-slot:label>
              <p>Create new location</p>
            </template>
          </v-radio>
          <v-radio :value="location.id" v-for="(location,index) in locations" :key="index">
            <template v-slot:label>
              <div>
                <p v-if="location.area" class="d-inline-block pr-1">{{ location.area}}</p>
                <p v-if="location.street" class="d-inline-block pr-1">{{ location.street}}</p>
                <p v-if="location.house" class="d-inline-block pr-1">{{ location.house}}</p>
                <p v-if="location.post_office" class="d-inline-block pr-1">{{ location.post_office}}</p>
                <p v-if="location.post_code" class="d-inline-block pr-1">{{ location.post_code}}</p>
                <p v-if="location.police_station" class="d-inline-block pr-1">{{ location.police_station}}</p>
                <p v-if="location.city" class="d-inline-block pr-1">{{ location.city}}</p>
              </div>
            </template>
          </v-radio>
        </v-radio-group>

        <div v-if="select_location === -1">
          <p class="title">Create a new location</p>
          <validation-observer
            ref="checkout_ref"
            v-slot="{ invalid }"
          >
            <form>
              <v-card-text>
                <div v-for="(data,key) in Object.entries(location)" :key="key">
                  <validation-provider
                    v-if="['post_office','police_station','city'].includes(data[0])"
                    v-slot="{ errors }"
                    :name="data[0].split('_').join(' ')"
                    rules="required"
                  >
                    <v-text-field
                      v-model="location[data[0]]"
                      :error-messages="errors"
                      :label="data[0].split('_').join(' ')+'*'"
                      required
                      outlined
                      chips
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider
                    v-else-if="data[0] === 'post_code'"
                    v-slot="{ errors }"
                    name="post code"
                    rules="required|max:10"
                  >
                    <v-text-field
                      v-model="location[data[0]]"
                      :error-messages="errors"
                      :label="data[0].split('_').join(' ')+'*'"
                      required
                      outlined
                      chips
                    ></v-text-field>
                  </validation-provider>

                  <v-text-field
                    v-else
                    v-model="location[data[0]]"
                    :label="data[0].split('_').join(' ')"
                    required
                    outlined
                    chips
                  ></v-text-field>
                </div>

              </v-card-text>

            </form>
          </validation-observer>
        </div>
      </v-col>
      <v-col md="6" cols="12">
        <p class="title">Total price: {{ total_price }}</p>
        <v-btn color="blue" @click="checkout_now">Checkout now</v-btn>
      </v-col>

    </v-row>
  </div>
</template>

<script>
  import {extend, ValidationObserver, ValidationProvider, setInteractionMode} from 'vee-validate'
  import {required, max} from 'vee-validate/dist/rules'

  setInteractionMode('eager')
  extend('required', {
    ...required,
    message: '{_field_} can not be empty'
  })
  extend('max', {
    ...max,
    message: '{_field_} may not be longer then {length} characters'
  })

  export default {
    middleware: ['is_auth'],
    async fetch(){
      const data = await this.$axios.get('/api/user/checkout/total_price/')
      this.total_price = data.data
    },
    // async asyncData({$axios }) {
    //   const data = await $axios.$get('/api/user/checkout/total_price/')
    //   return {
    //     total_price: data,
    //   }
    //
    //
    // },
    created() {
      this.$axios.get('/api/user/locations/')
        .then(res => {
          this.locations = res.data
        })
    },
    data() {
      return {
        total_price: 0,
        locations: [],
        select_location: null,
        location: {
          area: '',
          street: '',
          house: '',
          post_office: '',
          post_code: '',
          police_station: '',
          city: '',
        }
      }
    },
    components: {
      ValidationProvider,
      ValidationObserver,
    },
    methods: {
      async checkout_now() {
        if (this.select_location !== null) {
          if (this.select_location === -1) {
            const isValid = await this.$refs.checkout_ref.validate()
            if (isValid) {
              const locations = await this.$axios.post('/api/user/locations/', this.location)
              if (locations.status === 201) {
                this.select_location = locations.data
                this.location = {
                  area: '',
                  street: '',
                  house: '',
                  post_office: '',
                  post_code: '',
                  police_station: '',
                  city: '',
                }
              }
            } else {
              this.$toast.error('Please resolve the errors.')
            }
          }
          await this.$axios.post('/api/user/checkout/now/', {
            location: this.select_location
          }) .then(res => {
            this.$store.commit('replace_cart_count',0)
            this.$toast.success('Successfully placed your order.')
            this.$router.push('/')
          })
        } else {
          this.$toast.error("Please select or create a location.")
        }
      }
    },
    // mounted() {
    //   this.$axios.get('/api/user/checkout/')
    //     .then(res => {
    //       console.log(res.data)
    //     }).catch(err => {
    //     console.log(err.response.data)
    //   })
    // }
  }
</script>

<style scoped>

</style>
