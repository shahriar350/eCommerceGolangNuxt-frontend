<template>
  <div class="">
    <div class="container" v-if="serverError !== ''">
      <p class="bg-red-200 p-3 rounded shadow mb-2"><i class="pi pi-times mr-2"></i> {{ serverError }}</p>
    </div>
    <div class=" container grid grid-cols-2 gap-4">

      <!--      user location start-->
      <div>
        <div class="mb-3" v-if="locations.length > 0">
          <p class="font-bold">Select a location: </p>
          <div class="border shadow p-3 py-4 mb-3 rounded flex items-center gap-1" v-for="(loc,index) in locations"
               :key="index">
            <i v-if="select_location > 0" class="pi pi-check"></i>
            <div class=" flex flex-wrap gap-1 cursor-pointer" @click="select_location = parseInt(loc.id)">
              <p class="pr-2" v-if="loc.area !== ''"><span class="pr-1">Area:</span> {{ loc.area | capfirst }}, </p>
              <p class="pr-2" v-if="loc.street !== ''"><span class="pr-1">Area:</span> {{ loc.street | capfirst }}, </p>
              <p class="pr-2" v-if="loc.house !== ''"><span class="pr-1">Street:</span> {{ loc.house | capfirst }}, </p>
              <p class="pr-2" v-if="loc.post_office !== ''"><span class="pr-1">House:</span>
                {{ loc.post_office | capfirst }}, </p>
              <p class="pr-2" v-if="loc.post_code !== ''"><span class="pr-1">PostOffice:</span> {{ loc.post_code }},
              </p>
              <p class="pr-2" v-if="loc.police_station !== ''"><span class="pr-1">PostCode:</span>
                {{ loc.police_station | capfirst }}, </p>
              <p class="pr-2" v-if="loc.city !== ''"><span class="pr-1">PoliceStation:</span> {{ loc.city | capfirst }}
              </p>
            </div>
            <i @click="removeLocation(loc.id,index)" class="pi pi-trash text-red-500 cursor-pointer"></i>
          </div>
        </div>
        <Accordion>
          <AccordionTab header="Create a new location">
            <validation-observer
              ref="create_location_validation"
              v-slot="{ invalid }"
            >
              <form @submit.prevent="createLocation">
                <validation-provider
                  v-slot="{ errors }"
                  name="Area"
                  rules="required"
                >
                  <div class="flex flex-col mt-2">
                    <label for="area">Area*</label>
                    <InputText id="area" type="text" v-model="location.area"/>
                    <InlineMessage v-if="errors.length">{{ errors[0] }}</InlineMessage>
                  </div>
                </validation-provider>
                <div class="flex flex-col mt-2">
                  <label for="street">Street</label>
                  <InputText id="street" type="text" v-model="location.street"/>
                </div>
                <div class="flex flex-col mt-2">
                  <label for="house">House</label>
                  <InputText id="house" type="text" v-model="location.house"/>
                </div>
                <validation-provider
                  v-slot="{ errors }"
                  name="Post office"
                  rules="required"
                >
                  <div class="flex flex-col mt-2">
                    <label for="post_office">Post office*</label>
                    <InputText id="post_office" type="text" v-model="location.post_office"/>
                    <InlineMessage v-if="errors.length">{{ errors[0] }}</InlineMessage>
                  </div>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Post code"
                  rules="required"
                >
                  <div class="flex flex-col mt-2">
                    <label for="post_code">Post Code*</label>
                    <InputNumber id="post_code" type="text" v-model="location.post_code"/>
                    <InlineMessage v-if="errors.length">{{ errors[0] }}</InlineMessage>
                  </div>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Post code"
                  rules="required"
                >
                  <div class="flex flex-col mt-2">
                    <label for="police_station">Police station*</label>
                    <InputText id="police_station" type="text" v-model="location.police_station"/>
                    <InlineMessage v-if="errors.length">{{ errors[0] }}</InlineMessage>
                  </div>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="City"
                  rules="required"
                >
                  <div class="flex flex-col mt-2">
                    <label for="city">City*</label>
                    <InputText id="city" type="text" v-model="location.city"/>
                    <InlineMessage v-if="errors.length">{{ errors[0] }}</InlineMessage>
                  </div>
                </validation-provider>
                <Button label="Add Location" type="submit"/>
              </form>
            </validation-observer>
          </AccordionTab>

        </Accordion>

      </div>
      <!--      user location end-->
      <div>
        <div v-if="$fetchState.pending" class="flex w-full justify-center">
          <ProgressSpinner/>
        </div>
        <div v-else>

          <ClientOnly placeholder="loading...">
            <!--            <div v-if="Object.keys(cart).length === 0 ">-->
            <!--              <Card>-->
            <!--                <template #content>No cart product is available.</template>-->
            <!--              </Card>-->
            <!--            </div>-->
            <div>
              <div v-for="(cartProduct,index) in cart.edges.cart_products" :key="index"
                   class="grid grid-cols-12 md:gap-4 gap-2 mb-3">
                <div class="col-span-3">
                  <nuxt-link
                    :to="`/product/${cartProduct.edges.seller_product.slug}/${cartProduct.edges.seller_product.id}`">
                    <v_image :name="cartProduct.edges.seller_product.edges.seller_product_images[0].image"/>
                  </nuxt-link>

                </div>

                <div class="col-span-9">
                  <!--            {{ product.seller_product_variation[0]}}-->
                  <nuxt-link
                    :to="`/product/${cartProduct.edges.seller_product.slug}/${cartProduct.edges.seller_product.id}`">
                    <p>{{ cartProduct.edges.seller_product.name |capfirst }}</p>
                    <p>{{
                        offer(cartProduct.edges.seller_product.selling_price, cartProduct.edges.seller_product_variation, cartProduct.edges.seller_product.offer_price, cartProduct.edges.seller_product.offer_price_start, cartProduct.edges.seller_product.offer_price_end)
                      }} * {{ cartProduct.quantity }} = {{
                        (offer(cartProduct.edges.seller_product.selling_price, cartProduct.edges.seller_product_variation, cartProduct.edges.seller_product.offer_price, cartProduct.edges.seller_product.offer_price_start, cartProduct.edges.seller_product.offer_price_end) * cartProduct.quantity).toFixed(2)
                      }} /Taka</p>
                  </nuxt-link>

                  <Button @click="removeFromCart(index,cartProduct.id)" icon="pi pi-trash" iconPos="right"
                          class="p-button-sm"/>
                </div>
              </div>
              <div class="border p-2 shadow">
                <p class="text-lg"><span class="font-bold">Total</span>: {{ totalCartPrice }} /Taka</p>
              </div>
              <Button @click="checkout" label="Checkout now" class="mt-3 w-full"/>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script>
import {extend, setInteractionMode, ValidationObserver, ValidationProvider,} from 'vee-validate'
import {numeric, required} from 'vee-validate/dist/rules'
import InlineMessage from 'primevue/inlinemessage';
import InputText from 'primevue/inputtext';
import v_image from "@/components/v_image";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import InputNumber from 'primevue/inputnumber';

setInteractionMode('eager')
import ProgressSpinner from 'primevue/progressspinner';

extend('required', {
  ...required,
  message: '{_field_} can not be empty.'
})
extend('numeric', {
  ...numeric,
  message: '{_field_} must be numeric.'
})

export default {
  middleware: 'is_auth',
  components: {
    ValidationProvider, InlineMessage,
    ValidationObserver, InputNumber, InputText, v_image, Accordion, AccordionTab, ProgressSpinner
  },

  fetch() {
    this.$axios.get('/api/user/cart/product/all')
      .then(res => {
        if (res.status === 200) {
          this.cart = res.data
        } else {
          this.$router.push("/")
        }
      }).catch(err => {
      this.$router.push("/")
    })
    this.$axios.get('/api/user/all/location')
      .then(res => {
        if (res.status === 200) {
          this.locations = res.data
        }
      }).catch(err => {
      this.$toast.add({severity: 'error', summary: 'Try again', life: 3000});
    })
  },
  created() {
    this.getLocations()
  },
  fetchOnServer: false,
  data() {
    return {
      serverError: '',
      cart: {},
      total_price: 0,
      locations: [],
      select_location: 0,
      location: {
        area: '',
        street: '',
        house: '',
        post_office: '',
        post_code: null,
        police_station: '',
        city: '',
      }
    }
  },
  methods: {
    checkout() {
      if (this.select_location > 0) {
        if (this.serverError !== '') {
          this.serverError = ''
        }
        this.$axios.post('/api/user/checkout', {
          location: this.select_location
        }).then(() => {
          this.$store.commit("replace_cart_count", 0)
          this.$toast.add({severity: 'success', summary: 'Checkout Successful', life: 3000});
          this.$router.push("/")
        }).catch(err => {
          this.serverError = err.response.data
        })
      } else {
        this.$toast.add({severity: 'error', summary: 'Select your location', life: 3000});
      }
    },
    getLocations() {
      // this.$axios.get('/api/user/all/location')
      //   .then(res => {
      //     if (res.status === 200) {
      //       this.locations = res.data
      //     }
      //   }).catch(err => {
      //   this.$toast.add({severity: 'error', summary: 'Try again', life: 3000});
      // })
    },
    async createLocation() {
      const valid = await this.$refs.create_location_validation.validate()
      if (valid) {
        await this.$axios.post("/api/user/create/location", this.location)
          .then(res => {
            this.locations.push(res.data)
            this.location = {
              area: '',
              street: '',
              house: '',
              post_office: '',
              post_code: null,
              police_station: '',
              city: '',
            }
            this.$refs.create_location_validation.reset()
          }).catch(() => {
            this.$toast.add({severity: 'error', summary: 'Try again', life: 3000});
          })
      }
    },
    offer(value, variation, offer_percent, start, end) {
      variation = variation === undefined ? {} : variation
      offer_percent = offer_percent === undefined ? 0 : offer_percent
      start = start === undefined ? null : start
      end = end === undefined ? null : end
      const todaydate = new Date()
      const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) //new Date(2011,8,20)
      let price = 0
      if (Object.keys(variation).length > 0) {
        price = parseFloat(value) + parseFloat(variation.selling_price)
      } else {
        price = parseFloat(value)
      }
      // price = parseFloat(value) + parseFloat(variationPrice)

      if (start === null && end === null) {
        return price
      } else {
        const date_start = new Date(start)
        const date_end = new Date(end)
        if (today >= new Date(date_start.getFullYear(), date_start.getMonth(), date_start.getDate())
          && today <= new Date(date_end.getFullYear(), date_end.getMonth(), date_end.getDate())) {
          return price - (price * (parseInt(offer_percent) / 100))
        } else {
          return price
        }
      }
    },
    removeLocation(id, index) {
      if (this.locations.length > 1) {
        this.$confirm.require({
          message: 'Are you sure you want to delete this location?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.$axios.delete(`/api/user/remove/location/${id}`)
              .then(res => {
                this.locations.splice(index, 1)
                this.$toast.add({severity: 'success', summary: 'Removed successfully', life: 3000});
              }).catch(err => {
              this.$toast.add({severity: 'error', summary: 'Try again', life: 3000});
            })
          },
          reject: () => {
            //callback to execute when user rejects the action
          }
        });
      } else {
        this.$toast.add({severity: 'error', detail: 'One location is required.', life: 5000});
      }
    },
    removeFromCart(index, id) {
      if (this.cart.edges.cart_products.length > 1) {
        this.$confirm.require({
          message: 'Are you sure you want to delete from cart?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.$axios.delete(`/api/user/cart/product/remove/${id}`)
              .then(res => {
                if (this.cart.edges.cart_products.length > 1) {
                  this.cart.edges.cart_products.splice(index, 1)
                } else {
                  this.cart = {}
                }
                this.$store.commit('set_cart_count', -1)
                this.$toast.add({severity: 'success', summary: 'Removed successfully', life: 3000});
              }).catch(err => {
              this.$toast.add({severity: 'error', summary: 'Try again', life: 3000});
            })
          },
          reject: () => {
            //callback to execute when user rejects the action
          }
        });
      } else {
        this.$toast.add({severity: 'error', detail: 'Checkout cannot be empty.', life: 5000});
      }

    }
  },
  computed: {
    totalCartPrice() {
      let totalPrice = 0
      if (this.cart.edges.cart_products.length > 0) {
        this.cart.edges.cart_products.forEach(res => {
          console.log(res)
          totalPrice += (this.offer(res.edges.seller_product.selling_price, res.edges.seller_product_variation, res.edges.seller_product.offer_price, res.edges.seller_product.offer_price_start, res.edges.seller_product.offer_price_end) * res.quantity)
        })
      }
      return totalPrice.toFixed(2)
    }
  },
}
</script>
