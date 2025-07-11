<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="UploadInvoiceDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Upload Invoice</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="UploadInvoiceDialogEmit(1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <div class="FontSize red--text pb-2 pt-2">
            <strong>
              Once you upload you wouldn't be able to upload invoice again!
            </strong>
          </div>
          <v-file-input
            v-model="file"
            label="Upload PDF Attachment*"
            accept=".pdf"
            dense
            outlined
            class="FontSize"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="btnLoader"
            small
            class="mr-2"
            color="primary"
            @click="uploadInvoiceMethod()"
            >Upload<v-icon small class="pl-1"> mdi-upload </v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import { InitiateWorkflowForPayment } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";

import Snackbar from "@/components/Extras/SnackbarView.vue";

export default {
  mixins: [GenerateS3URL],
  props: {
    UploadInvoiceDialog: Boolean,
    InvoiceObj: Object,
  },
  components: {
    Snackbar,
  },
  data() {
    return {
      reportmonth: new Date().toISOString().substr(0, 7),
      menum: false,
      file: {},
      renderComp: true,
      SnackBarComponent: {},
      btnLoader: false,
    };
  },

  methods: {
    async uploadInvoiceMethod() {
      if (this.file.name) {
        this.btnLoader = true;
        const fileFormat = this.file.type.split("/")[1];
        let uploadFile = await this.GenerateS3URLMethods(
          `INVOICE_UPLOAD/${new Date().getTime()}.${fileFormat}`,
          this.file
        );
        console.log("FILE_UPLAOD", uploadFile);
        if (uploadFile.status === "SUCCESS") {
          try {
            const result = await API.graphql(
              graphqlOperation(InitiateWorkflowForPayment, {
                input: {
                  organization_id:
                    this.$store.getters.get_current_user_details
                      .organization_id,
                  user_id: this.$store.getters.get_current_user_details.user_id,
                  invoice_id: this.InvoiceObj.invoice_id,
                  payment_workflow_initiated_attachments: [
                    {
                      file_name: this.file.name,
                      file_type: this.file.type,
                      file_url: uploadFile.profile_pic_url,
                    },
                  ],
                },
              })
            );
            const response = JSON.parse(result.data.InitiateWorkflowForPayment);
            if (response.status === "SUCCESS") {
              this.renderComp = false;
              this.$nextTick(() => {
                this.renderComp = true;
              });
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                Top: true,
                SnackbarText: response.status_message,
              };
              this.btnLoader = false;
              this.UploadInvoiceDialogEmit(2);
            }
          } catch (error) {
            this.btnLoader = false;
            this.renderComp = false;
            this.$nextTick(() => {
              this.renderComp = true;
            });
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: error.errors[0].message,
            };
            //
          }
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Please select the document!",
        };
      }
    },
    // saveMethod() {
    //   this.UploadInvoiceDialogEmit(2, this.reportmonth);
    // },
    UploadInvoiceDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
      this.file = {};
    },
  },
};
</script>
