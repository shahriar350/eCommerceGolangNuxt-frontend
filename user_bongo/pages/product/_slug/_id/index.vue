<template>
  <div class="container">
    <div v-if="$fetchState.pending" class="flex w-full justify-center">
      <ProgressSpinner/>
    </div>
    <p v-else-if="$fetchState.error">Something is wrong. Reload again.</p>
    <div v-else>
      <div class="grid grid-cols-12 gap-4">
        <div class="lg:col-span-3 md:col-span-4 sm:col-span-5 col-span-full">
          <Galleria :containerStyle="display_size" :fullScreen="displayFull" :showItemNavigators="true"
                    :showItemNavigatorsOnHover="true"
                    :responsiveOptions="GalleryResponsiveOptions"
                    :circular="true" :value="product.edges.seller_product_images" :visible.sync="displayBasic">
            <template #item="slotProps" class="relative " style="width: 100%; display: block;">
              <!--          {{slotProps.item}}-->

              <v_image :name="slotProps.item.image"/>
              <i v-if="!displayFull" @click="onThumbnailButtonClick"
                 class="pi pi-eye absolute bottom-0 right-0 shadow bg-white rounded p-1 cursor-pointer"></i>
              <!--          <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%" />-->
            </template>
            <template #thumbnail="slotProps" style="display: block;">
              <v_image :name="slotProps.item.image" quality="40"/>
            </template>
            <template #footer>

              <div class="custom-galleria-footer">

                <!--                <Button icon="pi pi-list" @click="onThumbnailButtonClick"/>-->
              </div>
            </template>
          </Galleria>

        </div>
        <div class="lg:col-span-9 md:col-span-8 sm:col-span-7 col-span-full">
          <validation-observer
            ref="create_cart_validation"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="addToCart">
              <p class="text-xl font-bold px-2 py-4">{{ product.name | capfirst }}</p>
              <validation-provider
                v-slot="{ validate,errors }"
                name="Product Variation"
                rules="checkVariationSelect"
              >
                <div class="grid lg:grid-cols-8 md:grid-cols-6 sm:grid-cols-4 grid-cols-3  gap-2 "
                     v-if="'seller_product_variations' in product.edges && product.edges.seller_product_variations.length > 0">

                  <div class="shadow border rounded bg-gray-200"
                       v-for="(variation,index) in product.edges.seller_product_variations"
                       :key="index">
                    <div class="mb-2">
                      <ImagePreview :preview="true" :src="`http://127.0.0.1:8000/static/images/${variation.image}`"
                                    alt="Image Text">
                        <template #indicator>
                          <i class="pi pi-eye"></i>
                        </template>
                      </ImagePreview>

                      <!--                <v_image :name="variation.image" quality="30" />-->
                      <div @click="selectVariation(variation.id);validate" class="cursor-pointer px-3 relative">
                        <div v-for="(values,ValKey) in variation.edges.seller_product_variation_values" :key="ValKey">
                          {{ values.name | capfirst }}
                        </div>
                        <span
                          class="font-bold mt-1"><span>&#2547 </span>{{
                            offer(product.selling_price,variation.selling_price,product.offer_price,product.offer_price_start,product.offer_price_end)
                          }}</span>
                        <i v-if="variation.id === selectVariationID"
                           class="opacity-70 pi pi-check absolute bottom-0 right-0 mr-2 bg-white p-1 rounded-full"></i>
                      </div>
                    </div>
                  </div>
                  <InlineMessage v-if="errors.length">{{ errors[0] }}</InlineMessage>


                  <!--            <div v-for="(variation,index) in variations" :key="index">-->

                  <!--              <div v-for="(value,valueIndex) in variation" class=" inline-block" :key="valueIndex" v-if="index !== 'price'">-->
                  <!--                <p class="text-xl" v-if="valueIndex === 0">{{index}}</p>-->
                  <!--                <p @click="updateVariationValue(value.id,index,valueIndex)" :class="[value.active ? 'bg-gray-400': 'bg-gray-200 ',value.disabled ? 'text-gray-400':'text-gray-800']" class="px-4 py-2 shadow mr-4 cursor-pointer shadow rounded">{{value.name}}</p>-->
                  <!--              </div>-->

                  <!--            </div>-->
                </div>
                <div v-else>
                  <p><span>Price: </span>
                    <span
                      class="font-bold mt-1"><span>&#2547 </span>{{
                        offer(product.selling_price,0,product.offer_price,product.offer_price_start,product.offer_price_end)
                      }}</span>
                  </p>
                </div>
              </validation-provider>
              <div class="mt-4">
                <p>Quantity: </p>
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantity"
                  rules="required|min_value:1|numeric"
                >

                  <InputNumber v-model="product_quantity" :min="1" :max="10" showButtons buttonLayout="horizontal"
                               decrementButtonClass="p-button-secondary" incrementButtonClass="p-button-secondary"
                               incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"/>
                  <InlineMessage v-if="errors.length">{{ errors[0] }}</InlineMessage>
                  <!--                  <span v-if="errors.length">{{ errors[0] }}</span>-->
                </validation-provider>
              </div>
              <Button type="submit" label="Cart now"/>
            </form>
          </validation-observer>
        </div>

      </div>
      <div v-html="product.description">

      </div>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque explicabo iste necessitatibus neque
        possimus praesentium quas quibusdam ratione rem. Aliquam, nulla odit. Ad alias aliquam aliquid amet debitis
        deserunt dicta dolore dolores dolorum ducimus eius esse ex explicabo facilis, fuga illum inventore ipsam iste
        iure magni natus non odit optio placeat provident quia quidem quo quos reiciendis similique sit sunt vero
        voluptatem? Eos et harum minus neque officia, perferendis provident reiciendis vel. At deserunt est explicabo,
        in ipsum iure maiores maxime mollitia nemo nostrum numquam quam quas repudiandae, tempora, totam? Accusamus,
        adipisci aspernatur blanditiis, consectetur consequatur facilis fuga inventore laboriosam magni nam officiis
        perferendis quos tempore velit voluptatum? Aliquam aliquid commodi consequatur delectus deserunt dignissimos
        distinctio, dolorum eos facilis harum hic illum ipsam natus neque nostrum perferendis quae quaerat quis quisquam
        quo sapiente, similique veniam? Aliquam exercitationem nemo possimus quia quod velit! Aliquam architecto
        asperiores esse ex, magni maiores numquam perspiciatis praesentium tempore voluptatem? Animi aperiam culpa
        delectus dolore ducimus et fugiat laborum libero maiores officia officiis, pariatur possimus quod reiciendis
        repellat. Adipisci aliquam amet at, atque corporis cupiditate est eum impedit itaque iure laborum omnis
        perspiciatis porro possimus quibusdam quidem quis tenetur vero! Aliquam dolorum necessitatibus quos
        reprehenderit vero.</p>
    </div>


  </div>
</template>

<script>
import Galleria from 'primevue/galleria';
import ProgressSpinner from 'primevue/progressspinner';
import v_image from "@/components/v_image";
import ImagePreview from 'primevue/imagepreview';
import InputNumber from 'primevue/inputnumber';
import {extend, setInteractionMode, ValidationObserver, ValidationProvider,} from 'vee-validate'
import {min_value, numeric, required} from 'vee-validate/dist/rules'
import InlineMessage from 'primevue/inlinemessage';

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} can not be empty.'
})
extend('numeric', {
  ...numeric,
  message: '{_field_} must be numeric.'
})

extend('checkVariationSelect', {
  message: 'Kindly select a variation.', // the error message
  validate: value => {
    if (this.product.edges.seller_product_variations.length) {
      return !(this.selectVariationID === null || this.selectVariationID === 0);
    } else {
      return true
    }
  } // the validation function
})
extend('min_value', {
  ...min_value,
  message: '{_field_} value must be higher than {min}.'
})
export default {
  name: 'single_product',
  components: {
    Galleria, v_image, ProgressSpinner, ImagePreview, InputNumber, ValidationProvider, InlineMessage,
    ValidationObserver
  },
  data() {
    return {
      selectVariationID: null,
      product_quantity: 1,
      value: null,
      displayBasic: false,
      product: {},
      variations: {},
      GalleryResponsiveOptions: [
        {
          breakpoint: '1500px',
          numVisible: 6
        },
        {
          breakpoint: '1024px',
          numVisible: 5
        },
        {
          breakpoint: '768px',
          numVisible: 4
        },
        {
          breakpoint: '560px',
          numVisible: 3
        }
      ]
    }
  },
  async fetch() {
    await this.$axios.get(`/api/nonuser/single/products/${this.$route.params.slug}/${this.$route.params.id}`)
      .then(res => {
        this.product = res.data
        // this.combination_variations()
      }).catch(err => {
        console.log(err)
      })
  },
  fetchOnServer: false,

  computed: {
    displayFull() {
      return this.displayBasic
    },
    display_size() {
      if (this.displayBasic) {
        return 'max-width: 550px'
      } else {
        return null
      }
    }
  },
  mounted() {

    if (localStorage.getItem("bong_cart")) {
      let data = JSON.parse(this.$CryptoJS.AES.decrypt(localStorage.getItem("bong_cart"), process.env.localEncrypt).toString(this.CryptoJS.enc.Utf8))
      console.log(data)
    }

    // localStorage.setItem("name",this.$CryptoJS.AES.encrypt("value",process.env.localEncrypt))

  },
  methods: {
    async addToCart() {
      if ("seller_product_variations" in this.product.edges && this.product.edges.seller_product_variations.length) {
        if (this.selectVariationID === null || this.selectVariationID === 0 || this.selectVariationID === '') {
          this.$toast.add({severity: 'warn', summary: 'Select a variation', life: 5000});
          return;
        }
      }
      const isValid = await this.$refs.create_cart_validation.validate()
      if (isValid) {
        if (this.auth) {
          await this.$axios.post("/api/user/cart/add/product/one", {
            product_id: this.product.id,
            variation_id: this.selectVariationID,
            quantity: this.product_quantity
          })
            .then(res => {
              if (res.status === 201) {
                this.$store.commit('set_cart_count', 1)
              }
              this.$toast.add({severity: 'success', summary: 'Added to cart.', life: 3000});


            })
        } else {
          let data = {}
          if (localStorage.hasOwnProperty("bong_cart")) {
            data = JSON.parse(this.$CryptoJS.AES.decrypt(localStorage.getItem("bong_cart"), process.env.localEncrypt).toString(this.CryptoJS.enc.Utf8))
          }
          // let carts = this.$CryptoJS.AES.decrypt(localStorage.getItem("bong_cart"), "Secret Passphrase").toString(this.CryptoJS.enc.Utf8)
          // if (carts){
          //
          // } else {
          //   carts = []
          // }
          data[this.product.id] = {
            variation: this.selectVariationID,
            quantity: this.product_quantity
          }
          localStorage.setItem("bong_cart", this.$CryptoJS.AES.encrypt(JSON.stringify(data).toString(), process.env.localEncrypt))
          const carts = JSON.parse(this.$CryptoJS.AES.decrypt(localStorage.getItem("bong_cart"), process.env.localEncrypt).toString(this.CryptoJS.enc.Utf8))
          this.$store.commit('replace_cart_count', Object.keys(carts).length)
          // this.$store.commit('set_cart_count', 1)
        }
      }

    },
    selectVariation(id) {
      this.selectVariationID = id
    },
    offer(value, variation, offer_percent, start, end){
      const todaydate = new Date()
      const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) //new Date(2011,8,20)
      let price = 0
      console.log("variation: ",variation)
      if (parseFloat(variation) > 0 ) {
        price = parseFloat(value) + parseFloat(variation)
      } else {
        price = parseFloat(value)
      }
      // price = parseFloat(value) + parseFloat(variationPrice)

      if (start !== undefined && end !== undefined) {
        if (start === null && end === null) {
          return price.toFixed(2)
        } else {
          const date_start = new Date(start)
          const date_end = new Date(end)
          if (today >= new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate())
            && today <= new Date(date_end.getFullYear(), date_end.getMonth(), date_end.getDate())) {
            let temp_price = price - (price * (parseInt(offer_percent) / 100))
            return temp_price.toFixed(2)
          } else {
            return price.toFixed(2)
          }
        }
      }
    },
    onThumbnailButtonClick() {
      this.displayBasic = true
    },
    calculate_price(variation) {
      const main_price = this.product.selling_price
      return parseFloat(main_price) + parseFloat(variation)
    },
    // combination_variations() {
    //   let my_combination = {
    //     price: []
    //   }
    //   if (Object.keys(this.product).length > 0 && this.product.seller_product_variation.length > 0) {
    //     // console.log(this.product)
    //     this.product.seller_product_variation.forEach((variation, index) => {
    //       my_combination['price'].push({
    //         id: variation.id,
    //         product_price: variation.product_price,
    //         selling_price: variation.selling_price,
    //         quantity: parseInt(variation.quantity),
    //         image: variation.image,
    //         combination: [],
    //       })
    //       variation.seller_product_variation_values.forEach(values => {
    //         my_combination['price'][index]['combination'].push(values.id)
    //         if (values.attribute.name in my_combination) {
    //           console.log("name: ", my_combination[values.attribute.name])
    //           if (my_combination[values.attribute.name].name !== values.name) {
    //             my_combination[values.attribute.name].push({
    //               name: values.name,
    //               active: false,
    //               disabled: false
    //             })
    //           }
    //         } else {
    //           my_combination[values.attribute.name] = []
    //           my_combination[values.attribute.name].push({
    //             name: values.name,
    //             description: values.description,
    //             active: false,
    //             disabled: false
    //           })
    //         }
    //       })
    //
    //       console.log(my_combination)
    //     })
    //     this.variations = my_combination
    //
    //   }
    // },
    // updateVariationValue(id, parent, child) {
    //   console.log("id: ", id)
    //   // console.log(this.product.seller_product_variation[parent])
    //   // this.variations[parent][child].active = true
    //   this.variations[parent][child].disabled = true
    //   let ids = []
    //   Object.entries(this.variations).forEach((variation, index) => {
    //     if (variation[0] === 'price') {
    //       variation[1].forEach(val => {
    //         if (val['combination'].includes(id)) {
    //           val['combination'].forEach(e => {
    //             ids.push(e)
    //           })
    //         }
    //       })
    //     }
    //   })
    //   Object.entries(this.variations).forEach((variation, index) => {
    //     if (variation[0] !== 'price') {
    //       variation[1].forEach(val => {
    //         if (ids.includes(val.id)) {
    //           val.active = true
    //           val.disabled = false
    //         } else {
    //           val.active = false
    //           val.disabled = true
    //         }
    //       })
    //     }
    //   })
    //   console.log("ids: ", ids)
    // }
  },
}
</script>
