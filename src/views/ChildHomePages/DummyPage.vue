<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      transition="dialog-top-transition"
      max-width="400px"
      persistent
      :model-value="DialogCreateFolder"
    >
      <v-card class="elevation-0">
        <v-toolbar dense dark class="elevation-0" color="gradient-bg">
          <v-toolbar-title class="FontSizeMedium font-weight-light"
            >Create Folder</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn small icon @click="CreateFolderEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0 mt-4">
          <v-form ref="form">
            <v-text-field
              maxlength="31"
              dense
              outlined
              label="Folder Name"
              v-model="FolderName"
              class="mt-1 FontSize"
              :rules="[
                (v) => !!v || 'Required',
                (v) =>
                  (v && v.length < 30) ||
                  'Name must be less than 30 characters',
                (v) =>
                  (v && v.length > 3) || 'Name must be more than 3 characters',
              ]"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            text
            small
            color="primary"
            @click="CreateFolderEmit((Toggle = 1))"
            >Cancel</v-btn
          >
          <v-btn
            tile
            small
            class="primary"
            :loading="loading"
            @click="ValidateFormMethod()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import SnackBar from "@/components/Extras/SnackBar.vue";
import { GenerateS3URL } from "@/mixins/Extras/UploadImage.js";
var AWS = require("aws-sdk");
export default {
  props: {
    BreadCrumbsArray: Array,
    DialogCreateFolder: Boolean,
    GetCurrentUserDetailsObj: Object,
    StoreObj: Object,
  },
  components: {
    SnackBar,
  },
  mixins: [GenerateS3URL],
  data: () => ({
    path: "",
    loading: false,
    Toggle: 0,
    FolderName: "",
    SnackBarComponent: {},
    ShowPercentage: 0,
  }),
  watch: {
    DialogCreateFolder(val) {
      if (val == true) {
        // console.warn("GetCurrentUserDetailsObj", this.GetCurrentUserDetailsObj);
      }
      if (val == false) {
        this.$refs.form.reset();
      }
    },
  },
  methods: {
    ValidateFormMethod() {
      // this.FolderName = this.FolderName.trim();
      if (this.$refs.form.validate()) {
        if (this.FolderName != "" && this.FolderName != null) {
          this.CreateFolderMethod();
        }
      } else {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: "Invalid Inputs",
          timeout: 2000,
        };
      }
    },
    async CreateFolderMethod() {
      this.loading = true;
      this.GenerateS3URLMethods(
        `${this.StoreObj.Key + this.FolderName + "/"}`,
        this.FolderName + "/"
      );

      this.CreateFolderEmit(2);
      this.SnackBarComponent = {
        SnackbarVmodel: true,
        SnackbarColor: "green",
        SnackbarText: "Folder created successfully",
        Top: true,
        timeout: 2000,
      };
      this.loading = false;
      // var Key = this.StoreObj.Key + this.FolderName + "/";
      // var self = this;
      // var s3Bucket = new AWS.S3({
      //   accessKeyId:
      //     self.GetCurrentUserDetailsObj.s3_credentials.credentials.access_key,
      //   secretAccessKey:
      //     self.GetCurrentUserDetailsObj.s3_credentials.credentials.secret_key,
      // });
      // var param = {
      //   Bucket: self.GetCurrentUserDetailsObj.s3_credentials.bucket_name,
      //   Key: Key,
      //   ACL: "public-read",
      // };
      // self.SnackBarComponent = {
      //   SnackbarVmodel: true,
      //   SnackbarColor: "green",
      //   SnackbarText: "successfully folder created",
      //   Top: true,
      //   timeout: 2000,
      // };
      // // console.warn("s3Bucket", s3Bucket);
      // // console.warn("param", param);
      // await s3Bucket.putObject(param, function (err, data) {
      //   if (err) {
      //     console.warn("err", err);
      //     self.SnackBarComponent = {
      //       SnackbarVmodel: true,
      //       SnackbarColor: "red",
      //       SnackbarText: "Error Occured!! Please try again",
      //       Top: true,
      //       timeout: 2000,
      //     };
      //     self.loading = false;
      //   } else if (data) {
      //     self.loading = false;
      //     self.CreateFolderEmit((self.Toggle = 2));
      //   }
      // });
    },
    CreateFolderEmit(Toggle) {
      this.loading = false;
      this.ShowPercentage = 0;
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
<style scoped>
.FontSize {
  font-size: 12px;
}
.gradient-btn {
  background: -webkit-linear-gradient(145deg, #0a876e 30%, #0fc566 80%);
  /* -webkit-background-clip: text; */
  -webkit-text-fill-color: white;
}
.gradient-bg {
  background: -webkit-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -moz-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -o-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -ms-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
}
</style>
