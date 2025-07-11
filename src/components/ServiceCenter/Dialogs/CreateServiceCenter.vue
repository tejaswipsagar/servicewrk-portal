<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogCreateServiceCenter" persistent max-width="800px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2 white--text">
            {{
              StoreObj.action == "CREATE"
                ? "Add Service Center/Store"
                : "Edit Service Center/Store"
            }}
            <span v-if="StoreObj.action != 'CREATE'">{{
              StoreObj.service_center_name
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogCreateServiceCenterEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-row no-gutters>
            <v-col cols="12" xs="12" sm="12" md="6">
              <GoogleMaps :StoreObj="StoreObj" @clicked="GoogleMapsEmit" />
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="6">
              <v-form ref="form">
                <v-text-field
                  dense
                  outlined
                  :readonly="
                    $store.getters.get_user_type == 'AGENT' ||
                    $store.getters.get_user_type == 'MANAGER'
                  "
                  v-model="create_service_center.service_center_name"
                  label="Service Center Name *"
                  :rules="[(v) => !!v || 'Required']"
                  class="mt-6 FontSize field_height field_label_size"
                ></v-text-field>
                <v-row no-gutters>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      v-model="create_service_center.service_center_latitude"
                      label="Latitude *"
                      :rules="[(v) => !!v || 'Required']"
                      class="FontSize field_height field_label_size mr-1"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      v-model="create_service_center.service_center_longitude"
                      label="Longitude *"
                      :rules="[(v) => !!v || 'Required']"
                      class="FontSize field_height field_label_size ml-1"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                  dense
                  outlined
                  readonly
                  v-model="create_service_center.service_center_address"
                  label="Service Center Address *"
                  :rules="[(v) => !!v || 'Required']"
                  class="FontSize field_height field_label_size"
                ></v-text-field>
                <v-row no-gutters>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-dialog
                      ref="dialogOpenTime"
                      v-model="dialogOpenTime"
                      :return-value.sync="
                        create_service_center.service_center_open_time
                      "
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :rules="[(v) => !!v || 'Required']"
                          dense
                          outlined
                          class="FontSize field_height field_label_size mr-1"
                          v-model="
                            create_service_center.service_center_open_time
                          "
                          label="Open Time *"
                          readonly
                          :disabled="
                            $store.getters.get_user_type == 'AGENT' ||
                            $store.getters.get_user_type == 'MANAGER'
                          "
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="dialogOpenTime"
                        v-model="create_service_center.service_center_open_time"
                        full-width
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="dialogOpenTime = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.dialogOpenTime.save(
                              create_service_center.service_center_open_time
                            )
                          "
                        >
                          OK
                        </v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-dialog
                      ref="dialog"
                      v-model="dialogCloseTime"
                      :return-value.sync="
                        create_service_center.service_center_closed_time
                      "
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :rules="[(v) => !!v || 'Required']"
                          dense
                          outlined
                          class="FontSize field_height field_label_size ml-1"
                          v-model="
                            create_service_center.service_center_closed_time
                          "
                          label="Close Time *"
                          readonly
                          :disabled="
                            $store.getters.get_user_type == 'AGENT' ||
                            $store.getters.get_user_type == 'MANAGER'
                          "
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="dialogCloseTime"
                        v-model="
                          create_service_center.service_center_closed_time
                        "
                        full-width
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.dialog.save(
                              create_service_center.service_center_closed_time
                            )
                          "
                        >
                          OK
                        </v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-checkbox
                      dense
                      class="my-0 py-0"
                      :readonly="
                        $store.getters.get_user_type == 'AGENT' ||
                        $store.getters.get_user_type == 'MANAGER'
                      "
                      label="Service Center"
                      v-model="create_service_center.service_center_recognized"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-checkbox
                      dense
                      class="my-0 py-0"
                      :readonly="
                        $store.getters.get_user_type == 'AGENT' ||
                        $store.getters.get_user_type == 'MANAGER'
                      "
                      label="Store"
                      v-model="create_service_center.store"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
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
            :loading="loading"
            class="mr-1 mb-3"
            color="primary"
            @click="validateMethod()"
            >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  Create_Service_Center_For_Service,
  Update_Service_Center,
} from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import GoogleMaps from "@/components/ServiceCenter/Cards/GoogleMaps.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    dialogCreateServiceCenter: Boolean,
    StoreObj: Object,
  },
  components: {
    Snackbar,
    GoogleMaps,
  },
  data: () => ({
    center: { lat: 45.508, lng: -73.587 },
    renderComp: true,
    markers: [],
    Toggle: 0,
    loading: false,
    create_service_center: {
      service_center_name: "",
      service_center_latitude: "",
      service_center_longitude: "",
      service_center_address: "",
      service_center_open_time: "",
      service_center_closed_time: "",
      service_center_recognized: true,
      store: true,
    },
    dialogOpenTime: false,
    dialogCloseTime: false,
    SnackBarComponent: {},
  }),
  watch: {
    dialogCreateServiceCenter(val) {
      if (val == true) {
        if (this.StoreObj.action == "EDIT") {
          this.create_service_center = {
            service_center_name: this.StoreObj.service_center_name,
            service_center_latitude: this.StoreObj.service_center_latitude,
            service_center_longitude: this.StoreObj.service_center_longitude,
            service_center_address: this.StoreObj.service_center_address,
            service_center_open_time: this.StoreObj.service_center_open_time,
            service_center_closed_time:
              this.StoreObj.service_center_closed_time,
            service_center_recognized: this.StoreObj.service_center_recognized,
            store: this.StoreObj.is_store,
          };
        }
        this.center = {
          lat: this.StoreObj.service_center_latitude,
          lng: this.StoreObj.service_center_longitude,
        };
        this.markers = [];
        this.markers.push({
          position: {
            lat: this.StoreObj.service_center_latitude,
            lng: this.StoreObj.service_center_longitude,
          },
        });
      }
    },
  },
  mounted() {},
  methods: {
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    setPlace(place) {
      this.markers = [];
      this.markers.push({
        position: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      });
      this.create_service_center.service_center_latitude =
        place.geometry.location.lat();
      this.create_service_center.service_center_longitude =
        place.geometry.location.lng();
      this.create_service_center.service_center_address =
        place.formatted_address;
    },
    async updateservice_centerMethod() {
      var inputParams = {
        updater_user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        service_center_id: this.StoreObj.service_center_id,
        service_center_recognized:
          this.create_service_center.service_center_recognized,
        service_center_open_time:
          this.create_service_center.service_center_open_time,
        service_center_closed_time:
          this.create_service_center.service_center_closed_time,
        service_center_name: this.create_service_center.service_center_name,
        is_store: this.create_service_center.store,
      };
      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(Update_Service_Center, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.Update_Service_Center);
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
          this.dialogCreateServiceCenterEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async createservice_centerMethod() {
      var inputParams = {
        creator_user_id: this.$store.getters.get_current_user_details.user_id,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        service_center_recognized:
          this.create_service_center.service_center_recognized,
        service_center_open_time:
          this.create_service_center.service_center_open_time,
        service_center_closed_time:
          this.create_service_center.service_center_closed_time,
        service_center_name: this.create_service_center.service_center_name,
        service_center_address:
          this.create_service_center.service_center_address,
        service_center_latitude:
          this.create_service_center.service_center_latitude,
        service_center_longitude:
          this.create_service_center.service_center_longitude,
        is_store: this.create_service_center.store,
      };
      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(Create_Service_Center_For_Service, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.Create_Service_Center_For_Service
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
          this.dialogCreateServiceCenterEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    GoogleMapsEmit(place) {
      this.create_service_center.service_center_name = place.name;
      this.create_service_center.service_center_latitude =
        place.geometry.location.lat();
      this.create_service_center.service_center_longitude =
        place.geometry.location.lng();
      this.create_service_center.service_center_address =
        place.formatted_address;
    },
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.StoreObj.action == "CREATE") {
          this.createservice_centerMethod();
        } else if (this.StoreObj.action == "EDIT") {
          this.updateservice_centerMethod();
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fields marked with asterisks(*) are mandatory",
          };
          this.renderComp = true;
        });
      }
    },
    dialogCreateServiceCenterEmit(Toggle, create_service_center) {
      this.$refs.form.reset();
      this.$emit("clicked", Toggle, create_service_center);
    },
  },
};
</script>
