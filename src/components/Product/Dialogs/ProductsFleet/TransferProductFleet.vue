<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="TransferProductFleetDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-share</v-icon>
            Transfer Product Fleet
            <span>{{ StoreObj.setting_name }}</span>
          </div>
          <v-spacer />
          <v-btn icon @click="TransferProductFleetDialogEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <div v-if="StoreObj.action != 'TRANSFER_PRODUCT_FLEET_FROM_USERS'">
              <div
                class="text-center mt-2"
                v-if="StoreObj.representative_name != undefined"
              >
                <span class="font-weight-bold green--text"
                  >Transferred to : {{ StoreObj.representative_name }}</span
                >
              </div>
            </div>
            <div
              class="text-center mt-2"
              v-if="StoreObj.service_center_name != undefined"
            >
              <span class="font-weight-bold green--text"
                >Transferred to : {{ StoreObj.service_center_name }}</span
              >
            </div>
            <v-radio-group
              v-model="transferTo"
              class="font-weight-bold mt-nt"
              v-if="StoreObj.action != 'TRANSFER_PRODUCT_FLEET_FROM_USERS'"
            >
              <v-row>
                <v-col class="ml-2">
                  <v-radio label="Service Center" value="SERVICE_CENTER">
                  </v-radio>
                </v-col>
                <v-col class="ml-2">
                  <v-radio label="Representative" value="REPRESENTATIVE">
                  </v-radio>
                </v-col>
              </v-row>
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
              class="FontSize field_label_size field_height mt-4"
              v-model="service_center"
            ></v-autocomplete>
            <v-select
              v-if="transferTo == 'REPRESENTATIVE'"
              label="Representative *"
              outlined
              dense
              :rules="
                this.transferTo == 'REPRESENTATIVE'
                  ? [(v) => !!v || 'Required']
                  : []
              "
              v-model="new_representative_id"
              class="FontSize"
              :items="
                this.GetAllServiceRepresentativeList.filter(
                  (item) => item.user_name != 'ALL'
                )
              "
              item-text="user_name"
              item-value="user_id"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            class="primary mb-4 mt-n3 mr-2"
            :loading="isLoading"
            @click="TransferProductFleetMethod()"
          >
            <v-icon small>mdi-share</v-icon>
            Transfer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { TransferProductFleet } from "@/graphql/mutations.js";
import { GetAllServiceCenter } from "@/mixins/Locations/GetAllServiceCenter.js";
import { GetAllServiceRepresentative } from "@/mixins/Users/GetAllServiceRepresentative.js";
export default {
  props: {
    StoreObj: Object,
    TransferProductFleetDialog: Boolean,
  },
  mixins: [GetAllServiceCenter, GetAllServiceRepresentative],
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: true,
    isLoading: false,
    service_center: "",
    new_representative_id: "",
    transferTo: "SERVICE_CENTER",
    SnackBarComponent: {},
    GetAllServiceCentersList: [],
    GetAllServiceRepresentativeList: [],
  }),
  mounted() {
    this.GetAllServiceCentersMethod("ACTIVE");
    this.GetAllServiceRepresentativeMethod("ACTIVE");
  },
  methods: {
    async TransferProductFleetMethod() {
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        try {
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            creator_user_id:
              this.$store.getters.get_current_user_details.user_id,
            setting_id: this.StoreObj.setting_id,
            transfer_to: this.transferTo,
            service_center_id:
              this.transferTo == "SERVICE_CENTER"
                ? this.service_center
                : undefined,
            new_representative_id:
              this.transferTo == "REPRESENTATIVE"
                ? this.new_representative_id
                : undefined,
          };
          let result = await API.graphql(
            graphqlOperation(TransferProductFleet, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(result.data.TransferProductFleet);
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
            this.TransferProductFleetDialogEmit((this.Toggle = 2));
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
      } else {
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
    TransferProductFleetDialogEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.transferTo = "SERVICE_CENTER";
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
