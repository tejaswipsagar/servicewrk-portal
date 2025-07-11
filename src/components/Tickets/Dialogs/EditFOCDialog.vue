<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="EditFOCDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Edit FOC</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="EditFOCDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-checkbox
            v-model="enableDisableFoc"
            label="Enable/Disable FOC"
          ></v-checkbox>
          <v-text-field
            v-model="comment"
            dense
            outlined
            label="Comment"
            class="FontSize"
          ></v-text-field>
          <v-file-input
            dense
            outlined
            multiple
            v-model="files"
            class="FontSize"
            label="File input"
            :prepend-icon="null"
            append-icon="mdi-paperclip"
          ></v-file-input>
        </v-card-text>
        <v-card-actions class="pt-0 mr-2">
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="loading"
            color="primary"
            @click="editFOCMethod()"
            class="white--text mb-2"
            >Save<v-icon class="ml-1">mdi-bookmark</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { MarkTicketAsFOC } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetTicketDetails } from "@/mixins/Approvals/GetAllTicketDetailsByTicketId.js";
export default {
  mixins: [GenerateS3URL, GetTicketDetails],
  props: {
    StoreObj: Object,
    EditFOCDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    enableDisableFoc: false,
    loading: false,
    renderComp: true,
    comment: "",
    files: [],
    selected_files: [],
    s3_files: [],
    SnackBarComponent: {},
  }),

  watch: {
    async EditFOCDialog(val) {
      if (val) {
        if ("a" in this.StoreObj) {
          const ticketDetails = await this.TicketDetailsListMethod(
            this.StoreObj.a
          );
          this.StoreObj = ticketDetails[0];
          console.log("THIS_STOREOBJ", this.StoreObj);
        }
        this.enableDisableFoc = this.StoreObj.is_free_of_cost;
        this.comment = this.StoreObj.foc_comments;
      }
    },
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
  },

  methods: {
    async editFOCMethod() {
      if (this.selected_files.length > 0) {
        await this.uploadMediaToS3();
        await this.callApiMethod();
      } else {
        await this.callApiMethod();
      }
    },

    async uploadMediaToS3() {
      this.loading = true;
      if (
        this.selected_files != undefined &&
        this.selected_files != [] &&
        this.selected_files.length != 0
      ) {
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
        }
      }
    },

    async callApiMethod() {
      try {
        this.loading = true;
        const result = await API.graphql(
          graphqlOperation(MarkTicketAsFOC, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              ticket_id: this.StoreObj.ticket_id,
              comments: this.comment || undefined,
              is_free_of_cost: this.enableDisableFoc,
              attachment_file:
                this.s3_files.length > 0 ? this.s3_files : undefined,
            },
          })
        );
        const response = JSON.parse(result.data.MarkTicketAsFOC);
        if (response.status === "SUCCESS") {
          this.loading = false;
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              SnackbarText: response.Status_Message,
              Top: true,
            };
            this.renderComp = true;
          });
          this.EditFOCDialogEmit(2);
        }
      } catch (error) {
        console.log("Error", error);
        this.loading = false;
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: error.errors[0].message,
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },

    EditFOCDialogEmit(Toggle) {
      this.comment = "";
      this.files = [];
      this.selected_files = [];
      this.s3_files = [];
      this.enableDisableFoc = false;
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
