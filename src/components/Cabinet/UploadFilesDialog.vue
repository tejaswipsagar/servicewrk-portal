<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="UploadFilesDialog" persistent max-width="1000px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-plus</v-icon
            ><span>Upload Files</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="UploadFilesDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-file-input v-model="files" multiple dense outlined rounded>
          </v-file-input>
          <div
            v-if="selected_files.length !== 0"
            class="font-weight-bold mt-3 mb-3"
          >
            Selected Files
            <v-data-table
              v-if="selected_files.length !== 0"
              dense
              class="elevation-0"
              :headers="selected_files_header"
              :items="selected_files"
            >
              <template v-slot:[`item.sl_no`]="{ index }">
                <div class="FontSize">
                  {{ index + 1 }}
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
            class="text-capitalize mr-2"
            color="primary"
            :loading="btnLoading"
            @click="uploadFilesMethod()"
            >Upload</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  mixins: [GenerateS3URL],
  props: { UploadFilesDialog: Boolean, StoreObj: Object },
  components: { Snackbar },
  data: () => ({
    renderComp: true,
    btnLoading: false,
    files: [],
    selected_files: [],
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
      if (val.length !== 0 && val !== undefined && val !== null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push({
            name: val[i].name,
            type: val[i].type,
            file: val[i],
          });
        }
      }
    },
  },

  methods: {
    async uploadFilesMethod() {
      if (this.selected_files.length > 0) {
        this.btnLoading = true;
        let result;
        for (let i = 0; i < this.selected_files.length; i++) {
          result = await this.GenerateS3URLMethods(
            `${this.StoreObj.folder_path}${this.selected_files[i].name}`,
            this.selected_files[i].file
          );
          console.log("RES", result);

          // let Obj = {
          //   file_name: this.selected_files[i].name,
          //   file_type: this.selected_files[i].type,
          //   file_url: result.profile_pic_url,
          //   source_type: "QUOTATION",
          // };
          // this.s3_files.push(Obj);
        }
        if (result.status === "SUCCESS") {
          this.btnLoading = false;
          this.UploadFilesDialogEmit(2);
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: "Uploaded Successfully!",
          };
          this.renderComp = false;
          this.$nextTick(() => {
            this.renderComp = true;
          });
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Kindly select the file!",
        };
        this.renderComp = false;
        this.$nextTick(() => {
          this.renderComp = true;
        });
      }
      //   this.updatePaymentDetailsMethod();
    },
    UploadFilesDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
      this.files = [];
      this.selected_files = [];
    },
  },
};
</script>
