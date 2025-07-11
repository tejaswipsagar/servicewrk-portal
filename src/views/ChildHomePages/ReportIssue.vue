<template>
  <v-app>
    <v-app-bar dense app clipped-left color="white" elevation="1">
      <v-card class="elevation-0">
        <!-- <v-img contain width="100px" src="@/assets/raydeoLogo.png"></v-img> -->
      </v-card>
    </v-app-bar>
    <v-main>
      <v-card class="elevation-0">
        <Snackbar :SnackBarComponent="SnackBarComponent" />
        <v-overlay :value="overlayAttachments">
          <v-progress-circular
            :rotate="180"
            :width="5"
            :value="loaderPercentage"
            color="white"
            size="120"
          >
            {{ count + 1 }} /{{ selectedFiles.length }}
          </v-progress-circular>
          <div class="PrimaryFontColorXSmall">Uploading Attachments...</div>
        </v-overlay>
        <v-toolbar dense class="elevation-0">
          <div class="heading1 PrimaryFontColor">Report An Issue</div>
          <v-spacer></v-spacer>
          <v-btn small color="primary" class="mt-3" @click="goBack()">
            <v-icon class="mr-1">mdi-chevron-double-left</v-icon>
            Back
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="8">
              <div
                align="center"
                class="flexClass"
                v-if="mounted == true"
                style="padding-top: 40px"
              >
                <img
                  ref="imgRef"
                  width="100%"
                  height="350px"
                  class="flexClass"
                  :src="imageSRC"
                  @click="showMarkerArea"
                />
              </div>
              <v-card outlined width="100%" class="mx-2 mt-12 pa-2">
                <div class="font-weight-bold FontSize">
                  <u>Adding Annotation Instructions</u>
                </div>
                <div class="FontSize">
                  1. Click on the Image to enable adding annotation.
                </div>
                <div class="FontSize">
                  2. Select Any option from the toolbar.
                </div>
                <div class="FontSize">
                  3. After the changes are made click on the top right tick to
                  save the changes
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="4">
              <v-row no-gutters>
                <v-col cols="12" xs="12" sm="12" md="12">
                  <v-form ref="form">
                    <v-textarea
                      dense
                      outlined
                      rows="3"
                      :counter="1000"
                      class="FontSize field_height field_label_size"
                      label="Description"
                      v-model="report_issue.issue_description"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) =>
                          (v && v.length <= 1000) ||
                          'Description must be less than 1000 characters',
                      ]"
                    ></v-textarea>
                  </v-form>
                </v-col>
              </v-row>
              <v-card-actions class="pr-6 pb-4">
                <v-spacer></v-spacer>
                <v-btn small outlined color="primary" @click="goBack()"
                  >Cancel</v-btn
                >
                <v-btn
                  small
                  color="primary"
                  class="white--text"
                  :loading="loading"
                  @click="validateMethod()"
                  >Report</v-btn
                >
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>
<script>
import * as markerjs2 from "markerjs2";
import { API } from "aws-amplify";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  components: { Snackbar },
  data: () => ({
    msg: "",
    imageSRC: "",
    mounted: false,
    selectedFilesFromDrop: [],
    count: 0,
    overlayAttachments: false,
    report_issue: {
      issue_description: "",
    },
    loading: false,
    SnackBarComponent: {},
    selectedFiles: [],
    sub_systems: [],
    issue_attachments: [],
    loaderPercentage: 0,
    loaderPercentageDivider: 0,
  }),
  async mounted() {
    this.imageSRC = "";
    this.selectedFilesFromDrop =
      this.$store.getters.get_issue_details.selectedFilesFromDrop;
    if (this.selectedFilesFromDrop && this.selectedFilesFromDrop.length != 0) {
      this.selectedFiles = this.selectedFilesFromDrop;
    }
    if (this.selectedFilesFromDrop.length == 1) {
      var fileReader = new FileReader();
      var self = this;
      self.mounted = false;
      fileReader.readAsDataURL(self.selectedFilesFromDrop[0]);
      fileReader.onload = async function (value) {
        self.imageSRC = value.target.result;
        self.mounted = true;
      };
    }
  },
  methods: {
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.selectedFiles.length != 0) {
          this.count = 0;
          this.loaderPercentage = 0;
          this.loaderPercentageDivider = 100 / this.selectedFiles.length;
          this.uploadImageToS3();
        } else {
          this.reportIssueMethod();
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Invalid Input(s)",
        };
      }
    },
    goBack() {
      this.$router.push(this.$store.getters.get_previous_route);
    },
    async uploadImageToS3() {
      this.loading = true;
      this.overlayAttachments = true;
      var self = this;
      var base64FileContent = self.imageSRC.split(",");
      let Attachments = {
        file_data: Buffer.from(base64FileContent[1], "base64"),
        content_type: self.selectedFiles[0].type,
        file_extension: `.${self.selectedFiles[0].name.split(".").pop()}`,
      };
      self.issue_attachments.push(Attachments);
      const path = "report_issue_for_other_projects";
      const Report_issue = {
        headers: {
          "content-type": "application/json",
          "x-api-key": "pBO4CvjwZWaZQpKERUVE56M1A48MQgn911zjrHZi",
        },
        body: {
          command: "reportIssueForOtherProjects",
          user_email_id: self.$store.getters.get_user_email,
          project_api_key:
            "5357524b303030312d31363632353239333332383239316763623767706974",
          issue_description: self.report_issue.issue_description,
          issue_attachments: self.issue_attachments,
        },
      };
      self.loading = true;
      API.post("BUGTRAKR", path, Report_issue)
        .then((res) => {
          if (res.status == "success") {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: res.message,
            };
            setTimeout(() => {
              self.goBack();
            }, 500);
          } else {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: res.errorMessage,
            };
          }
          self.loading = false;
        })
        .catch((error) => {
          self.loading = false;
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error,
          };
        });
    },
    showMarkerArea() {
      const markerArea = new markerjs2.MarkerArea(this.$refs.imgRef);
      markerArea.addEventListener("render", (event) => {
        this.$refs.imgRef.src = event.dataUrl;
        this.imageSRC = event.dataUrl;
      });
      markerArea.show();
    },
  },
};
</script>
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.flexClass {
  display: flex !important;
}
</style>
