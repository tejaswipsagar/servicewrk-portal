<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="deactivateTicketDilaog"
      persistent
      :width="selected_files.length == 0 ? '400px' : '1000px'"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{ "mdi-close-circle-outline" }}</v-icon
            >Inactivate Ticket
            <div
              class="xsmallFontSize"
              v-if="this.StoreObj.custom_ticket_id == undefined"
            >
              ({{ this.StoreObj.ticket_id }})
            </div>
            <div
              class="xsmallFontSize"
              v-else-if="this.StoreObj.custom_ticket_id != undefined"
            >
              ({{ this.StoreObj.custom_ticket_id }})
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogDeactivateEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-row>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              :md="selected_files.length != 0 ? 4 : 12"
            >
              <v-form ref="form">
                <v-select
                  dense
                  outlined
                  item-text="setting_name"
                  item-value="setting_name"
                  v-model="closure_remarks"
                  label="Inactivation Remark *"
                  class="FontSize field_label_size"
                  :rules="[(v) => !!v || 'Required']"
                  :items="
                    GetAllClosureRemarksList.filter(
                      (item) => item.setting_name != 'ALL'
                    )
                  "
                >
                </v-select>
                <v-textarea
                  outlined
                  rows="2"
                  label="Comments *"
                  v-model="comments"
                  class="FontSize mt-n2"
                  :rules="[(v) => !!v || 'Required']"
                ></v-textarea>
                <v-file-input
                  dense
                  outlined
                  multiple
                  v-model="files"
                  label="File input"
                  :prepend-icon="null"
                  class="FontSize mt-n2"
                  append-icon="mdi-paperclip"
                >
                </v-file-input>
              </v-form>
            </v-col>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              md="8"
              v-if="selected_files.length != 0"
            >
              <div
                v-if="selected_files.length != 0"
                class="font-weight-bold mt-1"
              >
                Selected Files
              </div>
              <v-data-table
                dense
                class="elevation-0"
                :items="selected_files"
                :headers="selected_files_header"
                v-if="selected_files.length != 0"
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
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0 mr-2">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            :loading="loading"
            @click="validateMethod()"
            class="white--text mb-2"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { CloseTicket } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { GetAllClouserRemarks } from "@/mixins/MastersSetting/GetAllClouserRemarks.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
var aws = require("aws-sdk");
export default {
  props: {
    StoreObj: Object,
    deactivateTicketDilaog: Boolean,
  },
  components: {
    Snackbar,
  },
  mixins: [GetAllClouserRemarks, GenerateS3URL, GetTicketDetails],
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: true,
    comments: "",
    closure_remarks: "",
    files: [],
    s3_files: [],
    selected_files: [],
    GetAllClosureRemarksList: [],
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
    async deactivateTicketDilaog(val) {
      if (val == true) {
        if ("a" in this.StoreObj) {
          const ticketDetails = await this.TicketDetailsListMethod(
            this.StoreObj.a
          );
          this.StoreObj = ticketDetails[0];
          console.log("THIS_STOREOBJ", this.StoreObj);
        }
        this.GetAllClosureRemarksMethod("ACTIVE");
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
    async CloseTicketMethod(s3_files) {
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          ticket_id: this.StoreObj.ticket_id,
          comments: this.comments,
          closure_remarks: this.closure_remarks,
          ticket_action: "DEACTIVATE",
        };
        if (this.s3_files.length != undefined) {
          inputParams.attachment_file = this.s3_files;
        }
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(CloseTicket, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.CloseTicket);
        if (ResultObject.status == "Success") {
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
          this.dialogDeactivateEmit((this.Toggle = 2));
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
          file_name: this.selected_files[i].name,
          file_type: this.selected_files[i].type,
          file_url: result.profile_pic_url,
        };
        this.s3_files.push(Obj);
        if (i == this.selected_files.length - 1) {
          this.CloseTicketMethod();
        }
      }
    },
    dialogDeactivateEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      (this.s3_files = []), (this.selected_files = []);
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
