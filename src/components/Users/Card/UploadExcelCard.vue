<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
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
                    label="Name"
                    v-model="create_table.Name"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Country Code"
                    v-model="create_table.Country_Code"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Contact Number"
                    v-model="create_table.Contact_Number"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Manager Email-Id *"
                    v-model="create_table.Manager"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Product Names *"
                    v-model="create_table.Service_Name"
                    :rules="[(v) => !!v || 'Required']"
                  ></v-select>
                  <v-select
                    dense
                    outlined
                    class="FontSize field_label_size field_height"
                    :items="tableHeader"
                    label="Territory Name"
                    v-model="create_table.Territory_Name"
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
                    >rmation</v-icon
                  >
                  <v-icon small color="primary" @click="checkItem(item, 'EDIT')"
                    >mdi-pencil</v-icon
                  >
                </template>
              </v-data-table>
              <v-card-actions class="py-0">
                <v-spacer></v-spacer>
                <v-btn @click="uploadServiceCatelog()" small color="primary"
                  ><v-icon small>mdi-upload</v-icon>Upload</v-btn
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
import { Upload_Representative } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import InvalidReasonDialog from "@/components/Extras/InvalidReasonDialog.vue";
export default {
  props: {
    tableHeader: Array,
    tableData: Array,
  },
  components: {
    Snackbar,
    InvalidReasonDialog,
  },
  data: () => ({
    height: 0,
    Toggle: 0,
    StoreIDX: -1,
    tableDataTab: 0,
    StoreObj: {},
    SnackBarComponent: {},
    create_table: {
      Name: "",
      Country_Code: "",
      Contact_Number: "",
      Manager: "",
      Service_Name: "",
      Territory_Name: "",
    },
    headers: [],
    validData: [],
    invalidData: [],
    StoreValidDataArray: [],
    DialogInvalidReason: false,
    DialogEditInvalidData: false,
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
    async uploadServiceCatelog() {
      this.isLoading = true;
      let StoreValidUser = this.validData;
      const self = this;
      const StoreValidDataArray = StoreValidUser.map((user) => {
        return {
          user_country_code: user[self.create_table.Country_Code],
          user_contact_number: user[self.create_table.Contact_Number],
          reporter_email_id: user[self.create_table.Manager],
          territory_names: user[self.create_table.Territory_Name],
          service_names: user[self.create_table.Service_Name],
          user_name: user[self.create_table.Name],
        };
      });
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          service_representatives: StoreValidDataArray,
        };
        let result = await API.graphql(
          graphqlOperation(Upload_Representative, {
            input: inputParams,
          })
        );
        var ResultObj = JSON.parse(result.data.Upload_Representative);
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
    DialogEditInvalidDataEmit(Toggle, edit_object) {
      this.DialogEditInvalidData = false;
      if (Toggle == 2) {
        this.invalidData.splice(this.StoreIDX, 1);
        this.validData.push(edit_object);
        this.tableDataTab = 0;
      }
    },
    DialogInvalidReasonEmit() {
      this.DialogInvalidReason = false;
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
    validateMethod() {
      if (this.$refs.form.validate()) {
        this.enterDataToTable();
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Fill all the required details",
        };
      }
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
            key == "Country_Code" &&
            this.create_table[key] != undefined &&
            this.create_table[key] != null &&
            this.create_table[key] != ""
          ) {
            if (
              this.tableData[i][this.create_table[key]] != undefined &&
              this.tableData[i][this.create_table[key]] != null &&
              this.tableData[i][this.create_table[key]] != ""
            ) {
              if (
                this.tableData[i][this.create_table[key]]
                  .toString()
                  .includes("+") == false
              ) {
                this.tableData[i][this.create_table[key]] = `+${
                  this.tableData[i][this.create_table[key]]
                }`;
              }
            }
          }
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
          formTable[j][this.create_table.Name] == undefined ||
          formTable[j][this.create_table.Name] == null ||
          formTable[j][this.create_table.Name] == ""
        ) {
          formTable[j].reasons.push("Name Field Is Empty");
          formTable[j].data_type = "INVALID";
        }
        if (
          formTable[j][this.create_table.Country_Code] == undefined ||
          formTable[j][this.create_table.Country_Code] == null ||
          formTable[j][this.create_table.Country_Code] == ""
        ) {
          formTable[j].reasons.push("Country Code Field Is Empty");
          formTable[j].data_type = "INVALID";
        }
        if (
          formTable[j][this.create_table.Contact_Number] == undefined ||
          formTable[j][this.create_table.Contact_Number] == null ||
          formTable[j][this.create_table.Contact_Number] == ""
        ) {
          formTable[j].reasons.push("Country Name Field Is Empty");
          formTable[j].data_type = "INVALID";
        }
        if (
          formTable[j][this.create_table.Manager] == undefined ||
          formTable[j][this.create_table.Manager] == null ||
          formTable[j][this.create_table.Manager] == ""
        ) {
          formTable[j].reasons.push("Manager Field Is Empty");
          formTable[j].data_type = "INVALID";
        }
        if (
          formTable[j][this.create_table.Service_Name] == undefined ||
          formTable[j][this.create_table.Service_Name] == null ||
          formTable[j][this.create_table.Service_Name] == ""
        ) {
          formTable[j].reasons.push("Service Name Field Is Empty");
          formTable[j].data_type = "INVALID";
        }
        if (
          this.create_table.Territory_Name != undefined &&
          this.create_table.Territory_Name != null &&
          this.create_table.Territory_Name != ""
        ) {
          if (
            formTable[j][this.create_table.Territory_Name] == undefined ||
            formTable[j][this.create_table.Territory_Name] == null ||
            formTable[j][this.create_table.Territory_Name] == ""
          ) {
            formTable[j].reasons.push("Territory Name Field Is Empty");
            formTable[j].data_type = "INVALID";
          }
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
    UploadExcelCardEmit(Toggle, Status_Message) {
      this.$emit("clicked", Toggle, Status_Message);
    },
  },
};
</script>
