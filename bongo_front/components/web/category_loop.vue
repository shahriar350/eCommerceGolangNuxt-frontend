<template>
  <div>
    <div class="ml-3" v-for="(data,index) in child" :key="index">
      <p :style="[$route.query.cat ===data.name ? {'color': 'black'}:{'color': 'rgba(0,0,0,.6)'} ]" class="cursor-pointer" @click="sentEvent(data)">{{data.name }}</p>
      <category_loop v-if="data.child.length" @params_child_update="sentEvent" :child="data.child"></category_loop>
    </div>
  </div>

</template>

<script>
export default {
  name: 'category_loop',
  props: {
    child: {
      required: true,
      type: Array,
    }
  },
  methods: {
    sentEvent(value){
      this.$emit('params_child_update',value)
    }
  }

}
</script>

<style scoped>

</style>
