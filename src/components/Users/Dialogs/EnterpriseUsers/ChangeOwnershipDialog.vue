<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogChangeOwnership" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            Transfer Ownership to
            {{ this.StoreObj.user_name }}
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogChangeOwnershipEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center">
          <v-icon class="mt-2" size="50px" color="primary"
            >mdi-account-star</v-icon
          >
          <div>Make {{ StoreObj.user_name }} as Owner ?</div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            @click="transferOwnershipMethod()"
            :loading="loading"
            class="mr-2 mb-2 white--text"
            >Transfer Ownership</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { TransferOwnerShip } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    dialogChangeOwnership: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    renderComp: true,
    SnackBarComponent: {},
  }),
  watch: {},
  methods: {
    async transferOwnershipMethod() {
      try {
        var inputParams = {
          admin_or_manager_user_id: this.StoreObj.user_id,
          owner_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(TransferOwnerShip, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.TransferOwnerShip);
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
          this.dialogChangeOwnershipEmit((this.Toggle = 2));
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
    dialogChangeOwnershipEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
