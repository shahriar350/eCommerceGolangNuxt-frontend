<template>
<!--  <v-lazy-image :src="thumbnail"     sizes="100%"/>-->
<!--  <nuxt-img :src="thumbnail" fit="contain"  style="width: 100%" />-->
  <v-img :src="thumbnail" :lazy-src="thumbnail" contain>
    <template v-slot:placeholder>
      <v-row
        class="fill-height ma-0"
        align="center"
        justify="center"
      >
        <v-progress-circular
          :indeterminate="true"
          color="primary"
        ></v-progress-circular>
      </v-row>
    </template>
    <slot name="text"></slot>
  </v-img>
<!--  <div>-->
<!--    <img alt="image" :src="thumbnail" width="100%" />-->
<!--    <slot name="text"></slot>-->
<!--  </div>-->
</template>

<script>

export default {
  name: 'img-mine',
  props: {
    thumbnail: String,
  },
}
</script>
<style scoped>
.resp{
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
