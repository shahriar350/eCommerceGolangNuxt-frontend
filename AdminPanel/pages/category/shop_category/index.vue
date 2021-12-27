<template>
  <v-row dense>
    <v-col md="6" cols="12">
      <v-card>

        <v-card-title>
          Create a shop category
        </v-card-title>
        <v-card-text>
          <validation-observer
            ref="admin_shop_category_save_validate"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="save_category">
              <validation-provider
                v-slot="{ errors }"
                name="Shop category name"
                rules="required"
              >
                <v-text-field
                  v-model="form.name"
                  :error-messages="errors"
                  label="Shop category name"
                  required
                  outlined
                  chips
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Shop category image"
                rules="required|mimes:image/*|image|size:2048"
              >
                <v-file-input v-model="form.image"
                              accept="image/png, image/jpeg"
                              :show-size="true"
                              :error-messages="errors"
                              messages="2MB maximum"
                              placeholder="Pick a category image"
                              :prepend-icon="icons.mdiCamera"
                              label="Pick a category image"
                ></v-file-input>
              </validation-provider>
              <v-card-actions>
                <v-btn @click.prevent="save_category">Add now</v-btn>
              </v-card-actions>
            </form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col md="6" cols="12">
      <loading-page v-if="$fetchState.pending" />
      <v-row v-else>
        <v-col cols="12">
          <v-card>
            <v-card-title>Shop categories</v-card-title>
            <v-card-text>
              <v-text-field v-model="searchCategory" label="Search" placeholder="Search by name"></v-text-field>
            </v-card-text>
            <v-card-text>
              <v-list>
                <v-list-item-group v-if="categoryFilter.length">
                  <v-list-item v-for="(category,index) in categoryFilter" :key="index" class="my-2 ">
                    <v-list-item-title>
                      <v-row dense>
                        <v-col md="3" cols="4">{{ category.name }}</v-col>
                        <v-col md="6" cols="4">
                          <my_img :thumbnail="`${$store.state.apiHost}/static/images/${category.image}`"/>
                        </v-col>
                        <v-col md="3" cols="4">
                          <v-icon @click="EditInit(category.id,index)">{{ icons.mdiAccountEdit }}</v-icon>
                          <v-icon @click="softdelete(category.id,index)" color="red">{{ icons.mdiDelete }}</v-icon>
                        </v-col>
                      </v-row>

                    </v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
                <v-list-item-group v-else>
                  No data is found.
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>Trash Shop categories</v-card-title>
            <v-card-text>
              <v-text-field v-model="searchTrashCategory" label="Search" placeholder="Search by name"></v-text-field>
            </v-card-text>
            <v-card-text>
              <v-list>
                <v-list-item-group v-if="categoryFilter.length">
                  <v-list-item v-for="(category,index) in trashCategoryFilter" :key="index" class="my-2 ">
                    <v-list-item-title>
                      <v-row dense>
                        <v-col md="3" cols="4">{{ category.name }}</v-col>
                        <v-col md="6" cols="4">
                          <my_img :thumbnail="`${$store.state.apiHost}/static/images/${category.image}`"/>
                        </v-col>
                        <v-col md="3" cols="4">
                          <v-icon @click="recoverCategory(category.id,index)">{{ icons.mdiArrowUp }}</v-icon>
                          <v-icon @click="permanentDelete(category.id,index)" color="red">{{ icons.mdiDelete }}</v-icon>
                        </v-col>
                      </v-row>
                    </v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
                <v-list-item-group v-else>
                  No data is found.
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-dialog v-if="openEditModal" max-width="600" v-model="openEditModal">
      <v-card>
        <v-card-title>
          {{ editItem.name }}
        </v-card-title>
        <v-card-text>
          <validation-observer
            ref="admin_shop_category_update_validate"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="update_category">
              <validation-provider
                v-slot="{ errors }"
                name="Shop category name"
                rules="required"
              >
                <v-text-field
                  v-model="editForm.name"
                  :error-messages="errors"
                  label="Shop category name"
                  required
                  outlined
                  chips
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Shop category image"
                rules="mimes:image/*|image|size:2048"
              >
                <v-file-input v-model="editForm.image"
                              accept="image/png, image/jpeg"
                              :show-size="true"
                              :error-messages="errors"
                              messages="2MB maximum"
                              placeholder="Pick a category image"
                              :prepend-icon="icons.mdiCamera"
                              label="Pick a category image"
                ></v-file-input>
              </validation-provider>
              <v-card-actions>
                <v-btn @click.prevent="update_category">Add now</v-btn>
              </v-card-actions>
            </form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
    <confirm ref="confirm"/>

  </v-row>
</template>

<script>
import {extend, ValidationObserver, ValidationProvider, setInteractionMode} from 'vee-validate'
import {required, image, mimes, size} from 'vee-validate/dist/rules'
import {mdiCamera, mdiAccountEdit, mdiDelete, mdiArrowUp} from '@mdi/js'
import confirm from "@/components/confirm"
import my_img from "@/components/my_img";
import LoadingPage from "@/components/loading-page";

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
  head() {
    return {
      title: "Shop category"
    }
  },
  components: {
    LoadingPage,
    ValidationProvider,
    ValidationObserver,
    confirm, my_img
  },
  data() {
    return {
      searchCategory: '',
      searchTrashCategory: '',
      openEditModal: false,
      icons: {
        mdiCamera, mdiAccountEdit, mdiDelete, mdiArrowUp
      },
      shop_categories: [],
      trash_shop_categories: [],
      editItem: {},
      form: {
        name: '',
        image: null,
      },
      editForm: {
        name: '',
        image: null,
        index: null,
      }
    }
  },
  async fetch() {
    const data = await this.$axios.get("/api/admin/shop/categories/all")
    if (data.status === 200) {
      this.shop_categories = data.data.shop_categories
      this.trash_shop_categories = data.data.shop_categories_trash
    } else {
      console.log(data.data)
    }
  },
  computed: {
    categoryFilter() {
      if (this.searchCategory !== '') {
        return this.shop_categories.filter((item) => {
          return item.name.toLowerCase().includes(this.searchCategory.toLowerCase())
        })
      } else {
        return this.shop_categories
      }
    },
    trashCategoryFilter() {
      if (this.searchTrashCategory !== '') {
        return this.trash_shop_categories.filter((item) => {
          return item.name.toLowerCase().includes(this.searchTrashCategory.toLowerCase())
        })
      } else {
        return this.trash_shop_categories
      }
    }
  },

  methods: {
    async permanentDelete(id,index){
      if (
        await this.$refs.confirm.open('Want to delete permanently?')
      ) {
        const data = await this.$axios.delete(`/api/admin/shop/category/delete/permanent/${id}`)
        if (data.status === 200){
          this.trash_shop_categories.splice(index,1)
          this.$toast.success("Deleted successfully")
        } else {
          this.$toast.error(`${data.data}`)
        }
      }
    },
    async recoverCategory(id, index) {
      if (
        await this.$refs.confirm.open('Want to recover?')
      ) {
        const data = await this.$axios.put(`/api/admin/shop/category/delete/recover/${id}`)
        if (data.status === 200){
          this.trash_shop_categories[index].deleted_at = null
          this.shop_categories.push(JSON.parse(JSON.stringify(this.trash_shop_categories[index])))
          this.trash_shop_categories.splice(index,1)
          this.$toast.success("Success.")
        }
      }
    },
    async EditInit(id, index) {
      if (Object.keys(this.editItem).length > 0) {
        if (this.editItem.id !== id) {
          const data = await this.$axios.get(`/api/admin/shop/categories/${id}`)
          if (data.status === 200) {
            this.editItem = data.data
            this.editForm.name = data.data.name
            this.editForm.index = index
            this.openEditModal = true
          } else {
            this.$toast.error(data.data)
          }
        } else {
          this.openEditModal = true
        }

      } else {
        const data = await this.$axios.get(`/api/admin/shop/categories/${id}`)
        if (data.status === 200) {
          this.editItem = data.data
          this.editForm.name = data.data.name
          this.editForm.index = index
          this.openEditModal = true
        } else {
          this.$toast.error(data.data)
        }
      }
    },
    async softdelete(id, index) {
      if (
        await this.$refs.confirm.open('Want to delete?')
      ) {
        const data = await this.$axios.delete(`/api/admin/shop/category/delete/soft/${id}`)
        if (data.status === 200) {
          this.trash_shop_categories.push(JSON.parse(JSON.stringify(this.shop_categories[index])))
          this.shop_categories.splice(index, 1)
          this.$toast.success("Success.")
        } else {
          this.$toast.error("Something error. try again")
        }
      }
    },
    async update_category() {
      const check = await this.$refs.admin_shop_category_update_validate.validate()
      if (check) {
        if (
          await this.$refs.confirm.open('Want to update information.')
        ) {
          let myFormData = new FormData()
          if (this.editForm.name.toLowerCase() !== this.editItem.name.toLowerCase()) {
            myFormData.append("name", this.editForm.name)
          }
          if (this.editForm.image !== null) {
            myFormData.append("image", this.editForm.image)
          }
          const data = await this.$axios.put(`/api/admin/shop/category/update/${this.editItem.id}`, myFormData)
          console.log(data)
          if (data.status === 200) {
            this.$toast.success("Successfully updated")
            this.shop_categories[this.editForm.index] = data.data
            // this.shop_categories[this.editForm.index].name = this.editForm.name
          }
        }
      }
    },
    async save_category(e) {
      const check = await this.$refs.admin_shop_category_save_validate.validate()
      if (check) {
        let myFormData = new FormData()
        myFormData.append("image", this.form.image)
        myFormData.append("name", this.form.name)
        let config = {
          header: {
            'Content-Type': 'multipart/form-data'
          }
        }
        const data = await this.$axios.post("/api/admin/shop/category/create", myFormData, config)
        if (data.status === 201) {
          this.shop_categories.push(data.data)
        } else {
          console.log(data)
        }
      }
    }
  },
}
</script>
