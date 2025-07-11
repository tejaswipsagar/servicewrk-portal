<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent width="80%" :value="dialogAddUser">
      <v-toolbar color="primary" dense dark>
        <v-icon small>{{
          StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
        }}</v-icon>
        <div class="ml-2 white--text">
          {{ this.StoreObj.action == "CREATE" ? "Create User" : "Update User" }}
          <span v-if="StoreObj.action != 'CREATE'">
            {{ this.StoreObj.user_name }}
          </span>
        </div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="dialogAddUserEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card class="overflow-hidden">
        <v-card-text class="mt-4 pb-0">
          <v-form ref="form">
            <v-row no-gutters>
              <v-col cols="12" md="6" sm="12" xs="12">
                <GoogleMaps
                  style="width: 100%; height: 60%"
                  :StoreObj="StoreObj"
                  @clicked="GoogleMapsEmit"
                  class="mt-n4"
                />
              </v-col>
              <v-col cols="12" md="6" sm="12">
                <v-row class="mb-n8">
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-text-field
                      outlined
                      dense
                      :readonly="$store.getters.get_user_type == 'AGENT'"
                      label="User Name *"
                      class="FontSize field_label_size field_height"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) => /^[0-9a-zA-Z-\s]+$/.test(v) || 'Invalid',
                      ]"
                      v-model="user_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-text-field
                      outlined
                      dense
                      :readonly="StoreObj.action == 'EDIT'"
                      label="Email ID *"
                      class="FontSize field_label_size field_height"
                      v-model="user_email_id"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) =>
                          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(
                            v
                          ) || 'Email must be valid',
                      ]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      label="Country Code"
                      outlined
                      :items="CountryList"
                      dense
                      item-value="dial_code"
                      item-text="name"
                      v-model="user_country_code"
                      class="FontSize"
                    >
                      <template slot="selection" slot-scope="{ item }">
                        {{ item.dial_code }}
                      </template>
                      <template slot="item" slot-scope="{ item }">
                        {{ item.name }}({{ item.dial_code }})
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field
                      label="Phone Number"
                      outlined
                      dense
                      :rules="phoneNumberRules"
                      v-model="user_phone_number"
                      class="FontSize"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                  dense
                  outlined
                  label="Address"
                  class="FontSize"
                  v-model="user_address"
                ></v-text-field>
                <v-row no-gutters>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      label="City"
                      v-model="city"
                      class="FontSize mr-2"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      label="State"
                      v-model="state"
                      class="FontSize mr-2"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      label="Pincode"
                      class="FontSize"
                      type="number"
                      v-model="user_pincode"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n4">
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      type="number"
                      class="FontSize"
                      label="Latitude"
                      v-model="user_latitude"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      type="number"
                      class="FontSize"
                      label="Longitude"
                      v-model="user_longitude"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n6">
                  <v-col cols="12" md="5" sm="12" xs="12">
                    <v-autocomplete
                      outlined
                      dense
                      label="User Type *"
                      class="FontSize field_label_size field_height"
                      v-model="user_type"
                      :items="
                        StoreObj.action == 'EDIT'
                          ? user_typeItems
                          : user_typeItems.filter((item) => item != 'OWNER')
                      "
                      :rules="[(v) => !!v || 'Required']"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-autocomplete
                      outlined
                      dense
                      label="Reporting To "
                      class="FontSize field_label_size field_height"
                      v-model="reporting_to_manager_id"
                      :items="GetAllUsersList"
                      item-text="user_name"
                      item-value="user_id"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="3" xs="12" sm="12">
                    <v-autocomplete
                      outlined
                      dense
                      label="Designation"
                      class="FontSize field_label_size field_height"
                      v-model="designation"
                      item-text="setting_name"
                      item-value="setting_id"
                      :items="GetAllDesignationsList"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="mt-n6">
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-text-field
                      outlined
                      dense
                      class="FontSize"
                      v-model="user_qualification"
                      label="Qualification"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-text-field
                      outlined
                      dense
                      class="FontSize"
                      v-model="user_experience"
                      label="Experience"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-autocomplete
                  multiple
                  outlined
                  label="Territory Name(s)"
                  dense
                  class="FontSize field_label_size field_height"
                  v-if="
                    user_type == 'AGENT' ||
                    user_type == 'NSM' ||
                    user_type == 'RSM'
                  "
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
                    <v-list-item
                      ripple
                      @mousedown.prevent
                      @click="toggleTerritorySelection"
                    >
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
                    <v-checkbox
                      class="mt-n3"
                      v-model="enablerft"
                      label="Enable Component Request Notification"
                    ></v-checkbox>
                    <v-checkbox
                      class="mt-n3"
                      v-model="enablecomponent"
                      label="Enable Component Transaction"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-card
                      @click="checkImagePresent()"
                      max-width="800px"
                      height="100px"
                      align="center"
                      class="elevation-1 ml-6 mt-4"
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
                          @click.stop="(imgSrc = null), (uploadedImage = false)"
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
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-10">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            @click="validateMethod()"
            :loading="isLoading"
            class="mr-2 mb-2 white--text"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
Vue.use(Croppa);
import Vue from "vue";
var aws = require("aws-sdk");
import Croppa from "vue-croppa";
import CountryList from "@/JsonFiles/CountryList.json";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { Buffer } from "buffer";
import { API, graphqlOperation } from "aws-amplify";
import { Create_User, Update_User } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
window.Buffer = Buffer;
export default {
  props: {
    StoreObj: Object,
    dialogAddUser: Boolean,
    GetAllUsersList: Array,
    GetAllTerritoriesList: Array,
    GetAllDesignationsList: Array,
  },
  components: {
    Snackbar,
    GoogleMaps,
  },
  data: () => ({
    renderComp: true,
    isLoading: false,
    enablerft: false,
    enablecomponent: false,
    city: "",
    state: "",
    imgSrc: "",
    user_type: "",
    user_name: "",
    designation: "",
    user_pincode: "",
    user_address: "",
    user_email_id: "",
    user_latitude: "",
    user_longitude: "",
    user_experience: "",
    user_display_id: "",
    user_phone_number: "",
    user_qualification: "",
    user_country_code: "+91",
    setting_status: "ACTIVE",
    reporting_to_manager_id: "",
    reporting_to_manager_name: "",
    CountryList: [],
    territory_ids: [],
    phoneNumberRules: [],
    user_typeItems: [
      { text: "MANAGER", value: "MANAGER" },
      { text: "ADMIN", value: "ADMIN" },
      { text: "Service Co-Ordinator", value: "AGENT" },
      { text: "STORE MANAGER", value: "STORE_MANAGER" },
      { text: "OWNER", value: "OWNER" },
      { text: "MANAGEMENT", value: "MANAGEMENT" },
      { text: "NSM", value: "NSM" },
      { text: "RSM", value: "RSM" },
    ],
    SnackBarComponent: {},
  }),
  mixins: [GenerateS3URL],
  mounted() {
    this.CountryList = CountryList;
  },
  watch: {
    user_phone_number(val) {
      if (val != "" && val != null && val != undefined) {
        this.phoneNumberRules = [
          (v) =>
            /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
          (v) => (v && v.length < 11) || "Invalid",
          (v) => (v && v.length > 9) || "Invalid",
        ];
      } else {
        this.phoneNumberRules = [];
      }
    },
    dialogAddUser(val) {
      if (val == true) {
        if (this.StoreObj.action == "EDIT") {
          this.user_name = this.StoreObj.user_name;
          this.user_experience = this.StoreObj.user_experience;
          this.user_qualification = this.StoreObj.user_qualification;
          this.user_longitude = this.StoreObj.user_longitude;
          this.user_address = this.StoreObj.user_address;
          this.city = this.StoreObj.city;
          this.state = this.StoreObj.state;
          this.user_pincode = this.StoreObj.user_pincode;
          this.user_phone_number = this.StoreObj.user_phone_number;
          this.user_country_code = this.StoreObj.user_country_code;
          this.user_email_id = this.StoreObj.user_email_id;
          this.user_latitude = this.StoreObj.user_latitude;
          this.user_type = this.StoreObj.user_type;
          this.enablerft = this.StoreObj.enable_email_notification;
          this.enablecomponent = this.StoreObj.enable_component_transaction;
          this.imgSrc = this.StoreObj.user_profile_pic_url;
          this.reporting_to_manager_id = this.StoreObj.reporting_to_manager_id;
          if (
            this.user_type == "AGENT" ||
            this.user_type == "NSM" ||
            this.user_type == "RSM"
          ) {
            this.territory_ids = this.StoreObj.territory_ids;
          }
          this.designation = this.StoreObj.designation_id;
        }
      } else {
        if (this.$refs.form != undefined) {
          this.$refs.form.reset();
        }
      }
    },

    designation(val) {
      console.log("DES_ID", val);
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
  methods: {
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
        if (this.StoreObj.action == "CREATE") {
          this.addUserMethod();
        } else {
          this.editUserMethod();
        }
      } else {
        if (this.StoreObj.action == "CREATE") {
          this.addUserMethod();
        } else {
          this.editUserMethod();
        }
      }
    },
    async editUserMethod() {
      this.isLoading = true;
      try {
        var inputParams = {
          user_name: this.user_name,
          user_id: this.StoreObj.user_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_type: this.user_type,
          territory_ids: this.territory_ids,
          enable_email_notification: this.enablerft,
          enable_component_transaction: this.enablecomponent,
          user_profile_pic_url:
            this.StoreObj.user_profile_pic_url == this.imgSrc
              ? this.imgSrc
              : this.profile_pic_url,
        };
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
          this.user_longitude != undefined &&
          this.user_longitude != null &&
          this.user_longitude != ""
        ) {
          inputParams.user_longitude = this.user_longitude;
        }
        if (
          this.user_latitude != undefined &&
          this.user_latitude != null &&
          this.user_latitude != ""
        ) {
          inputParams.user_latitude = this.user_latitude;
        }
        if (
          this.user_address != undefined &&
          this.user_address != null &&
          this.user_address != ""
        ) {
          inputParams.user_address = this.user_address;
        }
        if (this.city != undefined && this.city != null && this.city != "") {
          inputParams.city = this.city;
        }
        if (this.state != undefined && this.state != null && this.state != "") {
          inputParams.state = this.state;
        }
        if (
          this.user_pincode != undefined &&
          this.user_pincode != null &&
          this.user_pincode != ""
        ) {
          inputParams.user_pincode = this.user_pincode;
        }
        if (
          this.user_phone_number != undefined &&
          this.user_phone_number != null &&
          this.user_phone_number != ""
        ) {
          inputParams.user_phone_number = this.user_phone_number;
        }
        if (
          this.user_country_code != undefined &&
          this.user_country_code != null &&
          this.user_country_code != ""
        ) {
          inputParams.user_country_code = this.user_country_code;
        }
        if (
          this.designation != undefined &&
          this.designation != null &&
          this.designation != ""
        ) {
          inputParams.designation_id = this.designation.setting_id;
          inputParams.designation_name = this.designation.setting_name;
        }
        if (
          this.reporting_to_manager_id != undefined &&
          this.reporting_to_manager_id != null &&
          this.reporting_to_manager_id != ""
        ) {
          inputParams.reporting_to_manager_id =
            this.reporting_to_manager_id.user_id;
        }
        if (
          this.reporting_to_manager_id != undefined &&
          this.reporting_to_manager_id != null &&
          this.reporting_to_manager_id != ""
        ) {
          inputParams.reporting_to_manager_name =
            this.reporting_to_manager_id.user_name;
        }
        let result = await API.graphql(
          graphqlOperation(Update_User, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.Update_User);
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
          this.dialogAddUserEmit((this.Toggle = 2));
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
    async validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.StoreObj.action == "CREATE") {
          if (
            this.imgSrc != undefined &&
            this.imgSrc != null &&
            this.imgSrc != ""
          ) {
            this.uploadImageToS3();
          } else {
            this.addUserMethod();
          }
        } else if (this.StoreObj.action == "EDIT") {
          if (
            this.imgSrc != undefined &&
            this.imgSrc != null &&
            this.imgSrc != ""
          ) {
            this.uploadImageToS3();
          } else {
            this.editUserMethod();
          }
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Fill all the required details",
        };
      }
    },
    async addUserMethod() {
      this.isLoading = true;
      try {
        var inputParams = {
          user_name: this.user_name,
          user_email_id: this.user_email_id,
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_type: this.user_type,
          territory_ids: this.territory_ids,
          enable_component_transaction:
            this.enable_component_transaction == undefined
              ? undefined
              : this.enablecomponent,
          enable_email_notification:
            this.enable_email_notification == undefined
              ? undefined
              : this.enablerft,
          user_profile_pic_url:
            this.StoreObj.user_profile_pic_url == this.imgSrc
              ? this.imgSrc
              : this.profile_pic_url,
        };
        if (
          this.reporting_to_manager_id != undefined &&
          this.reporting_to_manager_id != null &&
          this.reporting_to_manager_id != ""
        ) {
          inputParams.reporting_to_manager_id =
            this.reporting_to_manager_id.user_id;
        }
        if (
          this.reporting_to_manager_id != undefined &&
          this.reporting_to_manager_id != null &&
          this.reporting_to_manager_id != ""
        ) {
          inputParams.reporting_to_manager_name =
            this.reporting_to_manager_id.user_name;
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
          this.user_longitude != undefined &&
          this.user_longitude != null &&
          this.user_longitude != ""
        ) {
          inputParams.user_longitude = this.user_longitude;
        }
        if (
          this.user_latitude != undefined &&
          this.user_latitude != null &&
          this.user_latitude != ""
        ) {
          inputParams.user_latitude = this.user_latitude;
        }
        if (
          this.user_address != undefined &&
          this.user_address != null &&
          this.user_address != ""
        ) {
          inputParams.user_address = this.user_address;
        }
        if (this.city != undefined && this.city != null && this.city != "") {
          inputParams.city = this.city;
        }
        if (this.state != undefined && this.state != null && this.state != "") {
          inputParams.state = this.state;
        }
        if (
          this.user_pincode != undefined &&
          this.user_pincode != null &&
          this.user_pincode != ""
        ) {
          inputParams.user_pincode = this.user_pincode;
        }
        if (
          this.user_country_code != undefined &&
          this.user_country_code != null &&
          this.user_country_code != ""
        ) {
          inputParams.user_country_code = this.user_country_code;
        }
        if (
          this.user_phone_number != undefined &&
          this.user_phone_number != null &&
          this.user_phone_number != ""
        ) {
          inputParams.user_phone_number = this.user_phone_number;
        }
        if (
          this.designation != undefined &&
          this.designation != null &&
          this.designation != ""
        ) {
          inputParams.designation_id = this.designation.setting_id;
          // inputParams.designation_id = this.designation;
        }
        let result = await API.graphql(
          graphqlOperation(Create_User, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.Create_User);
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
          this.dialogAddUserEmit((this.Toggle = 2));
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
    dialogAddUserEmit(Toggle) {
      this.territory_ids = [];
      this.imgSrc = [];
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
