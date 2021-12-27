<template>
  <div v-if="server_err !== null">
    <div v-for="(errors,index) of server_err" :key="index">
      <div class="d-flex mb-2">
        <!--        <p class="pr-5 title"></p>-->
        <!-- <v-alert type="error" border="left" dense><span class="font-weight-bold">{{ index }}</span>: {{errors}}</v-alert> -->
        <!--        <ul v-for="(error,errorIndex) in errors" :key="errorIndex">-->
        <!--          <li class="subtitle-1"> {{error}}</li>-->
        <!--        </ul>-->
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
