<template>
  <div class="container">
    <Card>
      <template #title>
        <div  class="flex justify-center">
          <ProgressSpinner/>
        </div>

      </template>
    </Card>
  </div>
</template>
<script>
import ProgressSpinner from 'primevue/progressspinner';

export default {
  middleware: 'is_auth',
  components: {
    ProgressSpinner
  },
  mounted() {

  }
}
</script>
