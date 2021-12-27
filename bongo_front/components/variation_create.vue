<template>
  <div>
    <v-tab-item value="variation">
      <v-card-text>
        {{product_id}}
        <div>
          <v-select
            @input="varianceSelect"
            v-model="select_variation"
            item-text="name"
            item-value="id"
            :items="variation_types"
            outlined
            label="Product variations"
          >
          </v-select>
          <div v-if="variance_names.length">
            <!--                    <h2 class="mb-4 primary&#45;&#45;text"></h2>-->
            <v-card>
              <ValidationObserver ref="variance_validate"
                                  v-slot="{ invalid }" v-if="select_variation">
                <v-card-title>Variance items</v-card-title>
                <v-card-text>
                  <v-row :no-gutters="screenWidth <= 540" v-for="(variances,index) in variance_names"
                         :key="index">
                    <v-col cols="12">
                      <div class="d-flex">
                        <h3>Variance-{{ index+1 }}</h3>
                        <v-spacer></v-spacer>
                        <div>
                          <v-icon color="error" @click="decrease_variance_name(index)">mdi-minus-circle
                          </v-icon>
                          <v-icon color="primary" @click="increase_variance_name">mdi-plus-circle</v-icon>
                        </div>
                      </div>
                    </v-col>

                    <v-col cols="6"
                           v-for="(variance,aindex) in variances" :key="aindex">
                      <validation-provider v-if="aindex.split('_').length === 1"
                                           v-slot="{ errors }"
                                           :name="`${aindex}`"
                                           rules="required"
                      >
                        <v-text-field
                          :error-messages="errors"
                          v-model="variance_names[index][aindex]"
                          :label="`${aindex}*`"
                          required
                          outlined
                          dense
                        >
                        </v-text-field>
                      </validation-provider>
                      <v-text-field v-else
                                    v-model="variance_names[index][aindex]"
                                    :label="`${aindex}*`"
                                    outlined
                                    dense
                      >
                      </v-text-field>
                    </v-col>

                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="create_variation" color="primary" block>Add variance</v-btn>
                </v-card-actions>
              </ValidationObserver>
            </v-card>
          </div>
        </div>
        <v-card class="mt-4" v-if="product.variations.length > 0">
          <div v-for="(variances,index) in product.variations" :key="index">
            <div>
              <v-card-title>
                <p>Variance-{{ index+1}}</p>
                <v-spacer></v-spacer>
                <v-icon color="error" @click="decrease_main_variance_name(index)">mdi-minus-circle</v-icon>
              </v-card-title>

            </div>
            <div v-for="(variance,name) in variances" :key="name">
              <v-card-text>
                <div>
                  <validation-provider
                    v-if="name === 'image'"
                    v-slot="{ errors }"
                    :name="`${name}`"
                    rules="required|image"
                    data-vv-as="image"
                  >
                    <v-file-input
                      :error-messages="errors"
                      v-model="product.variations[index]['image']"
                      required outlined dense label="image*"

                    >
                    </v-file-input>
                  </validation-provider>

                  <validation-provider
                    v-slot="{ errors }"
                    :name="`${name}`"
                    v-else-if="name === 'quantity'"
                    rules="required"
                  >
                    <v-text-field
                      :error-messages="errors"
                      v-model="product.variations[index][name]"
                      :label="`${name}*`"
                      required outlined dense
                    >
                    </v-text-field>
                  </validation-provider>

                  <validation-provider
                    v-slot="{ errors }"
                    :name="`${name}`"
                    v-else-if="name === 'product_price' || name === 'selling_price'"
                    rules="required|price"
                  >
                    <v-text-field
                      :error-messages="errors"
                      v-model="product.variations[index][name]"
                      :label="`${name}*`"
                      required outlined
                    >
                    </v-text-field>
                  </validation-provider>

                  <v-text-field
                    v-else
                    v-model="product.variations[index][name]"
                    :label="`${name}*`"
                    required outlined dense disabled
                  >
                  </v-text-field>
                </div>
              </v-card-text>
            </div>
          </div>
        </v-card>
      </v-card-text>

    </v-tab-item>
  </div>
</template>

<script>
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import { required, size, image } from 'vee-validate/dist/rules'

  setInteractionMode('eager')
  const validatorImage = {
    getMessage(field, args) {
      return 'Minimum 2 and maximum 6 images can be uploaded'
    },
    validate(value, args) {
      return value.length >= 2 && value.length <= 6
    }
  }
  extend('price', {
    message: 'Price is like: 1234, 1234.56, 12.34', // the error message
    validate: value => {
      return /^\d+(\.\d{1,2})?$/.test(value)
    } // the validation function

  })
  extend('imageLength', validatorImage)

  extend('image', {
    ...image,
    message: '{_field_} should be an image'
  })
  extend('required', {
    ...required,
    message: '{_field_} can not be empty'
  })
  extend('size', {
    ...size,
    message: '{_field_} size must be below {length}'
  })
  export default {
    props: {
        product_id: Number
    },
    // mixins: [validationMixin],
    // async asyncData({ params, $axios, redirect }) {
    //   const data = await $axios.$get(`/api/seller/shop/product/variation/all/`)
    //   if (data) {
    //     return {
    //       variation_types: data.data
    //     }
    //   }
    // },
    components: {
      ValidationProvider,
      ValidationObserver,
    },
    data() {
      return {
        variation_types: [],
        modal: false,
        select_variation: null,
        variance_names: [],
        product: {
          variations: [],
        },
      }
    },
    created() {
      this.$axios.get(`/api/seller/shop/product/variation/all/`)
      .then(res => {
        this.variation_types = res.data
      })
      this.set_breadcrumbs()
    },
    methods: {
      async submit_product() {
        console.log('asce')
      },
      async create_variation() {
        const isValid = await this.$refs.variance_validate.validate()

        if (isValid) {
          this.product.variations = JSON.parse(JSON.stringify(this.variance_names))
          const myitem = {
            product_price: 0.00,
            selling_price: 0.00,
            quantity: 0,
            image: null
          }
          this.product.variations.forEach(e => {
            Object.assign(e, myitem)
          })
        } else {
          this.$toast.error('Please fill variance inputs properly.')
        }
      },
      varianceSelect() {
        this.variance_names.splice(0, this.variance_names.length)
        this.increase_variance_name()
      },
      async decrease_main_variance_name(index) {
        if (
          await this.$refs.confirm.open(
            'Confirm',
            'Are you sure you want to delete this record?'
          )
        ) {
          this.product.variations.splice(index, 1)
        }
      },
      increase_variance_name() {
        this.variation_types.filter((e => {
          if (e.id === this.select_variation) {
            const name = e.name.split('-')
            const object1 = {}
            // this.variance_names.push(e.name.split('-'))
            name.forEach((e) => {
              object1[e] = ''
              object1[`${e}_description`] = ''
            })
            this.variance_names.push(object1)
          }
        }))
      },
      async decrease_variance_name(index) {
        if (this.variance_names.length > 1) {
          if (
            await this.$refs.confirm.open(
              'Confirm',
              'Are you sure you want to delete this record?'
            )
          ) {
            this.variance_names.splice(index, 1)
          }
        } else {
          this.$store.commit('set_snackbar', 'Minimum one variance is required')
        }


      },
      set_breadcrumbs() {
        const data = [
          {
            text: 'Dashboard',
            disabled: false,
            href: '/seller'
          },
          {
            text: 'Product',
            disabled: false,
            href: '/seller/product'
          },
          {
            text: 'New product',
            disabled: true,
            href: '#'
          }

        ]
        this.$store.commit('set_breadcrumbs', data)
        this.$store.commit('set_breadcrumbs_name', null)
      }
    },
    computed: {
      tab: {
        set(tab) {
          this.$router.replace({ query: { ...this.$route.query, tab } })
        },
        get() {
          return this.$route.query.tab
        }
      }
    }
  }
</script>

<style scoped>

</style>
