<template>
  <div class="mt-4">
    <v-card>
      <v-tabs
        color="deep-purple accent-4"
        v-model="tab"
      >
        <v-tab href="#basic">Basic</v-tab>
        <v-tab href="#price">Price</v-tab>
        <v-tab href="#variation">Variance</v-tab>

        <v-tabs-items :value="tab">
          <validation-observer
            ref="create_product_validation"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="submit_product">
              <v-tab-item value="basic">
                <v-card>
                  <v-card-title>
                    Basic product information
                  </v-card-title>
                  <v-card-subtitle>
                    Provide all information with *
                  </v-card-subtitle>
                  <v-card-text>
                    <validation-provider
                      v-slot="{ errors }"
                      name="Name"
                      rules="required"
                    >
                      <v-text-field
                        v-model="product.name"
                        :error-messages="errors"
                        :counter="100"
                        label="Product name*"
                        required
                        outlined
                        chips
                      ></v-text-field>
                    </validation-provider>

                    <validation-provider
                      v-slot="{ errors }"
                      name="Category"
                      rules="required"
                    >
                      <v-autocomplete
                        :error-messages="errors"
                        v-model="product.category"
                        item-text="name"
                        multiple
                        item-value="id"
                        :items="categories"
                        outlined
                        chips
                        small-chips
                        label="Product category*"
                      >
                      </v-autocomplete>
                    </validation-provider>
                    <v-autocomplete
                      v-model="product.brand"
                      item-text="name"
                      item-value="id"
                      :items="brands"
                      outlined
                      chips
                      small-chips
                      label="Product brand"
                    >
                    </v-autocomplete>

                    <v-row>
                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          name="Primary image"
                          rules="required|image_size:1024|mimes:image/jpeg"
                        >
                          <v-file-input
                            :error-messages="errors"
                            v-model="product.primary_image"
                            required
                            outlined
                            chips
                            small-chips
                            label="Product primary images*"
                          ></v-file-input>
                        </validation-provider>
                      </v-col>
                      <v-col>
                        <validation-provider
                          v-slot="{ errors }"
                          name="Primary image"
                          rules="multi_image|mimes:image/jpeg"
                        >
                          <v-file-input
                            :error-messages="errors"
                            v-model="product.images"
                            multiple
                            outlined
                            type="file"
                            hint="Image size must be below under 1MB"
                            :counter="true"
                            accept="image/*"
                            label="Product images*"
                            chips
                            small-chips
                          >
                          </v-file-input>
                        </validation-provider>
                      </v-col>
                    </v-row>
                    <v-dialog
                      ref="dialog"
                      v-model="modal"
                      :return-value.sync="product.next_stock_date"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="product.next_stock_date"
                          label="Next stock date"
                          :prepend-icon="icon.mdiCalendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="product.next_stock_date"
                        :min="new Date().toISOString().substr(0, 10)"
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="modal = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog.save(product.next_stock_date)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                    <!--                    <vue-editor v-model="product.description"/>-->
                    <editor @changeHtml="addHtmlToData"></editor>

                  </v-card-text>

                </v-card>
              </v-tab-item>
              <v-tab-item value="price">
                <v-card-text>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Selling price"
                    rules="price"
                  >
                    <v-text-field
                      :error-messages="errors"
                      @input="product.normal_price = parseFloat(product.normal_price)"
                      v-model="product.normal_price"
                      label="Normal price"
                      outlined
                      chips
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Selling price"
                    rules="required|price"
                  >
                    <v-text-field
                      :error-messages="errors"
                      @input="product.selling_price = parseFloat(product.selling_price)"
                      v-model="product.selling_price"
                      label="Selling price*"
                      outlined
                      chips
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Total Quantity"
                    rules="required|numeric|min_value:1"
                  >
                    <v-text-field
                      :error-messages="errors"
                      v-model.number="product.quantity"
                      label="Total Quantity*"
                      outlined
                      chips
                    ></v-text-field>
                  </validation-provider>
                  <v-card>
                    <v-card-title>
                      Offer price %
                    </v-card-title>
                    <v-card-subtitle>
                      N.B. example: 25%. 25% will be apply product price and all variances of product.
                    </v-card-subtitle>
                    <v-card-text>
                      <div>
                        <v-subheader class="pl-0">
                          Offer price in percent
                        </v-subheader>
                        <validation-provider
                          v-slot="{ errors }"
                          name="Quantity"
                          rules="required|min_value:0|max_value:100"
                        >
                          <v-slider
                            v-model.number="product.offer_price"
                            max="100"
                            min="0"
                            persistent-hint
                            thumb-label="always"
                          ></v-slider>
                        </validation-provider>
                      </div>

                      <!--                      <validation-provider-->
                      <!--                        v-slot="{ errors }"-->
                      <!--                        name="Quantity"-->
                      <!--                        rules="numeric|min:0|max:100"-->
                      <!--                      >-->
                      <!--                      <v-text-field-->
                      <!--                        :error-messages="errors"-->
                      <!--                        v-model.number="product.offer_price"-->
                      <!--                        label="Offer price*"-->
                      <!--                        outlined-->
                      <!--                        chips-->
                      <!--                        placeholder="25"-->
                      <!--                        hint="if you need 25%, just write 25"-->
                      <!--                      ></v-text-field>-->
                      <!--                      </validation-provider>-->
                      <div>
                        <p class="text-h6">Offer date:</p>
                        <v-date-picker
                          v-model="product.offer_dates"
                          :first-day-of-week="6"
                          :min="new Date().toISOString().slice(0,10)"
                          range
                          :landscape="screenWidth > 500"
                          full-width
                        >
                        </v-date-picker>
                      </div>
                    </v-card-text>
                  </v-card>


                </v-card-text>
              </v-tab-item>
              <v-tab-item value="variation">
                <v-card-text>
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
                      <!--                    <h2 class="mb-4 primary--text"></h2>-->
                      <v-card>
                        <ValidationObserver ref="variance_validate"
                                            v-slot="{ invalid }" v-if="select_variation">
                          <v-card-title>Variance items</v-card-title>
                          <v-card-text>
                            <v-row :no-gutters="screenWidth <= 540" v-for="(variances,index) in variance_names"
                                   :key="index">
                              <v-col cols="12">
                                <div class="d-flex">
                                  <h3>Variance-{{ index + 1 }}</h3>
                                  <v-spacer></v-spacer>
                                  <div>
                                    <v-icon color="error" @click="decrease_variance_name(index)">
                                      {{ icon.mdiMinusCircle }}
                                    </v-icon>
                                    <v-icon color="primary" @click="increase_variance_name">{{
                                        icon.mdiPlusCircle
                                      }}
                                    </v-icon>
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
                          <p>Variance-{{ index + 1 }}</p>
                          <v-spacer></v-spacer>
                          <v-icon color="error" @click="decrease_main_variance_name(index)">{{ icon.mdiMinusCircle }}
                          </v-icon>
                        </v-card-title>

                      </div>
                      <div>
                        <v-card-text>
                          <div v-for="(variance,name) in variances" :key="name">
                            <validation-provider
                              v-if="name === 'image'"
                              v-slot="{ errors }"
                              :name="`${name}`"
                              rules="required|image|mimes:image/jpeg|image_size:1024"
                              data-vv-as="image"
                            >
                              <v-file-input class="py-2"
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
                              rules="required|min_value:1"
                            >
                              <v-text-field class="py-2"
                                            :error-messages="errors"
                                            v-model.number="product.variations[index][name]"
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
                              <v-text-field v-if="name === 'product_price'"
                                            @input="product.variations[index][name] =parseFloat(product.variations[index][name])"
                                            messages="This price will be added to PRODUCT PRICE of product."
                                            :error-messages="errors" class="py-2"
                                            v-model="product.variations[index][name]"
                                            :label="`${name}*`"
                                            required outlined dense
                              >
                              </v-text-field>
                              <v-text-field v-else
                                            messages="This price will be added to SELLING PRICE of product."
                                            @input="product.variations[index][name] =parseFloat(product.variations[index][name])"
                                            :error-messages="errors" class="py-2"
                                            v-model="product.variations[index][name]"
                                            :label="`${name}*`"
                                            required outlined dense
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
              <v-btn color="primary" block type="submit">Add product</v-btn>
            </form>
          </validation-observer>
        </v-tabs-items>

      </v-tabs>
    </v-card>
    <ConfirmDlg ref="confirm"/>
  </div>
</template>

<script>
// import { validationMixin } from 'vuelidate'
// import { required, numeric, minValue, maxValue, minLength, maxLength } from 'vuelidate/lib/validators'
import {extend, ValidationObserver, ValidationProvider, setInteractionMode} from 'vee-validate'
import {required, size, image, mimes, numeric, min_value, max_value} from 'vee-validate/dist/rules'
import {mdiMinusCircle, mdiCalendar, mdiPlusCircle} from '@mdi/js'

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

extend('numeric', {
  ...numeric,
  message: '{_field_} value must be numeric.'
})
extend('min_value', {
  ...min_value,
  message: '{_field_} value must be higher than {min}.'
})
extend('max_value', {
  ...max_value,
  message: '{_field_} value must be lower than {min}.'
})

extend('mimes', {
  ...mimes,
  message: '{_field_} image type must be jpeg format.'
})
extend('image', {
  ...image,
  message: '{_field_} should be an image'
})
const multiImageValidator = {
  getMessage(field, args) {
    return 'Every image size must be below 1 MB'
  },
  validate(value, args) {
    let valid = true
    value.forEach(e => {
      const fileSize = e.size / 1024 / 1024;
      console.log(e)
      if (fileSize > 2) {
        valid = false
      }
    })
    console.log(valid)
    return valid
  }
};
// extend('multi_image', multiImageValidator)
extend('multi_image', {
  message: 'Every image size must be below 1 MB', // the error message
  validate: value => {
    let valid = true
    value.forEach((e, index) => {
      const fileSize = e.size / 1024 / 1024;
      console.log(e)
      if (fileSize > 2) {
        valid = false
      }
    })
    console.log(valid)
    return valid
  } // the validation function
})

extend('required', {
  ...required,
  message: '{_field_} can not be empty'
})
extend('size', {
  ...size,
  message: '{_field_} size must be below {length}'
})
extend('image_size', {
  ...size,
  message: '{_field_} size must be below 1Mb'
})

export default {
  // mixins: [validationMixin],
  async asyncData({params, $axios, redirect}) {
    let shop = [];
    let brand = [];
    let category = [];
    let variation = [];
    const shop_data = await $axios.get(`/api/seller/shop/${params.uid}`)
    if (shop_data.status === 200) {
      shop = shop_data.data
      const brand_data = await $axios.get("/api/seller/brand/by/shop")
      const category_data = await $axios.get("/api/seller/category/by/shop")
      const variation_data = await $axios.get("/api/seller/variation")

      if (brand_data.status === 200) {
        shop = brand_data.data
      }
      if (category_data.status === 200) {
        category = category_data.data
      }
      if (variation_data.status === 200) {
        variation = variation_data.data
      }
      return {
        shop: shop,
        categories: category,
        variation_types: variation,
        brands: brand
      }
    } else {
      return redirect('/seller/product/create')
    }
    // const data = await $axios.$get(`/api/seller/shop/${params.shop}/`)
    // const data = await $axios.$get(`/api/seller/shop/check/${params.shop}/`)
    // if (data.status === 200) {
    //   return {
    //     shop: data.shop,
    //     categories: data.pro_cat,
    //     variation_types: data.variations,
    //     brands: data.brands
    //   }
    // } else {
    //   return redirect('/seller/product/create')
    // }
  },
  components: {
    ConfirmDlg: () => import('@/components/confirm'),
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      icon: {
        mdiMinusCircle, mdiCalendar, mdiPlusCircle
      },
      modal: false,
      select_variation: null,
      product: {
        brand: null,
        primary_image: null,
        name: 'fgh',
        category: [1],
        variations: [],
        description: `<p>hello</p>`,
        normal_price: 0.00,
        selling_price: 1212.12,
        offer_price: '',
        offer_dates: [],
        quantity: '0',
        images: [],
        next_stock_date: null
      },
      variance_names: []
    }
  },
  created() {
    this.set_breadcrumbs()
  },
  methods: {
    async submit_product() {
      const isValid = await this.$refs.create_product_validation.validate()
      if (isValid) {
        //submit product code
        let formdata = new FormData()
        let basic_data = {
          name: this.product.name,
          brand: this.product.brand ? this.product.brand : null,
          product_price: this.product.normal_price ? parseFloat(this.product.normal_price) : 0.00,
          selling_price: this.product.selling_price ? parseFloat(this.product.selling_price) : 0.00,
          offer_price: this.product.offer_price ? parseInt(this.product.offer_price) : 0,
          quantity: this.product.quantity ? parseInt(this.product.quantity) : 0,
          description: this.product.description,
          offer_date_start: this.product.offer_dates.length ? new Date(this.product.offer_dates[0]).toJSON() : null,
          offer_date_end: this.product.offer_dates.length ? new Date(this.product.offer_dates[1]).toJSON() : null,
          next_stock_date: this.product.next_stock_date ? new Date(this.product.next_stock_date).toJSON() : null
        }
        formdata.set('basic', JSON.stringify(basic_data))
        formdata.append('primary_image', this.product.primary_image)
        if (this.product.variations.length > 0) {
          let myVariance = []
          this.product.variations.forEach((e, index) => {

            myVariance[index] = JSON.parse(JSON.stringify(e))
            delete myVariance[index]['image']
            formdata.append('variance_images', e['image'])
          })
          formdata.append('variance', JSON.stringify(myVariance))
        }
        let category = []
        this.product.category.forEach(function (element) {
          category.push({id: element})
        })
        formdata.append('category', JSON.stringify(category))
        if (this.product.images.length > 0) {
          this.product.images.forEach(function (element) {
            formdata.append('images', element)
          })
        }

        await this.$axios.post(`/api/seller/product/create/${this.$route.query.uid}`, formdata)
        // .then(res => {
        //   this.$store.commit('set_snackbar', 'Successfully created your product')
        //   this.product = {
        //     name: '',
        //     category: [],
        //     variations: [],
        //     description: '',
        //     normal_price: '',
        //     selling_price: '',
        //     offer_price: '',
        //     offer_dates: [],
        //     quantity: '',
        //     images: [],
        //     next_stock_date: null
        //   }
        //   this.variance_names.splice(0, this.variance_names.length)
        //   this.select_variation = null
        //   this.$refs.create_product_validation.reset()
        // })
      } else {
        this.$store.commit('set_snackbar', 'Please resolve the errors of form')
      }
    },
    addHtmlToData(data) {
      this.product.description = data
    },
    async create_variation() {
      const isValid = await this.$refs.variance_validate.validate()
      if (isValid) {
        this.product.variations = JSON.parse(JSON.stringify(this.variance_names))
        const myitem = {
          product_price: parseFloat(0.00),
          selling_price: parseFloat(0.00),
          quantity: 0,
          image: null
        }
        this.product.variations.forEach(e => {
          Object.assign(e, myitem)
        })
      } else {
        this.$toast.error('Please fill variance inputs properly')
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
        this.$toast.error('Minimum one variance is required')
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
        this.$router.replace({query: {...this.$route.query, tab}})
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
