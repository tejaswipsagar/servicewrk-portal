<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      persistent
      :width="
        selected_files.length == 0 && s3_files.length == 0 ? '400px' : '1000px'
      "
      :value="CreateServiceTypesDialog"
    >
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2">
            {{ StoreObj.action == "CREATE" ? "Add " : "Edit " }} Service Type
            <span v-if="StoreObj.action != 'CREATE'">{{
              StoreObj.service_type_name
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="CreateServiceTypesDialogEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-row>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              :md="selected_files.length != 0 || s3_files.length != 0 ? 4 : 12"
            >
              <v-form ref="form">
                <v-text-field
                  outlined
                  dense
                  label="Name *"
                  :rules="[(v) => !!v || 'Required']"
                  class="FontSize field_label_size field_height mt-4"
                  v-model="create_setting.setting_name"
                ></v-text-field>
                <v-text-field
                  outlined
                  dense
                  label="Service Type Code "
                  class="FontSize field_label_size field_height"
                  v-model="create_setting.service_type_code"
                  :maxlength="12"
                ></v-text-field>
                <v-text-field
                  outlined
                  dense
                  label="Service Type Price "
                  type="number"
                  class="FontSize field_label_size field_height"
                  v-model="create_setting.service_price"
                ></v-text-field>
                <v-autocomplete
                  outlined
                  dense
                  label="Tag Ticket Type"
                  item-text="setting_name"
                  item-value="setting_id"
                  class="FontSize"
                  :items="GetAllTicketTypesList"
                  v-model="create_setting.tag_ticket_type"
                >
                </v-autocomplete>
                <v-file-input
                  class="FontSize"
                  :prepend-icon="null"
                  append-icon="mdi-paperclip"
                  v-model="files"
                  label="File input"
                  outlined
                  multiple
                  dense
                >
                </v-file-input>
              </v-form>
            </v-col>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              md="8"
              v-if="s3_files.length != 0 || selected_files.length != 0"
            >
              <div
                v-if="selected_files.length != 0"
                class="font-weight-bold mt-3"
              >
                Selected Files
              </div>
              <v-data-table
                v-if="selected_files.length != 0"
                dense
                class="elevation-0"
                :headers="selected_files_header"
                :items="selected_files"
              >
                <template v-slot:[`item.sl_no`]="{ item }">
                  <div class="FontSize">
                    {{ selected_files.indexOf(item) + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                  <div class="FontSize">
                    {{ item.name }}
                  </div>
                </template>
                <template v-slot:[`item.type`]="{ item }">
                  <div class="FontSize">
                    {{ item.type }}
                  </div>
                </template>
                <template v-slot:[`item.Action`]="{ item }">
                  <v-btn
                    icon
                    color="red"
                    @click="
                      selected_files.splice(selected_files.indexOf(item), 1)
                    "
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
              <div v-if="s3_files.length != 0" class="font-weight-bold">
                Files Added
              </div>
              <v-data-table
                v-if="s3_files.length != 0"
                dense
                class="elevation-0"
                :headers="s3_files_header"
                :items="s3_files"
              >
                <template v-slot:[`item.sl_no`]="{ item }">
                  <div class="FontSize">
                    {{ s3_files.indexOf(item) + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.file_name`]="{ item }">
                  <div class="FontSize">
                    {{ item.file_name }}
                  </div>
                </template>
                <template v-slot:[`item.file_type`]="{ item }">
                  <div class="FontSize">
                    {{ item.file_type }}
                  </div>
                </template>
                <template v-slot:[`item.Action`]="{ item }">
                  <v-btn icon color="primary" @click="checkItem(item)">
                    <v-icon small>mdi-paperclip</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="red"
                    @click="s3_files.splice(s3_files.indexOf(item), 1)"
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="isLoading"
            color="primary"
            @click="validateMethod()"
            class="white--text mb-2 mr-2"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
      <Overlay :overlay="overlay" />
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllTicketTypes } from "@/mixins/MastersSetting/GetAllTicketTypes.js";
import { API, graphqlOperation } from "aws-amplify";
import {
  Create_Service_Type,
  Update_Service_Type,
} from "@/graphql/mutations.js";
var aws = require("aws-sdk");
import { Buffer } from "buffer";
window.Buffer = Buffer;
export default {
  props: {
    StoreObj: Object,
    CreateServiceTypesDialog: Boolean,
  },
  components: {
    Snackbar,
    Overlay,
  },
  mixins: [GetAllTicketTypes, GenerateS3URL],
  data: () => ({
    count: 0,
    Toggle: 0,
    overlay: false,
    renderComp: true,
    isLoading: false,
    files: [],
    s3_files: [],
    selected_files: [],
    GetAllTicketTypesList: [],
    selected_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "name" },
      { text: "Type", value: "type" },
      { text: "Action", value: "Action" },
    ],
    s3_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "file_name" },
      { text: "Type", value: "file_type" },
      { text: "Action", value: "Action" },
    ],
    create_setting: {
      service_type_code: "",
      service_price: 0,
      tag_ticket_type: "",
      setting_name: "",
    },
    SnackBarComponent: {},
  }),
  watch: {
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
    CreateServiceTypesDialog(val) {
      if (val == true) {
        if (this.StoreObj.action == "EDIT") {
          this.create_setting.setting_name = this.StoreObj.service_type_name;
          this.create_setting.service_type_code =
            this.StoreObj.service_type_code;
          this.create_setting.service_price = this.StoreObj.service_type_price;
          this.s3_files =
            this.StoreObj.service_type_s3_files != null &&
            this.StoreObj.service_type_s3_files != undefined &&
            this.StoreObj.service_type_s3_files.length != 0
              ? this.StoreObj.service_type_s3_files
              : [];
          this.create_setting.tag_ticket_type =
            this.StoreObj.tagged_ticket_type_ids != undefined
              ? this.StoreObj.tagged_ticket_type_ids[0]
              : undefined;
        }
      }
    },
  },
  mounted() {
    this.GetAllTicketTypesMethod();
  },
  methods: {
    async uploadMediaToS3() {
      this.isLoading = true;
      for (let i = 0; i < this.selected_files.length; i++) {
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}.jpg`,
          this.selected_files[i]
        );
        let Obj = {
          file_name: this.selected_files[i].name,
          file_type: this.selected_files[i].type,
          file_url: result.profile_pic_url,
        };
        this.s3_files.push(Obj);
        if (i == this.selected_files.length - 1) {
          this.commonCreateMethod();
        }
      }
    },
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.selected_files.length == 0) {
          this.commonCreateMethod();
        } else {
          this.uploadMediaToS3();
        }
      } else if (!this.$refs.form.validate()) {
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
    async commonCreateMethod(s3_files) {
      if (this.StoreObj.action == "CREATE") {
        var mutationname = Create_Service_Type;
        var mutationresult = "Create_Service_Type";
        var inputParams = {
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          service_type_name: this.create_setting.setting_name,
          tagged_ticket_type_ids: [this.create_setting.tag_ticket_type],
        };
        if (
          this.create_setting.service_price != undefined &&
          this.create_setting.service_price != null &&
          this.create_setting.service_price != ""
        ) {
          inputParams.service_type_price = this.create_setting.service_price;
        }
        if (
          this.create_setting.service_type_code != undefined &&
          this.create_setting.service_type_code != null &&
          this.create_setting.service_type_code != ""
        ) {
          inputParams.service_type_code = this.create_setting.service_type_code;
        }
        if (this.s3_files.length != 0) {
          inputParams.service_type_s3_files = this.s3_files;
        }
      } else if (this.StoreObj.action == "EDIT") {
        mutationname = Update_Service_Type;
        mutationresult = "Update_Service_Type";
        inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          service_type_id: this.StoreObj.service_type_id,
          service_type_name: this.create_setting.setting_name,
          tagged_ticket_type_ids: [this.create_setting.tag_ticket_type],
        };
        if (
          this.create_setting.service_type_code != undefined &&
          this.create_setting.service_type_code != null &&
          this.create_setting.service_type_code != ""
        ) {
          inputParams.service_type_code = this.create_setting.service_type_code;
        }
        if (
          this.create_setting.service_price != undefined &&
          this.create_setting.service_price != null &&
          this.create_setting.service_price != ""
        ) {
          inputParams.service_type_price = this.create_setting.service_price;
        }
        if (this.s3_files.length != 0) {
          inputParams.service_type_s3_files = this.s3_files;
        }
      }
      try {
        this.isLoading = true;
        let result = await API.graphql(
          graphqlOperation(mutationname, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data[mutationresult]);
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
          this.CreateServiceTypesDialogEmit((this.Toggle = 2));
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
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
      }
    },
    CreateServiceTypesDialogEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      (this.s3_files = []), (this.selected_files = []);
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
