<template>
  <v-dialog v-model="dialogNew" persistent width="560">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>Anchorpoint Setting</v-card-title>
      <!--  -->
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <big>Coordination of point</big>
          </v-col>
          <!--  -->
          <v-col cols="6" align="right">
            <big>X: {{parseInt(currentMousePos.x * parseFloat(radio.front))}} | Y: {{parseInt(currentMousePos.y * parseFloat(radio.front))}}</big>
          </v-col>
          <!--  -->
          <v-col cols="12">
            <v-text-field
              label="Name ancherpoint"
              v-model="name"
              :error-messages="nameErrors"
              required
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
            ></v-text-field>
          </v-col>
          <!--  -->
          <v-col cols="12">
            <v-select
              :clearable="true"
              v-if="currentSide === 'back'"
              :items="relatedFrontPoint"
              item-text="name"
              item-value="id"
              v-model="relatedPoint"
              @change="get_related_date"
              label="Select realeted point on other side"
            ></v-select>
          </v-col>
          
          <!--  -->
          <v-col cols="12" v-if="!relatedPoint">
            <big>Select a type of anchorpoiont</big>
            <v-radio-group
              :disabled="relatedPoint != null"
              v-model="selectedType"
              :error-messages="selectedTypeErrors"
              required
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
            >
              <v-radio
                @change="null_type"
                v-for="(item, index) in dialogOpps.types"
                :key="index"
                :label="item"
                :value="item"
              ></v-radio>
            </v-radio-group>
          </v-col>
          <!--  -->
          <v-col cols="12" v-if="!relatedPoint">
            <v-select
              :disabled="relatedPoint != null"
              :items="all_classes"
              v-model="selectedClass"
              :error-messages="selectedClassErrors"
              required
              item-text="name"
              item-value="id"
              :multiple="selectedType==='Plus'"
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
              label="Select class of anchorpoint"
            ></v-select>
          </v-col>
          <!--  -->
          <v-col cols="12">
            <v-textarea v-model="hint" label="Enter hint for anchorpoint (if needed)"></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <!--  -->
      <v-divider></v-divider>
      <!--  -->
      <v-card-actions>
        <v-col cols="6" align="right">
          <v-btn color="red" text block @click="cancelDialog">Cancel</v-btn>
        </v-col>
        <v-col cols="6" align="right">
          <v-btn color="primary" block @click="saveDialog">Done</v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  props: [
    "dialogNew",
    "dialogOpps",
    "relatedFrontPoint",
    "currentSide",
    "currentMousePos",
    "all_classes",
    "radio"
  ],

  validations: {
    name: { required },
    selectedClass: { required },
    selectedType: { required }
  },
  data() {
    return {
      name: null,
      selectedClass: [],
      selectedType: null,
      hint: null,
      relatedPoint: null
    };
  },
  created() {},
  methods: {
    cancelDialog() {
      this.name = null;
      this.selectedClass = [];
      this.selectedType = null;
      this.hint = null;
      this.relatedPoint = null;

      this.$emit("cancelDialog");
    },
    saveDialog() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const data = {
          name: this.name,
          class: this.selectedClass,
          type: this.selectedType,
          hint: this.hint,
          relatedPoint: this.relatedPoint
        };
        this.$emit("saveNewDialog", data);
        //
        this.cancelDialog();
      }
    },
    null_type(){
      this.selectedClass = []
    },
    get_related_date(){
      if(this.relatedPoint != null){
        let data = this.relatedFrontPoint.filter(item => parseInt(item.id) === parseInt(this.relatedPoint))[0]
        this.selectedClass = data.class
        this.selectedType = data.type
      }
    }
  },
  computed: {
    // валидация форм
    //
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    selectedClassErrors() {
      const errors = [];
      if (!this.$v.selectedClass.$dirty) return errors;
      !this.$v.selectedClass.required && errors.push("Class is required.");
      return errors;
    },
    selectedTypeErrors() {
      const errors = [];
      if (!this.$v.selectedType.$dirty) return errors;
      !this.$v.selectedType.required && errors.push("Type is required.");
      return errors;
    }
  }
};
</script>