<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="dialogActivateInactivateVendorDialog"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{
              ActionObj.tagged_product_status == "ACTIVE"
                ? "mdi-close"
                : "mdi-check"
            }}</v-icon
            ><span>{{
              ActionObj.tagged_product_status == "ACTIVE" ? "Untag " : "Tag "
            }}</span>
            <span
              >(
              {{
                ActionObj.tagged_type === "COMPONENT"
                  ? ActionObj.component_name
                  : ActionObj.product_name
              }}
              )</span
            >
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="ActivateInactivateVendorComponentEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon
            size="50px"
            :color="
              ActionObj.tagged_product_status == 'ACTIVE' ? 'red' : 'green'
            "
            >{{
              ActionObj.tagged_product_status == "ACTIVE"
                ? "mdi-close"
                : "mdi-check"
            }}</v-icon
          >
          <div>
            Are you sure you want to
            <span
              v-text="
                ActionObj.tagged_product_status == 'ACTIVE' ? 'Untag' : 'Tag'
              "
            ></span>
            <span class="font-weight-bold ml-2">{{
              ActionObj.tagged_type == "COMPONENT"
                ? ActionObj.component_name
                : ActionObj.product_name
            }}</span>
            ?
          </div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2 text-capitalize"
            color="primary"
            :loading="loading"
            @click="activateInactivateMethod()"
            ><span
              v-text="
                ActionObj.tagged_product_status == 'ACTIVE' ? 'Untag' : 'Tag'
              "
            ></span
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { ActivateOrDeactivateTaggedProductOrComponentOfVendor } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    ActionObj: Object,
    dialogActivateInactivateVendorDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: true,
    SnackBarComponent: {},
  }),
  methods: {
    async activateInactivateMethod() {
      try {
        var inputParams = {
          tagged_id: this.ActionObj.tagged_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          action_type:
            this.ActionObj.tagged_product_status == "ACTIVE"
              ? "DEACTIVATE"
              : "ACTIVATE",
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(
            ActivateOrDeactivateTaggedProductOrComponentOfVendor,
            {
              input: inputParams,
            }
          )
        );
        var ResultObject = JSON.parse(
          result.data.ActivateOrDeactivateTaggedProductOrComponentOfVendor
        );
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.status_message,
            };
            this.renderComp = true;
          });
          this.ActivateInactivateVendorComponentEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
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
      }
    },
    ActivateInactivateVendorComponentEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
