<template>
  <div v-if="server_err !== null">
    <div v-for="(error,index) of server_err" :key="index">
      <div class="d-flex mb-2">
        <p>{{ index }}: </p>
        <p>{{ error }} </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

    created() {
      this.$store.commit('set_validation_error', '')
    },
    computed: {
      server_err(){
        return this.$store.getters.get_validation_error
      }
    }
  }
</script>
