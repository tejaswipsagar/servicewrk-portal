<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <EditInvalidData
      :StoreObj="StoreObj"
      :create_table="create_table"
      :DialogEditInvalidData="DialogEditInvalidData"
      @clicked="DialogEditInvalidDataEmit"
    />
    <InvalidReasonDialog
      :DialogInvalidReason="DialogInvalidReason"
      :StoreObj="StoreObj"
      @clicked="DialogInvalidReasonEmit"
    />
    <v-card class="elevation-0">
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-toolbar dense class="elevation-0">
            <div class="PrimaryFontColor heading1">Excel Upload</div>
          </v-toolbar>
        </v-col>
        <v-col cols="12" sm="12" md="6" xs="12">
          <v-toolbar dense class="elevation-0">
            <v-spacer></v-spacer>
            <v-btn
              small
              color="primary"
              @click="UploadExcelCardEmit((Toggle = 1))"
              ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
            >
          </v-toolbar>
        </v-col>
      </v-row>
      <v-card-text class="py-0">
        <v-row no-gutters>
          <v-col
            cols="12"
            xs="12"
            sm="12"
            md="3"
            v-if="validData.length == 0 && invalidData.length == 0"
          >
            <v-card class="elevation-1" :height="height">
              <v-card-text>
                <v-form ref="form">
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Enable Technician"
                    v-model="create_table.Enable_Technician"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Enable Visibility"
                    v-model="create_table.Enable_Visibility"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Master Category"
                    v-model="create_table.Master_Category"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Category"
                    v-model="create_table.Category"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Product"
                    v-model="create_table.Product"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Product ID"
                    v-model="create_table.Product_Id"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Product Price"
                    v-model="create_table.service_price"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Service Prefix"
                    v-model="create_table.Ticket_Prefix"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Service Type"
                    v-model="create_table.Service_Type"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Auto tag to Users"
                    v-model="create_table.autotag_to_users"
                  ></v-select>
                </v-form>
              </v-card-text>
              <v-card-actions class="pt-0">
                <v-spacer></v-spacer>
                <v-btn small color="primary" @click="validateMethod()"
                  >Add</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            xs="12"
            sm="12"
            :md="validData.length != 0 || invalidData.length != 0 ? 12 : 9"
          >
            <v-card
              class="elevation-0"
              v-if="validData.length != 0 || invalidData.length != 0"
            >
              <v-tabs v-model="tableDataTab">
                <v-tab>Valid Data</v-tab>
                <v-tab>Invalid Data</v-tab>
              </v-tabs>
              <v-data-table
                dense
                class="elevation-0"
                :headers="headers"
                :items="tableDataTab == 0 ? validData : invalidData"
              >
                <template v-slot:[`item.Action`]="{ item }">
                  <v-icon
                    small
                    class="mr-2"
                    color="primary"
                    @click="checkItem(item, 'INFORMATION')"
                    >mdi-information</v-icon
                  >
                  <v-icon small color="primary" @click="checkItem(item, 'EDIT')"
                    >mdi-pencil</v-icon
                  >
                </template>
              </v-data-table>
              <v-card-actions v-if="tableDataTab == 0" class="pt-0">
                <v-spacer></v-spacer>
                <v-btn small color="primary" @click="uploadMethod()"
                  >Confirm</v-btn
                >
              </v-card-actions>
            </v-card>
            <v-card v-else height="100%">
              <v-card-text align="center" style="padding-top: 200px">
                <h3>
                  Please Add All The Mandatory Fields Respective Column And Add
                  Then Click On The Add Button.
                </h3>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { Upload_Service_Catalogue } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import InvalidReasonDialog from "@/components/Extras/InvalidReasonDialog.vue";
import EditInvalidData from "@/components/Product/Dialogs/ProductCatalogue/EditInvalidData.vue";
export default {
  props: {
    tableData: Array,
    tableHeader: Array,
  },
  components: {
    Snackbar,
    EditInvalidData,
    InvalidReasonDialog,
  },
  data: () => ({
    height: 0,
    Toggle: 0,
    tableDataTab: 0,
    isLoading: false,
    DialogEditInvalidData: false,
    DialogInvalidReason: false,
    create_table: {
      Enable_Technician: "",
      Enable_Visibility: "",
      Master_Category: "",
      Category: "",
      Product: "",
      Ticket_Prefix: "",
      Service_Type: "",
      autotag_to_users: "",
      Product_Id: "",
      service_price : ""
    },
    StoreObj: {},
    SnackBarComponent: {},
    headers: [],
    validData: [],
    invalidData: [],
    StoreValidDataArray: [],
  }),
  watch: {
    tableDataTab(val) {
      if (val == 0) {
        if (this.headers.filter((item) => item.text == "Action").length == 1) {
          this.headers.pop();
        }
      } else if (val == 1) {
        if (this.headers.filter((item) => item.text == "Action").length == 0) {
          this.headers.push({ text: "Action", value: "Action" });
        }
      }
    },
  },
  mounted() {
    this.height = window.innerHeight - 110;
  },
  methods: {
    uploadMethod() {
      this.uploadServiceCatelog();
    },
    validateMethod() {
      if (this.$refs.form.validate()) {
        this.enterDataToTable();
        // this.uploadServiceCatelog();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Fill all the required details",
        };
      }
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      if (action == "INFORMATION") {
        this.DialogInvalidReason = true;
      } else if (action == "EDIT") {
        this.StoreIDX = this.invalidData.indexOf(item);
        this.DialogEditInvalidData = true;
      }
    },
    DialogInvalidReasonEmit() {
      this.DialogInvalidReason = false;
    },
    enterDataToTable() {
      for (let key in this.create_table) {
        if (
          this.create_table[key] != "" &&
          this.create_table[key] != null &&
          this.create_table[key] != undefined
        ) {
          this.headers.push({
            text: key.replace("_", " "),
            value: this.create_table[key],
          });
        }
      }
      let formTable = [];
      for (let i = 0; i < this.tableData.length; i++) {
        let dataObject = {};
        for (let key in this.create_table) {
          if (
            this.create_table[key] != undefined &&
            this.create_table[key] != null &&
            this.create_table[key] != ""
          ) {
            dataObject[this.create_table[key]] =
              this.tableData[i][this.create_table[key]];
          }
        }
        formTable.push(dataObject);
      }
      for (let j = 0; j < formTable.length; j++) {
        formTable[j].reasons = [];
        formTable[j].data_type = "VALID";
        if (
          formTable[j][this.create_table.Enable_Technician] == true ||
          formTable[j][this.create_table.Enable_Technician] == "true" ||
          formTable[j][this.create_table.Enable_Technician] == "TRUE" ||
          formTable[j][this.create_table.Enable_Technician] == "YES" ||
          formTable[j][this.create_table.Enable_Technician] == "Yes" ||
          formTable[j][this.create_table.Enable_Technician] == "yes"
        ) {
          if (
            formTable[j][this.create_table.Enable_Visibility] == "" ||
            formTable[j][this.create_table.Enable_Visibility] == undefined ||
            formTable[j][this.create_table.Enable_Visibility] == null
          ) {
            formTable[j].reasons.push(
              "If enable technician is set to true,Enable Visibility value should not be empty."
            );
            formTable[j].data_type = "INVALID";
          }
        } else {
          if (
            (formTable[j][this.create_table.Enable_Technician] == undefined ||
              formTable[j][this.create_table.Enable_Technician] == null ||
              formTable[j][this.create_table.Enable_Technician] == "") &&
            formTable[j][this.create_table.Enable_Technician] != false
          ) {
            formTable[j].reasons.push("Enable Technician Field Value Is Empty");
            formTable[j].data_type = "INVALID";
          } else if (
            formTable[j][this.create_table.Enable_Technician] == false
          ) {
            if (
              formTable[j][this.create_table.Enable_Visibility] != undefined &&
              formTable[j][this.create_table.Enable_Visibility] != null &&
              formTable[j][this.create_table.Enable_Visibility] != ""
            ) {
              delete formTable[j][this.create_table.Enable_Visibility];
            }
            if (
              formTable[j][this.create_table.Enable_Visibility] == undefined
            ) {
              delete formTable[j][this.create_table.Enable_Visibility];
            }
          } else {
            formTable[j].reasons.push(
              'Enable Technician Field accepts values in "true","false","yes","No"'
            );
            formTable[j].data_type = "INVALID";
          }
        }
        if (
          formTable[j][this.create_table.Master_Category] == undefined ||
          formTable[j][this.create_table.Master_Category] == null ||
          formTable[j][this.create_table.Master_Category] == ""
        ) {
          formTable[j].reasons.push("Master Category Field Is Empty");
          formTable[j].data_type = "INVALID";
        }
        if (
          formTable[j][this.create_table.Category] == undefined ||
          formTable[j][this.create_table.Category] == null ||
          formTable[j][this.create_table.Category] == ""
        ) {
          formTable[j].reasons.push("Category Field Is Empty");
          formTable[j].data_type = "INVALID";
        }
        if (
          formTable[j][this.create_table.Product] == undefined ||
          formTable[j][this.create_table.Product] == null ||
          formTable[j][this.create_table.Product] == ""
        ) {
          formTable[j].reasons.push("Product Field Is Empty");
          formTable[j].data_type = "INVALID";
        }
        if (
          formTable[j][this.create_table.Ticket_Prefix] == undefined ||
          formTable[j][this.create_table.Ticket_Prefix] == null ||
          formTable[j][this.create_table.Ticket_Prefix] == ""
        ) {
          formTable[j].reasons.push("Ticket Prefix Field Is Empty");
          formTable[j].data_type = "INVALID";
        }
        if (
          this.create_table.Service_Type != undefined &&
          this.create_table.Service_Type != null &&
          this.create_table.Service_Type != ""
        ) {
          if (
            formTable[j][this.create_table.Service_Type] == undefined ||
            formTable[j][this.create_table.Service_Type] == null ||
            formTable[j][this.create_table.Service_Type] == ""
          ) {
            formTable[j].reasons.push("Service Type Field Is Empty");
            formTable[j].data_type = "INVALID";
          }
        }
        if (
          formTable[j][this.create_table.autotag_to_users] == undefined ||
          formTable[j][this.create_table.autotag_to_users] == null ||
          formTable[j][this.create_table.autotag_to_users] == ""
        ) {
          formTable[j].reasons.push("Auto tag to Users is Empty");
          formTable[j].data_type = "INVALID";
        }
      }
      for (let i = 0; i < formTable.length; i++) {
        if (formTable[i].data_type == "VALID") {
          this.validData.push(formTable[i]);
        } else if (formTable[i].data_type == "INVALID") {
          this.invalidData.push(formTable[i]);
        }
      }
      if (this.invalidData.length != 0 && this.tableDataTab == 1) {
        this.headers.push({ text: "Action", value: "Action" });
      }
    },
    DialogEditInvalidDataEmit(Toggle, edit_object) {
      this.DialogEditInvalidData = false;
      if (Toggle == 2) {
        this.invalidData.splice(this.StoreIDX, 1);
        this.validData.push(edit_object);
        this.tableDataTab = 0;
      }
    },

    async uploadServiceCatelog() {
      this.isLoading = true;
      let StoreValidUser = this.validData;
      const self = this;
      const StoreValidDataArray = StoreValidUser.map((user) => {
        return {
          service_technician_enabled:
            user[self.create_table.Enable_Technician] == "yes" ? true : false,
          master_category_name: user[self.create_table.Master_Category],
          category_name: user[self.create_table.Category],
          service_name: user[self.create_table.Product],
          service_ticket_prefix: user[self.create_table.Ticket_Prefix],
          service_type_names: user[self.create_table.Service_Type],
          autotag_to_users:
            user[self.create_table.autotag_to_users] == "yes" ? true : false,
          is_visible:
            user[self.create_table.Enable_Visibility] == "yes" ? true : false,
          service_display_id: user[self.create_table.Product_Id],
          service_price : user[self.create_table.service_price]
        };
      });
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          service_catalogue_list: StoreValidDataArray,
        };
        let result = await API.graphql(
          graphqlOperation(Upload_Service_Catalogue, {
            input: inputParams,
          })
        );
        var ResultObj = JSON.parse(result.data.Upload_Service_Catalogue);
        if (ResultObj.status == "SUCCESS") {
          this.UploadExcelCardEmit((this.Toggle = 2), ResultObj.Status_Message);
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: error.errors[0].message,
        };
      }
    },
    UploadExcelCardEmit(Toggle, Status_Message) {
      this.$emit("clicked", Toggle, Status_Message);
    },
  },
};
</script>
