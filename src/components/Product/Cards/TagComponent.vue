<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <Overlay :overlay="overlay" />
    <v-card class="elevation-0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-toolbar dense class="elevation-0">
            <v-icon color="primary" small>{{
              StoreObj.action == "TAG" ? "mdi-tag-plus-outline" : ""
            }}</v-icon>
            <div class="ml-2 largeFontSizeNew">
              {{
                StoreObj.action == "TAG"
                  ? "Tag Components to "
                  : "Tag Components to "
              }}
              <span>{{ StoreObj.service_name }}</span>
            </div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-toolbar dense class="elevation-0">
            <v-spacer></v-spacer>
            <v-select
              dense
              outlined
              label="Search By"
              v-model="field_name"
              :items="SearchByItems"
              class="FontSize mt-8 mr-2 WidthVariation2"
            >
            </v-select>
            <v-text-field
              dense
              outlined
              label="Search"
              v-model="search"
              prepend-inner-icon=""
              class="mt-8 mr-2 maxWidth FontSize"
            >
              <template v-slot:append>
                <v-btn
                  icon
                  small
                  color="primary"
                  v-if="isSearching == false"
                  @click="searchvalue((isSearching = true))"
                >
                  <v-tooltip bottom color="primary">
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-magnify</v-icon>
                    </template>
                    <span>Click to Search</span>
                  </v-tooltip>
                </v-btn>
                <v-btn
                  icon
                  small
                  v-if="isSearching == true"
                  @click="clearSearch((isSearching = false), (search = ''))"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">mdi-close</v-icon>
                    </template>
                    <span>Clear</span>
                  </v-tooltip>
                </v-btn>
              </template>
            </v-text-field>
            <v-btn
              small
              color="primary"
              class="mr-2 mt-1"
              :loading="tag_btn_loader"
              @click="TagComponentsMethod()"
              ><v-icon small class="mr-1">mdi-tag-plus-outline </v-icon>Tag
            </v-btn>
            <v-btn
              small
              class="mt-1"
              color="primary"
              @click="TagCardEmit((Toggle = 1))"
              ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
            >
          </v-toolbar>
        </v-col>
      </v-row>
      <v-card-text class="py-0">
        <v-data-table
          dense
          show-select
          fixed-header
          :page.sync="page"
          v-model="selected"
          :headers="headers"
          :loading="loading"
          :items-per-page="50"
          hide-default-footer
          :height="TableHeight"
          item-key="component_id"
          :no-data-text="noDataText"
          :items="GetAllComponentsList"
          :single-select="singleSelect"
          @page-count="pageCount = $event"
        >
          <template v-slot:[`item.component_name`]="{ item }">
            <div class="FontSize">{{ item.component_name }}</div>
          </template>
          <template v-slot:[`item.service_name`]="{ item }">
            <div class="FontSize" v-if="item.service_name != undefined">
              {{ item.service_name }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.component_product_code`]="{ item }">
            <div
              class="FontSize"
              v-if="item.component_product_code != undefined"
            >
              {{ item.component_product_code }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.component_description`]="{ item }">
            <div
              class="FontSize"
              v-if="item.component_description != undefined"
            >
              {{ item.component_description }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:[`item.unit_of_measure`]="{ item }">
            <div class="FontSize" v-if="item.unit_of_measure != undefined">
              {{ item.unit_of_measure }}
            </div>
            <div v-else>-</div>
          </template>
        </v-data-table>
        <v-pagination
          v-model="page"
          total-visible="4"
          :length="pageCount"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { TagComponentsToService } from "@/graphql/mutations.js";
import { GetAllComponents } from "@/mixins/Product/GetAllComponents.js";
import { GetAllComponentsBySearch } from "@/mixins/Product/GetAllSearchedComponents.js";
export default {
  props: {
    StoreObj: Object,
  },
  mixins: [GetAllComponents, GetAllComponentsBySearch],
  components: {
    Overlay,
    Snackbar,
  },
  data: () => ({
    page: 1,
    pageCount: 1,
    TableHeight: 0,
    search: null,
    overlay: false,
    loading: false,
    renderComp: false,
    isSearching: false,
    singleSelect: false,
    tag_btn_loader: false,
    field_name: "component_name",
    SnackBarComponent: {},
    selected: [],
    GetAllComponentsList: [],
    SearchByItems: [
      { text: "Comp. Name", value: "component_name" },
      { text: "Comp. Code", value: "component_product_code" },
    ],
    headers: [
      { text: "Component", value: "component_name" },
      { text: "Component Description", value: "component_description" },
      { text: "Component Product Code", value: "component_product_code" },
      { text: "Service Name", value: "service_name" },
      { text: "Unit Of Measure", value: "unit_of_measure" },
    ],
  }),
  watch: {
    search(val) {
      if (val != "") {
        this.isSearching = false;
      }
    },
    page() {
      if (
        this.next_token != undefined &&
        this.next_token != null &&
        this.next_token != ""
      ) {
        this.GetAllComponentsMethod("ACTIVE", this.next_token);
      }
    },
  },
  mounted() {
    this.TableHeight = window.innerHeight - 200;
    this.GetAllComponentsMethod(
      "ACTIVE",
      this.next_token != undefined ? this.next_token : undefined
    );
    this.selected = this.StoreObj.component_ids.map((comp) => {
      return {
        component_id: comp,
      };
    });
  },
  methods: {
    TagCardEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
    searchvalue(isSearching = true) {
      if (
        this.search != "" &&
        this.search != null &&
        this.search != undefined
      ) {
        (this.GetAllComponentsList = []),
          setTimeout(() => {
            this.GetAllComponentsBySearchMethod(
              "ACTIVE",
              this.search,
              this.field_name
            );
          }, 200);
      } else {
        this.isSearching = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "Type Something to Search..!",
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
    clearSearch() {
      if (this.isSearching == true) {
        this.GetAllComponentsList = [];
      }
      this.GetAllComponentsList = [];
      this.GetAllComponentsMethod("ACTIVE", undefined);
    },
    async TagComponentsMethod() {
      this.tag_btn_loader = true;
      try {
        var inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          service_id: this.StoreObj.service_id,
          component_ids: this.selected.map((comp) => comp.component_id),
        };
        let result = await API.graphql(
          graphqlOperation(TagComponentsToService, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.TagComponentsToService);
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
          this.TagCardEmit((this.Toggle = 2));
        }
        this.tag_btn_loader = false;
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
        this.tag_btn_loader = false;
      }
    },
  },
};
</script>
