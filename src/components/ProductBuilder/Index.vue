<template>
  <v-content>
    <v-row justify="end">
      <v-col cols="4">
        <v-btn block color="primary" :to="{ name: 'ProductBuilderCreate'}">
          <v-icon>mdi-plus-thick</v-icon>Create New Skeleton
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-simple-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in skeletsList" :key="index">
              <td>
                <router-link
                  :to="{ name: 'ProductBuilderUpdate', params: { id: item.id }}"
                >{{item.name}}</router-link>
              </td>
              <td align="right">
                <v-btn
                  text
                  icon
                  color="blue"
                  :to="{ name: 'ProductBuilderUpdate', params: { id: item.id }}"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-btn text icon color="pink" @click="delete_product(item.id)">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("prb_load_all_products");
  },
  methods: {
    delete_product(id){
      this.$store.dispatch('prb_delete_product', parseInt(id))
    }
  },
  computed: {
    skeletsList() {
      return this.$store.getters.prb_all_products_data;
    }
  }
};
</script>