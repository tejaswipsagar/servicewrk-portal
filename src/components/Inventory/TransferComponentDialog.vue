<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent width="400px" :value="dialogTransferComp">
      <Overlay :overlay="overlay" />
      <v-toolbar color="primary" dense dark>
        <v-icon small>{{
          StoreObj.action == "TRANSFER" ? "mdi-plus" : "mdi-pencil"
        }}</v-icon>
        <div class="ml-2 white--text">
          Transfer Component
          <span class="xsmallFontSize">{{ this.StoreObj.component_name }}</span>
        </div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="CloseDialog((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card class="overflow-hidden">
        <v-card-text class="mt-4 pb-0">
          <v-form ref="form">
            <v-radio-group v-model="transferTo" class="font-weight-bold mt-n2">
              <v-row
                ><v-col class="ml-2">
                  <v-radio
                    label="Service Center"
                    value="SERVICE_CENTER"
                  ></v-radio>
                </v-col>
                <v-col>
                  <v-radio
                    label="Representative"
                    value="REPRESENTATIVE"
                  ></v-radio> </v-col
              ></v-row>
            </v-radio-group>
            <v-autocomplete
              v-if="transferTo == 'SERVICE_CENTER'"
              :items="GetAllServiceCentersList"
              item-text="service_center_name"
              item-value="service_center_id"
              outlined
              dense
              :rules="
                this.transferTo == 'SERVICE_CENTER'
                  ? [(v) => !!v || 'Required']
                  : []
              "
              label="Service Center *"
              class="FontSize field_label_size field_height"
              v-model="service_center"
            ></v-autocomplete>
            <v-autocomplete
              dense
              outlined
              class="FontSize"
              item-text="text"
              label="User Type *"
              item-value="value"
              v-model="user_type"
              :items="user_type_items"
              v-if="transferTo == 'REPRESENTATIVE'"
              :rules="
                this.transferTo == 'REPRESENTATIVE'
                  ? [(v) => !!v || 'Required']
                  : []
              "
            >
            </v-autocomplete>
            <v-autocomplete
              dense
              outlined
              class="FontSize"
              item-text="user_name"
              item-value="user_id"
              v-model="dealers_or_service_partners"
              v-if="transferTo == 'REPRESENTATIVE' && user_type != 'ENTERPRISE'"
              :label="
                user_type == 'SERVICE_PARTNER'
                  ? 'Service Partner Name *'
                  : 'Dealer Name *'
              "
              :rules="
                this.transferTo == 'REPRESENTATIVE' &&
                this.user_type != 'ENTERPRISE'
                  ? [(v) => !!v || 'Required']
                  : []
              "
              :items="
                user_type == 'SERVICE_PARTNER'
                  ? GetAllPartnerAndPartnerUserList
                  : user_type == 'DEALER_OWNER'
                  ? GetDealersList
                  : []
              "
            >
            </v-autocomplete>
            <v-autocomplete
              v-if="transferTo == 'REPRESENTATIVE'"
              outlined
              dense
              item-text="user_name"
              item-value="user_id"
              v-model="representative_id"
              :items="
                user_type == 'ENTERPRISE'
                  ? GetAllServiceRepresentativeList
                  : user_type == 'DEALER_OWNER'
                  ? GetDealersListForTicketFilter
                  : user_type == 'SERVICE_PARTNER'
                  ? GetAllPartnerAndPartnerUserListForTicketFilter
                  : []
              "
              label="Representative *"
              :rules="
                this.transferTo == 'REPRESENTATIVE'
                  ? [(v) => !!v || 'Required']
                  : []
              "
              class="FontSize"
            ></v-autocomplete>
            <v-text-field
              outlined
              dense
              label="Component Count *"
              class="FontSize"
              :rules="[(v) => !!v || 'Required']"
              type="number"
              v-model="component_count"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            @click="TransfercomponentMethod()"
            :loading="isLoading"
            class="mr-2 mb-2 white--text"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { TransferComponents } from "@/graphql/mutations.js";
import { GetAllDealers } from "@/mixins/Users/GetAllDealers.js";
import { GetAllPartnerUser } from "@/mixins/Users/GetAllPartnerUser.js";
import { GetAllServiceCenter } from "@/mixins/Locations/GetAllServiceCenter.js";
import { GetAllServiceRepresentative } from "@/mixins/Users/GetAllServiceRepresentative.js";
import { GetAllDealersForTicketFilter } from "@/mixins/Tickets/GetAllDealerUsersForTicketFilter.js";
import { GetAllPartnerUserForTicketFilter } from "@/mixins/Tickets/GetAllParterUsersForTicketFilter.js";
export default {
  mixins: [
    GetAllDealers,
    GetAllPartnerUser,
    GetAllServiceCenter,
    GetAllServiceRepresentative,
    GetAllDealersForTicketFilter,
    GetAllPartnerUserForTicketFilter,
  ],
  props: {
    StoreObj: Object,
    dialogTransferComp: Boolean,
  },
  components: {
    Overlay,
    Snackbar,
  },
  data: () => ({
    overlay: false,
    isLoading: false,
    renderComp: true,
    service_center: "",
    component_count: "",
    representative_id: "",
    user_type: "ENTERPRISE",
    transferTo: "SERVICE_CENTER",
    dealers_or_service_partners: "",
    SnackBarComponent: {},
    GetDealersList: [],
    GetDealersListForTicketFilter: [],
    GetAllPartnerAndPartnerUserList: [],
    GetAllPartnerAndPartnerUserListForTicketFilter: [],
    user_type_items: [
      { text: "ENTERPRISE REPRESENTATIVE", value: "ENTERPRISE" },
      { text: "SERVICE PARTNER", value: "SERVICE_PARTNER" },
      { text: "DEALER", value: "DEALER_OWNER" },
    ],
    GetAllServiceCentersList: [],
    GetAllServiceRepresentativeList: [],
  }),
  mounted() {
    this.GetAllServiceRepresentativeMethod("ACTIVE");
    this.GetAllServiceCentersMethod("ACTIVE");
  },
  watch: {
    dialogTransferComp(val) {
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
    user_type(val) {
      if (val != undefined && val != null && val != "") {
        if (val == "DEALER_OWNER") {
          this.GetDealersMethod("DEALER_OWNER", "ACTIVE");
        } else if (val == "SERVICE_PARTNER") {
          this.GetAllPartnerUserMethod("SERVICE_PARTNER", "ACTIVE");
        }
      }
    },
    dealers_or_service_partners(val) {
      if (this.user_type == "SERVICE_PARTNER") {
        this.GetAllPartnerUserForTicketFilterMethod(
          "PARTNER_REPRESENTATIVE",
          "ACTIVE",
          val
        );
      } else if (this.user_type == "DEALER_OWNER") {
        this.GetDealersMethodForTicketFilter(
          "DEALER_TECHNICIAN",
          "ACTIVE",
          val,
          undefined
        );
      }
    },
  },
  methods: {
    async TransfercomponentMethod() {
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        try {
          var inputParams = {
            updater_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            component_id: this.StoreObj.component_id,
            current_service_center_id: this.StoreObj.service_center_id,
            transfer_to:
              this.transferTo != "SERVICE_CENTER"
                ? this.user_type == "SERVICE_PARTNER"
                  ? "PARTNER_REPRESENTATIVE"
                  : this.user_type == "DEALER_OWNER"
                  ? "DEALER_REPRESENTATIVE"
                  : this.user_type == "ENTERPRISE"
                  ? "REPRESENTATIVE"
                  : this.transferTo
                : this.transferTo,
            new_service_center_id:
              this.transferTo == "SERVICE_CENTER"
                ? this.service_center
                : undefined,
            representative_id:
              this.transferTo == "REPRESENTATIVE"
                ? this.representative_id
                : undefined,
            components_count: this.component_count,
          };
          let result = await API.graphql(
            graphqlOperation(TransferComponents, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(result.data.TransferComponents);
          if (ResultObject.status == "SUCCESS") {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                Top: true,
                SnackbarText: ResultObject.Status_Message,
              };
              this.transferTo = "SERVICE_CENTER";
              this.renderComp = true;
            });
            this.CloseDialog((this.Toggle = 2));
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
      } else if (!this.$refs.form.validate()) {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all the required details",
          };
          this.renderComp = true;
        });
      }
    },
    CloseDialog(Toggle) {
      this.user_type = "ENTERPRISE";
      this.transferTo = "SERVICE_CENTER";
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
