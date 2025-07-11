<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      :value="dialogActivateInactivateCustomer"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">{{
              StoreObj.customer_status == "ACTIVE"
                ? "mdi-account-cancel"
                : "mdi-account-plus"
            }}</v-icon
            ><span
              >{{
                StoreObj.customer_status == "ACTIVE" ? "Deactivate" : "Activate"
              }}
            </span>
            {{ this.StoreObj.customer_name }}
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="dialogActivateInactivateCustomerEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon
            size="50px"
            :color="StoreObj.customer_status == 'ACTIVE' ? 'red' : 'green'"
            >{{
              StoreObj.customer_status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon
          >
          <div>
            Are you sure you want to
            <span
              v-text="
                StoreObj.customer_status == 'ACTIVE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            {{ StoreObj.customer_name }} ?
          </div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="text-capitalize mr-2"
            color="primary"
            :loading="loading"
            @click="activateInactivateMethod()"
            ><span
              v-text="
                StoreObj.customer_status == 'ACTIVE' ? 'Deactivate' : 'Activate'
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
import { ActivateOrDeactivateBusinessIndividualCustomer } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    dialogActivateInactivateCustomer: Boolean,
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
    async activateInactivateMethod() {
      try {
        var inputParams = {
          customer_id: this.StoreObj.customer_id,
          customer_email_id:
            this.$store.getters.get_current_user_details.customer_email_id,
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          action:
            this.StoreObj.customer_status == "ACTIVE"
              ? "DEACTIVATE"
              : "ACTIVATE",
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ActivateOrDeactivateBusinessIndividualCustomer, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(
          result.data.ActivateOrDeactivateBusinessIndividualCustomer
        );
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.status_message,
            };
            this.renderComp = true;
          });
          this.dialogActivateInactivateCustomerEmit((this.Toggle = 2));
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
    dialogActivateInactivateCustomerEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
