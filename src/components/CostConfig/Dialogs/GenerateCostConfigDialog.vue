<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="GenerateCostConfigDialog" persistent :width="900">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Generate Cost Configuration</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="GenerateCostConfigDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5">
          <v-form ref="costConfigForm" v-if="StoreObj.action === 'CREATE'">
            <v-row>
              <v-col cols="12" lg="3" md="3" class="pt-0 pb-0">
                <v-autocomplete
                  label="Category *"
                  v-model="category"
                  :items="categoryItems"
                  class="FontSize mt-2"
                  outlined
                  dense
                  item-text="category_name"
                  item-value="category_id"
                  :rules="[(v) => !!v || 'Required']"
                  :readonly="StoreObj.action === 'EDIT'"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" lg="3" md="3" v-if="category" class="pt-0 pb-0">
                <v-autocomplete
                  label="Product *"
                  dense
                  outlined
                  v-model="product"
                  item-text="service_name"
                  item-value="service_id"
                  class="FontSize mt-2 mr-2"
                  :items="GetServiceByCategoriesList"
                  :rules="[(v) => !!v || 'Required']"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" lg="3" md="3" v-if="product" class="pt-0 pb-0">
                <v-autocomplete
                  label="Service Type *"
                  dense
                  outlined
                  v-model="serviceType"
                  item-value="service_type_id"
                  item-text="service_type_name"
                  class="FontSize mt-2 mr-2"
                  :items="GetAllServiceTypeByServiceIDList"
                  :rules="[(v) => !!v || 'Required']"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                lg="3"
                md="3"
                v-if="serviceType"
                class="pt-0 pb-0"
              >
                <v-autocomplete
                  label="Ticket Type *"
                  dense
                  outlined
                  v-model="ticketType"
                  item-value="value"
                  item-text="text"
                  class="FontSize mt-2 mr-2"
                  :items="ticketCreationTypeItems"
                  :rules="[(v) => !!v || 'Required']"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                lg="3"
                md="3"
                v-if="ticketType"
                class="pt-0 pb-0"
              >
                <v-select
                  dense
                  outlined
                  label="Support *"
                  :items="supportItems"
                  item-text="text"
                  item-value="value"
                  v-model="support"
                  class="FontSize"
                  :rules="[(v) => !!v || 'Required']"
                  return-object
                ></v-select>
              </v-col>
              <v-col cols="12" lg="3" md="3" v-if="support" class="pt-0 pb-0">
                <v-select
                  dense
                  outlined
                  label="Support Type *"
                  item-text="setting_name"
                  item-value="setting_id"
                  :items="GetAllAMCTypeList"
                  v-model="supportType"
                  :rules="[(v) => !!v || 'Required']"
                  class="FontSize"
                  return-object
                ></v-select>
              </v-col>
              <v-col cols="12" lg="3" md="3" v-if="false" class="pt-0 pb-0">
                <v-text-field
                  dense
                  outlined
                  label="Model Number"
                  v-model="modelNumber"
                  class="FontSize"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="3"
                md="3"
                v-if="supportType"
                class="pt-0 pb-0"
              >
                <v-text-field
                  dense
                  outlined
                  label="Cost *"
                  v-model="cost"
                  class="FontSize"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="3"
                md="3"
                v-if="supportType"
                class="pt-0 pb-0"
              >
                <v-text-field
                  dense
                  outlined
                  label="GST *"
                  v-model="gst"
                  type="number"
                  class="FontSize"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="3"
                md="3"
                v-if="supportType"
                class="pt-0 pb-0"
              />
              <v-col
                cols="12"
                lg="3"
                md="3"
                v-if="supportType"
                class="pt-0 pb-0"
              />
              <v-col
                cols="12"
                lg="3"
                md="3"
                v-if="supportType"
                class="pt-0 pb-0"
              />
              <v-col
                cols="12"
                lg="3"
                md="3"
                v-if="supportType"
                class="d-flex justify-end pt-0 pb-0"
              >
                <v-btn
                  v-if="false"
                  :disabled="modelNumber === '' || cost === ''"
                  small
                  color="primary"
                  class="text-capitalize"
                  @click="
                    addInfoToCostConfigTableMethod(
                      addSaveBtnName,
                      editDataIndex
                    )
                  "
                  >{{ addSaveBtnName === "ADD" ? "Add" : "Save" }}</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
          <v-form ref="editCostConfigForm" v-else class="mt-5">
            <v-row>
              <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pt-0 pb-0">
                <div class="FontSize">
                  <strong>Category Name: </strong> {{ categoryName2 }}
                </div>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pt-0 pb-0">
                <div class="FontSize">
                  <strong>Product Name: </strong> {{ productName2 }}
                </div>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pt-0 pb-0">
                <div class="FontSize">
                  <strong>Service Type Name: </strong> {{ serviceTypeName2 }}
                </div>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pt-0 pb-0">
                <div class="FontSize">
                  <strong>Ticket Type Name: </strong> {{ ticketTypeName2 }}
                </div>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pt-0 pb-0">
                <div class="FontSize">
                  <strong>Support: </strong> {{ support2 }}
                </div>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pt-0 pb-0">
                <div class="FontSize">
                  <strong>Support Type Name: </strong> {{ supportTypeName2 }}
                </div>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pt-0 pb-0">
                <v-text-field
                  dense
                  outlined
                  label="Cost *"
                  v-model="cost"
                  class="FontSize"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="3" md="3" sm="12" xs="12" class="pt-0 pb-0">
                <v-text-field
                  dense
                  outlined
                  label="GST *"
                  v-model="gst"
                  type="number"
                  class="FontSize"
                  :rules="[(v) => !!v || 'Required']"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-data-table
            v-if="showTable"
            dense
            :headers="costConfigHeader"
            :items="costConfigItems"
            class="TableValFontsize mt-5"
          >
            <template v-slot:[`item.action`]="{ item, index }">
              <div class="d-flex">
                <div class="pr-1">
                  <v-btn icon @click="editCostConfigDataMethod(index)"
                    ><v-icon small color="green">mdi-pencil</v-icon></v-btn
                  >
                </div>
                <div class="pl-1">
                  <v-btn icon @click="costConfigItems.splice(index, 1)"
                    ><v-icon small color="red">mdi-delete</v-icon></v-btn
                  >
                </div>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <div class="ml-2">
            <v-btn
              :loading="btnLoading"
              :disabled="cost === ''"
              small
              color="primary"
              class="white--text"
              @click="generateCostConfigMethod()"
              >{{ StoreObj.action === "CREATE" ? "Generate" : "Save" }}</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { GetAllOrganizationSettingsTypesInMS } from "@/mixins/MastersSetting/GetAllOrganizationSettingsTypesInMS.js";
import { GetServicesByCategory } from "@/mixins/Tickets/GetServicesByCategory.js";
import { GetAllServiceTypeBasedOnServiceID } from "@/mixins/Tickets/GetAllListServiceTypeById.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";

import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import {
  CreateCostConfiguration,
  EditCostConfiguration,
} from "@/graphql/mutations.js";
export default {
  mixins: [
    GetAllOrganizationSettingsTypesInMS,
    GetServicesByCategory,
    GetAllServiceTypeBasedOnServiceID,
    GetAllOrganizationSetting,
  ],
  props: { GenerateCostConfigDialog: Boolean, StoreObj: Object },
  components: { Snackbar },
  data: () => ({
    category: "",
    product: "",
    serviceType: "",
    ticketType: "",
    support: "",
    supportType: "",
    modelNumber: "",
    cost: "",
    categoryName2: "",
    productName2: "",
    serviceTypeName2: "",
    ticketTypeName2: "",
    support2: "",
    supportTypeName2: "",

    addSaveBtnName: "ADD",
    editDataIndex: 0,
    gst: 0,
    categoryItems: [],
    costConfigItems: [],
    btnLoading: false,
    renderComp: true,
    showTable: false,
    SnackBarComponent: {},
    ticketCreationTypeItems: [
      { text: "Breakdown", value: "BREAKDOWN" },
      { text: "Installation", value: "INSTALLATION" },
      { text: "Schedule Service", value: "SCHEDULE_SERVICE" },
      { text: "Core Service Job", value: "CORE_SERVICE_JOB" },
      { text: "Non-Core Service Job", value: "NON_CORE_SERVICE_JOB" },
      { text: "Sundary Job", value: "SUNDARY_JOB" },
      { text: "Other", value: "OTHER" },
    ],
    supportItems: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "AMC" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NONE", value: "NO_WARRANTY" },
    ],
    costConfigHeader: [
      { text: "Category Name", value: "category_name" },
      { text: "Product Name", value: "product_name" },
      { text: "Service Type", value: "service_type" },
      { text: "Ticket Type", value: "ticket_type" },
      { text: "Support", value: "support" },
      { text: "Support Type", value: "support_type" },
      { text: "Model Name", value: "model_name" },
      { text: "Cost", value: "cost" },
      { text: "Action", value: "action" },
    ],
  }),

  watch: {
    async GenerateCostConfigDialog(val) {
      if (val) {
        if (this.StoreObj.action === "CREATE") {
          this.categoryItems = [];
          await this.GetAllOrganizationSettingsTypesMethod();
        } else {
          this.categoryName2 = this.StoreObj.category_name;
          this.productName2 = this.StoreObj.product_name;
          this.serviceTypeName2 = this.StoreObj.service_type_name;
          this.ticketTypeName2 = this.StoreObj.ticket_type;
          this.support2 = this.StoreObj.support_name;
          this.supportTypeName2 = this.StoreObj.support_type_name;
          this.cost = this.StoreObj.cost;
          this.gst = this.StoreObj.gst;
          // product_id: this.product.service_id,
          // product_name: this.product.service_name,
          // service_type_id: this.serviceType.service_type_id,
          // service_type_name: this.serviceType.service_type_name,
          // // ticket_type_id: this.ticketType.value,
          // ticket_type: this.ticketType.value,
          // // support_id: this.support.value,
          // support_name: this.support.value,
          // support_type_id: this.supportType.setting_id,
          // support_type_name: this.supportType.setting_name,
          // cost: this.cost,
          // gst: parseFloat(parseFloat(this.gst).toFixed(2)),
        }
      }
    },

    async category(val) {
      if (val) {
        this.GetServiceByCategoriesList = [];
        this.GetAllServiceTypeByServiceIDList = [];
        this.product = "";
        this.serviceType = "";
        this.ticketType = "";
        this.support = "";
        this.supportType = "";
        this.modelNumber = "";
        this.cost = "";
        this.GetAllAMCTypeList = [];
        await this.GetServicesByCategoriesMethod(val.category_id);
      }
    },

    async product(val) {
      if (val) {
        this.serviceType = "";
        this.ticketType = "";
        this.support = "";
        this.GetAllServiceTypeByServiceIDList = [];
        this.supportType = "";
        this.modelNumber = "";
        this.cost = "";
        this.GetAllAMCTypeList = [];
        await this.GetAllServiceTypeByServiceIDMethod(val.service_id);
      }
    },

    async support(val) {
      if (val) {
        this.supportType = "";
        this.modelNumber = "";
        this.cost = "";
        this.GetAllAMCTypeList = [];
        await this.GetAllAMCTypeMethod("ACTIVE", val.value);
      }
    },

    supportType(val) {
      if (val) {
        this.modelNumber = "";
        this.cost = "";
      }
    },
  },

  methods: {
    addInfoToCostConfigTableMethod(action, index) {
      this.showTable = true;
      this.addSaveBtnName = action;
      const obj = {
        category_name: this.category.category_name,
        product_name: this.product.service_name,
        service_type: this.serviceType.service_type_name,
        ticket_type: this.ticketType.text,
        support: this.support.text,
        support_type: this.supportType.setting_name,
        model_name: this.modelNumber,
        cost: this.cost,
      };

      if (action === "ADD") {
        if (
          this.costConfigItems.length === 0 ||
          !this.costConfigItems.some(
            (item) => JSON.stringify(item) === JSON.stringify(obj)
          )
        ) {
          this.costConfigItems.push(obj);
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Provided data already there in the table!",
            };
            this.renderComp = true;
          });
        }
      } else {
        this.costConfigItems.splice(index, 1, obj);
        this.addSaveBtnName = "ADD";
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "Saved Successfully!",
          };
          this.renderComp = true;
        });
      }
    },

    editCostConfigDataMethod(index) {
      this.addSaveBtnName = "EDIT";
      this.editDataIndex = index;
      this.renderComp = false;
      this.$nextTick(() => {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          SnackbarText: "Edit the required fields given above!",
        };
        this.renderComp = true;
      });
    },

    async generateCostConfigMethod() {
      const apiName =
        this.StoreObj.action === "CREATE"
          ? CreateCostConfiguration
          : EditCostConfiguration;
      const apiNameString =
        this.StoreObj.action === "CREATE"
          ? "CreateCostConfiguration"
          : "EditCostConfiguration";
      try {
        this.btnLoading = true;
        const result = await API.graphql(
          graphqlOperation(apiName, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              configuration_id:
                this.StoreObj.action === "EDIT"
                  ? this.StoreObj.configuration_id
                  : undefined,
              category_id:
                this.StoreObj.action === "CREATE"
                  ? this.category.category_id
                  : undefined,
              category_name:
                this.StoreObj.action === "CREATE"
                  ? this.category.category_name
                  : undefined,
              product_id:
                this.StoreObj.action === "CREATE"
                  ? this.product.service_id
                  : undefined,
              product_name:
                this.StoreObj.action === "CREATE"
                  ? this.product.service_name
                  : undefined,
              service_type_id:
                this.StoreObj.action === "CREATE"
                  ? this.serviceType.service_type_id
                  : undefined,
              service_type_name:
                this.StoreObj.action === "CREATE"
                  ? this.serviceType.service_type_name
                  : undefined,
              // ticket_type_id: this.ticketType.value,
              ticket_type:
                this.StoreObj.action === "CREATE"
                  ? this.ticketType.value
                  : undefined,
              // support_id: this.support.value,
              support_name:
                this.StoreObj.action === "CREATE"
                  ? this.support.value
                  : undefined,
              support_type_id:
                this.StoreObj.action === "CREATE"
                  ? this.supportType.setting_id
                  : undefined,
              support_type_name:
                this.StoreObj.action === "CREATE"
                  ? this.supportType.setting_name
                  : undefined,
              cost: this.cost,
              gst: parseFloat(parseFloat(this.gst).toFixed(2)) || 0,
            },
          })
        );
        const response = JSON.parse(result.data[apiNameString]);
        if (response.status === "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.Status_Message,
            };
            this.renderComp = true;
          });
          this.GenerateCostConfigDialogEmit(2);
          this.btnLoading = false;
        }
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
        this.btnLoading = false;
      }
    },

    GenerateCostConfigDialogEmit(Toggle) {
      if (this.StoreObj.action === "CREATE") {
        this.$refs.costConfigForm.reset();
      } else {
        this.$refs.editCostConfigForm.reset();
        this.categoryName2 = "";
        this.productName2 = "";
        this.serviceTypeName2 = "";
        this.ticketTypeName2 = "";
        this.support2 = "";
        this.supportTypeName2 = "";
      }
      this.showTable = false;
      this.GetAllServiceTypeByServiceIDList = [];
      this.GetAllAMCTypeList = [];
      this.categoryItems = [];
      this.costConfigItems = [];
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
