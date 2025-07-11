<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogDeleteInvalidCustomer" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-delete</v-icon
            ><span>Delete</span>
            {{ this.StoreObj.customer_name }}
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogDeleteInvalidCustomerEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon size="50px" color="red">mdi-delete</v-icon>
          <div>Are you sure you want to Delete <span>{{ this.StoreObj.customer_name }}</span> ?</div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="text-capitalize mr-2"
            color="primary"
            :loading="loading"
            @click="deleteInvalidCustomerMethod()"
            >Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { DeleteInvalidCustomer } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    dialogDeleteInvalidCustomer: Boolean,
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
  methods: {
    async deleteInvalidCustomerMethod() {
      try {
        var inputParams = {
          customer_id: this.StoreObj.customer_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(DeleteInvalidCustomer, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.DeleteInvalidCustomer);
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: "Deleted Invalid Customer Successfully !!!",
            };
            this.renderComp = true;
          });
          this.dialogDeleteInvalidCustomerEmit((this.Toggle = 2));
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
    dialogDeleteInvalidCustomerEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
