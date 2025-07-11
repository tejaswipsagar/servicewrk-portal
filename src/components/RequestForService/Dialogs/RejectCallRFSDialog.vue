<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="RejectCallRFSDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-close-circle</v-icon
            ><span>Reject</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="RejectCallRFSDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-text-field
            v-model="comments"
            dense
            outlined
            label="Comments"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading"
            @click="rejectRFSMethod()"
            >Reject
            <v-icon small color="white" class="pl-1">mdi-close</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { RejectHelloWRKRFSTicket } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    RejectCallRFSDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    comments: "",
    loading: false,
    renderComp: true,
    SnackBarComponent: {},
  }),

  methods: {
    async rejectRFSMethod() {
      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(RejectHelloWRKRFSTicket, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              updater_user_id:
                this.$store.getters.get_current_user_details.user_id,
              rfs_id: this.StoreObj.rfs_id,
              comments: this.comments || undefined,
            },
          })
        );
        var ResultObject = JSON.parse(result.data.RejectHelloWRKRFSTicket);
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
          this.RejectCallRFSDialogEmit((this.Toggle = 2));
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
    RejectCallRFSDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
