<template>
  <v-content v-if="productData.length > 0">
    <UpdateForm
      :_name="productData[0].name"
      :_weight="productData[0].weight"
      :imageFront="productData[0].image_front"
      :imageBack="productData[0].image_back"
      @resolve="onResolve"
    ></UpdateForm>
    <!--  -->
    <PointConfigurator
      :width="400"
      :id="id"
      :urlFrontImage="productData[0].image_front"
      :urlBackImage="productData[0].image_back"
      :related="'product'"
    ></PointConfigurator>
  </v-content>
</template>

<script>
import PointConfigurator from "@/components/PointConfigurator/Index.vue";
import UpdateForm from "@/components/ProductBuilder/UpdateForm.vue";
export default {
  components: {
    PointConfigurator,
    UpdateForm
  },
  data() {
    return {
      // eslint-disable-next-line no-undef
      id: _THIS_PRODUCT_ID_
    };
  },
  destroyed() {
    this.$store.dispatch("prb_clear_all_data");
  },
  created() {
    this.$store.dispatch(
      "prb_load_product_data_by_id",
      parseInt(this.id)
    );
  },
  methods: {
    onResolve(data) {
      this.name = data.name;
      this.weight = data.weight;
      //
      this.saveSkeleton();
    },
    saveSkeleton() {
      const data = {
        id: parseInt(this.productData[0].id),
        name: this.name,
        weight: this.weight
      };
      this.$store.dispatch("prb_update_product", data);
    }
  },
  computed: {
    productData() {
      return this.$store.getters.prb_product_data_by_id;
    }
  }
};
</script>