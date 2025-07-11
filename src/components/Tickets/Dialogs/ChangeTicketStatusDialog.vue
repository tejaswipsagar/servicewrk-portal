<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="dialogChangeTicketStatus"
      persistent
      :width="
        selected_files.length == 0 && attached_files.length == 0
          ? '500px'
          : '1000px'
      "
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{ "mdi-close-circle-outline" }}</v-icon
            >Change Status
            <div
              class="xsmallFontSize"
              v-if="this.StoreObj.custom_ticket_id == undefined"
            >
              ({{ this.StoreObj.ticket_id }})
            </div>
            <div
              class="xsmallFontSize"
              v-if="this.StoreObj.custom_ticket_id != undefined"
            >
              ({{ this.StoreObj.custom_ticket_id }})
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogChangeTicketStatusEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-row>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              :md="
                selected_files.length != 0 || attached_files.length != 0
                  ? 4
                  : 12
              "
            >
              <div class="font-weight-bold">
                Product Name :{{ StoreObj.service_name }}
              </div>
              <v-form ref="form">
                <v-select
                  dense
                  outlined
                  v-model="setting_id"
                  class="FontSize mt-4"
                  item-value="setting_id"
                  item-text="setting_name"
                  label="Select WIP State *"
                  :rules="[(v) => !!v || 'Required']"
                  :items="
                    GetAllWIPStateList.filter(
                      (item) => item.setting_name != 'ALL'
                    )
                  "
                >
                </v-select>
                <v-textarea
                  outlined
                  rows="2"
                  class="FontSize"
                  v-model="comments"
                  label="Please Add Comments *"
                  :rules="[(v) => !!v || 'Required']"
                ></v-textarea>
              </v-form>
              <v-form ref="formComponent">
                <v-row no-gutters>
                  <v-col cols="12" xs="12" sm="12" md="5">
                    <v-autocomplete
                      dense
                      outlined
                      class="FontSize"
                      label="Select Component"
                      item-value="component_id"
                      item-text="component_name"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="add_component.component_id"
                      :items="GetAllComponentsByServiceIDList"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-text-field
                      dense
                      outlined
                      label="Quantity"
                      class="FontSize ml-4"
                      v-model="add_component.component_quantity"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) =>
                          /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(
                            v
                          ) || 'Invalid',
                      ]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="3">
                    <v-btn
                      small
                      class="text-capitalize ml-2"
                      color="primary"
                      @click="addComponents()"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
              <v-data-table
                dense
                class="elevation-0"
                hide-default-footer
                :items="component_ids"
                :headers="componentHeaders"
                v-if="component_ids.length != 0"
              >
                <template v-slot:[`item.component_name`]="{ item }">
                  <div class="FontSize">{{ item.component_name }}</div>
                </template>
                <template v-slot:[`item.component_quantity`]="{ item }">
                  <div class="FontSize">{{ item.component_quantity }}</div>
                </template>
                <template v-slot:[`item.Action`]="{ item }">
                  <v-icon
                    small
                    color="red"
                    @click="
                      component_ids.splice(component_ids.indexOf(item), 1)
                    "
                    >mdi-delete</v-icon
                  >
                </template>
              </v-data-table>
              <div v-else align="center" class="mt-n2">
                No Components Added yet.
              </div>
              <v-file-input
                dense
                outlined
                multiple
                v-model="files"
                label="File input"
                :prepend-icon="null"
                class="FontSize mt-2"
                append-icon="mdi-paperclip"
              >
              </v-file-input>
            </v-col>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              md="8"
              v-if="selected_files.length != 0 || attached_files.length != 0"
            >
              <div
                v-if="selected_files.length != 0"
                class="font-weight-bold mt-1"
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
              <div
                v-if="attached_files.length != 0"
                class="font-weight-bold mt-1"
              >
                Uploaded Files
              </div>
              <v-data-table
                v-if="attached_files.length != 0"
                dense
                class="elevation-0"
                :headers="attachment_file_header"
                :items="attached_files"
              >
                <template v-slot:[`item.sl_no`]="{ item }">
                  <div class="FontSize">
                    {{ attached_files.indexOf(item) + 1 }}
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
                      attached_files.splice(attached_files.indexOf(item), 1)
                    "
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0 mr-2">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            :loading="loading"
            class="white--text mb-2"
            @click="validateMethod()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllWipState } from "@/mixins/MastersSetting/GetAllWipState.js";
import { Mark_Or_Change_Tickets_WIP_SubStage } from "@/graphql/mutations.js";
import { GetAllComponentsByServiceID } from "@/mixins/Tickets/GetAllComponentsByServiceID.js";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
var aws = require("aws-sdk");
export default {
  props: {
    StoreObj: Object,
    dialogChangeTicketStatus: Boolean,
  },
  components: {
    Snackbar,
  },
  mixins: [
    GenerateS3URL,
    GetAllWipState,
    GetAllComponentsByServiceID,
    GetTicketDetails,
  ],
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: true,
    comments: "",
    setting_id: "",
    files: [],
    s3_files: [],
    component_ids: [],
    quantityRules: [],
    selected_files: [],
    attached_files: [],
    GetAllWIPStateList: [],
    GetAllComponentsByServiceIDList: [],
    componentHeaders: [
      { text: "Component Name", value: "component_name" },
      { text: "Quantity", value: "component_quantity" },
      { text: "Action", value: "Action" },
    ],
    s3_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "file_name" },
      { text: "Type", value: "file_type" },
      { text: "Action", value: "Action" },
    ],
    selected_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "name" },
      { text: "Type", value: "type" },
      { text: "Action", value: "Action" },
    ],
    attachment_file_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "file_name" },
      { text: "Type", value: "file_type" },
      { text: "Action", value: "Action" },
    ],
    add_component: {
      component_id: "",
      component_quantity: 1,
    },
    SnackBarComponent: {},
    ticketDetails: [],
  }),
  watch: {
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
    component_quantity(val) {
      if (val != undefined && val != "" && val != null) {
        this.quantityRules = [
          (v) =>
            /^(?=[a-zA-Z0-9@._%+-]{0,30}$)[0-9 +-]{0,64}$/.test(v) || "Invalid",
        ];
      } else {
        this.quantityRules = [];
      }
    },
    async dialogChangeTicketStatus(val) {
      if (val == true) {
        if ("a" in this.StoreObj) {
          const ticketDetails = await this.TicketDetailsListMethod(
            this.StoreObj.a
          );
          this.StoreObj = ticketDetails[0];
          console.log("THIS_STOREOBJ", this.StoreObj);
        }
        this.attached_files =
          this.StoreObj.attachment_file != undefined
            ? this.StoreObj.attachment_file
            : [];
        this.GetAllWipStateMethod("ACTIVE");
        this.GetAllComponentsByServiceIDMethod(this.StoreObj.service_id);
      }
    },
  },
  methods: {
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.selected_files.length == 0) {
          this.CloseTicketMethod();
        } else {
          this.uploadMediaToS3();
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
    addComponents() {
      if (this.$refs.formComponent.validate()) {
        let componentObj = { ...this.add_component };
        componentObj.component_name =
          this.GetAllComponentsByServiceIDList.filter(
            (item) => item.component_id == componentObj.component_id
          )[0].component_name;
        if (
          this.component_ids.filter(
            (item) => item.component_id == componentObj.component_id
          ).length == 0
        ) {
          this.component_ids.push(componentObj);
          this.$refs.formComponent.reset();
          this.add_component.component_quantity = 1;
        } else {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Component Already Exists",
            };
            this.renderComp = true;
          });
          this.$refs.formComponent.reset();
        }
      }
    },
    async CloseTicketMethod(s3_files) {
      if (this.StoreObj.attachment_file != undefined) {
        if (this.StoreObj.attachment_file.length != this.attached_files) {
          let attachments = this.StoreObj.attachment_file;
          attachments.map((item) => this.s3_files.push(item));
        }
      }
      try {
        var inputParams = {
          ticket_id: this.StoreObj.ticket_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          wip_sub_stage_id: this.setting_id,
          comments: this.comments,
        };
        if (this.s3_files != undefined && this.s3_files.length != 0) {
          inputParams.attachment_file = this.s3_files;
        }
        if (this.component_ids.length != 0) {
          inputParams.component_ids = this.component_ids;
        }
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(Mark_Or_Change_Tickets_WIP_SubStage, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.Mark_Or_Change_Tickets_WIP_SubStage
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
          this.dialogChangeTicketStatusEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
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
    async uploadMediaToS3() {
      this.loading = true;
      for (let i = 0; i < this.selected_files.length; i++) {
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}.jpg`,
          this.selected_files[i]
        );
        let Obj = {
          file_name:
            this.selected_files[i].name != undefined
              ? this.selected_files[i].name
              : this.selected_files[i].file_name,
          file_type:
            this.selected_files[i].type != undefined
              ? this.selected_files[i].type
              : this.selected_files[i].file_type,
          file_url: result.profile_pic_url,
          source_type: "WIP",
        };
        this.s3_files.push(Obj);
        if (i == this.selected_files.length - 1) {
          this.CloseTicketMethod();
        }
      }
      // if (
      //   this.StoreObj.attachment_file != undefined &&
      //   this.StoreObj.attachment_file.length != 0
      // ) {
      //   let attachments = this.StoreObj.attachment_file;
      //   attachments.map((item) => this.s3_files.push(item));
      // }
    },
    dialogChangeTicketStatusEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.s3_files = [];
      this.files = [];
      this.attached_files = [];
      this.component_ids = [];
      this.selected_files = [];
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
