<template>
  <ClientOnly>
    <!-- Use the component in the right place of the template -->
    <tiptap-vuetify @keydown="passEvent" v-model="content" :extensions="extensions"/>

    <template #placeholder>
      Loading...
    </template>
  </ClientOnly>
</template>

<script>
// import the component and the necessary extensions
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Table ,
  TableRow  ,
  TableCell   ,
  TableHeader   ,
  Strike,
  Underline,
  Code,
  Image,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
} from 'tiptap-vuetify'

export default {
  name: 'editor',
  // specify TiptapVuetify component in "components"
  components: { TiptapVuetify },
  data: () => ({
    // declare extensions you want to use
    extensions: [
      History,
      Blockquote,
      Link,
      Underline,
      Strike,
      Table,
      TableRow ,
      TableCell  ,
      TableHeader  ,
      Italic,
      Image,
      ListItem,
      BulletList,
      OrderedList,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3]
          }
        }
      ],
      Bold,
      Link,
      Code,
      HorizontalRule,
      Paragraph,
      HardBreak,

    ],
    // starting editor's content
    content: ``,
  }),
  methods: {
    passEvent(){
      console.log('asf')
      this.$emit("changeHtml",this.content)
    }
  }
}
</script>
<style scoped>
.ProseMirror{
  min-height: 150px !important;
}
</style>
