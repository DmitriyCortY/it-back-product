<template>
  <v-content>
    <v-container>
      <router-view></router-view>
    </v-container>
  </v-content>
</template>
<script>
// export default {
//   components: {}
// };
export default {
    data(){
        return {

        }
    },
    created(){
        // eslint-disable-next-line no-undef
        this.$store.dispatch('prb_load_product_data_by_id', _THIS_PRODUCT_ID_)
    },
    methods: {

    },
    computed: {
        product_data(){
            return this.$store.getters.prb_product_data_by_id
        }
    }
}
</script>