<template>
  <v-app style="max-width: 1170px; margin: auto;">
     <v-container>
      <ProductBuilder></ProductBuilder>
    </v-container>

    <notifications group="foo" />
  </v-app>
</template>

<script>
import ProductBuilder from '@/views/ProductBuilder'
export default {
  components: {
    ProductBuilder
  },
  data(){
    return { }
  },
  updated(){
  }
};
</script>
