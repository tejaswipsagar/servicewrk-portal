<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="shareToCustomerDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div v-if="StoreObj.action_type === 'SHARE_CUSTOMER'">
            Share Purchase ID ({{ StoreObj.purchase_order_display_id }}) to
            Customer
          </div>
          <div v-else>Update Shared Details</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="shareToCustomerDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <v-form ref="form" v-if="StoreObj.action_type === 'SHARE_CUSTOMER'">
            <v-text-field
              class="FontSize"
              v-model="vendorEmailId"
              dense
              outlined
              label="Vendor Email ID"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>
          </v-form>
          <v-form
            ref="form2"
            v-if="StoreObj.action_type === 'UPDATE_SEND_DETAILS'"
          >
            <v-select
              dense
              outlined
              v-model="sharedType"
              label="Shared By *"
              :items="sharedTypeItems"
              :rules="[(v) => !!v || 'Required']"
            ></v-select>
          </v-form>
          <v-text-field
            class="FontSize"
            v-model="comments"
            dense
            outlined
            label="Comments"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="btnLoading"
            @click="ShareCustomerMethod()"
            color="primary"
            >Share<v-icon size="15" class="pl-1">mdi-share</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { SharePurchaseOrderToVendor } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: { shareToCustomerDialog: Boolean, StoreObj: Object },
  components: { Snackbar },
  data: () => ({
    renderComp: true,
    btnLoading: false,
    vendorEmailId: "",
    comments: "",
    SnackBarComponent: {},
    sharedType: "",
    sharedTypeItems: ["EMAIL", "WHATSAPP"],
  }),
  watch: {
    shareToCustomerDialog(val) {
      if (val) {
        this.vendorEmailId = this.StoreObj.vendor_email_id;
      }
    },
  },
  methods: {
    async ShareCustomerMethod() {
      const useForm =
        this.StoreObj.action_type === "UPDATE_SEND_DETAILS"
          ? this.$refs.form2.validate()
          : this.$refs.form.validate();
      if (useForm) {
        try {
          this.btnLoading = true;
          const result = await API.graphql(
            graphqlOperation(SharePurchaseOrderToVendor, {
              input: {
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                user_id: this.$store.getters.get_current_user_details.user_id,
                purchase_order_id: this.StoreObj.purchase_order_id,
                vendor_email_id:
                  this.StoreObj.action_type === "UPDATE_SEND_DETAILS"
                    ? undefined
                    : this.vendorEmailId,
                comments: this.comments,
                shared_through:
                  this.StoreObj.action_type === "UPDATE_SEND_DETAILS"
                    ? this.sharedType
                    : undefined,
                is_shared_from_our_system:
                  this.StoreObj.action_type === "UPDATE_SEND_DETAILS"
                    ? false
                    : true,
              },
            })
          );
          const response = JSON.parse(result.data.SharePurchaseOrderToVendor);
          if (response.status === "SUCCESS") {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.Status_Message,
            };
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
            this.btnLoading = false;
            this.shareToCustomerDialogEmit(2);
          }
        } catch (error) {
          this.btnLoading = false;
          console.log("Error", error);
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Kindly provide vendor email!",
        };
      }
    },
    shareToCustomerDialogEmit(Toggle) {
      this.comments = "";
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
