<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="routerComp" />
    <v-dialog :value="dialogAddUser" persistent max-width="80%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2 white--text">
            {{
              StoreObj.action == "CREATE" ? "Create Dealer" : "Update Dealer "
            }}
            <span v-if="StoreObj.action != 'CREATE'">{{
              StoreObj.user_name
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogAddUserEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-form ref="form">
          <v-card-text class="pb-0">
            <v-row no-gutters>
              <v-row no-gutters>
                <v-col cols="12" sm="12" md="6" xs="12">
                  <GoogleMaps
                    style="width: 100%; height: 60%"
                    :StoreObj="StoreObj"
                    @clicked="GoogleMapsEmit"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="6" xs="12" class="mt-4">
                  <v-row no-gutters>
                    <v-col cols="12" sm="12" md="6" xs="12">
                      <v-text-field
                        outlined
                        dense
                        label="Name *"
                        class="FontSize mr-2"
                        :rules="[
                          (v) => !!v || 'Required',
                          (v) =>
                            /^[0-9a-zA-Z-\s.@%$@#!^!&*(!)]+$/.test(v) ||
                            'Invalid',
                        ]"
                        v-model="user_name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" xs="12">
                      <v-text-field
                        outlined
                        dense
                        label="Email ID *"
                        class="FontSize"
                        v-model="user_email_id"
                        :rules="[
                          (v) => !!v || 'Required',
                          (v) =>
                            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                              v
                            ) || 'Email must be valid',
                        ]"
                        :readonly="StoreObj.action == 'EDIT'"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" md="2" xs="12" sm="12">
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
                        class="FontSize mr-2 ml-1"
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
                        class="FontSize mr-2"
                        v-model="user_latitude"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        readonly
                        type="number"
                        label="Longitude"
                        class="FontSize"
                        v-model="user_longitude"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-text-field
                    outlined
                    dense
                    label="Address"
                    class="FontSize"
                    v-model="user_address"
                  ></v-text-field>
                  <v-row class="mb-n8">
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
                        dense
                        outlined
                        type="number"
                        label="Pincode"
                        class="FontSize"
                        v-model="user_pincode"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="mb-n8">
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
                    :items="
                      GetAllTerritoriesList.filter(
                        (item) => item.territory_id != 'ALL'
                      )
                    "
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
                        class="elevation-1 mr-4"
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
                    <!-- <v-col cols="12" md="6" sm="12" xs="12">
                      <v-checkbox
                        class="mt-n2"
                        v-model="checkbox"
                        label="Enable Dealer To Create Tickets"
                      ></v-checkbox>
                      <v-checkbox
                        class="mt-n2"
                        v-model="enableSerialNumberTicket"
                        label="Enable Dealer To Create Tickets on Serial Number Based"
                      ></v-checkbox>
                      <v-checkbox
                        class="mt-n2"
                        v-model="enableOriginalTicketCreation"
                        label="Enable Original Ticket Creation"
                      ></v-checkbox>
                      <v-checkbox
                        class="mt-n2"
                        v-model="checkboxRep"
                        label="Enable Dealer To Create Service Reps and Agents"
                      ></v-checkbox>

                      <v-checkbox
                        class="mt-n2"
                        v-model="checkboxProdFleet"
                        label="Enable/Disable Product Fleet Tab"
                      ></v-checkbox>
                      <v-checkbox
                        class="mt-n2"
                        v-model="checkboxCustTagged"
                        label="Enable/Disable Customer Tagged Product"
                      ></v-checkbox>
                      <v-checkbox
                        class="mt-n2"
                        v-model="checkboxCust"
                        label="Enable/Disable Customer Tab"
                      ></v-checkbox>
                      <v-checkbox
                        class="mt-n2"
                        v-model="checkboxReport"
                        label="Enable/Disable Report Tab"
                      ></v-checkbox>
                    </v-col> -->
                  </v-row>
                  <!-- <div class="mt-3 mb-3">
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          <span style="font-weight: bold">
                            Dealer Settings
                          </span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="mt-2">
                          <v-row>
                            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                              <v-checkbox
                                class="mt-n2"
                                v-model="checkbox"
                                label="Enable Dealer To Create Tickets"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                              <v-checkbox
                                class="mt-n2"
                                v-model="enableSerialNumberTicket"
                                label="Enable Dealer To Create Tickets on Serial Number Based"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                              <v-checkbox
                                class="mt-n2"
                                v-model="enableOriginalTicketCreation"
                                label="Enable Original Ticket Creation"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                              <v-checkbox
                                class="mt-n2"
                                v-model="checkboxRep"
                                label="Enable Dealer To Create Service Reps and Agents"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                              <v-checkbox
                                class="mt-n2"
                                v-model="checkboxProdFleet"
                                label="Enable/Disable Product Fleet Tab"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                              <v-checkbox
                                class="mt-n2"
                                v-model="checkboxCustTagged"
                                label="Enable/Disable Customer Tagged Product"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                              <v-checkbox
                                class="mt-n2"
                                v-model="checkboxCust"
                                label="Enable/Disable Customer Tab"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                              <v-checkbox
                                class="mt-n2"
                                v-model="checkboxReport"
                                label="Enable/Disable Report Tab"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div> -->
                </v-col>
              </v-row>
            </v-row>
            <div>
              <span style="font-weight: bold; font-size: 17px" class="mb-4">
                Settings
              </span>
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header style="font-weight: bold"
                    >Ticket</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <div class="d-flex" style="position: relative; top: 10px">
                      <div class="mr-3">
                        <v-checkbox
                          class="mt-n2"
                          v-model="checkbox"
                          label="Enable to display create button"
                        ></v-checkbox>
                      </div>
                      <!-- <div class="ml-3">
                        <v-checkbox
                          class="mt-n2"
                          v-model="enableSerialNumberTicket"
                          label="Enable to display button (serial number based)"
                        ></v-checkbox>
                      </div> -->
                    </div>
                    <v-divider />
                    <div class="ml-7 mt-5" v-if="checkbox">
                      <v-checkbox
                        class="mt-n2"
                        v-model="enableSerialNumberTicket"
                        label="Enable to create ticket with or without serial number"
                      ></v-checkbox>
                      <v-checkbox
                        class="mt-n2"
                        v-model="enableOriginalTicketCreation"
                        label="Enable Original Based Ticket Creation"
                      ></v-checkbox>

                      <!-- <p class="FontSize">Enable to </p> -->
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-3">
                  <v-expansion-panel-header style="font-weight: bold"
                    >My Product Fleet</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <div class="d-flex" style="position: relative; top: 10px">
                      <div class="mr-3">
                        <v-checkbox
                          class="mt-n2"
                          v-model="checkboxProdFleet"
                          label="Enable/Disable Product Fleet Tab"
                        ></v-checkbox>
                      </div>
                    </div>
                    <v-divider />
                    <div class="ml-7 mt-5" v-if="checkboxProdFleet">
                      <v-checkbox
                        class="mt-n2"
                        v-model="enableRaiseComplaint"
                        label="Enable/Disable option to raise a complaint"
                      ></v-checkbox>

                      <!-- <p class="FontSize">Enable to </p> -->
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-3">
                  <v-expansion-panel-header style="font-weight: bold"
                    >My Customers</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <div class="d-flex" style="position: relative; top: 10px">
                      <div class="mr-3">
                        <v-checkbox
                          class="mt-n2"
                          v-model="checkboxCust"
                          label="Enable/Disable Customer Tab"
                        ></v-checkbox>
                      </div>
                    </div>
                    <v-divider />
                    <div class="ml-7 mt-5" v-if="checkboxCust">
                      <v-checkbox
                        class="mt-n2"
                        v-model="checkboxCustTagged"
                        label="Enable/Disable Customer Tagged Product"
                      ></v-checkbox>
                      <v-checkbox
                        class="mt-n2"
                        v-model="checkboxTaggedProdCreateBtn"
                        label="Enable/Disable create ticket button within tagged products tab"
                      ></v-checkbox>
                      <!-- <p class="FontSize">Enable to </p> -->
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-3">
                  <v-expansion-panel-header style="font-weight: bold"
                    >Reports</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <div class="d-flex" style="position: relative; top: 10px">
                      <div class="mr-3">
                        <v-checkbox
                          class="mt-n2"
                          v-model="checkboxReport"
                          label="Enable/Disable Report Tab"
                        ></v-checkbox>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-3">
                  <v-expansion-panel-header style="font-weight: bold"
                    >Service Reps & Agent</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <div class="d-flex" style="position: relative; top: 10px">
                      <div class="mr-3">
                        <v-checkbox
                          class="mt-n2"
                          v-model="checkboxRep"
                          label="Enable Dealer To Create Service Reps and Agents"
                        ></v-checkbox>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-3">
                  <v-expansion-panel-header style="font-weight: bold"
                    >Service Co-Ordinators</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <div class="d-flex" style="position: relative; top: 10px">
                      <div class="mr-3">
                        <v-checkbox
                          class="mt-n2"
                          v-model="enableServCoTab"
                          label="Enable/Disable service co-ordinators tab"
                        ></v-checkbox>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-3">
                  <v-expansion-panel-header style="font-weight: bold"
                    >Representatives</v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <div class="d-flex" style="position: relative; top: 10px">
                      <div class="mr-3">
                        <v-checkbox
                          class="mt-n2"
                          v-model="enableRepTab"
                          label="Enable/Disable representatives tab"
                        ></v-checkbox>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card-text>
        </v-form>
        <v-card-actions
          class="pt-0 mt-3"
          v-if="
            $store.getters.get_user_type != 'AGENT' &&
            $store.getters.get_user_type != 'MANAGER'
          "
        >
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="isLoading"
            class="mr-1 mb-3"
            color="primary"
            @click="validateMethod()"
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
var aws = require("aws-sdk");
window.Buffer = Buffer;
import CountryList from "@/JsonFiles/CountryList.json";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import { Buffer } from "buffer";
import { API, graphqlOperation } from "aws-amplify";
import { GetAllUsers } from "@/mixins/Users/GetAllUsers.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllTerritories } from "@/mixins/Terretories/PincodesTaggedToTerritory.js";
import { CreateDealerUser, UpdateDealerUser } from "@/graphql/mutations.js";
import { GetAllDesignations } from "@/mixins/MastersSetting/GetAllDesignations.js";
export default {
  props: {
    StoreObj: Object,
    dialogAddUser: Boolean,
    StoreServiceDealerObj: Object,
  },
  mixins: [GetAllUsers, GenerateS3URL, GetAllTerritories, GetAllDesignations],
  components: {
    Snackbar,
    GoogleMaps,
  },
  data: () => ({
    city: "",
    state: "",
    gst_no: "",
    imgSrc: "",
    user_name: "",
    category_id: "",
    user_pan_no: "",
    designation: "",
    user_address: "",
    user_pincode: "",
    user_email_id: "",
    territory_ids: "",
    user_latitude: "",
    user_longitude: "",
    user_experience: "",
    user_qualification: "",
    user_contact_number: "",
    user_country_code: "+91",
    setting_status: "ACTIVE",
    reporting_to_manager_id: "",
    Toggle: 0,
    loading: false,
    checkbox: false,
    isLoading: false,
    routerComp: true,
    checkboxRep: false,
    CountryList: [],
    GetAllUsersList: [],
    GetAllTerritoriesList: [],
    SnackBarComponent: {},
    checkboxProdFleet: false,
    checkboxCust: false,
    checkboxReport: false,
    enableRepTab: false,
    enableServCoTab: false,
    checkboxCustTagged: false,
    checkboxTaggedProdCreateBtn: false,
    enableSerialNumberTicket: false,
    enableOriginalTicketCreation: false,
    enableRaiseComplaint: false,
  }),
  watch: {
    dialogAddUser(val) {
      if (val == true) {
        this.GetAllUsersMethod(undefined, "ACTIVE");
        this.GetAllTerritoriesMethod(
          "ACTIVE",
          undefined,
          undefined,
          "TERRITORY",
          undefined
        );
        if (this.StoreObj.action == "EDIT") {
          this.user_name = this.StoreObj.user_name;
          this.lat = this.StoreObj.lat;
          this.lng = this.StoreObj.lng;
          this.city = this.StoreObj.city;
          this.state = this.StoreObj.state;
          this.user_email_id = this.StoreObj.user_email_id;
          this.user_address = this.StoreObj.user_address;
          this.user_latitude = this.StoreObj.user_latitude;
          this.user_longitude = this.StoreObj.user_longitude;
          this.user_pincode = this.StoreObj.user_pincode;
          this.user_pan_no = this.StoreObj.user_pan_no;
          this.user_qualification = this.StoreObj.user_qualification;
          this.user_experience = this.StoreObj.user_experience;
          this.gst_no = this.StoreObj.gst_no;
          this.user_country_code = "+91";
          this.user_contact_number = this.StoreObj.user_contact_number;
          this.territory_ids = this.StoreObj.territory_ids;
          this.checkbox = this.StoreObj.enable_ticket_creation;
          this.checkboxRep = this.StoreObj.enable_user_creation;
          this.imgSrc = this.StoreObj.user_profile_pic_url;
          this.designation = this.StoreObj.designation_id;
          this.reporting_to_manager_id = this.StoreObj.reporting_to_manager_id;
          this.checkboxProdFleet = this.StoreObj.is_product_fleet_tab_visible;
          this.enableRaiseComplaint =
            this.StoreObj.enable_ticket_creation_for_product_fleet;
          this.checkboxCust = this.StoreObj.is_customer_tab_visible;
          this.checkboxReport = this.StoreObj.is_report_tab_visible;
          this.enableServCoTab = this.StoreObj.enable_service_co_ordinators_tab;
          this.enableRepTab = this.StoreObj.enable_representatives_tab;
          this.checkboxCustTagged =
            this.StoreObj.is_customer_tagged_product_tab_visible;
          this.enableSerialNumberTicket =
            this.StoreObj.is_serial_number_based_ticket_creation;
          this.enableOriginalTicketCreation =
            this.StoreObj.is_original_ticket_creation_enabled;
          this.checkboxTaggedProdCreateBtn =
            this.StoreObj.enable_ticket_creation_for_customer_tagged_product;
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
    this.GetAllDesignationsMethod(this.setting_status);
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
    async updateDealersMethod() {
      var inputParams = {
        updater_user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        user_id: this.StoreObj.user_id,
        user_name: this.user_name,
        territory_ids: this.territory_ids,
        enable_ticket_creation: this.checkbox,
        enable_user_creation: this.checkboxRep,
        user_profile_pic_url:
          this.StoreObj.user_profile_pic_url == this.imgSrc
            ? this.imgSrc
            : this.profile_pic_url,
        reporter_user_id: this.StoreObj.user_id,
        is_product_fleet_tab_visible: this.checkboxProdFleet,
        enable_ticket_creation_for_product_fleet: this.enableRaiseComplaint,
        is_customer_tab_visible: this.checkboxCust,
        is_report_tab_visible: this.checkboxReport,
        enable_service_co_ordinators_tab: this.enableServCoTab,
        enable_representatives_tab: this.enableRepTab,
        is_customer_tagged_product_tab_visible: this.checkboxCustTagged,
        enable_ticket_creation_for_customer_tagged_product:
          this.checkboxTaggedProdCreateBtn,
        is_serial_number_based_ticket_creation: this.enableSerialNumberTicket,
        is_original_ticket_creation_enabled: this.enableOriginalTicketCreation,
      };
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
        this.user_contact_number != undefined &&
        this.user_contact_number != null &&
        this.user_contact_number != ""
      ) {
        if (
          this.user_country_code != undefined &&
          this.user_country_code != null &&
          this.user_country_code != ""
        ) {
          inputParams.user_country_code = this.user_country_code;
        }
      }
      if (
        this.user_contact_number != undefined &&
        this.user_contact_number != null &&
        this.user_contact_number != ""
      ) {
        inputParams.user_contact_number = this.user_contact_number;
      }
      if (this.city != undefined && this.city != null && this.city != "") {
        inputParams.city = this.city;
      }
      if (this.state != undefined && this.state != null && this.state != "") {
        inputParams.state = this.state;
      }
      if (
        this.user_pan_no != undefined &&
        this.user_pan_no != null &&
        this.user_pan_no != ""
      ) {
        inputParams.user_pan_no = this.user_pan_no;
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
        this.gst_no != undefined &&
        this.gst_no != null &&
        this.gst_no != ""
      ) {
        inputParams.gst_no = this.gst_no;
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
      if (
        this.designation != undefined &&
        this.designation != null &&
        this.designation != ""
      ) {
        if (typeof this.designation != "string") {
          inputParams.designation_id = this.designation.setting_id;
        } else {
          inputParams.designation_id = this.designation;
        }
      }
      if (
        this.designation != undefined &&
        this.designation != null &&
        this.designation != ""
      ) {
        if (typeof this.designation != "string") {
          inputParams.designation_name = this.designation.setting_name;
        }
      }
      try {
        this.isLoading = true;
        let result = await API.graphql(
          graphqlOperation(UpdateDealerUser, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.UpdateDealerUser);
        if (ResultObject.status == "SUCCESS") {
          this.routerComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.routerComp = true;
          });
          this.dialogAddUserEmit((this.Toggle = 2));
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.routerComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.routerComp = true;
        });
      }
    },
    async createsDealerMethod() {
      var inputParams = {
        creator_user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        reporter_user_id: this.user_id,
        user_type: "DEALER_OWNER",
        user_email_id: this.user_email_id,
        user_name: this.user_name,
        territory_ids: this.territory_ids,
        enable_ticket_creation:
          this.checkbox != undefined &&
          this.checkbox != null &&
          this.checkbox != ""
            ? this.checkbox
            : undefined,
        enable_user_creation:
          this.checkboxRep != undefined &&
          this.checkboxRep != null &&
          this.checkboxRep != ""
            ? this.checkboxRep
            : undefined,
        user_profile_pic_url:
          this.StoreObj.user_profile_pic_url == this.imgSrc
            ? this.imgSrc
            : this.profile_pic_url,
        is_product_fleet_tab_visible: this.checkboxProdFleet,
        enable_ticket_creation_for_product_fleet: this.enableRaiseComplaint,
        is_customer_tab_visible: this.checkboxCust,
        is_report_tab_visible: this.checkboxReport,
        enable_service_co_ordinators_tab: this.enableServCoTab,
        enable_representatives_tab: this.enableRepTab,
        is_customer_tagged_product_tab_visible: this.checkboxCustTagged,
        is_serial_number_based_ticket_creation: this.enableSerialNumberTicket,
        is_original_ticket_creation_enabled: this.enableOriginalTicketCreation,
        enable_ticket_creation_for_customer_tagged_product:
          this.checkboxTaggedProdCreateBtn,
      };
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
        this.user_contact_number != undefined &&
        this.user_contact_number != null &&
        this.user_contact_number != ""
      ) {
        if (
          this.user_country_code != undefined &&
          this.user_country_code != null &&
          this.user_country_code != ""
        ) {
          inputParams.user_country_code = this.user_country_code;
        }
      }
      if (
        this.user_contact_number != undefined &&
        this.user_contact_number != null &&
        this.user_contact_number != ""
      ) {
        inputParams.user_contact_number = this.user_contact_number;
      }
      if (this.city != undefined && this.city != null && this.city != "") {
        inputParams.city = this.city;
      }
      if (this.state != undefined && this.state != null && this.state != "") {
        inputParams.state = this.state;
      }
      if (
        this.user_pan_no != undefined &&
        this.user_pan_no != null &&
        this.user_pan_no != ""
      ) {
        inputParams.user_pan_no = this.user_pan_no;
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
        this.gst_no != undefined &&
        this.gst_no != null &&
        this.gst_no != ""
      ) {
        inputParams.gst_no = this.gst_no;
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
        this.service_ids != undefined &&
        this.service_ids != null &&
        this.service_ids != ""
      ) {
        inputParams.service_ids = this.service_ids;
      }
      try {
        this.isLoading = true;
        let result = await API.graphql(
          graphqlOperation(CreateDealerUser, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.CreateDealerUser);
        if (ResultObject.status == "SUCCESS") {
          this.routerComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.Status_Message,
            };
            this.routerComp = true;
          });
          this.dialogAddUserEmit((this.Toggle = 2));
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.routerComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
          this.routerComp = true;
        });
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
          this.createsDealerMethod();
        } else {
          this.updateDealersMethod();
        }
      } else {
        if (this.StoreObj.action == "CREATE") {
          this.createsDealerMethod();
        } else {
          this.updateDealersMethod();
        }
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
            this.createsDealerMethod();
          }
        } else if (this.StoreObj.action == "EDIT") {
          if (
            this.imgSrc != undefined &&
            this.imgSrc != null &&
            this.imgSrc != ""
          ) {
            this.uploadImageToS3();
          } else {
            this.updateDealersMethod();
          }
        }
      } else {
        this.routerComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fields marked with asterisks(*) are mandatory",
          };
          this.routerComp = true;
        });
      }
    },
    dialogAddUserEmit(Toggle) {
      this.$refs.form.reset();
      this.$emit("clicked", Toggle);
      this.imgSrc = [];
    },
  },
};
</script>
