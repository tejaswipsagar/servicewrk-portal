<!-- <template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogCloseQuotation" persistent width="30%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-close</v-icon> Close Quotation
            <span v-if="StoreObj.quotation_display_id">{{
              StoreObj.quotation_display_id
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogCloseQuotationEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="black--text mt-5 pb-0">
          <v-form ref="form">
            <v-text-field
              dense
              outlined
              class="FontSize"
              v-model="comments"
              label="Comments *"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading_btn"
            @click="updateSendDetailsMethod()"
          >
            <v-icon small>mdi-update</v-icon>Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { UpdateLabourQuotationPayment } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    dialogCloseQuotation: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    renderComp: true,
    loading_btn: false,
    comments: "",
    customer_email_id: "",
    shared_through: "WHATSAPP",
    SnackBarComponent: {},
  }),
  methods: {
    async updateSendDetailsMethod() {
      if (this.$refs.form.validate()) {
        try {
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            updater_user_id:
              this.$store.getters.get_current_user_details.user_id,
            quotation_id: this.StoreObj.quotation_id,
            comments: this.comments != undefined ? this.comments : undefined,
          };
          this.loading_btn = true;
          let result = await API.graphql(
            graphqlOperation(UpdateLabourQuotationPayment, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(
            result.data.UpdateLabourQuotationPayment
          );
          if (ResultObject.status == "SUCCESS") {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                Top: true,
                SnackbarText: ResultObject.status_message,
              };
              this.renderComp = true;
            });
            this.dialogCloseQuotationEmit((this.Toggle = 2));
          }
          this.loading_btn = false;
        } catch (error) {
          this.loading_btn = false;
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
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill Mandatory Fields..!",
          };
          this.renderComp = true;
        });
      }
    },
    dialogCloseQuotationEmit(Toggle) {
      this.comments = "";
      this.$emit("clicked", Toggle);
    },
  },
};
</script> -->

<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogCloseQuotation" persistent width="60%">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-close</v-icon> Close Quotation
            <span v-if="StoreObj.quotation_display_id">{{
              StoreObj.quotation_display_id
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogCloseQuotationEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="black--text mt-5 pb-0">
          <v-form ref="form">
            <v-text-field
              dense
              outlined
              class="FontSize"
              v-model="comments"
              label="Comments *"
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>

            <v-file-input
              dense
              outlined
              multiple
              v-model="files"
              class="FontSize"
              :prepend-icon="null"
              label="Attachements"
              append-icon="mdi-paperclip"
            >
            </v-file-input>
            <div v-if="s3_files.length !== 0 || selected_files.length != 0">
              <div
                v-if="selected_files.length !== 0"
                class="font-weight-bold mt-n3"
              >
                Selected Files
                <v-data-table
                  v-if="selected_files.length !== 0"
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
              </div>
            </div>
            <!-- <div v-if="isUploading" class="d-flex justify-center">
              <v-progress-circular
                :value="totalProgress"
                indeterminate="false"
                color="primary"
              >
                Uploading files
              </v-progress-circular>
            </div> -->
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading_btn"
            @click="validateMethod()"
          >
            <v-icon small>mdi-update</v-icon>Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { UpdateLabourQuotationPayment } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    dialogCloseQuotation: Boolean,
  },
  components: {
    Snackbar,
  },
  mixins: [GenerateS3URL],
  data: () => ({
    Toggle: 0,
    files: [],
    renderComp: true,
    loading_btn: false,
    isUploading: false,
    comments: "",
    customer_email_id: "",
    shared_through: "WHATSAPP",
    SnackBarComponent: {},
    selected_files: [],
    s3_files: [],

    selected_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "name" },
      { text: "Type", value: "type" },
      { text: "Action", value: "Action" },
    ],
  }),

  watch: {
    files(val) {
      if (val.length !== 0 && val !== undefined && val !== null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
  },
  methods: {
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.selected_files.length !== 0) {
          this.uploadMediaToS3();
        } else {
          this.updateSendDetailsMethod();
        }
      }
    },
    async uploadMediaToS3() {
      this.loading_btn = true;
      for (let i = 0; i < this.selected_files.length; i++) {
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}.jpg`,
          this.selected_files[i]
        );
        let Obj = {
          file_name: this.selected_files[i].name,
          file_type: this.selected_files[i].type,
          file_url: result.profile_pic_url,
          source_type: "QUOTATION",
        };
        this.s3_files.push(Obj);
      }
      this.updateSendDetailsMethod();
    },
    async updateSendDetailsMethod() {
      if (this.$refs.form.validate()) {
        try {
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            updater_user_id:
              this.$store.getters.get_current_user_details.user_id,
            quotation_id: this.StoreObj.quotation_id,

            quotation_closed_attachments:
              this.s3_files.length !== 0 ? this.s3_files : undefined,
            comments: this.comments != undefined ? this.comments : undefined,
          };
          this.loading_btn = true;
          let result = await API.graphql(
            graphqlOperation(UpdateLabourQuotationPayment, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(
            result.data.UpdateLabourQuotationPayment
          );
          if (ResultObject.status == "SUCCESS") {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                Top: true,
                SnackbarText: ResultObject.status_message,
              };
              this.renderComp = true;
            });
            this.dialogCloseQuotationEmit((this.Toggle = 2));
          }
          this.loading_btn = false;
        } catch (error) {
          this.loading_btn = false;
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
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill Mandatory Fields..!",
          };
          this.renderComp = true;
        });
      }
    },
    dialogCloseQuotationEmit(Toggle) {
      this.comments = "";
      this.selected_files = [];
      this.files = [];
      this.isUploading = false;
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
