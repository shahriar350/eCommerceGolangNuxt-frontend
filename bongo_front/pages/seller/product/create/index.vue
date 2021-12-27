<template>
  <div class="mt-4">
    <v-card>
      <v-tabs
        color="deep-purple accent-4"
        v-model="tab"
      >
        <v-tab href="#home">Landscape</v-tab>
        <v-tab href="#city">City</v-tab>
        <v-tab href="#abs">Abstract</v-tab>

        <v-tabs-items :value="tab">
          <form action="">
            <v-tab-item value="home">
              <v-card>
                <v-card-title>
                  Basic product information
                </v-card-title>
                <v-card-subtitle>
                  Provide all information with *
                </v-card-subtitle>
                <v-card-text>
                  <v-text-field
                    v-model="product.name"
                    :error-messages="ProductNameRequiredError"
                    :counter="100"
                    label="Product name*"
                    required
                    outlined
                    chips
                    @input="$v.product.name.$touch()"
                    @blur="$v.product.name.$touch()"
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item value="city">
              <v-card-text>
                hello world 2
              </v-card-text>
            </v-tab-item>
            <v-tab-item value="abs">
              <v-card-text>
                hello world 3
              </v-card-text>
            </v-tab-item>
          </form>

        </v-tabs-items>

      </v-tabs>
    </v-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        product: {
          name: '',
        }
      }
    },
    validations: {
        product: {
          name: {
            required
          }
        }
    },

    created() {
      this.set_breadcrumbs()
    },
    methods: {
      set_breadcrumbs() {
        const data = [
          {
            text: 'Dashboard',
            disabled: false,
            href: '/seller'
          },
          {
            text: 'Product',
            disabled: false,
            href: '/seller/product'
          },
          {
            text: 'New product',
            disabled: true,
            href: '/seller/product/create'
          }

        ]
        this.$store.commit('set_breadcrumbs', data)
        this.$store.commit('set_breadcrumbs_name', null)
      }
    },
    computed: {
      tab: {
        set (tab) {
          this.$router.replace({ query: { ...this.$route.query, tab } })
        },
        get () {
          return this.$route.query.tab
        }
      },
      ProductNameRequiredError() {
        const errors = []
        if (!this.$v.product.name.$dirty) return errors
        !this.$v.product.name.required && errors.push('This field is required!')
        return errors
      },
    },
  }
</script>

<style scoped>

</style>
