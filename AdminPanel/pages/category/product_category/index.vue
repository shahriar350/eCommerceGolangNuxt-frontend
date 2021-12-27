<template>
  <div>
    <div class="d-flex justify-space-between align-center">
      <v-card-title>Shop category</v-card-title>
      <v-btn @click="openDialog">Create new</v-btn>
    </div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search_shop_category"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="categories"
        class="elevation-1"
        :search="search_shop_category"
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
            {{ icons.mdiDeleteCircle }}
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <div class="mt-3">
      <v-card>
        <v-card-title>Category trashes</v-card-title>
        <v-card-title>
          <v-text-field
            v-model="search_deleted_shop_category"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="deletedHeaders"
          :items="deletedCategories"
          class="elevation-1"
          :search="search_deleted_shop_category"
        >
          <template v-slot:item.actions="{ item,index }">
            <v-icon
              small
              class="mr-2"
              @click="recoverItem(item,index)"
            >
              {{ icons.mdiArrowUp }}
            </v-icon>
            <v-icon
              small
              color="red"
              @click="permanentDeleteItem(item)"
            >
              {{ icons.mdiDelete }}
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <v-dialog max-width="600" v-model="openCreateDialog" v-if="openCreateDialog">
      <v-card>
        <v-card-title>Create a category</v-card-title>
        <v-card-text>
          <form @submit.prevent="createCategory">
            <validation-observer ref="create_category_observer" v-slot="{ invalid }">

              <validation-provider
                v-slot="{ errors }"
                name="Category name"
                rules="required"
              >
                <v-text-field
                  v-model="form.name"
                  :error-messages="errors"
                  label="Category name"
                  required
                  outlined
                  chips
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Shop category"
                rules="required"
              >
                <v-autocomplete
                  v-model="form.shop_category_id"
                  :error-messages="errors"
                  :items="shopCategories" item-text="name" item-value="id" clearable solo
                  label="Select a shop category." placeholder="Select one"
                  no-data-text="No data can be found"
                >
                </v-autocomplete>
              </validation-provider>
              <v-autocomplete
                v-model="form.parent_id"
                :items="categories" item-text="name" item-value="id" clearable solo
                label="Select a parent category." placeholder="Select one"
                no-data-text="No data can be found"
              >
              </v-autocomplete>
              <v-btn type="submit">Add category</v-btn>

            </validation-observer>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="600" v-model="openEditDialog" v-if="openEditDialog">
      <v-card>
        <v-card-title>Update a {{ editForm.name| capfirst }}</v-card-title>
        <v-card-text>
          <validation-observer ref="edit_category_observer" v-slot="{ invalid }">
            <form>
              <validation-provider
                v-slot="{ errors }"
                name="Category name"
                rules="required"
              >
                <v-text-field
                  v-model="editForm.name"
                  :error-messages="errors"
                  label="Category name"
                  required
                  outlined
                  chips
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Shop category"
                rules="required"
              >
                <v-autocomplete auto-select-first
                                v-model="editForm.shop_category_id"
                                :error-messages="errors"
                                :items="shopCategories" item-text="name" item-value="id" clearable solo
                                label="Select a shop category." placeholder="Select one"
                                no-data-text="No data can be found"
                >
                </v-autocomplete>
              </validation-provider>
              <v-autocomplete auto-select-first
                              v-model="editForm.parent_id"
                              :items="categories" item-text="name" item-value="id" clearable solo
                              label="Select a parent category." placeholder="Select one"
                              no-data-text="No data can be found"
              >
              </v-autocomplete>
              <v-btn @click="updateCategory">Add category</v-btn>
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
import {mdiCamera, mdiAccountEdit, mdiDelete, mdiArrowUp, mdiDeleteCircle} from '@mdi/js'
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
      title: "Product category"
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
      search_shop_category: '',
      search_deleted_shop_category: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        {text: 'Name', value: 'name'},
        {text: 'ShopCategory name', value: 'shop_category.name', sortable: true,},
        {text: 'Parent ID', value: 'parent.id', sortable: true,},
        {text: 'Parent name', value: 'parent.name'},
        {text: 'Actions', value: 'actions', sortable: false},

      ],
      deletedHeaders: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        {text: 'Name', value: 'name'},
        {text: 'ShopCategory name', value: 'shop_category.name', sortable: true,},
        {text: 'Parent ID', value: 'parent.id', sortable: true,},
        {text: 'Parent name', value: 'parent.name'},
        {text: 'Actions', value: 'actions', sortable: false},

      ],
      openCreateDialog: false,
      openEditDialog: false,
      shopCategories: [],
      deletedCategories: [],
      categories: [],
      icons: {
        mdiCamera, mdiAccountEdit, mdiDelete, mdiArrowUp, mdiDeleteCircle
      },
      form: {
        name: '',
        shop_category_id: null,
        parent_id: null,
      },
      editForm: {
        id: '',
        name: '',
        shop_category_id: null,
        parent_id: null,
        index: null,
      },

    }
  },
  async fetch() {
    const data = await this.$axios.get("/api/admin/categories")
    if (data.status === 200) {
      this.categories = data.data
    }
  },
  mounted() {
    this.GetDeletedCategory()
  },
  methods: {
    async editItem(item, index) {
      if (this.shopCategories.length < 1) {
        await this.getActiveShopCategories()
      }
      if (this.categories.length < 1) {
        await this.getCategories()
      }
      this.editForm.id = item.id
      this.editForm.name = item.name
      this.editForm.index = index
      this.editForm.shop_category_id = item.shop_category_id
      this.editForm.parent_id = item.parent_id
      this.openEditDialog = true
    },
    async updateCategory() {
      const check = await this.$refs.edit_category_observer.validate()

      if (check) {
        const data = await this.$axios.put(`/api/admin/category/update/${this.editForm.id}`, {
          "name": this.editForm.name,
          "shop_category_id": this.editForm.shop_category_id,
          "parent_id": this.editForm.parent_id,
        })
        if (data.status === 200) {
          this.categories.splice(this.editForm.index, 1, data.data)
          // this.categories[this.editForm.index] = data.data
          this.editForm = {
            id: '',
            name: '',
            shop_category_id: null,
            parent_id: null,
            index: null,
          }
          this.$refs.edit_category_observer.reset()
          this.$toast.success("Successfully updated.")
        }
      }
    },
    async deleteItem(item, index) {
      if (
        await this.$refs.confirm.open('Want to delete?')
      ) {
        const data = await this.$axios.delete(`/api/admin/category/delete/soft/${item.id}`)
        if (data.status === 200) {
          this.deletedCategories.push(JSON.parse(JSON.stringify(this.categories[index])))
          this.categories.splice(index, 1)
          this.$toast.success("Deleted successfully.")
        }
      }
    },
    async permanentDeleteItem(item, index) {
      if (
        await this.$refs.confirm.open('Want to delete permanently?')
      ) {
        const data = await this.$axios.delete(`/api/admin/category/delete/permanent/${item.id}`)
        if (data.status === 200) {
          this.deletedCategories.splice(index, 1)
          this.$toast.success("Deleted permanently successfully.")
        }
      }
    },
    async recoverItem(item, index) {
      if (
        await this.$refs.confirm.open('Want to recover?')
      ) {
        const data = await this.$axios.put(`/api/admin/category/delete/recover/${item.id}`)
        if (data.status === 200) {
          this.categories.push(JSON.parse(JSON.stringify(this.deletedCategories[index])))
          this.deletedCategories.splice(index, 1)
          this.$toast.success("Restored successfully.")
        }
      }
    },
    async GetDeletedCategory() {
      const data = await this.$axios.get('/api/admin/categories/deleted')
      if (data.status === 200) {
        this.deletedCategories = data.data
      }
    },
    async createCategory() {
      const check = await this.$refs.create_category_observer.validate()

      if (check) {
        const data = await this.$axios.post("/api/admin/category/create", this.form)
        if (data.status === 201) {
          this.categories.push(data.data)
          this.form.name = ''
          await this.$refs.create_category_observer.reset()
          this.$toast.success("Successfully created.")
        }
      } else {
        this.$toast.error(`${check}`)
      }
    },
    async getActiveShopCategories() {
      const data = await this.$axios.get('/api/admin/shop/categories/active')
      if (data.status === 200) {
        this.shopCategories = data.data
      }
    },
    async getCategories() {
      const data = await this.$axios.get('/api/admin/categories')
      if (data.status === 200) {
        this.categories = data.data
      }
    },
    async openDialog() {
      if (this.shopCategories.length < 1) {
        await this.getActiveShopCategories()
      }
      if (this.categories.length < 1) {
        await this.getCategories()
      }
      this.openCreateDialog = true
    },

  },

}
</script>

<style scoped>

</style>
