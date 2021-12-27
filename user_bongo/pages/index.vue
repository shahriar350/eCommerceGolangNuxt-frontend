<template>
  <div class="container">

    <div class="grid lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 md:gap-4 gap-2 mb-5">
      <div v-for="(product,index) in products" :key="index" class="max-w-sm rounded overflow-hidden shadow-lg">
        <nuxt-link :to="`/product/${product.slug}/${product.id}`">
          <v_image :name="product.product_image[0].image"/>
        </nuxt-link>
        <div class="px-6 py-4">
<!--          <div class="font-bold text-xl mb-2">The Coldest Sunset</div>-->
          <nuxt-link :to="`/product/${product.slug}/${product.id}`" class="font-bold text-base mb-2 text-gray-700">
            {{ product.name | capfirst }}
          </nuxt-link>
        </div>
        <!--        <div class="px-6 pt-4 pb-2">-->
        <!--          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>-->
        <!--          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>-->
        <!--          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>-->
        <!--        </div>-->
      </div>

    </div>
<!--   categories /-->
    <div class="" v-if="categories.length">
      <p class="font-xl font-bold border-b border-gray-500 py-2">Categories</p>
      <div class="grid lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 md:gap-4 gap-2">
        <div v-for="(category,index) in categories" :key="index" class="max-w-sm rounded overflow-hidden shadow-lg">
          <div class="px-6 py-4">
            <!--          <div class="font-bold text-xl mb-2">The Coldest Sunset</div>-->
            <nuxt-link :to="`/product/category/${category.slug}/${category.id}`" class="font-bold text-base mb-2 text-gray-700">
              {{ category.name | capfirst }}
            </nuxt-link>
          </div>
          <!--        <div class="px-6 pt-4 pb-2">-->
          <!--          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>-->
          <!--          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>-->
          <!--          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>-->
          <!--        </div>-->
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import v_image from "@/components/v_image";

export default {
  name: 'IndexPage',
  components: {
    v_image
  },
  data() {
    return {
      products: [],
      categories: []
    }
  },
  async fetch() {
    await this.$axios.get("/api/nonuser/all/products")
      .then(res => {
        this.products = res.data
      }).catch(err => {
        console.log(err.response)
      })


  },
  mounted() {
    this.getProductCategories()
  },
  methods: {
    getProductCategories(){
       this.$axios.get("/api/nonuser/all/main/categories")
        .then(res => {
          this.categories = res.data
        }).catch(err => {
          console.log(err.response)
        })
    }
  },
  fetchOnServer: false,

}
</script>
