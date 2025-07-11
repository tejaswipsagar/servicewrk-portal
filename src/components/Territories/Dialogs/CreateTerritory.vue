<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogCreateTerritory" persistent max-width="1000px">
      <v-card class="elevation-0">
        <v-toolbar dark dense class="elevation-0" color="primary">
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2 white--text">
            {{
              StoreObj.action == "CREATE" ? "Add Territory" : "Edit Territory"
            }}
            <span v-if="StoreObj.action != 'CREATE'">{{
              StoreObj.territory_name
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogCreateTerritoryEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" xs="12" md="4" sm="12">
              <v-toolbar
                v-if="StoreObj.action == 'CREATE'"
                dense
                class="elevation-1 my-4"
              >
                <v-icon>mdi-magnify</v-icon>
                <gmap-autocomplete
                  placeholder="Search Location"
                  style="width: 300px; font-size: 14px; border: none"
                  :value="search"
                  ref="clearSearch"
                  @place_changed="setPlace"
                >
                </gmap-autocomplete>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-on="on"
                      v-bind="attrs"
                      color="primary"
                      @click="clearPolygon()"
                      >mdi-close</v-icon
                    >
                  </template>
                  <span>Clear</span>
                </v-tooltip>
              </v-toolbar>
              <v-form ref="form">
                <v-text-field
                  dense
                  outlined
                  class="FontSize mt-2"
                  label="Territory Name *"
                  v-model="territory_name"
                  :rules="[(v) => !!v || 'Required']"
                  :readonly="$store.getters.get_user_type == 'MANAGER'"
                ></v-text-field>
                <v-row>
                  <v-col cols="12" md="6" xs="12" sm="12">
                    <v-select
                      dense
                      outlined
                      class="FontSize"
                      label="Territory Type *"
                      v-model="territory_type"
                      :items="territory_type_list"
                      :rules="[((v) => !!v) || 'Required']"
                      :readonly="StoreObj.action != 'CREATE'"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-text-field
                      dense
                      outlined
                      class="FontSize"
                      label="Territory Prefix *"
                      v-model="territory_ticket_prefix"
                      :readonly="$store.getters.get_user_type == 'MANAGER'"
                      @keyup="callmethodUppercase(territory_ticket_prefix)"
                      hint="Should Be 3 Character"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) => (v && v.length > 2) || 'Invalid Value',
                        (v) => (v && v.length <= 3) || 'Invalid Value',
                      ]"
                      :maxlength="3"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-textarea
                  dense
                  outlined
                  v-if="
                    this.territory_type == 'NON_GEO_BASED' &&
                    StoreObj.action == 'CREATE'
                  "
                  class="FontSize"
                  label="Pincode(s)"
                  :rows="1"
                  auto-grow
                  v-model="territory_pincode"
                ></v-textarea>
                <v-textarea
                  dense
                  outlined
                  :rows="2"
                  :readonly="$store.getters.get_user_type == 'MANAGER'"
                  class="FontSize"
                  label="Territory Description *"
                  :rules="[
                    (v) => !!v || 'Required',
                    (v) => (v && v.length >= 5) || 'Minimum 5 characters',
                    (v) => (v && v.length < 100) || 'Maximum 100 characters',
                  ]"
                  v-model="territory_description"
                ></v-textarea>
                <v-autocomplete
                  label="Territory Category"
                  outlined
                  dense
                  class="FontSize"
                  :items="GetAllTerritoryCategoryList"
                  item-value="master_id"
                  item-text="territory_name"
                  v-model="territory_category"
                  return-object
                ></v-autocomplete>
              </v-form>
              <v-card-actions
                class="py-0 pr-0"
                v-if="$store.getters.get_user_type != 'MANAGER'"
              >
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loading"
                  small
                  color="primary"
                  class="white--text"
                  @click="validateMethod()"
                  >Save</v-btn
                >
              </v-card-actions>
            </v-col>
            <v-col cols="12" xs="12" md="8" sm="12">
              <v-card class="elevation-0">
                <v-card-text>
                  <gmap-map
                    ref="mymap"
                    :center="center"
                    :zoom="10"
                    @click="checkValue($event)"
                    style="width: 100%; height: 350px"
                  >
                    <gmap-marker
                      :key="index"
                      v-for="(m, index) in markers"
                      :position="m.position"
                      @click="center = m.position"
                    ></gmap-marker>
                    <gmap-polygon
                      v-bind:path.sync="paths"
                      :editable="enablePolygon"
                    >
                    </gmap-polygon>
                  </gmap-map>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { Create_Territory, Update_Territory } from "@/graphql/mutations.js";
import { GetAllTerritoryCategories } from "@/mixins/MastersSetting/GetAllTerritoryCategories.js";
export default {
  components: {
    Snackbar,
  },
  mixins: [GetAllTerritoryCategories],
  props: {
    StoreObj: Object,
    dialogCreateTerritory: Boolean,
  },
  data: () => ({
    latitude: 0,
    longitude: 0,
    search: "",
    territory_name: "",
    territory_category: "",
    polygonShape: "POLYGON",
    territory_description: "",
    territory_ticket_prefix: "",
    territory_type: "GEO_BASED",
    valid: false,
    loading: false,
    renderComp: true,
    currentPlace: null,
    startmarking: false,
    enablePolygon: false,
    paths: [],
    places: [],
    markers: [],
    locationArray: [],
    territory_pincode: [],
    GetAllTerritoryCategoryList: [],
    territory_type_list: [
      { text: "GEO BASED", value: "GEO_BASED" },
      { text: "NON GEO BASED", value: "NON_GEO_BASED" },
    ],
    SnackBarComponent: {},
    center: { lat: 0, lng: 0 },
  }),
  watch: {
    dialogCreateTerritory(val) {
      if (val == true) {
        if (this.StoreObj.action == "EDIT") {
          this.startmarking = false;
          this.enablePolygon = false;
          this.territory_type = this.StoreObj.territory_type;
          this.territory_name = this.StoreObj.territory_name;
          this.territory_ticket_prefix = this.StoreObj.territory_ticket_prefix;
          this.territory_category = this.StoreObj.territory_category_id;
          this.territory_description = this.StoreObj.territory_description;
          this.center = {
            lat: this.StoreObj.territory_location.lat,
            lng: this.StoreObj.territory_location.lng,
          };
          this.markers = [];
          this.markers.push({
            position: {
              lat: this.StoreObj.territory_location.lat,
              lng: this.StoreObj.territory_location.lng,
            },
          });
          if (this.StoreObj.territory_type == "GEO_BASED") {
            for (
              let i = 0;
              i < this.StoreObj.polygon_co_ordinates.coordinates.length;
              i++
            ) {
              this.paths.push({
                lat: this.StoreObj.polygon_co_ordinates.coordinates[i][0],
                lng: this.StoreObj.polygon_co_ordinates.coordinates[i][1],
              });
            }
          }
        } else if (this.StoreObj.action == "CREATE") {
          this.GetCurrentLocation();
        }
      }
      this.GetAllTerritoryCategoryMethod("ACTIVE");
    },
  },
  methods: {
    callmethodUppercase(territory_ticket_prefix) {
      this.territory_ticket_prefix = territory_ticket_prefix.toUpperCase();
    },
    async UpdateTerritory() {
      try {
        this.loading = true;
        var inputparams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          territory_id: this.StoreObj.territory_id,
          territory_name: this.territory_name,
          territory_description: this.territory_description,
          territory_ticket_prefix: this.territory_ticket_prefix,
        };
        if (
          this.territory_category != undefined &&
          this.territory_category != "" &&
          this.territory_category != null
        ) {
          inputparams.territory_category =
            this.territory_category.territory_name;
        }
        if (
          this.territory_category != undefined &&
          this.territory_category != "" &&
          this.territory_category != null
        ) {
          inputparams.territory_category_id = this.territory_category.master_id;
        }
        let result = await API.graphql(
          graphqlOperation(Update_Territory, {
            input: inputparams,
          })
        );
        var ResultObject = JSON.parse(result.data.Update_Territory);
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
          this.dialogCreateTerritoryEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.renderComp = true;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: error.errors[0].message,
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.StoreObj.action == "CREATE") {
          this.CreateTerritory();
        } else if (this.StoreObj.action == "EDIT") {
          this.UpdateTerritory();
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Please mark the territory area on the map",
            };
            this.renderComp = true;
          });
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
    clearPolygon() {
      this.finalArray = [];
      this.locationArray = [];
      this.enablePolygon = false;
      this.startmarking = false;
      this.paths = [];
      this.territory_name = "";
      this.territory_description = "";
      this.GetCurrentLocation();
    },
    setPlace(place) {
      this.finalArray = [];
      this.locationArray = [];
      this.enablePolygon = true;
      this.startmarking = true;
      this.territory_name = place.formatted_address;
      this.finalArray = [];
      this.currentPlace = place;
      (this.center.lat = this.currentPlace.geometry.location.lat()),
        (this.center.lng = this.currentPlace.geometry.location.lng());
      this.markers = [];
      this.markers.push({
        position: {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        },
      });
    },
    async CreateTerritory() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          territory_name: this.territory_name,
          territory_description: this.territory_description,
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          territory_ticket_prefix: this.territory_ticket_prefix,
          territory_type: this.territory_type,
        };
        if (
          this.territory_category != undefined &&
          this.territory_category != null &&
          this.territory_category != ""
        ) {
          inputparams.territory_category =
            this.territory_category.territory_name;
        }
        if (
          this.territory_category != undefined &&
          this.territory_category != null &&
          this.territory_category != ""
        ) {
          inputparams.territory_category_id = this.territory_category.master_id;
        }
        if (this.territory_type == "NON_GEO_BASED") {
          if (
            this.territory_pincode != undefined &&
            this.territory_pincode != null &&
            this.territory_pincode != ""
          ) {
            inputparams.territory_pincode = this.territory_pincode.split(",");
          }
        }
        if (
          this.finalArray != undefined &&
          this.finalArray != null &&
          this.finalArray != ""
        ) {
          inputparams.polygonCoords = this.finalArray;
        }
        if (
          this.center.lat != undefined &&
          this.center.lat != null &&
          this.center.lat != ""
        ) {
          inputparams.lat = this.center.lat;
        }
        if (
          this.center.lng != undefined &&
          this.center.lng != null &&
          this.center.lng != ""
        ) {
          inputparams.lng = this.center.lng;
        }
        let result = await API.graphql(
          graphqlOperation(Create_Territory, {
            input: inputparams,
          })
        );
        var ResultObject = JSON.parse(result.data.Create_Territory);
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
          this.dialogCreateTerritoryEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: error.errors[0].message,
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
    checkValue(event) {
      if (this.startmarking == true && this.enablePolygon) {
        this.locationArray.push(JSON.stringify(event.latLng));
        let latLngFOund = this.paths.filter((a) => {
          return (
            a.lat.toFixed(6) == event.latLng.lat().toFixed(6) &&
            a.lng.toFixed(6) == event.latLng.lng().toFixed(6)
          );
        });
        if (latLngFOund == false) {
          this.paths.push({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          });
        }
      }
      var arrayParsedata = [];
      this.locationArray.forEach(function (ele) {
        ele = JSON.parse(ele);
        arrayParsedata.push([ele.lat, ele.lng]);
      });
      this.finalArray = arrayParsedata;
    },
    GetCurrentLocation() {
      var self = this;
      navigator.geolocation.getCurrentPosition(function (pos) {
        self.center.lat = pos.coords.latitude;
        self.center.lng = pos.coords.longitude;
        self.latitude = pos.coords.latitude;
        self.longitude = pos.coords.longitude;
      });
    },
    dialogCreateTerritoryEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
