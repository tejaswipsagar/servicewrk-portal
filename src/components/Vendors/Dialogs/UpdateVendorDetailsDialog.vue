<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="UpdateVendorDetailsDialog" persistent :width="1200">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Update Vendor Details</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="UpdateVendorDetailsDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <v-row align="center" class="pa-0">
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <GoogleMaps style="width: 100%" @clicked="GoogleMapsEmit" />
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="12" xs="12">
              <div class="d-flex justify-center mb-2">
                <div style="position: absolute; right: 240px; z-index: 1">
                  <v-btn
                    icon
                    v-if="imgFile !== null && tempImgURL !== null"
                    @click="(imgFile = null), (tempImgURL = null)"
                    ><v-icon color="red" size="15"
                      >mdi-close-circle</v-icon
                    ></v-btn
                  >
                  <v-btn
                    icon
                    v-if="imgFile === null && tempImgURL === null"
                    @click="ActivateFileInputMethod()"
                    ><v-icon color="blue" size="15"
                      >mdi-plus-circle</v-icon
                    ></v-btn
                  >
                </div>
                <v-file-input
                  ref="fileInput"
                  v-model="imgFile"
                  v-show="false"
                  @change="GetImgInput(imgFile)"
                />
                <v-card :width="150" elevation="0">
                  <v-img
                    style="border-radius: 80px"
                    :width="150"
                    :src="
                      tempImgURL !== null
                        ? tempImgURL
                        : require('@/assets/img/profileLogo3.png')
                    "
                  >
                  </v-img>
                </v-card>
              </div>
              <v-form ref="form">
                <v-row class="pa-0">
                  <!-- <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorEmpId"
                      dense
                      outlined
                      label="Vendor Employee ID"
                      :rules="[(v) => !!v || 'Required']"
                    />
                  </v-col> -->
                  <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorName"
                      dense
                      outlined
                      label="Vendor Name"
                      :rules="[(v) => !!v || 'Required']"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorPrimaryCountryCode"
                      dense
                      outlined
                      label="Country Code"
                      :rules="[(v) => !!v || 'Required']"
                    />
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorPrimaryContNum"
                      dense
                      outlined
                      label="Phone Number"
                      :rules="[(v) => !!v || 'Required']"
                    />
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorEmailId"
                      dense
                      outlined
                      label="Email ID"
                      :rules="emailRules"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorQualifications"
                      dense
                      outlined
                      label="Qualifications"
                      :rules="[(v) => !!v || 'Required']"
                    />
                  </v-col>
                  <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorExp"
                      dense
                      outlined
                      label="Experience"
                      :rules="[(v) => !!v || 'Required']"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" lg="12" md="12" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorAddress"
                      dense
                      outlined
                      label="Address"
                      :rules="[(v) => !!v || 'Required']"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorLatitude"
                      dense
                      outlined
                      label="Latitude"
                      :rules="[(v) => !!v || 'Required']"
                    />
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorLongitude"
                      dense
                      outlined
                      label="Longitude"
                      :rules="[(v) => !!v || 'Required']"
                    />
                  </v-col>
                  <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                    <v-text-field
                      readonly
                      v-model="vendorPincode"
                      dense
                      outlined
                      label="Pincode"
                      :rules="[(v) => !!v || 'Required']"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorGstNum"
                      dense
                      outlined
                      label="GST Number"
                    />
                  </v-col>
                  <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                    <v-text-field
                      v-model="vendorPanNum"
                      dense
                      outlined
                      label="PAN Number"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" lg="12">
                    <v-select
                      multiple
                      v-model="vendorTerritories"
                      dense
                      outlined
                      label="Territories"
                      :items="allTerritoriesNameList"
                      item-text="territory_name"
                      item-value="territory_id"
                      :rules="[(v) => !!v || 'Required']"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="btnLoading"
            dense
            color="primary"
            @click="UpdateVendorDetailsMethod()"
            >Update<v-icon size="15" class="pl-2">mdi-pencil</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { UpdateVendorDetails } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import GoogleMaps from "@/components/Extras/GoogleMaps.vue";
import { ListTerritoriesAndPincodes } from "@/graphql/queries.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";

export default {
  mixins: [GenerateS3URL],
  props: { UpdateVendorDetailsDialog: Boolean, StoreObj: Object },
  components: {
    Snackbar,
    GoogleMaps,
  },
  data: () => ({
    btnLoading: false,
    SnackBarComponent: {},
    vendorEmpId: "",
    vendorPrimaryCountryCode: "",
    vendorName: "",
    vendorQualifications: "",
    vendorExp: "",
    vendorPanNum: "",
    vendorPincode: "",
    vendorAddress: "",
    vendorGstNum: "",
    vendorLongitude: "",
    vendorLatitude: "",
    vendorPrimaryContNum: "",
    vendorTerritories: "",
    allTerritoriesNameList: [],
    vendorEmailId: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    imgFile: null,
    tempImgURL: null,
    finalImgURL: "",
    skipS3Upload: false,
  }),
  watch: {
    UpdateVendorDetailsDialog(val) {
      if (val) {
        console.log("STOREOBJ", this.StoreObj.vendor_profile_pic_url);
        // this.vendorEmpId = this.StoreObj.vendor_employee_id || "";
        this.vendorPrimaryCountryCode =
          this.StoreObj.vendor_primary_country_code || "";
        this.vendorName = this.StoreObj.vendor_name;
        this.vendorQualifications = this.StoreObj.vendor_qualification || "";
        this.vendorExp = this.StoreObj.vendor_experience || "";
        this.vendorPanNum = this.StoreObj.vendor_pan_no || "";
        this.vendorPincode = this.StoreObj.vendor_pincode || "";
        this.vendorAddress = this.StoreObj.vendor_address || "";
        this.vendorGstNum = this.StoreObj.vendor_gst_no || "";
        this.vendorLongitude = this.StoreObj.vendor_longitude || "";
        this.vendorLatitude = this.StoreObj.vendor_latitude || "";
        this.vendorPrimaryContNum =
          this.StoreObj.vendor_primary_contact_number || "";
        this.vendorTerritories = this.StoreObj.territory_ids || "";
        this.vendorEmailId = this.StoreObj.vendor_email_id || "";
        if ("vendor_profile_pic_url" in this.StoreObj) {
          console.log("CHECHHHHHH");
          this.tempImgURL = this.StoreObj.vendor_profile_pic_url;
          this.imgFile = {};
          this.finalImgURL = this.StoreObj.vendor_profile_pic_url;
          this.skipS3Upload = true;
        }
      }
    },

    async vendorPincode(PINCODE) {
      if (PINCODE) {
        try {
          const result = await API.graphql(
            graphqlOperation(ListTerritoriesAndPincodes, {
              input: {
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                territory_status: "ACTIVE",
                required_type: "TERRITORY_BY_PINCODE",
                territory_type: "NON_GEO_BASED",
                territory_pincode: PINCODE,
              },
            })
          );
          const response = JSON.parse(result.data.ListTerritoriesAndPincodes);
          this.allTerritoriesNameList = response.data.Items;
          // if (response.overAllTerritoryDetails) {
          //   this.SnackBarComponent = {
          //     SnackbarVmodel: true,
          //     SnackbarColor: "red",
          //     Top: true,
          //     SnackbarText: "No territories are tagged for the given pincode",
          //   };
          // }
          console.log("CHECK_THE_RESPONSE", response);
        } catch (error) {
          console.log("Error", error);
        }
      }
    },
  },
  methods: {
    ActivateFileInputMethod() {
      this.$refs.fileInput.$el.querySelector("input").click();
    },

    async GetImgInput(imgFile) {
      this.tempImgURL = URL.createObjectURL(imgFile);
      this.skipS3Upload = false;
    },
    async UpdateVendorDetailsMethod() {
      this.btnLoading = true;
      if (this.imgFile !== null && this.skipS3Upload === false) {
        let picUploadResult = await this.GenerateS3URLMethods(
          `${
            this.$store.getters.get_current_user_details.organization_id
          }/PROFILE_PIC/${new Date().getTime()}_${this.imgFile.name}`,
          this.imgFile
        );
        if (picUploadResult.status === "SUCCESS") {
          this.finalImgURL = picUploadResult.profile_pic_url;
        }
      }
      try {
        const result = await API.graphql(
          graphqlOperation(UpdateVendorDetails, {
            input: {
              updater_user_id:
                this.$store.getters.get_current_user_details.user_id,
              vendor_id: this.StoreObj.vendor_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              action: "EDIT",
              vendor_name: this.vendorName,
              vendor_address: this.vendorAddress,
              vendor_profile_pic_url:
                this.finalImgURL !== "" ? this.finalImgURL : undefined,
              vendor_qualification: this.vendorQualifications,
              vendor_longitude: this.vendorLongitude,
              vendor_latitude: this.vendorLatitude,
              vendor_primary_country_code: this.vendorPrimaryCountryCode,
              vendor_primary_contact_number: this.vendorPrimaryContNum,
              vendor_experience: this.vendorExp,
              territory_ids: this.vendorTerritories,
              vendor_email_id: this.vendorEmailId,
              // vendor_pincode: this.vendorPincode,
            },
          })
        );
        const response = JSON.parse(result.data.UpdateVendorDetails);
        if (response.status === "SUCCESS") {
          this.UpdateVendorDetailsDialogEmit(2);
          this.btnLoading = false;
          this.imgFile = null;
          this.tempImgURL = null;
          this.finalImgURL = "";
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "Updated Successfully!",
          };
        }
      } catch (error) {
        this.btnLoading = false;
        console.log("Error", error);
      }
    },

    // GoogleMapsEmit(place) {
    //   this.customer_latitude = place.geometry.location.lat();
    //   this.customer_longitude = place.geometry.location.lng();
    //   this.customer_address = place.formatted_address;
    //   this.getPincode(this.customer_latitude, this.customer_longitude);
    //   if (this.same_as_billing_address == true) {
    //     this.customer_billing_address = place.formatted_address;
    //   } else {
    //     this.customer_billing_address = "";
    //   }
    // },

    UpdateVendorDetailsDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
