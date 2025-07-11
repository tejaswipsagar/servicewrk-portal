<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent width="400px" :value="dialogProcureComp">
      <v-toolbar color="primary" dense dark>
        <v-icon small>{{
          StoreObj.action == "PROCURE" ? "mdi-plus" : "mdi-pencil"
        }}</v-icon>
        <div class="ml-2 white--text">
          Procure Component
          {{ StoreObj.component_name }}
        </div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="dialogProcureCompEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card class="overflow-hidden">
        <v-card-text class="mt-4 pb-0">
          <v-form ref="form">
            <v-autocomplete
              dense
              outlined
              class="FontSize"
              v-model="service_center"
              label="Service Center *"
              item-value="service_center_id"
              item-text="service_center_name"
              :items="GetAllServiceCentersList"
              :rules="[(v) => !!v || 'Required']"
            ></v-autocomplete>
            <v-text-field
              dense
              outlined
              type="number"
              class="FontSize"
              label="Component Count *"
              :rules="[(v) => !!v || 'Required']"
              v-model="component_count"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            :loading="isLoading"
            class="mr-2 mb-2 white--text"
            @click="procurecomponentMethod()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { IncrementComponentsCount } from "@/graphql/mutations.js";
import { GetAllServiceCenter } from "@/mixins/Locations/GetAllServiceCenter.js";
export default {
  mixins: [GetAllServiceCenter],
  props: {
    StoreObj: Object,
    dialogProcureComp: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    isLoading: false,
    renderComp: true,
    service_center: "",
    component_count: "",
    SnackBarComponent: {},
    GetAllServiceCentersList: [],
  }),
  mounted() {
    this.GetAllServiceCentersMethod('ACTIVE');
  },
  watch: {
    dialogProcureComp(val) {
      if (val == true) {
        if (this.StoreObj.action == "EDIT") {
          this.component_name = this.StoreObj.component_name;
          this.component_description = this.StoreObj.component_description;
          this.component_product_code = this.StoreObj.component_product_code;
          this.unit_of_measure = this.StoreObj.unit_of_measure;
        }
      } else {
        if (this.$refs.form != undefined) {
          this.$refs.form.reset();
        }
      }
    },
  },
  methods: {
    async procurecomponentMethod() {
      this.isLoading = true;
      try {
        var inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          component_id: this.StoreObj.component_id,
          service_center_id: this.service_center,
          components_count: this.component_count,
        };
        let result = await API.graphql(
          graphqlOperation(IncrementComponentsCount, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.IncrementComponentsCount);
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.renderComp = true;
          });
          this.dialogProcureCompEmit((this.Toggle = 2));
        }
        this.isLoading = false;
      } catch (error) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.renderComp = true;
        });
        this.isLoading = false;
      }
    },
    dialogProcureCompEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
