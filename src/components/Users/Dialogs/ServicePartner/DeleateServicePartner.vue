<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp == true" />
    <v-dialog :value="DeletePartnerdialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{
              StoreObj.user_status == "ACTIVE"
                ? "mdi-account-cancel"
                : "mdi-account-plus"
            }}</v-icon>
            <span
              v-text="
                StoreObj.user_status == 'ACTIVE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            {{ StoreObj.user_name }}
          </div>
          <v-spacer /><v-spacer />
          <v-btn @click="dialogDeletePartnerEmit(Toggle == 1)" icon small>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon
            size="50px"
            :color="StoreObj.user_status == 'ACTIVE' ? 'red' : 'green'"
            >{{
              StoreObj.user_status == "ACTIVE"
                ? "mdi-account-cancel"
                : "mdi-account-plus"
            }}</v-icon
          >
          <div>
            Are you sure you want to
            <span
              v-text="
                StoreObj.user_status == 'ACTIVE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            {{ StoreObj.user_name }} ?
          </div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer /><v-spacer />
          <v-btn
            small
            class="mr-2"
            color="primary"
            :loading="loading"
            @click="DeleteMethod()"
            ><span
              v-text="
                StoreObj.user_status == 'ACTIVE' ? 'Deactivate' : 'Activate'
              "
            ></span
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { ActivateOrDeactivatePartnerUser } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    DeletePartnerdialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp : true,
    SnackBarComponent: {},
  }),
  watch: {},
  methods: {
    async DeleteMethod() {
      try {
        var inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.StoreObj.user_id,
          action:
            this.StoreObj.user_status == "ACTIVE" ? "DEACTIVATE" : "ACTIVATE",
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ActivateOrDeactivatePartnerUser, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.ActivateOrDeactivatePartnerUser
        );
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
          })
          this.dialogDeletePartnerEmit((this.Toggle = 2));
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
        })
      }
    },
    dialogDeletePartnerEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
