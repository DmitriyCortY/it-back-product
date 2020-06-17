<template>
  <v-content>
    <CreateForm @resolve="onResolve" @reject="onReject"></CreateForm>
    <!--  -->
    <PointConfigurator
      v-if="formValid && prb_create_product.id"
      :width="400"
      :id="parseInt(prb_create_product.id)"
      :urlFrontImage="imageFrontSrc"
      :urlBackImage="imageBackSrc"
      :related="'product'"
    ></PointConfigurator>
  </v-content>
</template>

<script>
import CreateForm from "@/components/ProductBuilder/CreateForm.vue";
import PointConfigurator from "@/components/PointConfigurator/Index.vue";
export default {
  components: {
    CreateForm,
    PointConfigurator
  },
  data() {
    return {
      formValid: false,
      name: null,
      weight: null,
      imageFront: null,
      imageBack: null
    };
  },
  destroyed() {
    this.$store.dispatch("prb_clear_all_data");
  },
  created() {},
  mounted() {},
  methods: {
    onResolve({ isValid, data }) {
      this.name = data.name;
      this.weight = data.weight;
      this.imageFront = data.imageFront;
      this.imageBack = data.imageBack;
      //
      this.formValid = isValid;
      this.savePart();
    },
    onReject({ isValid }) {
      this.formValid = isValid;
    },
    savePart() {
      if (this.prb_create_product.id === undefined) {
        const data = {
          name: this.name,
          weight: this.weight,
          image_front: this.imageFront,
          image_back: this.imageBack
        };
        this.$store.dispatch("prb_create_product", data);
      } else  {
        const data = {
          id: parseInt(this.prb_create_product.id),
          name: this.name,
          weight: this.weight
        };
        this.$store.dispatch("prb_update_product", data);
      }
    }
  },
  computed: {
    imageFrontSrc() {
      return URL.createObjectURL(this.imageFront);
    },
    imageBackSrc() {
      return URL.createObjectURL(this.imageBack);
    },
    prb_create_product() {
      return this.$store.getters.prb_create_product;
    }
  }
};
</script>