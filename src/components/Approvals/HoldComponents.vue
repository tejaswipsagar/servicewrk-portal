<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="HoldComponentDialog" persistent :width="800">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            {{ HoldComponentObj.purpose === "HOLD" ? "Hold" : "Update" }}
            Component
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="HoldComponentDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="mt-5 pb-0">
          <div
            class="pa-5 ma-2"
            v-for="(mrfDetail, index) in HoldComponentObj.mrf_hold_details"
            :key="index"
            style="background-color: #ffdfef"
          >
            <div>
              <span class="FontSize font-weight-bold black--text">
                Comment:
                <span class="font-weight-regular black--text"
                  >{{ mrfDetail.comments }}
                </span>
              </span>
            </div>
            <div>
              <span class="FontSize font-weight-bold black--text"
                >Acted By:
                <span class="font-weight-regular black--text"
                  >{{ mrfDetail.updated_by_name }}
                </span>
              </span>
            </div>
            <div>
              <span class="FontSize font-weight-bold black--text"
                >Acted On:
                <span class="font-weight-regular black--text"
                  >{{
                    new Date(mrfDetail.updated_on * 1000).toLocaleString(
                      "en-GB"
                    )
                  }}
                </span>
              </span>
            </div>
            <div v-if="mrfDetail.attachements">
              <span class="FontSize font-weight-bold black--text"
                >Attachments:
              </span>
              <v-data-table
                style="width: 100%; background-color: #ffdfef"
                dense
                :headers="holdAttachemntsHeader"
                :items="mrfDetail.attachements"
                class="TableValFontsize"
                hide-default-footer
              >
                <template v-slot:[`item.view`]="{ item }">
                  <v-btn icon @click="navigateToUrlMethod(item.file_url)">
                    <v-icon small color="primary">mdi-eye</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>
          </div>
          <v-form ref="form" class="pt-5">
            <div>
              <v-text-field
                v-model="comment"
                label="Comment*"
                dense
                outlined
                class="FontSize"
                :rules="[(v) => !!v || 'Required']"
              ></v-text-field>
            </div>
          </v-form>
          <v-file-input
            dense
            outlined
            multiple
            v-model="files"
            class="FontSize"
            :prepend-icon="null"
            label="Attachments"
            append-icon="mdi-paperclip"
          >
          </v-file-input>
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
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="btnLoader"
            @click="approvePayoutMethod()"
            >{{ HoldComponentObj.purpose === "HOLD" ? "Hold" : "Update" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { HoldMRF } from "@/graphql/mutations.js";
import { UpdateHoldedMRF } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
export default {
  mixins: [GenerateS3URL],
  props: {
    HoldComponentObj: Object,
    HoldComponentDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    btnLoader: false,
    renderComp: true,
    SnackBarComponent: {},
    comment: "",
    files: [],
    selected_files: [],
    s3_files: [],
    selected_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "name" },
      { text: "Type", value: "type" },
      { text: "Action", value: "Action" },
    ],
    holdAttachemntsHeader: [
      { text: "File Name", value: "file_name" },
      { text: "View", value: "view" },
    ],
  }),
  watch: {
    HoldComponentDialog(val) {
      if (val) {
        console.log("CHECK_OBJ", this.HoldComponentObj);
        // if (this.HoldComponentObj.purpose === "UPDATE") {
        //   this.comment = this.HoldComponentObj.holded_comments;
        //   this.selected_files = this.HoldComponentObj.holded_attachements.map(
        //     (item) => ({
        //       name: item.file_name,
        //       type: item.file_type,
        //     })
        //   );
        // }
      }
    },
    files(val) {
      if (val.length !== 0 && val !== undefined && val !== null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
  },
  methods: {
    navigateToUrlMethod(url) {
      window.open(url, "__blank");
    },
    async approvePayoutMethod() {
      if (this.$refs.form.validate()) {
        this.btnLoader = true;
        const mutationName =
          this.HoldComponentObj.purpose === "HOLD" ? HoldMRF : UpdateHoldedMRF;
        const mutationNameString =
          this.HoldComponentObj.purpose === "HOLD"
            ? "HoldMRF"
            : "UpdateHoldedMRF";
        try {
          if (this.selected_files.length > 0) {
            await this.uploadMediaToS3();
          }
          const result = await API.graphql(
            graphqlOperation(mutationName, {
              input: {
                updater_user_id:
                  this.$store.getters.get_current_user_details.user_id,
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                workflow_id: this.HoldComponentObj.workflow_id,
                comments: this.comment || undefined,
                attachements:
                  this.s3_files.length > 0 ? this.s3_files : undefined,
              },
            })
          );
          const response = JSON.parse(result.data[mutationNameString]);
          console.log("RESPONSE", response);
          if (response.status === "SUCCESS") {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                Top: true,
                SnackbarText: response.status_message,
              };
              this.renderComp = true;
            });
            this.HoldComponentDialogEmit(2);
            this.btnLoader = false;
          }
        } catch (error) {
          this.btnLoader = false;
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

          // /
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Kindly fill mandatory fields..!",
          };
          this.renderComp = true;
        });
      }
    },
    async uploadMediaToS3() {
      this.loading_btn = true;
      for (let i = 0; i < this.selected_files.length; i++) {
        const fileFormat = this.selected_files[i].type.split("/")[1];
        console.log("SELECTED_FILES", this.selected_files[i]);
        let result = await this.GenerateS3URLMethods(
          `COMPONENT_HOLD_UPDATE_ATTACHMENTS/${new Date().getTime()}.${fileFormat}`,
          this.selected_files[i]
        );
        let Obj = {
          file_name: this.selected_files[i].name,
          file_type: this.selected_files[i].type,
          file_url: result.profile_pic_url,
          source_type: "COMPONENT",
        };
        this.s3_files.push(Obj);
      }
    },
    HoldComponentDialogEmit(Toggle) {
      this.files = [];
      this.$refs.form.reset();
      this.selected_files = [];
      this.s3_files = [];
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
