<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <AddMoreAddressedDialog
      :StoreObj="StoreObj"
      :AddMoreAddressDialog="AddMoreAddressDialog"
      @clicked="AddMoreAddressesDialogEmit"
    />
    <v-dialog persistent width="90%" :value="CreateServicePartnerDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2 white--text">
            {{
              StoreObj.action == "CREATE"
                ? "Create Service Partner"
                : "Update Service Partner"
            }}
            <span v-if="StoreObj.action != 'CREATE'">{{
              StoreObj.user_name
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="ServicePartnerUserEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-form ref="form">
            <v-row no-gutters>
              <v-col cols="12" sm="12" md="6" xs="12">
                <GoogleMaps
                  style="width: 100%; height: 60%"
                  :StoreObj="StoreObj"
                  @clicked="GoogleMapsEmit"
                />
              </v-col>
              <v-col cols="12" sm="12" md="6" xs="12">
                <v-row no-gutters>
                  <v-col cols="12" sm="12" md="6" xs="12">
                    <v-text-field
                      outlined
                      dense
                      label="Name *"
                      class="FontSize mt-4"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="user_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-text-field
                      outlined
                      dense
                      :readonly="StoreObj.action == 'EDIT'"
                      label="Email ID *"
                      class="FontSize mt-4 ml-2"
                      v-model="user_email_id"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) =>
                          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                            v
                          ) || 'Email must be valid',
                      ]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters class="mb-4">
                  <v-col cols="12" md="2" sm="12" xs="12">
                    <v-autocomplete
                      dense
                      outlined
                      class="FontSize"
                      label="Country Code"
                      :items="CountryList"
                      item-text="dial_code"
                      item-value="dial_code"
                      v-model="user_country_code"
                    >
                      <template slot="selection" slot-scope="{ item }">
                        {{ item.dial_code }}
                      </template>
                      <template slot="item" slot-scope="{ item }">
                        {{ item.name }}({{ item.dial_code }})
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      class="FontSize ml-1"
                      label="Phone Number"
                      v-model="user_contact_number"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="3" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      type="number"
                      label="Latitude"
                      class="FontSize ml-2"
                      v-model="user_latitude"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      type="number"
                      class="FontSize ml-2"
                      label="Longitude"
                      v-model="user_longitude"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n8 mb-n10">
                  <v-col cols="12" sm="12" md="11" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Address"
                      class="FontSize"
                      v-model="user_address"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="1" xs="12">
                    <v-tooltip color="primary" left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          small
                          v-on="on"
                          class="ml-n4"
                          v-bind="attrs"
                          color="primary"
                          @click.stop="checkItem()"
                        >
                          <v-icon small>mdi-map-marker-plus-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Add More Addresses</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
                <v-row class="mb-n10">
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      label="City"
                      class="FontSize"
                      v-model="city"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      outlined
                      dense
                      label="State"
                      class="FontSize"
                      v-model="state"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      type="number"
                      class="FontSize"
                      label="Pincode"
                      v-model="user_pincode"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-expansion-panels
                  class="my-4"
                  v-if="
                    this.multiple_address != [] &&
                    this.multiple_address.length != 0
                  "
                >
                  <v-card outlined>
                    <v-expansion-panel>
                      <v-expansion-panel-header
                        class="font-weight-bold FontSize"
                        expand-icon="mdi-menu-down"
                      >
                        More Addresses : {{ this.multiple_address.length }}
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-data-table
                          dense
                          fixed-header
                          class="elevation-0"
                          style="border: 1px solid gray"
                          :headers="multiple_address_headers"
                          :items="multiple_address"
                          hide-default-footer
                        >
                          <template v-slot:[`item.city`]="{ item }">
                            <div class="FontSize" v-if="item.city != undefined">
                              {{ item.city }}
                            </div>
                            <div v-else>-</div>
                          </template>
                          <template v-slot:[`item.address_name`]="{ item }">
                            <div
                              class="FontSize"
                              v-if="item.address_name != undefined"
                            >
                              {{ item.address_name }}
                            </div>
                            <div v-else>-</div>
                          </template>
                          <template v-slot:[`item.area`]="{ item }">
                            <div class="FontSize" v-if="item.area != undefined">
                              {{ item.area }}
                            </div>
                            <div v-else>-</div>
                          </template>
                          <template v-slot:[`item.pincode`]="{ item }">
                            <div
                              class="FontSize"
                              v-if="item.pincode != undefined"
                            >
                              {{ item.pincode }}
                            </div>
                            <div v-else>-</div>
                          </template>
                          <template v-slot:[`item.delete`]="{ item }">
                            <v-btn
                              icon
                              small
                              @click="
                                multiple_address.splice(
                                  multiple_address.indexOf(item),
                                  1
                                )
                              "
                              ><v-icon color="red" small
                                >mdi-delete</v-icon
                              ></v-btn
                            >
                          </template>
                        </v-data-table>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-card>
                </v-expansion-panels>
                <v-row class="mb-n10">
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      class="FontSize"
                      label="GST Number"
                      v-model="gst_no"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      class="FontSize"
                      label="PAN Number"
                      v-model="user_pan_no"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      class="FontSize"
                      label="Qualification"
                      v-model="user_qualification"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      class="FontSize"
                      label="Experience"
                      v-model="user_experience"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-autocomplete
                      dense
                      outlined
                      return-object
                      class="FontSize"
                      label="Designation"
                      v-model="designation"
                      item-value="setting_id"
                      item-text="setting_name"
                      :items="GetAllDesignationsList"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-autocomplete
                      dense
                      outlined
                      return-object
                      class="FontSize"
                      label="Report To"
                      item-value="user_id"
                      item-text="user_name"
                      :items="GetAllUsersList"
                      v-model="reporting_to_manager_id"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-autocomplete
                  :rules="[(v) => !!v || 'Required']"
                  multiple
                  outlined
                  label="Territory Name(s) *"
                  dense
                  class="FontSize"
                  :items="GetAllTerritoriesList"
                  item-text="territory_name"
                  item-value="territory_id"
                  v-model="territory_ids"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip x-small v-if="index === 0">
                      <span>{{ item.territory_name }}</span>
                    </v-chip>
                    <span
                      v-if="index === 0 && territory_ids.length > 1"
                      class="grey--text text-caption"
                    >
                      (+{{ territory_ids.length - 1 }} others)
                    </span>
                  </template>
                  <template v-slot:prepend-item>
                    <v-list-item ripple @click="toggleTerritorySelection">
                      <v-list-item-action>
                        <v-icon
                          :color="
                            GetAllTerritoriesList.length > 0
                              ? 'indigo darken-4'
                              : ''
                          "
                        >
                          {{ selectAllTerritories }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title> Select All </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-autocomplete>
                <v-row>
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-card
                      @click="checkImagePresent()"
                      max-width="800px"
                      height="100px"
                      align="center"
                      class="elevation-1 mx-2"
                    >
                      <v-fab-transition v-if="imgSrc != null && imgSrc != ''">
                        <v-btn
                          absolute
                          top
                          right
                          dark
                          x-small
                          fab
                          color="red"
                          class="mr-n4"
                          @click.stop="
                            (imgSrc = null),
                              (uploadedImage = false),
                              s3DeleteMethod()
                          "
                        >
                          <v-icon x-small>mdi-close</v-icon>
                        </v-btn>
                      </v-fab-transition>
                      <v-img
                        v-if="imgSrc != null && imgSrc != ''"
                        :src="imgSrc"
                        :lazy-src="imgSrc"
                        max-width="400px"
                        class="mt-4"
                      ></v-img>
                      <div v-else>
                        <input
                          ref="excel-upload-input"
                          accept="image/*"
                          class="excel-upload-input"
                          type="file"
                          @change="handleClick"
                        />
                        <v-icon class="mt-4">mdi-upload</v-icon>
                        <div align="center ">Upload Profile Picture</div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-checkbox
                      class="mt-n2"
                      v-model="checkbox"
                      label="Enable Partner To Create Tickets"
                    ></v-checkbox>
                    <v-checkbox
                      class="mt-n2"
                      v-model="checkboxRep"
                      label="Enable Partner To Create Service Reps and Agents"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions
          class="pt-0"
          v-if="
            $store.getters.get_user_type != 'AGENT' &&
            $store.getters.get_user_type != 'MANAGER'
          "
        >
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="isLoading"
            color="primary"
            @click="valicateCreateReps"
            class="white--text mb-4"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import Croppa from "vue-croppa";
Vue.use(Croppa);
import CountryList from "@/mixins/Users/CountryList.json";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import AddMoreAddressedDialog from "@/components/Users/Dialogs/ServicePartner/AddMoreAddressedDialog.vue";
import { Buffer } from "buffer";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllPartnerUser } from "@/mixins/Users/GetAllPartnerUser.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { CreatePartnerUser, UpdatePartnerUsers } from "@/graphql/mutations.js";
import { GetAllDesignations } from "@/mixins/MastersSetting/GetAllDesignations.js";
window.Buffer = Buffer;
var aws = require("aws-sdk");
export default {
  props: {
    StoreObj: Object,
    StoreObjArray: Array,
    GetAllUsersList: Array,
    CreateServicePartnerDialog: Boolean,
  },
  components: {
    Snackbar,
    GoogleMaps,
    AddMoreAddressedDialog,
  },
  mixins: [
    GenerateS3URL,
    GetAllTerritories,
    GetAllPartnerUser,
    GetAllDesignations,
  ],
  data: () => ({
    Toggle: 0,
    checkbox: true,
    isLoading: false,
    renderComp: true,
    checkboxRep: true,
    AddMoreAddressDialog: false,
    city: "",
    state: "",
    gst_no: "",
    imgSrc: "",
    user_name: "",
    user_pan_no: "",
    service_ids: "",
    designation: "",
    user_pincode: "",
    user_address: "",
    user_latitude: "",
    user_email_id: "",
    user_longitude: "",
    user_experience: "",
    reporter_user_id: "",
    user_qualification: "",
    user_contact_number: "",
    user_country_code: "+91",
    setting_status: "ACTIVE",
    reporting_to_manager_id: "",
    user_type: "SERVICE_PARTNER",
    reporting_to_manager_name: "",
    CountryList: [],
    territory_ids: [],
    multiple_address: [],
    multiple_address_headers: [
      { text: "Name", value: "address_name" },
      { text: "Address", value: "area" },
      { text: "City", value: "city" },
      { text: "Pincode", value: "pincode" },
      { text: "Delete", value: "delete" },
    ],
    SnackBarComponent: {},
  }),
  watch: {
    CreateServicePartnerDialog(val) {
      if (val == true) {
        this.GetAllTerritoriesMethod(
          "ACTIVE",
          undefined,
          undefined,
          "TERRITORY",
          undefined
        );
        this.user_country_code = "+91";
        if (this.StoreObj.action == "EDIT") {
          this.user_name = this.StoreObj.user_name;
          this.user_country_code = this.StoreObj.user_country_code;
          this.user_contact_number = this.StoreObj.user_contact_number;
          this.reporter_user_id = this.StoreObj.reporter_user_id;
          this.user_type = this.StoreObj.user_type;
          this.service_ids = this.StoreObj.service_ids;
          this.territory_ids = this.StoreObj.territory_ids;
          this.user_email_id = this.StoreObj.user_email_id;
          this.user_address = this.StoreObj.user_address;
          this.user_latitude = this.StoreObj.user_latitude;
          this.state = this.StoreObj.state;
          this.city = this.StoreObj.city;
          this.user_longitude = this.StoreObj.user_longitude;
          this.user_pincode = this.StoreObj.user_pincode;
          this.user_pan_no = this.StoreObj.user_pan_no;
          this.gst_no = this.StoreObj.gst_no;
          this.user_experience = this.StoreObj.user_experience;
          this.user_qualification = this.StoreObj.user_qualification;
          this.checkbox = this.StoreObj.enable_ticket_creation;
          this.checkboxRep = this.StoreObj.enable_user_creation;
          this.imgSrc = this.StoreObj.user_profile_pic_url;
          this.designation = this.StoreObj.designation_id;
          this.reporting_to_manager_id = this.StoreObj.reporting_to_manager_id;
          this.multiple_address =
            this.StoreObj.multiple_address != undefined
              ? this.StoreObj.multiple_address
              : [];
        }
      }
    },
  },
  computed: {
    someTerritoriesSelected() {
      return (
        this.GetAllTerritoriesList.length > 0 && !this.allTerritoriesSelected
      );
    },
    allTerritoriesSelected() {
      return this.GetAllTerritoriesList.length === this.territory_ids.length;
    },
    selectAllTerritories() {
      if (this.allTerritoriesSelected) return "mdi-close-box";
      if (this.someTerritoriesSelected) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
  },
  mounted() {
    this.CountryList = CountryList;
    this.GetAllTerritoriesMethod("ACTIVE");
    this.GetAllDesignationsMethod(this.setting_status);
  },
  methods: {
    checkItem() {
      this.AddMoreAddressDialog = true;
    },
    AddMoreAddressesDialogEmit(item, Toggle) {
      this.AddMoreAddressDialog = false;
      if (Toggle == 2) {
        this.multiple_address.push(item);
      }
    },
    toggleTerritorySelection() {
      this.$nextTick(() => {
        if (this.allTerritoriesSelected) {
          this.territory_ids = [];
        } else {
          this.territory_ids = this.GetAllTerritoriesList.map(
            (item) => item.territory_id
          );
        }
      });
    },
    GoogleMapsEmit(place) {
      this.user_address = place.formatted_address;
      this.user_latitude = place.geometry.location.lat();
      this.user_longitude = place.geometry.location.lng();
      this.getPincode(this.user_latitude, this.user_longitude);
    },
    async getPincode(lat, lng) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAuHcsssNtWZhnt0op_n5nm9s8raGeNHGk`
      );
      const data = await response.json();
      if (JSON.parse(data.results.length)) {
        const addressComponents = data.results[0].address_components;
        const pincodeComponent = addressComponents.find((item) =>
          item.types.includes("postal_code")
        );
        const cityComponent = addressComponents.find((item) =>
          item.types.includes("locality")
        );
        const stateComponent = addressComponents.find((item) =>
          item.types.includes("administrative_area_level_1")
        );
        this.user_pincode = pincodeComponent
          ? pincodeComponent.long_name
          : "Pincode Not Found";
        this.city = cityComponent ? cityComponent.long_name : "City Not Found";
        this.state = stateComponent
          ? stateComponent.long_name
          : "State not found";
      }
    },
    checkImagePresent() {
      if (
        this.imgSrc == null ||
        this.imgSrc == "" ||
        this.imgSrc == undefined
      ) {
        this.handleUpload();
      }
    },
    handleUpload() {
      this.$refs["excel-upload-input"].click();
    },
    handleClick(e) {
      this.selectedFile = e.target.files[0];
      var self = this;
      var fileReader = new FileReader();
      fileReader.readAsDataURL(self.selectedFile);
      fileReader.onload = async function (val) {
        self.imgSrc = val.target.result;
      };
    },
    async uploadImageToS3() {
      this.isLoading = true;
      if (this.selectedFile != undefined) {
        let result = await this.GenerateS3URLMethods(
          `${
            this.$store.getters.get_current_user_details.organization_id
          }/PROFILE_PIC/${new Date().getTime()}_${this.selectedFile.name}`,
          this.selectedFile
        );
        this.profile_pic_url = result.profile_pic_url;
        this.CreateUpdateServicePartner();
      } else {
        this.CreateUpdateServicePartner();
      }
    },
    async valicateCreateReps() {
      if (this.$refs.form.validate()) {
        if (
          this.imgSrc != undefined &&
          this.imgSrc != null &&
          this.imgSrc != ""
        ) {
          this.uploadImageToS3();
        } else {
          this.CreateUpdateServicePartner();
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
    async CreateUpdateServicePartner() {
      this.isLoading = true;
      try {
        let mutation_name =
          this.StoreObj.action == "CREATE"
            ? CreatePartnerUser
            : UpdatePartnerUsers;
        let mutation_result =
          this.StoreObj.action == "CREATE"
            ? "CreatePartnerUser"
            : "UpdatePartnerUsers";
        var inputParams = {
          updater_user_id:
            this.StoreObj.action != "CREATE"
              ? this.$store.getters.get_current_user_details.user_id
              : undefined,
          creator_user_id:
            this.StoreObj.action == "CREATE"
              ? this.$store.getters.get_current_user_details.user_id
              : undefined,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_name: this.user_name,
          user_type:
            this.StoreObj.action == "CREATE" ? this.user_type : undefined,
          territory_ids: this.territory_ids,
          enable_ticket_creation: this.checkbox == null ? false : this.checkbox,
          enable_user_creation:
            this.checkboxRep == null ? false : this.checkboxRep,
          user_profile_pic_url:
            this.StoreObj.user_profile_pic_url == this.imgSrc
              ? this.imgSrc
              : this.profile_pic_url,
          user_id:
            this.StoreObj.action != "CREATE"
              ? this.StoreObj.user_id
              : undefined,
        };
        if (this.multiple_address != [] && this.multiple_address.length != 0) {
          inputParams.multiple_address = this.multiple_address;
        }
        if (
          this.reporting_to_manager_id != "" &&
          this.reporting_to_manager_id != undefined &&
          this.reporting_to_manager_id != null
        ) {
          inputParams.reporting_to_manager_name =
            this.reporting_to_manager_id.user_name;
        }
        if (
          this.reporting_to_manager_id != "" &&
          this.reporting_to_manager_id != undefined &&
          this.reporting_to_manager_id != null
        ) {
          inputParams.reporting_to_manager_id =
            this.reporting_to_manager_id.user_id;
        }
        if (
          this.designation != "" &&
          this.designation != undefined &&
          this.designation != null
        ) {
          if (typeof this.designation != "string") {
            inputParams.designation_id = this.designation.setting_id;
          } else {
            inputParams.designation_id = this.designation;
          }
        }
        if (
          this.designation != "" &&
          this.designation != undefined &&
          this.designation != null
        ) {
          if (typeof this.designation != "string") {
            inputParams.designation_name = this.designation.setting_name;
          }
        }
        if (
          this.user_country_code != undefined &&
          this.user_country_code != null &&
          this.user_country_code != ""
        ) {
          inputParams.user_country_code = this.user_country_code;
        }
        if (
          this.user_contact_number != undefined &&
          this.user_contact_number != null &&
          this.user_contact_number != ""
        ) {
          inputParams.user_contact_number = this.user_contact_number;
        }
        if (
          this.user_email_id != undefined &&
          this.user_email_id != null &&
          this.user_email_id != ""
        ) {
          inputParams.user_email_id =
            this.StoreObj.action == "CREATE" ? this.user_email_id : undefined;
        }
        if (
          this.user_address != undefined &&
          this.user_address != null &&
          this.user_address != ""
        ) {
          inputParams.user_address = this.user_address;
        }
        if (
          this.user_latitude != undefined &&
          this.user_latitude != null &&
          this.user_latitude != ""
        ) {
          inputParams.user_latitude = this.user_latitude;
        }
        if (this.city != undefined && this.city != null && this.city != "") {
          inputParams.city = this.city;
        }
        if (this.state != undefined && this.state != null && this.state != "") {
          inputParams.state = this.state;
        }
        if (
          this.user_longitude != undefined &&
          this.user_longitude != null &&
          this.user_longitude != ""
        ) {
          inputParams.user_longitude = this.user_longitude;
        }
        if (
          this.user_pincode != undefined &&
          this.user_pincode != null &&
          this.user_pincode != ""
        ) {
          inputParams.user_pincode = this.user_pincode;
        }
        if (
          this.user_pan_no != undefined &&
          this.user_pan_no != null &&
          this.user_pan_no != ""
        ) {
          inputParams.user_pan_no = this.user_pan_no;
        }
        if (
          this.gst_no != undefined &&
          this.gst_no != null &&
          this.gst_no != ""
        ) {
          inputParams.gst_no = this.gst_no;
        }
        if (
          this.user_experience != undefined &&
          this.user_experience != null &&
          this.user_experience != ""
        ) {
          inputParams.user_experience = this.user_experience;
        }
        if (
          this.user_qualification != undefined &&
          this.user_qualification != null &&
          this.user_qualification != ""
        ) {
          inputParams.user_qualification = this.user_qualification;
        }
        if (
          this.service_ids != undefined &&
          this.service_ids != null &&
          this.service_ids != ""
        ) {
          inputParams.service_ids = this.service_ids;
        }
        let result = await API.graphql(
          graphqlOperation(mutation_name, {
            input: inputParams,
          })
        );
        let ResultObject = JSON.parse(result.data[mutation_result]);
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
          this.ServicePartnerUserEmit((this.Toggle = 2));
        }
        this.isLoading = false;
      } catch (error) {
        console.log("Err:", error);
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
    ServicePartnerUserEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
        this.imgSrc = [];
        this.multiple_address = [];
      }
      this.$emit("clicked", Toggle);
      this.imgSrc = [];
    },
  },
};
</script>
<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
</style>
