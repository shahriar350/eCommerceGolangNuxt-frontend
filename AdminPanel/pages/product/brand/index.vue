<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Create a attribute</v-card-title>
          <v-card-text>
            <validation-observer
              ref="admin_brand_validate"
              v-slot="{ invalid }"
            >
              <form @submit.prevent="createBrand">
                <validation-provider
                  v-slot="{ errors }"
                  name="Attribute name"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.name"
                    :error-messages="errors"
                    label="Attribute name"
                    required
                    outlined
                    chips
                  ></v-text-field>

                </validation-provider>
                <!--                <validation-provider-->
                <!--                  v-slot="{ errors }"-->
                <!--                  name="Shop Category"-->
                <!--                  rules="required"-->
                <!--                >-->
                <!--                  <v-select-->
                <!--                    v-model="form.shop_category_id"-->
                <!--                    :error-messages="errors"-->
                <!--                    :items="categories" item-text="name" item-value="id"-->
                <!--                    label="Shop Category"-->
                <!--                    outlined-->
                <!--                  ></v-select>-->

                <!--                </validation-provider>-->

                <v-card-actions>
                  <v-btn type="submit">Create</v-btn>
                </v-card-actions>
              </form>

            </validation-observer>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <loading-page v-if="$fetchState.pending"/>
        <v-card v-else>
          <v-card-title>brand</v-card-title>
          <v-card-text>
            <v-text-field v-model="searchAttribute" label="Search" placeholder="Search by name"></v-text-field>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="brand"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item,index }">
                <v-icon
                  small
                  class="mr-2"
                  @click="editItem(item,index)"
                >
                  {{ icons.mdiAccountEdit }}
                </v-icon>
                <v-icon
                  small
                  color="red"
                  @click="deleteItem(item,index)"
                >
                  {{ icons.mdiDelete }}
                </v-icon>
              </template>
            </v-data-table>
            <!--            <v-list>-->
            <!--              <v-list-item-group v-if="brand.length > 0">-->
            <!--                <v-list-item v-for="(attribute,index) in brand" :key="index" class="my-2 ">-->
            <!--                  <v-list-item-title>-->
            <!--                    <v-row dense>-->
            <!--                      <v-col md="3" cols="4">{{ attribute.id }}</v-col>-->
            <!--                      <v-col md="3" cols="4">{{ attribute.name | capfirst }}</v-col>-->
            <!--                      <v-col md="3" cols="4">-->
            <!--                        &lt;!&ndash;                        <v-icon @click="EditInit(attribute.id,index)">{{ icons.mdiAccountEdit }}</v-icon>&ndash;&gt;-->
            <!--                        &lt;!&ndash;                        <v-icon @click="softdelete(attribute.id,index)" color="red">{{ icons.mdiDelete }}</v-icon>&ndash;&gt;-->
            <!--                      </v-col>-->
            <!--                    </v-row>-->

            <!--                  </v-list-item-title>-->
            <!--                </v-list-item>-->
            <!--              </v-list-item-group>-->
            <!--              <v-list-item-group v-else>-->
            <!--                No data is found.-->
            <!--              </v-list-item-group>-->
            <!--            </v-list>-->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-if="openEditModal" max-width="600" v-model="openEditModal">
      <v-card>
        <v-card-title>
          {{ editForm.name }} Edit
        </v-card-title>
        <v-card-text>
          <validation-observer
            ref="admin_shop_category_update_validate"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="update_attribute">
              <validation-provider
                v-slot="{ errors }"
                name="Attribute name"
                rules="required"
              >
                <v-text-field
                  v-model="editForm.name"
                  :error-messages="errors"
                  label="Attribute name"
                  required
                  outlined
                  chips
                ></v-text-field>
              </validation-provider>

              <v-card-actions>
                <v-btn @click.prevent="update_attribute">Add now</v-btn>
              </v-card-actions>
            </form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
    <confirm ref="confirm"/>
  </div>
</template>

<script>
import {extend, ValidationObserver, ValidationProvider, setInteractionMode} from 'vee-validate'
import {required, image, mimes, size} from 'vee-validate/dist/rules'
import LoadingPage from "@/components/loading-page";
import {mdiAccountEdit, mdiDelete} from "@mdi/js"
import Confirm from "@/components/confirm";

setInteractionMode('eager')
extend('required', {
  ...required,
  message: '{_field_} can not be empty'
})
extend('image', image)
extend('image', image)
extend('mimes', mimes)
extend('size', {
  ...size,
  message: '{_field_} size cannot be greater than 2MB'
})
export default {
  components: {
    Confirm,
    LoadingPage, ValidationProvider,
    ValidationObserver,
  },
  head() {
    return {
      title: "brand",
    }
  },
  data() {
    return {
      openEditModal: false,
      editForm: {
        name: '',
        shop_category_id: '',
        index: '',
      },

      icons: {mdiAccountEdit, mdiDelete},
      headers: [
        {text: 'ID', value: 'id', sortable: true,},
        {text: 'Name', value: 'name'},
        {text: 'Actions', value: 'actions'},

      ],
      form: {
        name: '',
        // shop_category_id: '',
      },
      brand: [],
      searchAttribute: '',
      // categories: [],
    }
  },
  async fetch() {
    const data = await this.$axios.get("/api/admin/product/brand/all")
    // const category_data = await this.$axios.get("/api/admin/shop/categories/only/all")
    if (data.status === 200) {
      this.brand = data.data
    }
    // if (category_data.status === 200){
    //   this.categories = category_data.data
    // }
  },
  methods: {
    async update_attribute() {
      const check = await this.$refs.admin_shop_category_update_validate.validate()
      if (check) {
        const data = await this.$axios.put(`/api/admin/brand/edit/${this.editForm.id}`, {
          "name": this.editForm.name
        })
        if (data.status === 200) {
          this.brand.splice(this.editForm.index, 1, data.data)
          this.$toast.success("Successfully updated.")
        } else {
          this.$toast.success("Cannot delete. Try again.")
        }
      }
    },
    async editItem(item, index) {
      this.editForm.id = item.id
      this.editForm.name = item.name
      this.editForm.shop_category_id = item.shop_category.id
      this.editForm.index = index
      this.openEditModal = true
    },
    async deleteItem(item, index) {
      if (await this.$refs.confirm.open("Want to delete")) {
        const data = await this.$axios.delete(`/api/admin/product/brand/delete/${item.id}`)
        .then(res => {
          this.brand.splice(index, 1)
          this.$toast.success("Successfully deleted")
        }) .catch(err => {
          this.$toast.error(`${err.response.data}`)
          })
      }
    },
    async createBrand() {
      const check = await this.$refs.admin_brand_validate.validate()
      if (check) {
        await this.$axios.post("/api/admin/product/brand/create", this.form)
          .then(res => {
            this.form.name = ''
            this.$refs.admin_brand_validate.reset()
            this.$toast.error("Created.")
            this.brand.push(res.data.data)
          }) .catch(err => {
            console.log(err)
            this.$toast.error("Cannot create.")
          })

      }
    }
  },
}
</script>

<style scoped>

</style>
