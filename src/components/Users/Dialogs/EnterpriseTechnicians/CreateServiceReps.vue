<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="rendomComp" />
    <v-dialog persistent width="80%" :value="CreateServiceRepsDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2 white--text">
            {{
              StoreObj.action == "CREATE"
                ? "Create Service Representative"
                : "Update"
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
            @click="CreateServiceRepsDialogEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-form ref="form">
            <v-row no-gutters>
              <v-col cols="12" md="6" xs="12" sm="12">
                <GoogleMaps
                  style="width: 100%; height: 60%"
                  :StoreObj="StoreObj"
                  @clicked="GoogleMapsEmit"
                />
              </v-col>
              <v-col cols="12" md="6" sm="12" xs="12">
                <v-row>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Name *"
                      v-model="user_name"
                      class="FontSize mt-4"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" xs="12" md="6">
                    <v-text-field
                      dense
                      outlined
                      v-model="rep_id"
                      label="Employee ID"
                      class="FontSize mt-4"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="12" md="4" xs="12">
                    <v-select
                      dense
                      outlined
                      item-text="name"
                      class="FontSize"
                      :items="CountryList"
                      label="Country Code *"
                      item-value="dial_code"
                      v-model="user_country_code"
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
                      class="FontSize ml-2"
                      label="Contact Number *"
                      v-model="user_contact_number"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) =>
                          /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(
                            v
                          ) || 'Invalid',
                        (v) =>
                          satisfiedPhoneNum ||
                          'Invalid number format for the selected country',
                      ]"
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col cols="12" sm="12" md="8" xs="12">
                    <v-text-field
                      dense
                      outlined
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
                  </v-col> -->
                </v-row>
                <v-text-field
                  dense
                  outlined
                  label="Address"
                  class="FontSize"
                  v-model="user_address"
                ></v-text-field>
                <v-row class="mb-n10">
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      label="City"
                      class="FontSize"
                      v-model="city"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      label="State"
                      class="FontSize"
                      v-model="state"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Pincode"
                      class="FontSize"
                      v-model="user_pincode"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-select
                      dense
                      outlined
                      class="FontSize"
                      item-value="user_id"
                      item-text="user_name"
                      label="Select Manager *"
                      :items="GetAllUsersList"
                      v-model="reporter_user_id"
                      :rules="[(v) => !!v || 'Required']"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      type="number"
                      label="Latitude"
                      class="FontSize"
                      v-model="user_latitude"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      type="number"
                      class="FontSize"
                      label="Longitude"
                      v-model="user_longitude"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n6">
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Qualification"
                      v-model="user_qualification"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" xs="12" sm="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Experience"
                      v-model="user_experience"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="PAN Number"
                      v-model="user_pan_no"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-autocomplete
                  dense
                  outlined
                  multiple
                  class="FontSize"
                  label="Product *"
                  v-model="service_ids"
                  item-value="service_id"
                  item-text="service_name"
                  :items="GetAllServicesList"
                  :rules="[(v) => !!v || 'Required']"
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
                              ? 'indigo darken-4'
                              : ''
                          "
                        >
                          {{ AllProducts }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title> Select All </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-autocomplete>
                <v-autocomplete
                  dense
                  outlined
                  multiple
                  class="FontSize"
                  v-model="territory_ids"
                  item-value="territory_id"
                  item-text="territory_name"
                  label="Territory Name(s) *"
                  :items="GetAllTerritoriesList"
                  :rules="[(v) => !!v || 'Required']"
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
                <v-col cols="12" md="4" sm="12">
                  <v-row no-gutters>
                    <v-col cols="12" sm="12" md="12" xs="12">
                      <v-card
                        @click="checkImagePresent()"
                        max-width="800px"
                        height="100px"
                        align="center"
                        class="elevation-1 ml-6"
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
                              (imgSrc = null), (uploadedImage = false)
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
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-5">
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="isLoading"
            color="primary"
            @click="valicateCreateReps"
            class="white--text mb-6"
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
import CountryList from "@/JsonFiles/CountryList.json";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GetAllUsers } from "@/mixins/Users/GetAllUsers.js";
import { GetAllServices } from "@/mixins/Product/GetAllServices.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { GetAllDesignations } from "@/mixins/MastersSetting/GetAllDesignations.js";
import {
  Create_Enterprise_Representative,
  Update_Enterprise_Representative,
} from "@/graphql/mutations.js";
var aws = require("aws-sdk");
import { Buffer } from "buffer";
window.Buffer = Buffer;
export default {
  props: {
    StoreObj: Object,
    CreateServiceRepsDialog: Boolean,
  },
  components: {
    Snackbar,
    GoogleMaps,
  },
  mixins: [
    GetAllUsers,
    GenerateS3URL,
    GetAllServices,
    GetAllTerritories,
    GetAllDesignations,
  ],
  data: () => ({
    Toggle: 0,
    city: "",
    state: "",
    rep_id: "",
    imgSrc: "",
    user_name: "",
    user_pan_no: "",
    user_address: "",
    user_pincode: "",
    user_latitude: "",
    user_longitude: "",
    user_experience: "",
    reporter_user_id: "",
    user_qualification: "",
    user_contact_number: "",
    current_profile_pic: "",
    user_country_code: "+91",
    setting_status: "ACTIVE",
    isLoading: false,
    rendomComp: true,
    CountryList: [],
    service_ids: [],
    selectedFile: [],
    territory_ids: [],
    GetAllUsersList: [],
    SnackBarComponent: {},
    satisfiedPhoneNum: undefined,
  }),
  watch: {
    CreateServiceRepsDialog(val) {
      if (val == true) {
        this.GetAllUsersMethod(undefined, "ACTIVE", undefined);
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
          this.user_address = this.StoreObj.user_address;
          this.city = this.StoreObj.city;
          this.state = this.StoreObj.state;
          this.user_latitude = this.StoreObj.user_latitude;
          this.user_pincode = this.StoreObj.user_pincode;
          this.user_qualification = this.StoreObj.user_qualification;
          this.user_experience = this.StoreObj.user_experience;
          this.user_pan_no = this.StoreObj.user_pan_no;
          this.user_longitude = this.StoreObj.user_longitude;
          this.user_country_code = this.StoreObj.user_country_code;
          this.user_contact_number = this.StoreObj.user_contact_number;
          this.reporter_user_id = this.StoreObj.reporter_user_id;
          this.service_ids = this.StoreObj.service_ids;
          this.territory_ids = this.StoreObj.territory_ids;
          this.rep_id = this.StoreObj.employee_id;
          this.imgSrc = this.StoreObj.user_profile_pic_url;
        }
      }
    },
    user_contact_number(val) {
      if (this.user_country_code === "+60") {
        this.satisfiedPhoneNum = this.CountryList.some(
          (item) => item.dial_code === "+60" && val.length >= item.digit_count
        );
      } else {
        this.satisfiedPhoneNum = false;
      }
      if (this.user_country_code !== "+60") {
        if (val.length === 10) {
          this.satisfiedPhoneNum = true;
        } else {
          this.satisfiedPhoneNum = false;
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
    someTerritoriesSelected() {
      return (
        this.GetAllTerritoriesList.length > 0 && !this.allTerritoriesSelected
      );
    },
    allTerritoriesSelected() {
      return this.GetAllTerritoriesList.length === this.territory_ids.length;
    },
    AllProducts() {
      if (this.allProductsSelected) return "mdi-close-box";
      if (this.someProductsSelected) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    selectAllTerritories() {
      if (this.allTerritoriesSelected) return "mdi-close-box";
      if (this.someTerritoriesSelected) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
  },
  mounted() {
    this.GetAllServicesMethod("PRODUCT", "ACTIVE");
    this.GetAllDesignationsMethod(this.setting_status);
    this.CountryList = CountryList;
    console.log("COUNTRY_LIST", this.CountryList);
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
      this.CreateEditServiceRep();
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
    async valicateCreateReps() {
      if (this.$refs.form.validate()) {
        if (
          this.imgSrc != undefined &&
          this.imgSrc != null &&
          this.imgSrc != ""
        ) {
          this.uploadImageToS3();
        } else {
          this.CreateEditServiceRep();
        }
      } else {
        this.rendomComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all the required details",
          };
          this.rendomComp = true;
        });
      }
    },
    async CreateEditServiceRep() {
      this.isLoading = true;
      try {
        let mutation_name =
          this.StoreObj.action === "CREATE"
            ? Create_Enterprise_Representative
            : Update_Enterprise_Representative;
        let mutation_result =
          this.StoreObj.action === "CREATE"
            ? "Create_Enterprise_Representative"
            : "Update_Enterprise_Representative";
        var inputParams = {
          reporter_user_id: this.reporter_user_id,
          user_name: this.user_name,
          user_address:
            this.user_address != undefined &&
            this.user_address != null &&
            this.user_address != ""
              ? this.user_address
              : undefined,
          city:
            this.city != undefined && this.city != null && this.city != ""
              ? this.city
              : undefined,
          state:
            this.state != undefined && this.state != null && this.state != ""
              ? this.state
              : undefined,
          user_latitude:
            this.user_latitude != undefined &&
            this.user_latitude != null &&
            this.user_latitude != ""
              ? this.user_latitude
              : undefined,
          user_pan_no:
            this.user_pan_no != undefined &&
            this.user_pan_no != null &&
            this.user_pan_no != ""
              ? this.user_pan_no
              : undefined,
          user_experience:
            this.user_experience != undefined &&
            this.user_experience != null &&
            this.user_experience != ""
              ? this.user_experience
              : undefined,
          user_qualification:
            this.user_qualification != undefined &&
            this.user_qualification != null &&
            this.user_qualification != ""
              ? this.user_qualification
              : undefined,
          user_pincode:
            this.user_pincode != undefined &&
            this.user_pincode != null &&
            this.user_pincode != ""
              ? this.user_pincode
              : undefined,
          user_longitude:
            this.user_longitude != undefined &&
            this.user_longitude != null &&
            this.user_longitude != ""
              ? this.user_longitude
              : undefined,
          employee_id:
            this.rep_id != undefined && this.rep_id != "" && this.rep_id != null
              ? this.rep_id
              : undefined,
          creator_user_id:
            this.StoreObj.action == "CREATE"
              ? this.$store.getters.get_current_user_details.user_id
              : undefined,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_country_code: this.user_country_code,
          user_contact_number: this.user_contact_number,
          territory_ids: this.territory_ids,
          service_ids: this.service_ids,
          user_profile_pic_url:
            this.StoreObj.user_profile_pic_url == this.imgSrc
              ? this.imgSrc
              : this.profile_pic_url,
          updater_user_id:
            this.StoreObj.action == "EDIT"
              ? this.$store.getters.get_current_user_details.user_id
              : undefined,
          user_id:
            this.StoreObj.action == "EDIT" ? this.StoreObj.user_id : undefined,
        };
        let result = await API.graphql(
          graphqlOperation(mutation_name, {
            input: inputParams,
          })
        );
        let ResultObject = JSON.parse(result.data[mutation_result]);
        if (ResultObject.status == "SUCCESS") {
          this.rendomComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.rendomComp = true;
          });
          this.CreateServiceRepsDialogEmit((this.Toggle = 2));
        }
        this.isLoading = false;
      } catch (error) {
        console.log("Err", error);
        this.rendomComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.rendomComp = true;
        });
        this.isLoading = false;
      }
    },
    CreateServiceRepsDialogEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
        this.imgSrc = [];
      }
      this.$emit("clicked", Toggle);
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
