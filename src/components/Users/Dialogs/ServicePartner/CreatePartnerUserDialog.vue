<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="rendorComp" />
    <v-dialog persistent width="80%" :value="CreateServicePartnerUserDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small>{{
            StoreObj.action == "CREATEREP" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2 white--text">
            {{
              StoreObj.action == "CREATEREP"
                ? "Create Service Partner User"
                : "Update Service Partner User"
            }}
            <span v-if="StoreObj.action != 'CREATEREP'">
              {{ StoreObj.user_name }}
            </span>
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
              <v-col cols="12" xs="12" md="6" sm="12">
                <GoogleMaps
                  style="width: 100%; height: 60%"
                  :StoreObj="StoreObj"
                  @clicked="GoogleMapsEmit"
                />
              </v-col>
              <v-col cols="12" sm="12" md="6" xs="12">
                <v-row>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      label="Name *"
                      class="FontSize mt-4"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="user_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-select
                      :readonly="
                        StoreObj.action == 'EDIT' ||
                        StoreObj.action2 ==
                          'CREATEPARTNERUSERFROMPARTNERPORTAL' ||
                        StoreObj.action2 == 'CREATE_PARTNER_REP'
                      "
                      outlined
                      dense
                      label="User Type *"
                      class="FontSize mt-4"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="user_type"
                      :items="GetAllPartnerUserList"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-text-field
                  v-if="user_type != 'PARTNER_REPRESENTATIVE'"
                  outlined
                  dense
                  :readonly="StoreObj.action == 'EDIT'"
                  label="Email ID *"
                  class="FontSize"
                  v-model="user_email_id"
                  :rules="[
                    (v) => !!v || 'Required',
                    (v) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                      'Email must be valid',
                  ]"
                ></v-text-field>
                <v-row no-gutters v-if="user_type != 'PARTNER_AGENT'">
                  <v-col cols="12" sm="12" md="4" xs="12">
                    <v-select
                      label="Country Code *"
                      :readonly="StoreObj.action == 'EDIT'"
                      v-model="user_country_code"
                      :items="CountryList"
                      item-value="dial_code"
                      item-text="name"
                      dense
                      outlined
                      class="FontSize"
                    >
                      <template slot="selection" slot-scope="{ item }">
                        {{ item.dial_code }}
                      </template>
                      <template slot="item" slot-scope="{ item }">
                        {{ item.name }}({{ item.dial_code }})
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="8" xs="12">
                    <v-text-field
                      dense
                      outlined
                      :readonly="StoreObj.action == 'EDIT'"
                      class="FontSize ml-2"
                      label="Contact Number *"
                      v-model="user_contact_number"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) =>
                          /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(
                            v
                          ) || 'Invalid',
                        (v) => (v && v.length < 11) || 'Invalid Contact Number',
                        (v) => (v && v.length > 9) || 'Invalid Contact Number',
                      ]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                  outlined
                  dense
                  label="Address"
                  v-model="user_address"
                  class="FontSize"
                >
                </v-text-field>
                <v-row no-gutters>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="City"
                      class="FontSize mr-2"
                      v-model="city"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="State"
                      class="FontSize mr-2"
                      v-model="state"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      class="FontSize"
                      label="Pincode"
                      type="number"
                      v-model="user_pincode"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters class="mb-6">
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      readonly
                      label="Latitude"
                      type="number"
                      class="FontSize mr-2"
                      v-model="user_latitude"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      readonly
                      label="Longitude"
                      type="number"
                      class="FontSize mr-2"
                      v-model="user_longitude"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="GST Number"
                      v-model="gst_no"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n6" no-gutters>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      outlined
                      dense
                      class="FontSize mr-2"
                      label="Qualification"
                      v-model="user_qualification"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      outlined
                      dense
                      class="FontSize mr-2"
                      label="Experience"
                      v-model="user_experience"
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
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" md="12" sm="12" xs="12">
                    <v-select
                      multiple
                      v-if="user_type == 'PARTNER_REPRESENTATIVE'"
                      outlined
                      item-text="service_name"
                      item-value="service_id"
                      dense
                      label="Products *"
                      class="FontSize"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="service_ids"
                      :items="
                        GetAllServicesList.filter(
                          (item) => item.service_id != 'ALL'
                        )
                      "
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip x-small v-if="index === 0">
                          <span>{{ item.service_name }}</span>
                        </v-chip>
                        <span
                          v-if="index === 0 && service_ids.length > 1"
                          class="grey--text text-caption"
                        >
                          (+{{ service_ids.length - 1 }} others)
                        </span>
                      </template>
                      <template v-slot:prepend-item>
                        <v-list-item ripple @click="toggle">
                          <v-list-item-action>
                            <v-icon
                              :color="
                                GetAllServicesList.length > 0
                                  ? 'purple darken-4'
                                  : ''
                              "
                            >
                              {{ icon }}
                            </v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title> Select All </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="12" md="8" xs="12">
                    <v-card
                      @click="checkImagePresent()"
                      max-width="800px"
                      height="100px"
                      align="center"
                      class="elevation-1"
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
            class="white--text mr-4 mb-4"
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
import Croppa from "vue-croppa";
import CountryList from "@/mixins/Users/CountryList.json";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GetAllServices } from "@/mixins/Product/GetAllServices.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { CreatePartnerUser, UpdatePartnerUsers } from "@/graphql/mutations.js";
import { GetAllReportersForPartnersAndDelearUsers } from "@/mixins/Users/GetAllReporterForServicePartnersAndDealers.js";
var aws = require("aws-sdk");
export default {
  props: {
    StoreObj: Object,
    partner_id: String,
    GetAllUsersList: Array,
    CreateServicePartnerUserDialog: Boolean,
  },
  components: {
    Snackbar,
    GoogleMaps,
  },
  mixins: [
    GenerateS3URL,
    GetAllServices,
    GetAllReportersForPartnersAndDelearUsers,
  ],
  data: () => ({
    Toggle: 0,
    city: "",
    state: "",
    gst_no: "",
    imgSrc: "",
    user_type: "",
    user_name: "",
    user_pan_no: "",
    service_ids: "",
    user_pincode: "",
    user_address: "",
    user_latitude: "",
    user_email_id: "",
    user_longitude: "",
    user_experience: "",
    user_qualification: "",
    user_contact_number: "",
    user_country_code: "+91",
    isLoading: false,
    rendorComp: true,
    CountryList: [],
    territory_ids: [],
    GetAllReportersForServciePartnersAndDealersList: [],
    GetAllPartnerUserList: [
      { text: "PARTNER SERVICE CO-ORDINATOR", value: "PARTNER_AGENT" },
      { text: "PARTNER REPRESENTATIVE", value: "PARTNER_REPRESENTATIVE" },
    ],
    SnackBarComponent: {},
  }),
  watch: {
    CreateServicePartnerUserDialog(val) {
      if (val == true) {
        if (this.StoreObj.action2 == "CREATEPARTNERUSERFROMPARTNERPORTAL") {
          this.user_type = "PARTNER_AGENT";
          this.GetAllReportersForPartnersAndDelearUsersMethod(
            this.$store.getters.get_current_user_details.partner_id
          );
        } else if (this.StoreObj.action2 == "CREATE_PARTNER_REP") {
          this.user_type = "PARTNER_REPRESENTATIVE";
          this.GetAllReportersForPartnersAndDelearUsersMethod(
            this.$store.getters.get_current_user_details.partner_id
          );
        } else {
          this.GetAllReportersForPartnersAndDelearUsersMethod(this.partner_id);
          this.service_ids = [];
        }
        this.user_country_code = "+91";
        if (this.StoreObj.action == "EDIT") {
          this.user_name = this.StoreObj.user_name;
          this.user_address = this.StoreObj.user_address;
          this.user_latitude = this.StoreObj.user_latitude;
          this.city = this.StoreObj.city;
          this.state = this.StoreObj.state;
          this.user_longitude = this.StoreObj.user_longitude;
          this.user_pincode = this.StoreObj.user_pincode;
          this.user_qualification = this.StoreObj.user_qualification;
          this.user_experience = this.StoreObj.user_experience;
          this.user_pan_no = this.StoreObj.user_pan_no;
          this.gst_no = this.StoreObj.gst_no;
          this.user_country_code = this.StoreObj.user_country_code;
          this.user_contact_number = this.StoreObj.user_contact_number;
          this.user_type = this.StoreObj.user_type;
          this.service_ids = this.StoreObj.service_ids;
          this.territory_ids = this.StoreObj.territory_ids;
          this.user_email_id = this.StoreObj.user_email_id;
          this.imgSrc = this.StoreObj.user_profile_pic_url;
        }
      }
    },
  },
  computed: {
    allProductsSelected() {
      return this.GetAllServicesList.length === this.service_ids.length;
    },
    someProductsSelected() {
      return this.GetAllServicesList.length > 0 && !this.allProductsSelected;
    },
    icon() {
      if (this.allProductsSelected) return "mdi-close-box";
      if (this.someProductsSelected) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
  },
  mounted() {
    this.CountryList = CountryList;
    this.GetAllServicesMethod("PRODUCT", "ACTIVE");
  },
  methods: {
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
        // self.uploadImageToS3();
      };
    },
    async uploadImageToS3() {
      this.isLoading = true;
      let result = await this.GenerateS3URLMethods(
        `${
          this.$store.getters.get_current_user_details.organization_id
        }/PROFILE_PIC/${new Date().getTime()}_${this.selectedFile.name}`,
        this.selectedFile
      );
      this.profile_pic_url = result.profile_pic_url;
      if (this.StoreObj.action == "CREATEREP") {
        this.CreateServicePartner();
      } else if (this.StoreObj.action == "EDIT") {
        this.EditServicePartner();
      }
    },
    toggle() {
      this.$nextTick(() => {
        if (this.allProductsSelected) {
          this.service_ids = [];
        } else {
          this.service_ids = this.GetAllServicesList.map(
            (item) => item.service_id
          );
        }
      });
    },
    valicateCreateReps() {
      if (this.$refs.form.validate()) {
        if (
          this.imgSrc != undefined &&
          this.imgSrc != null &&
          this.imgSrc != ""
        ) {
          this.uploadImageToS3();
        } else {
          if (this.StoreObj.action == "CREATEREP") {
            this.CreateServicePartner();
          } else if (this.StoreObj.action == "EDIT") {
            this.EditServicePartner();
          }
        }
      } else {
        this.rendorComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all the required details",
          };
          this.rendorComp = true;
        });
      }
    },
    async EditServicePartner() {
      this.isLoading = true;
      try {
        var inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_name: this.user_name,
          user_id: this.StoreObj.user_id,
          territory_ids: this.territory_ids,
          user_profile_pic_url:
            this.StoreObj.user_profile_pic_url == this.imgSrc
              ? this.imgSrc
              : this.profile_pic_url,
          reporter_user_id:
            this.$store.getters.get_current_user_details.user_type ==
            "SERVICE_PARTNER"
              ? this.$store.getters.get_current_user_details.user_id
              : this.StoreObj.partner_id,
        };
        if (
          this.user_address != undefined &&
          this.user_address != null &&
          this.user_address != ""
        ) {
          inputParams.user_address = this.user_address;
        }
        if (
          this.user_pincode != undefined &&
          this.user_pincode != null &&
          this.user_pincode != ""
        ) {
          inputParams.user_pincode = this.user_pincode;
        }
        if (
          this.user_qualification != undefined &&
          this.user_qualification != null &&
          this.user_qualification != ""
        ) {
          inputParams.user_qualification = this.user_qualification;
        }
        if (
          this.user_experience != undefined &&
          this.user_experience != null &&
          this.user_experience != ""
        ) {
          inputParams.user_experience = this.user_experience;
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
        if (this.city != undefined && this.city != null && this.city != "") {
          inputParams.city = this.city;
        }
        if (this.state != undefined && this.state != null && this.state != "") {
          inputParams.state = this.state;
        }
        if (
          this.service_ids != undefined &&
          this.service_ids != null &&
          this.service_ids != ""
        ) {
          inputParams.service_ids = this.service_ids;
        }
        let result = await API.graphql(
          graphqlOperation(UpdatePartnerUsers, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.UpdatePartnerUsers);
        if (ResultObject.status == "SUCCESS") {
          this.rendorComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.rendorComp = true;
          });

          this.ServicePartnerUserEmit((this.Toggle = 2));
        }
        this.isLoading = false;
      } catch (error) {
        this.rendorComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.rendorComp = true;
        });

        this.isLoading = false;
      }
    },
    async CreateServicePartner() {
      this.isLoading = true;
      try {
        var inputParams = {
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_name: this.user_name,
          user_type: this.user_type,
          territory_ids: this.territory_ids,
          user_profile_pic_url:
            this.StoreObj.user_profile_pic_url == this.imgSrc
              ? this.imgSrc
              : this.profile_pic_url,
          reporter_user_id:
            this.$store.getters.get_current_user_details.user_type ==
            "SERVICE_PARTNER"
              ? this.$store.getters.get_current_user_details.user_id
              : this.StoreObj.partner_id,
        };
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
          inputParams.user_email_id = this.user_email_id;
        }
        if (
          this.user_pincode != undefined &&
          this.user_pincode != null &&
          this.user_pincode != ""
        ) {
          inputParams.user_pincode = this.user_pincode;
        }
        if (
          this.user_qualification != undefined &&
          this.user_qualification != null &&
          this.user_qualification != ""
        ) {
          inputParams.user_qualification = this.user_qualification;
        }
        if (
          this.user_experience != undefined &&
          this.user_experience != null &&
          this.user_experience != ""
        ) {
          inputParams.user_experience = this.user_experience;
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
        if (this.city != undefined && this.city != null && this.city != "") {
          inputParams.city = this.city;
        }
        if (this.state != undefined && this.state != null && this.state != "") {
          inputParams.state = this.state;
        }
        if (
          this.user_address != undefined &&
          this.user_address != null &&
          this.user_address != ""
        ) {
          inputParams.user_address = this.user_address;
        }
        if (
          this.service_ids != undefined &&
          this.service_ids != null &&
          this.service_ids != ""
        ) {
          inputParams.service_ids = this.service_ids;
        }
        let result = await API.graphql(
          graphqlOperation(CreatePartnerUser, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.CreatePartnerUser);
        if (ResultObject.status == "SUCCESS") {
          this.rendorComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.rendorComp = true;
          });

          this.ServicePartnerUserEmit((this.Toggle = 2));
        }
        this.isLoading = false;
      } catch (error) {
        this.rendorComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.rendorComp = true;
        });

        this.isLoading = false;
      }
    },
    ServicePartnerUserEmit(Toggle) {
      this.$emit("clicked", Toggle);
      this.$refs.form.reset();
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
