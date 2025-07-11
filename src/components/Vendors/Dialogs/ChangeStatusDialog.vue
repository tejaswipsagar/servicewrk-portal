<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="ChangeStatusDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            {{
              StoreObj.vendor_status === "ACTIVE"
                ? `Deactivate ${StoreObj.vendor_name}`
                : `Activate ${StoreObj.vendor_name}`
            }}
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="ChangeStatusDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          Do you want to
          {{
            StoreObj.vendor_status === "ACTIVE"
              ? `deactivate ${StoreObj.vendor_name}?`
              : `activate ${StoreObj.vendor_name}?`
          }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="btnLoading"
            dense
            color="primary"
            @click="ChangeStatusMethod()"
            >{{
              StoreObj.vendor_status === "ACTIVE" ? "Deactivate" : "Activate"
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { UpdateVendorDetails } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";

export default {
  props: { ChangeStatusDialog: Boolean, StoreObj: Object },
  components: {
    Snackbar,
  },
  data: () => ({
    btnLoader: false,
    SnackBarComponent: {},
    btnLoading: false,
  }),

  methods: {
    async ChangeStatusMethod() {
      this.btnLoader = true;
      try {
        const result = await API.graphql(
          graphqlOperation(UpdateVendorDetails, {
            input: {
              updater_user_id:
                this.$store.getters.get_current_user_details.user_id,
              vendor_id: this.StoreObj.vendor_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              action:
                this.StoreObj.vendor_status === "ACTIVE"
                  ? "DEACTIVATE"
                  : "ACTIVATE",
            },
          })
        );
        const response = JSON.parse(result.data.UpdateVendorDetails);
        if (response.status === "SUCCESS") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "Updated Successfully",
          };
          this.ChangeStatusDialogEmit(2);
          this.btnLoader = false;
        }
      } catch (error) {
        this.btnLoader = false;
        console.log("Error", error);
      }
    },
    ChangeStatusDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
