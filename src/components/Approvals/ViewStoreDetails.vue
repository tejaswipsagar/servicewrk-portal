<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="DialogStoreDetails" width="500" persistent>
      <v-card>
        <v-toolbar dense dark color="primary">
          <div class="ml-2 white--text">From Store</div>
          <v-spacer />
          <v-btn icon @click="DialogStoreDetailsEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-form ref="form">
            <v-row no-gutters v-if="work_flow_status == 'PENDING'">
              <v-col cols="12" md="8" sm="12" xs="12">
                <v-select
                  dense
                  outlined
                  return-object
                  class="FontSize mr-1"
                  label="Store Name"
                  v-model="store_name"
                  :no-data-text="noDataText"
                  item-text="service_center_name"
                  :items="GetStoreNamesAndCompCountList"
                  :rules="[(v) => !!v || 'Required']"
                ></v-select>
                <div
                  class="FontSize mt-n6 ml-1 black--text"
                  v-if="store_name != '' && store_name != undefined"
                >
                  Available : {{ this.availableQtyAtSelectedStore }}
                </div>
              </v-col>
              <v-col cols="12" md="3" xs="12" sm="12">
                <v-text-field
                  dense
                  outlined
                  type="number"
                  label="Quantity"
                  class="FontSize mr-1"
                  v-model="store_qty"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="1" sm="12" xs="12">
                <v-btn small class="primary white--text mt-1" @click="addData()"
                  >Add</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
          <div>
            <v-data-table
              dense
              hide-default-footer
              :items="approve_service_center_details"
              :headers="
                work_flow_status != 'PENDING'
                  ? service_center_table_headers.filter(
                      (item) => item.value != 'actions'
                    )
                  : service_center_table_headers
              "
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon
                  small
                  v-if="work_flow_status == 'PENDING'"
                  color="red"
                  class="mr-2"
                  @click="
                    approve_service_center_details.splice(
                      approve_service_center_details.indexOf(item),
                      1
                    )
                  "
                  >mdi-delete</v-icon
                >
              </template>
            </v-data-table>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            v-if="work_flow_status == 'PENDING'"
            @click="approveFromStoreMethod()"
            class="primary white--text mb-4 mt-n4 mr-4"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetStoreNamesAndCompCount } from "@/mixins/Approvals/CompCountAtRepAndStore.js";
export default {
  props: {
    StoreObj: Object,
    work_flow_status: String,
    DialogStoreDetails: Boolean,
    StoreObjOfCompDetails: Object,
  },
  mixins: [GetStoreNamesAndCompCount],
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    store_id: "",
    store_qty: "",
    store_name: "",
    noDataText: "",
    availableQtyAtSelectedStore: "",
    renderComp: true,
    SnackBarComponent: {},
    approve_service_center_details: [],
    GetStoreNamesAndCompCountList: [],
    service_center_table_headers: [
      { text: "Store", value: "service_center_name" },
      { text: "Qty", value: "approved_component_quantity" },
      { text: "Delete", value: "actions" },
    ],
  }),
  watch: {
    DialogStoreDetails(val) {
      if (val == true) {
        if (this.StoreObjOfCompDetails != undefined) {
          if (
            this.StoreObjOfCompDetails.approve_service_center_details !=
              undefined &&
            this.StoreObjOfCompDetails.approve_service_center_details.length !=
              0
          ) {
            this.approve_service_center_details =
              this.StoreObjOfCompDetails.approve_service_center_details;
          } else {
            this.approve_service_center_details = [];
          }
        }
        if (this.work_flow_status == "PENDING") {
          this.GetStoreNamesAndCompCountMethod(
            this.StoreObjOfCompDetails.component_id,
            undefined
          );
        }
        if (
          this.StoreObjOfCompDetails.approve_service_center_details !=
            undefined &&
          this.StoreObjOfCompDetails.approve_service_center_details.length !=
            0 &&
          this.StoreObjOfCompDetails.approve_service_center_details != []
        ) {
          this.approve_service_center_details =
            this.StoreObjOfCompDetails.approve_service_center_details;
        }
      }
    },
    store_name(val) {
      if (val != "" && val != undefined && val != null) {
        this.availableQtyAtSelectedStore = val.components_in_stock;
      }
    },
  },
  methods: {
    addData() {
      if (
        this.store_qty != "" &&
        this.store_qty != undefined &&
        this.store_qty != null &&
        this.store_name != undefined &&
        this.store_name != ""
      ) {
        if (this.$refs.form.validate()) {
          let storeNamesObj = {
            approved_component_quantity: parseInt(this.store_qty),
            service_center_id: this.store_name.service_center_id,
            service_center_name: this.store_name.service_center_name,
          };
          this.approve_service_center_details.push(storeNamesObj);
          this.StoreObjOfCompDetails.approve_service_center_details =
            this.approve_service_center_details;
          this.$refs.form.reset();
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Select altealst One Store with Quantity..!",
          };
          this.renderComp = true;
        });
      }
    },
    DialogStoreDetailsEmit(Toggle) {
      this.availableQtyAtSelectedStore = "";
      this.$emit("clicked", Toggle, this.StoreObjOfCompDetails);
    },
    approveFromStoreMethod() {
      if (
        (this.approve_service_center_details != undefined &&
          this.approve_service_center_details.length != 0 &&
          this.approve_service_center_details != []) ||
        (this.StoreObjOfCompDetails.store_approve_count != undefined &&
          this.StoreObjOfCompDetails.store_approve_count != 0)
      ) {
        this.StoreObjOfCompDetails.approve_service_center_details =
          this.approve_service_center_details;
        this.approve_service_center_details = [];
        this.approve_service_center_details = [];
        this.DialogStoreDetailsEmit(
          (this.Toggle = 2),
          this.StoreObjOfCompDetails
        );
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Select altealst One Store with Quantity..!",
          };
          this.renderComp = true;
        });
      }
    },
  },
};
</script>

<style></style>
