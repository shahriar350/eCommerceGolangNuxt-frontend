<template>
  <div class="container">
    <div v-if="$fetchState.pending" class="flex w-full justify-center"><ProgressSpinner />
    </div>
    <p v-else-if="$fetchState.error">Error. Please reload again</p>
    <div v-else>
      <p class="text-2xl font-bold py-4 border-b border-gray-500 mb-4">{{$route.params.slug | capfirst}}</p>
      <div class="grid lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 md:gap-4 gap-2 mb-5">
        <p v-if="Object(products).length <= 0">
          No data available
        </p>
        <div v-else v-for="(product,index) in products.edges.seller_products" :key="index" class="max-w-sm rounded overflow-hidden shadow-lg">

          <nuxt-link :to="`/product/${product.slug}/${product.id}`">
            <v_image :name="product.edges.seller_product_images[0].image"/>
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
    </div>
  </div>
</template>
<script>
import v_image from "@/components/v_image";
import ProgressSpinner from 'primevue/progressspinner';

export default {
  name: 'product_by_category',
  components: {
      v_image,ProgressSpinner
  },
  data() {
    return {
      products: []
    }
  },
  async fetch(){
    await this.$axios.get(`/api/nonuser/single/categories/all/product/${this.$route.params.slug}/${this.$route.params.id}`)
    .then(res => {
      if (res.status === 200){
        this.products = res.data
      }

    })
  },
  fetchOnServer:false,
}
</script>

<style scoped>

</style>
