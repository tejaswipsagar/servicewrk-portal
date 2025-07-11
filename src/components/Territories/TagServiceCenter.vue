<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-card flat>
      <v-toolbar dense class="elevation-0">
        <v-icon color="primary" small dark>mdi-tag</v-icon>
        <div class="ml-2 largeFontSizeNew">
          Tag Service Center to
          <span>{{ StoreObj.territory_name }}</span>
        </div>
        <v-spacer></v-spacer>
        <v-text-field
          dense
          outlined
          label="Search"
          class="mt-8 mr-2 ml-2 FontSize mediumWidth field_label_size field_height"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
        <v-btn
          dark
          small
          color="primary"
          @click="tagServiceCenterDailogEmit((Toggle = 1))"
          ><v-icon>mdi-chevron-double-left</v-icon>BACK</v-btn
        >
      </v-toolbar>
      <v-data-table
        dense
        :headers="headers"
        fixed-header
        :height="TableHeight"
        :items="GetAllServiceCentersList"
        :single-select="singleSelect"
        show-select
        v-model="selected"
        item-key="service_center_id"
        :loading="isLoading"
        :search="search"
        :footer-props="{
          'items-per-page-options': [100, 200, 500],
        }"
        :items-per-page="100"
      >
        <template v-slot:[`item.service_center_name`]="{ item }">
          <div class="FontSize" v-if="item.service_center_name != undefined">
            {{ item.service_center_name }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.service_center_created_on`]="{ item }">
          <div
            class="FontSize"
            v-if="item.service_center_created_on != undefined"
          >
            {{
              new Date(item.service_center_created_on * 1000).toLocaleString(
                "en-GB"
              )
            }}
          </div>
          <div v-else>-</div>
        </template>
      </v-data-table>
      <v-card-actions>
        <v-spacer />
        <v-btn
          @click="tagServiceCenterTerritory()"
          :loading="loading"
          color="primary"
          small
          >confirm</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { TagServiceCentersToTerritory } from "@/graphql/mutations.js";
import { GetAllServiceCenter } from "@/mixins/Locations/GetAllServiceCenter.js";
export default {
  props: {
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  mixins: [GetAllServiceCenter],
  data: () => ({
    TableHeight: 0,
    search: "",
    selected: [],
    GetAllServiceCentersList: [],
    headers: [
      { text: "Service Centers", value: "service_center_name" },
      { text: "Created On", value: "service_center_created_on" },
    ],
    loading: false,
    isLoading: false,
    renderComp: true,
    singleSelect: false,
    SnackBarComponent: {},
  }),
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllServiceCentersMethod((this.service_center_status = "ACTIVE"));
    this.selected =
      this.StoreObj.service_center_ids != undefined
        ? this.StoreObj.service_center_ids.map((val) => {
            return {
              service_center_id: val,
            };
          })
        : [];
  },
  methods: {
    tagServiceCenterDailogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
    async tagServiceCenterTerritory() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          territory_id: this.StoreObj.territory_id,
          service_center_ids: this.selected.map((val) => val.service_center_id),
        };
        let result = await API.graphql(
          graphqlOperation(TagServiceCentersToTerritory, {
            input: inputparams,
          })
        );
        var ResultObject = JSON.parse(result.data.TagServiceCentersToTerritory);
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
          this.tagServiceCenterDailogEmit((this.Toggle = 2));
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
  },
};
</script>
