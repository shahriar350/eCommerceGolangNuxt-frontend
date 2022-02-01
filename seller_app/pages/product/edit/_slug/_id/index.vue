<template>
  <div class="mt-4">
    <div v-if="$fetchState.pending">
      <loading_page />
    </div>
<!--    <p v-else-if="$fetchState.error !== null">Something is wrong. Refresh page</p>-->
    <div v-else>
      <h2 class="py-2">{{ product.name }}</h2>
      <v-card>
        <v-card-title>
          Product images
        </v-card-title>
        <v-card-text>
          <v-row>
                        <v-col cols="6" md="2" sm="4" xm v-for="(image,index) in product.edges.seller_product_images" :key="index">
                          <div v-if="image.display" class="d-block">
                            <div style="position: relative">
                              <my_img :thumbnail="image.image"/>
                              <v-icon style="position: absolute;top: 0;text-shadow: black 0px 0px 10px; color: white">mdi-record
                              </v-icon>
                            </div>
                            <!--                <v-btn block small @click="deleteImage(image.id,index,true)">Delete</v-btn>-->
                          </div>
                          <div v-else>
                            <span @dblclick="defaultImage(image.id,index)">
                              <my_img :thumbnail="image.image"/>
                            </span>

                            <v-btn block small @click="deleteImage(image.id,index,false)">Delete</v-btn>
                          </div>
                        </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>

          <v-btn @click="dialog=true" block>Upload new images</v-btn>
          <v-dialog
            v-model="dialog"
          >

            <v-card>
              <v-card-title class="headline grey lighten-2">
                Upload images
              </v-card-title>

              <v-row>
                <v-col cols="12">
                  <v-card-subtitle>
                    Primary image <small>Display first</small>
                  </v-card-subtitle>
                  <v-card-text>
                    <validation-observer
                      ref="add_image_primary"
                      v-slot="{ invalid }"
                    >
                      <form @submit.prevent="updateImages(true)">
                        <validation-provider
                          v-slot="{ errors }"
                          name="Primary image"
                          rules="required|image|image_size:1024|mimes:image/jpeg"
                        >
                          <v-file-input :error-messages="errors" v-model="primary_image"
                                        placeholder="Add product image"></v-file-input>
                        </validation-provider>
                        <v-btn block type="submit">Update product primary images</v-btn>
                      </form>
                    </validation-observer>
                  </v-card-text>
                </v-col>
                <v-col cols="12">
                  <v-card-subtitle>
                    Additional image
                  </v-card-subtitle>
                  <v-card-text>
                    <validation-observer
                      ref="add_image_additional"
                      v-slot="{ invalid }"
                    >
                      <form @submit.prevent="updateImages(false)">
                        <validation-provider
                          v-slot="{ errors }"
                          name="Image"
                          rules="multi_image|image|image_size:1024|mimes:image/jpeg"
                        >
                          <v-file-input :error-messages="errors" v-model="images" multiple
                                        placeholder="Add product image"></v-file-input>
                        </validation-provider>
                        <v-btn block type="submit">Update product images</v-btn>
                      </form>
                    </validation-observer>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>

      <v-card class="mt-4">
        <v-card-title>{{ product.name }} Basic</v-card-title>

        <v-card-text>
          <validation-observer
            ref="basic_observer"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="productBasicUpdate">
              <validation-provider
                v-slot="{ errors }"
                name="Product quantity"
                rules="required|min_value:1"
              >
                <v-text-field
                  :error-messages="errors"
                  v-model="product.quantity"
                  label="Product quantity"
                  required outlined dense
                >
                </v-text-field>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Product Price"
                rules="price"
              >
                <v-text-field
                  :error-messages="errors"
                  v-model="product.product_price"
                  label="Product price"
                  required outlined dense
                >
                </v-text-field>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Product Selling Price"
                rules="price"
              >
                <v-text-field
                  :error-messages="errors"
                  v-model="product.selling_price"
                  label="Product Selling price"
                  required outlined dense
                  messages="This selling price is the final price of the product"
                >
                </v-text-field>
              </validation-provider>
              <div class="mb-4">
                <div class="subheading">
                  Next stock date
                </div>
                <!--              <v-date-picker v-model="picker"></v-date-picker>-->
                {{ new Date(product.next_stock) }}
                <v-date-picker
                  :min="new Date().toISOString().slice(0, 10)"
                  v-model="product.next_stock"
                  :landscape="screenWidth > 500"
                  full-width
                ></v-date-picker>
              </div>
              <v-btn type="submit" block>Update basic</v-btn>
            </form>
          </validation-observer>
        </v-card-text>
      </v-card>

      <v-card class="mt-4">
        <v-card-title>Product offer</v-card-title>
        <v-card-text>
          <validation-observer
            ref="offer_date_observer"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="productOfferUpdate">
              <validation-provider
                v-slot="{ errors }"
                name="product_offer_price"
                rules="required|price|min_value:1"
              >
                <v-text-field
                  :error-messages="errors"
                  v-model="product_offer_price"
                  label="Product offer price"
                  required outlined dense
                >
                </v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="product_offer_date"
                rules="required"
              >
                <v-date-picker
                  :error-messages="errors"
                  v-model="product_offer_date"
                  :first-day-of-week="6"
                  :min="new Date().toISOString().slice(0,10)"
                  range
                  :landscape="screenWidth > 500"
                  full-width
                >
                </v-date-picker>
              </validation-provider>
              <v-btn block class="mt-2" type="submit">Update product offer</v-btn>
            </form>
          </validation-observer>
        </v-card-text>
      </v-card>
      <v-card class="mt-4">
        <v-card-title>
          Product variation
        </v-card-title>
        <v-card-text class="elevation-2 mb-4" v-for="(variance,index) in product.edges.seller_product_variations" :key="index">
          <div class="px-3">
            <div class="pt-2 pb-4 d-flex flex-row justify-space-between align-content-start">
              <div class="d-flex">
                <ul>
                  <li>
                    <v-img width="70px" :src="`http://127.0.0.1:8000/static/images/${variance.image}`" />
                  </li>
                </ul>
                <ul v-for="(value,valueIndex) in variance.edges.seller_product_variation_values" :key="valueIndex">
                  <li><span class="font-weight-bold">{{ value.edges.attribute.name | capfirst }}</span>
                    <ul>
                      <li>{{ value.name | capfirst }}</li>
                      <li>Description: {{ value.description }}</li>
                    </ul>
                  </li>
                </ul>
              </div>
              <v-icon class="red--text" @click="delete_variance(variance.id,index)">mdi-delete</v-icon>
            </div>

            <validation-observer
              ref="variance_update"
              v-slot="{ invalid }"
            >
              <form @submit.prevent="updateVariance(index)">
                <!--                <validation-provider-->
                <!--                  v-if="variance.color"-->
                <!--                  v-slot="{ errors }"-->
                <!--                  name="color"-->
                <!--                  rules="required"-->
                <!--                >-->
                <!--                  <v-text-field-->
                <!--                    v-model="product.seller_product_variation[index]['color']"-->
                <!--                    :error-messages="errors"-->
                <!--                    label="Color"-->
                <!--                    required-->
                <!--                    outlined-->
                <!--                    chips-->
                <!--                  ></v-text-field>-->
                <!--                </validation-provider>-->
                <!--                <v-text-field-->
                <!--                  v-if="variance.color"-->
                <!--                  v-model="product.seller_product_variation[index]['color_description']"-->
                <!--                  label="Color description"-->
                <!--                  outlined-->
                <!--                  chips-->
                <!--                ></v-text-field>-->
                <!--                <validation-provider-->
                <!--                  v-if="variance.style"-->
                <!--                  v-slot="{ errors }"-->
                <!--                  name="Style"-->
                <!--                  rules="required"-->
                <!--                >-->
                <!--                  <v-text-field-->
                <!--                    v-model="product.seller_product_variation[index]['style']"-->
                <!--                    :error-messages="errors"-->
                <!--                    label="Style"-->
                <!--                    required-->
                <!--                    outlined-->
                <!--                    chips-->
                <!--                  ></v-text-field>-->
                <!--                </validation-provider>-->
                <!--                <v-text-field-->
                <!--                  v-if="variance.style"-->
                <!--                  v-model="product.seller_product_variation[index]['style_description']"-->
                <!--                  label="Style description"-->
                <!--                  outlined-->
                <!--                  chips-->
                <!--                ></v-text-field>-->

                <!--                <validation-provider-->
                <!--                  v-if="variance.size"-->
                <!--                  v-slot="{ errors }"-->
                <!--                  name="Size"-->
                <!--                  rules="required"-->
                <!--                >-->
                <!--                  <v-text-field-->
                <!--                    v-model="product.seller_product_variation[index]['size']"-->
                <!--                    :error-messages="errors"-->
                <!--                    label="Size"-->
                <!--                    required-->
                <!--                    outlined-->
                <!--                    chips-->
                <!--                  ></v-text-field>-->
                <!--                </validation-provider>-->
                <!--                <v-text-field-->
                <!--                  v-if="variance.size"-->
                <!--                  v-model="product.seller_product_variation[index]['size_description']"-->
                <!--                  label="Size description"-->
                <!--                  outlined-->
                <!--                  chips-->
                <!--                ></v-text-field>-->
                <!--                <v-textarea-->
                <!--                  v-model="product.seller_product_variation[index]['description']"-->
                <!--                  label="Description"-->
                <!--                  outlined-->
                <!--                  chips-->
                <!--                ></v-textarea>-->

                <validation-provider
                  v-slot="{ errors }"
                  name="Product price"
                  rules="price"
                >
                  <v-text-field
                    v-model="product.edges.seller_product_variations[index]['product_price']"
                    :error-messages="errors"
                    label="Product price"
                    required
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
                    v-model="product.edges.seller_product_variations[index]['selling_price']"
                    :error-messages="errors"
                    label="Selling price"
                    required
                    outlined
                    chips
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantity"
                  rules="required"
                >
                  <v-text-field
                    v-model="product.edges.seller_product_variations[index]['quantity']"
                    :error-messages="errors"
                    label="Quantity"
                    required
                    outlined
                    chips
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Primary image"
                  rules="image|image_size:1024|mimes:image/jpeg"
                >
                  <v-file-input :error-messages="errors"
                                v-model="product.edges.seller_product_variations[index]['new_img']"
                                label="Update image"
                                outlined
                                chips
                  ></v-file-input>
                </validation-provider>
<!--                <button class="v-btn" type="submit">Update now</button>-->
                <v-btn block type="submit">Update now</v-btn>
              </form>
            </validation-observer>
          </div>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>
          Add new variance
        </v-card-title>
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
          <v-card class="mt-4" v-if="all_variations.length">
            <div v-for="(variances,index) in all_variations" :key="index">
              <div>
                <v-card-title>
                  <p>Variance-{{ index + 1 }}</p>
                  <v-spacer></v-spacer>
                  <v-icon color="error" @click="decrease_main_variance_name(index)">mdi-minus-circle</v-icon>
                </v-card-title>

              </div>
              <ValidationObserver ref="variance_validate_save"
                                  v-slot="{ invalid }">
                <form @submit.prevent="add_new_variance" action="">
                  <v-card-text>
                    <div v-for="(variance,name) in variances" :key="name">


                      <div>
                        <validation-provider
                          v-if="name === 'image'"
                          v-slot="{ errors }"
                          :name="`${name}`"
                          rules="required|image|mimes:image/jpeg|image_size:1024"
                          data-vv-as="image"
                        >
                          <v-file-input
                            :error-messages="errors"
                            v-model="all_variations[index]['image']"
                            outlined
                            dense
                            label="image*"

                          >
                          </v-file-input>
                        </validation-provider>

                        <validation-provider
                          v-slot="{ errors }"
                          :name="`${name}`"
                          v-else-if="name === 'quantity'"
                          rules="required|min_value:1"
                        >
                          <v-text-field
                            :error-messages="errors"
                            v-model="all_variations[index][name]"
                            :label="`${name}*`"
                            @input="all_variations[index][name] =parseInt(all_variations[index][name])"
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
                            v-if="name === 'product_price'"
                            messages="This price will be added to PRODUCT PRICE of product."
                            :error-messages="errors"
                            @input="all_variations[index][name] =parseFloat(all_variations[index][name])"
                            v-model="all_variations[index][name]"
                            :label="`${name}*`"
                            required outlined
                          >
                          </v-text-field>
                          <v-text-field v-else
                                        :error-messages="errors"
                                        messages="This price will be added to SELLING PRICE of product."
                                        @input="all_variations[index][name] =parseFloat(all_variations[index][name])"
                                        v-model="all_variations[index][name]"
                                        :label="`${name}*`"
                                        required outlined
                          >
                          </v-text-field>

                        </validation-provider>

                        <v-text-field
                          v-else
                          v-model="all_variations[index][name]"
                          :label="`${name}*`"
                          required outlined dense disabled
                        >
                        </v-text-field>
                      </div>



                    </div>
                  </v-card-text>
                  <v-btn block type="submit">Save</v-btn>
                </form>
              </ValidationObserver>

            </div>
          </v-card>
        </v-card-text>
      </v-card>
    </div>

    <ConfirmDlg ref="confirm"/>
  </div>
</template>

<script>
import {extend, ValidationObserver, ValidationProvider, setInteractionMode} from 'vee-validate'
import {required, size, image, min_value, mimes} from 'vee-validate/dist/rules'
import my_img from "@/components/my_img";
import loading_page from "@/components/loading_page";
setInteractionMode('eager')
extend('imageLength', {
  message: 'Minimum 2 and maximum 6 images can be uploaded', // the error message
  validate: value => {
    return value.length >= 2 && value.length <= 6
  } // the validation function
})
extend('price', {
  message: 'Price is like: 1234, 123.4, 12.34', // the error message
  validate: value => {
    return /^\d+(\.\d{1,2})?$/.test(value)
  } // the validation function
})

extend('image', {
  ...image,
  message: '{_field_} should be an image'
})
extend('mimes', {
  ...mimes,
  message: '{_field_} image type must be jpeg format.'
})
extend('min_value', {
  ...min_value,
  message: '{_field_} value should be higher than {min}'
})
extend('required', {
  ...required,
  message: '{_field_} can not be empty'
})
extend('image_size', {
  ...size,
  message: '{_field_} size must be below 1Mb'
})
extend('size', {
  ...size,
  message: '{_field_} size must be below {length}'
})
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
export default {
  components: {
    ConfirmDlg: () => import('../../../../../components/confirm'),
    ValidationProvider,
    ValidationObserver,my_img,loading_page
  },
  async fetch() {
    await this.$axios.get(`/api/seller/product/${this.$route.params.id}`)
      .then(res => {
        this.product = res.data
        if (this.product.next_stock !== null) {
          this.product.next_stock = new Date(this.product.next_stock).toISOString().slice(0, 10)
        }
        if (this.product.offer_price !== null) {
          this.product_offer_price = this.product.offer_price
          this.product_offer_date.push(new Date(this.product.offer_price_start).toISOString().slice(0, 10))
          this.product_offer_date.push(new Date(this.product.offer_price_end).toISOString().slice(0, 10))
        }
        if (this.product.edges.seller_product_variations.length > 0) {
          this.product.edges.seller_product_variations.forEach(e => {
            e["new_img"] = null
            // e.image = null
          })
        }
      })
  },
  fetchOnServer: false,
  // async asyncData({$axios, params}) {
  //   const product = await $axios.$get(`/api/seller/product/edit/${this.$route.query.id}/basic/`)
  //   return {
  //     product: product.product
  //   }
  // },
  data() {
    return {
      product: {},
      all_variations: [],
      images: [],
      primary_image: null,
      additional_image: [],
      product_offer_price: '',
      product_offer_date: [],
      dialog: false,
      select_variation: null,
      variation_types: [],
      variance_names: [],
    }
  },
  mounted() {
    this.$axios.get('/api/seller/variation')
      .then(res => {
        this.variation_types = res.data
      })


  },
  methods: {
    // variance start
    async delete_variance(variance_id, index) {
      if (await this.$refs.confirm.open('Delete?', 'You cannot undo this action')) {
        const data = await this.$axios.delete(`/api/seller/product/delete/variation/${this.$route.params.id}/${variance_id}/`)
        if (data.status === 200) {
          this.product.seller_product_variation.splice(index, 1)
          this.$toast.success('Successfully deleted.')
        }
      }
    },
    add_new_variance() {
      let formdata = new FormData()
      let myVariance = []
      this.all_variations.forEach((e, index) => {
        myVariance[index] = JSON.parse(JSON.stringify(e))
        delete myVariance[index]['image']
        formdata.append('variance_images', e['image'])
      })
      formdata.append('variance', JSON.stringify(myVariance))
      this.$axios.post(`/api/seller/product/new/variation/${this.product.id}/`, formdata)
        .then(res => {
          this.$toast.success('Successfully saved.')
          res.data.forEach(e => {
            this.product.edges.seller_product_variations.push(e)
          })
          this.all_variations.splice(0, this.all_variations.length)
          this.variance_names.splice(0, this.variance_names.length)
          this.select_variation = null
        })
    },
    varianceSelect() {
      this.variance_names.splice(0, this.variance_names.length)
      this.increase_variance_name()
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
    async decrease_main_variance_name(index) {
      if (
        await this.$refs.confirm.open(
          'Confirm',
          'Are you sure you want to delete this record?'
        )
      ) {
        this.all_variations.splice(index, 1)
      }
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
    async create_variation() {
      const isValid = await this.$refs.variance_validate.validate()

      if (isValid) {
        this.all_variations = JSON.parse(JSON.stringify(this.variance_names))
        const myitem = {
          product_price: 0.00,
          selling_price: 0.00,
          quantity: 0,
          image: null
        }
        this.all_variations.forEach(e => {
          Object.assign(e, myitem)
        })
      } else {
        this.$toast.error('Please fill variance inputs properly')
      }
    },
    // variance end
    async updateVariance(index) {
      let formdata = new FormData()
      // if (this.product.seller_product_variation[index]['color']) {
      //   formdata.append('color', this.product.seller_product_variation[index]['color'])
      //   if (this.product.seller_product_variation[index]['color_description']) {
      //     formdata.append('color_description', this.product.seller_product_variation[index]['color_description'])
      //   }
      // }
      // if (this.product.seller_product_variation[index]['size']) {
      //   formdata.append('size', this.product.seller_product_variation[index]['size'])
      //   if (this.product.seller_product_variation[index]['size_description']) {
      //     formdata.append('size_description', this.product.seller_product_variation[index]['size_description'])
      //   }
      // }
      // if (this.product.seller_product_variation[index]['style']) {
      //   formdata.append('style', this.product.seller_product_variation[index]['style'])
      //   if (this.product.seller_product_variation[index]['style_description'] !== null) {
      //     formdata.append('style_description', this.product.seller_product_variation[index]['style_description'])
      //   }
      //
      // }
      // if (this.product.seller_product_variation[index]['description'] !== null) {
      //   formdata.append('description', this.product.seller_product_variation[index]['description'])
      // }
      // const isValid = await this.$refs.variance_update.validate()
      // const isValid = await this.$refs.variance_update.validate()
      // if (isValid){
        formdata.append('product_price', parseFloat(this.product.edges.seller_product_variations[index]['product_price']))
        formdata.append('selling_price', parseFloat(this.product.edges.seller_product_variations[index]['selling_price']))
        formdata.append('quantity', parseInt(this.product.edges.seller_product_variations[index]['quantity']))
      console.log('asfasf')
        if (this.product.edges.seller_product_variations[index].new_img !== null) {
          formdata.append('image', this.product.edges.seller_product_variations[index].new_img)
        }
      console.log('asfasf')

        this.$axios.patch(`/api/seller/product/edit/variation/${this.$route.params.id}/${this.product.edges.seller_product_variations[index]['id']}`, formdata)
          .then((res) => {
            if (this.product.edges.seller_product_variations[index]['new_img'] !== null){
              this.product.edges.seller_product_variations[index]['image'] = res.data
              this.product.edges.seller_product_variations[index]['new_img'] = null
              this.$toast.success("Sucessfully updated.")
            }

          }).catch(res => {
          this.$toast.success(`${res.response.data}`)
        })
      // }

    },
    defaultImage(image_id, index) {
      console.log("display" in this.product.edges.seller_product_images[index])
      console.log(index)
      this.product.edges.seller_product_images.forEach((data) => {
        console.log(data.display)
        if(data.display === undefined){
          data["display"] = false
        }
        // if (!("display" in this.product.edges.seller_product_images)){
        //
        // }
      })
      this.$axios.patch(`/api/seller/product/edit/${this.product.id}/${image_id}/image/display`)
        .then(res => {
          this.product.edges.seller_product_images.forEach((data) => {
            if (data.display) {
              data.display = false
            }
          })

          this.product.edges.seller_product_images[index].display = true
          console.log(this.product.edges.seller_product_images[index])
        }).catch(() => {
        this.$toast.error("Try again.")
      })

    },
    async productBasicUpdate() {
      const isValid = await this.$refs.basic_observer.validate()
      if (isValid) {
        await this.$axios.patch(`/api/seller/product/edit/basic/${this.$route.params.id}`, {
          quantity: parseInt(this.product.quantity),
          product_price: parseFloat(this.product.product_price),
          selling_price: parseFloat(this.product.selling_price),
          next_stock: new Date(this.product.next_stock).toJSON(),
        }).then(res => {
          this.$toast.success('Successfully Updated.')
        })
      }
    },
    async productOfferUpdate() {
      const isValid = await this.$refs.offer_date_observer.validate()
      if (isValid) {
        await this.$axios.patch(`/api/seller/product/edit/basic/offer/${this.$route.params.id}`, {
          offer_price: parseInt(this.product_offer_price),
          offer_price_start: new Date(this.product_offer_date[0]).toJSON(),
          offer_price_end: new Date(this.product_offer_date[1]).toJSON()
        }).then(res => {
          this.$toast.success('Successfully Updated.')
        }).catch(() => {
          this.$toast.error('Something is wrong. Try again.')
        })
      } else {
        this.$toast.show('Please add product offer price and date properly.')
      }
    },
    async deleteImage(id, index, display) {
      if (
        await this.$refs.confirm.open(
          'Confirm',
          'Are you sure you want to delete this record?'
        )
      ) {
        if (!display) {
          this.$axios.delete(`/api/seller/product/edit/${this.$route.params.id}/${id}/image/delete/`)
            .then(() => {
              this.product.product_image.splice(index, 1)
              this.$store.commit('set_snackbar', 'Successfully deleted')
            }).catch(err => {
            this.$toast.error(`${err.response.data}`)
          })
        } else {
          this.$toast.info("You cannot delete display image of product.")
        }

      }

    },
    async updateImages(display) {
      let total = 0
      console.log(display)
      if (display) {
        total = this.product.product_image.length + 1
      } else {
        total = this.product.product_image.length + this.images.length
      }
      if (total <= 6) {
        if (display) {
          const isValid = await this.$refs.add_image_primary.validate()
          if (isValid) {
            let formdata = new FormData()
            formdata.append('image', this.primary_image)
            formdata.set('display', 'y')
            this.$axios.post(`/api/seller/product/edit/add/image/${this.$route.params.id}`, formdata)
              .then(res => {
                this.primary_image = null
                this.$refs.add_image_primary.reset()
                this.product.product_image.forEach((data) => {
                  if (data.display) {
                    data.display = false
                  }
                })
                this.product.product_image.push(res.data)
                // res.data.image.forEach(e => {
                //   this.product.product_image.push(e)
                // })

              })
          }
        } else {
          const isValid = await this.$refs.add_image_additional.validate()
          if (isValid) {
            let formdata = new FormData()
            this.images.forEach(e => {
              formdata.append('images', e)
            })
            this.$axios.post(`/api/seller/product/edit/add/image/${this.$route.params.id}`, formdata)
              .then(res => {
                res.data.forEach(e => {
                  this.product.product_image.push(e)
                })
                this.images.splice(0, this.images.length)
              })
          }
        }

      } else {
        this.$toast.info(`You can add ${parseInt(this.images.length) - parseInt(this.product.product_image.length)} products`)
      }
    },
    set_breadcrumbs() {
      const data = [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/'
        },
        {
          text: 'Active Product',
          disabled: true,
          href: '/product/data/active'
        }
      ]
      this.$store.commit('set_breadcrumbs', data)
      this.$store.commit('set_breadcrumbs_name', {
        name: 'Create Product',
        url: `/product/data/active?page=${this.$route.query.page}&tab=openshop`
      })
    }
  }
}
</script>

<style scoped>

</style>
