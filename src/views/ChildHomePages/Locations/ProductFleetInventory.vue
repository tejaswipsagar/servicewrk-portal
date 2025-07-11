<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-card flat>
      <v-toolbar dense class="elevation-0">
        <v-icon color="primary" small>
          {{ "mdi-share" }}
        </v-icon>
        <div class="ml-2 largeFontSizeNew">Transfer Product Fleet</div>
        <v-spacer />
        <v-autocomplete
          dense
          outlined
          class="FontSize field_label_size WidthVariation1 field_height mt-6"
          label="Select Service Center"
          :items="GetAllServiceCentersList"
          item-text="service_center_name"
          item-value="service_center_id"
          v-model="service_center_id"
        >
        </v-autocomplete>
        <v-autocomplete
          dense
          outlined
          class="FontSize field_label_size WidthVariation1 field_height mt-6 mx-2"
          label="Transfer to"
          :items="newServiceCenterList"
          item-text="service_center_name"
          item-value="service_center_id"
          v-model="new_service_center_id"
        >
        </v-autocomplete>
        <v-btn @click="transferProductFleetMethod()" color="primary" :loading="loadingBtn" small>
          <v-icon class="mr-2" small dark>mdi-share</v-icon>Transfer
        </v-btn>
      </v-toolbar>
      <v-card outlined>
        <v-card-text>
          <v-data-table
            dense
            :headers="headers"
            :items="AvailableFleetList"
            :single-select="singleSelect"
            show-select
            :height="TableHeight"
            v-model="selected"
            item-key="setting_id"
            :loading="loading"
            :search="search"
          >
            <template v-slot:[`item.setting_name`]="{ item }">
              <div v-if="item.setting_name">
                {{ item.setting_name }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.setting_price`]="{ item }">
              <div v-if="item.setting_price">
                {{ item.setting_price }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:[`item.setting_description`]="{ item }">
              <div v-if="item.setting_description">
                {{ item.setting_description }}
              </div>
              <div v-else>-</div>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-card>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GetAllServices } from "@/mixins/Product/GetAllServices.js";
import { TransferProductFleetToServiceCenter } from "@/graphql/mutations.js";
import { GetAllServiceCenter } from "@/mixins/Locations/GetAllServiceCenter.js";
import { GetAllAvailableProductFleet } from "@/mixins/Locations/GetAllAvailableProductFleet.js";
export default {
  components: {
    Snackbar,
  },
  props: {
    StoreObj: Object,
  },
  mixins: [GetAllServiceCenter, GetAllServices, GetAllAvailableProductFleet],
  data: () => ({
    price: "",
    search: "",
    category: "",
    product_id: "",
    service_id: "",
    setting_id: "",
    service_center_id: "",
    new_service_center_id: "",
    service_center_status: "ACTIVE",
    TableHeight: 0,
    menu2: false,
    loading: false,
    renderComp: true,
    loadingBtn : false,
    singleSelect: false,
    selected: [],
    categoryItems: [],
    AvailableFleetList: [],
    newServiceCenterList: [],
    GetServiceByCategoriesList: [],
    headers: [
      { text: "Serial Number", value: "setting_name" },
      { text: "Price", value: "setting_price" },
      { text: "Description", value: "setting_description" },
    ],
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    SnackBarComponent: {},
  }),
  watch: {
    service_center_id(val) {
      this.GetAvailableFleetMethod(val);
      this.newServiceCenterList = [];
      this.GetAllServiceCentersList.map((item) => {
        if (item.service_center_id != val) {
          this.newServiceCenterList.push(item);
        }
      });
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 210;
    this.GetAllServiceCentersMethod(this.service_center_status);
    this.GetAvailableFleetMethod(this.service_center_id);
    this.GetAllServicesMethod(this.service_enable_type, this.service_status);
  },
  methods: {
    async transferProductFleetMethod() {
      if (this.selected.length != 0) {
        try {
          var inputParams = {
            old_service_center_id: this.service_center_id,
            new_service_center_id: this.new_service_center_id,
            setting_ids: this.selected.map((val) => val.setting_id),
          };
          this.loadingBtn = true;
          let result = await API.graphql(
            graphqlOperation(TransferProductFleetToServiceCenter, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(
            result.data.TransferProductFleetToServiceCenter
          );
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
            this.selected = [];
            this.service_center_id = "";
            this.new_service_center_id = "";
            this.TagProductCustomerCardEmit((this.Toggle = 2));
          }
          this.loadingBtn = false;
        } catch (error) {
          this.loadingBtn = false;
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
      } else {
        this.loadingBtn = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Select any one Product Fleet and Transfer to Service Center",
          };
          this.renderComp = true;
        });
      }
    },
    TagProductCustomerCardEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
