<template>
  <div class="px-4">
    <div v-if="$fetchState.pending" class="flex w-full justify-center">
      <ProgressSpinner/>
    </div>
    <p v-else-if="$fetchState.error">Something is wrong. Reload again.</p>
    <div v-else>
      <div class="grid grid-cols-12">
        <div class="lg:col-span-3 md:col-span-4 sm:col-span-5 col-span-full">
          <Galleria :showItemNavigators="true" :showItemNavigatorsOnHover="true"
                    :responsiveOptions="GalleryResponsiveOptions" :numVisible="5"
                    :circular="true" :value="product.product_image">
            <template #item="slotProps">
              <!--          {{slotProps.item}}-->
              <v_image :name="slotProps.item.image"/>
              <!--          <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%" />-->
            </template>
            <template #thumbnail="slotProps">
              <v_image :name="slotProps.item.image" quality="40"/>
            </template>
          </Galleria>
        </div>
        <div class="lg:col-span-9 md:col-span-8 sm:col-span-7 col-span-full">
          <p class="text-xl font-bold px-2 py-4">{{ product.name | capfirst }}</p>
          <div v-if="product.seller_product_variation.length > 0">
            <div v-for="(variation,index) in variations" :key="index">

              <div v-for="(value,valueIndex) in variation" class=" inline-block" :key="valueIndex" v-if="index !== 'price'">
                <p class="text-xl" v-if="valueIndex === 0">{{index}}</p>
                <p @click="updateVariationValue(value.id,index,valueIndex)" :class="[value.active ? 'bg-gray-400': 'bg-gray-200 ',value.disabled ? 'text-gray-400':'text-gray-800']" class="px-4 py-2 shadow mr-4 cursor-pointer shadow rounded">{{value.name}}</p>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div v-html="product.description">
      </div>
    </div>
  </div>
</template>

<script>
import Galleria from 'primevue/galleria';
import ProgressSpinner from 'primevue/progressspinner';
import v_image from "@/components/v_image";
import product from "../../../../../seller_app/pages/product";

export default {
  name: 'single_product',
  components: {
    Galleria, v_image, ProgressSpinner
  },
  data() {
    return {
      product: {},
      variations: {},
      GalleryResponsiveOptions: [
        {
          breakpoint: '1024px',
          numVisible: 5
        },
        {
          breakpoint: '960px',
          numVisible: 4
        },
        {
          breakpoint: '768px',
          numVisible: 3
        },
        {
          breakpoint: '560px',
          numVisible: 1
        }
      ]
    }
  },
  async fetch() {
    await this.$axios.get(`/api/nonuser/single/products/${this.$route.params.slug}/${this.$route.params.id}`)
      .then(res => {
        this.product = res.data
        this.combination_variations()
      }).catch(err => {
        console.log(err)
      })
  },
  fetchOnServer: false,
  mounted() {

  },
  methods: {
    combination_variations(){
      let my_combination = {
        price: []
      }
      if(Object.keys(this.product).length > 0 && this.product.seller_product_variation.length > 0){
        // console.log(this.product)
        this.product.seller_product_variation.forEach((variation,index) => {
          my_combination['price'].push({
            id: variation.id,
            product_price: variation.product_price,
            selling_price: variation.selling_price,
            quantity: parseInt(variation.quantity),
            image: variation.image,
            combination: [],
          })
          variation.seller_product_variation_values.forEach(values => {
            my_combination['price'][index]['combination'].push(values.id)
            if (values.attribute.name in my_combination){
              my_combination[values.attribute.name].push({
                id :values.id,
                name : values.name,
                description : values.description,
                active: false,
                disabled: false
              })
            } else {
              my_combination[values.attribute.name] = []
              my_combination[values.attribute.name].push({
                id :values.id,
                name : values.name,
                description : values.description,
                active: false,
                disabled: false
              })
            }
          })

          console.log(my_combination)
        })
        this.variations = my_combination

      }
    },
    updateVariationValue(id,parent,child){
      console.log("id: ",id)
      // console.log(this.product.seller_product_variation[parent])
      // this.variations[parent][child].active = true
      this.variations[parent][child].disabled = true
      let ids = []
      Object.entries(this.variations).forEach((variation,index) => {
        if (variation[0] === 'price'){
          variation[1].forEach(val => {
            if (val['combination'].includes(id)){
              val['combination'].forEach(e => {
                ids.push(e)
              })
            }
          })
        }
      })
      Object.entries(this.variations).forEach((variation,index) => {
        if (variation[0] !== 'price'){
          variation[1].forEach(val => {
            if (ids.includes(val.id)){
              val.active = true
              val.disabled = false
            } else {
              val.active = false
              val.disabled = true
            }
          })
        }
      })
      console.log("ids: ",ids)
    }
  },
}
</script>
