<template>
  <div>
    <!-- <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" /> -->
    <v-dialog v-model="CreateFolderDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-plus</v-icon
            ><span>Create Folder</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="CreateFolderDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-form ref="form">
            <v-text-field
              v-model="folderName"
              dense
              outlined
              label="Enter folder name"
              :rules="folderNameRules"
            >
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="text-capitalize mr-2"
            color="primary"
            :loading="btnLoading"
            @click="createFolderMethod()"
            >Create</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
export default {
  mixins: [GenerateS3URL],
  props: { CreateFolderDialog: Boolean, StoreObj: Object },
  data: () => ({
    btnLoading: false,
    folderName: "",
    renderComp: true,
    orgId: "",
    folderNameRules: [
      (v) => !!v || "Required",
      (v) =>
        /^[a-zA-Z0-9 ]+$/.test(v) ||
        "A folder name can only contain letters, numbers, and spaces",
    ],
  }),

  watch: {
    CreateFolderDialog(val) {
      if (val) {
        this.orgId =
          this.$store.getters.get_current_user_details.organization_id;
      }
    },
  },

  methods: {
    async createFolderMethod() {
      if (this.$refs.form.validate()) {
        this.btnLoading = true;
        let result = await this.GenerateS3URLMethods(
          `${this.StoreObj.folder_path}${this.folderName}/`,
          this.folderName
        );
        if (result.status === "SUCCESS") {
          this.btnLoading = false;
          this.CreateFolderDialogEmit(2);
        } else {
          this.btnLoading = false;
        }
      }
    },
    CreateFolderDialogEmit(Toggle) {
      this.$refs.form.reset();
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
