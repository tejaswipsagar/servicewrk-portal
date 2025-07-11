<template>
    <div>
      <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
      <v-dialog
        :value="dialogDeleteInvalidUser"
        persistent
        max-width="400px"
      >
        <v-card>
          <v-toolbar dark dense class="elevation-0" color="primary">
            <div>
              <v-icon small class="mr-2">mdi-delete</v-icon
              ><span
               Delete
              ></span>
              {{ StoreObj.user_name }}
            </div>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialogInvalidUserEmit((Toggle = 1))"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-toolbar>
          <v-card-text class="text-center mt-5 pb-0">
            <v-icon
              size="50px"
              color="red"
              >mdi-delete</v-icon
            >
            <div>
              Are you sure you want to Delete
              {{ StoreObj.user_name }} ?
            </div>
          </v-card-text>
          <v-card-actions class="pb-4">
            <v-spacer></v-spacer>
            <v-btn
              small
              class="mr-2"
              color="primary"
              :loading="loading"
              @click="deleteMethod()"
            >Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <script>
  import { API, graphqlOperation } from "aws-amplify";
  import { UpdateInvalidUser } from "@/graphql/mutations.js";
  import Snackbar from "@/components/Extras/SnackbarView.vue";
  export default {
    props: {
      StoreObj: Object,
      dialogDeleteInvalidUser: Boolean,
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
      async deleteMethod() {
        try {
          var inputParams = {
            user_id: this.StoreObj.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            };
          this.loading = true;
          let result = await API.graphql(
            graphqlOperation(UpdateInvalidUser, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(result.data.UpdateInvalidUser);
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
            this.dialogInvalidUserEmit((this.Toggle = 2));
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
              SnackbarText: 'Invalid User Deleted Successfully',
            };
            this.renderComp = true;
          });
        }
      },
      dialogInvalidUserEmit(Toggle) {
        this.$emit("clicked", Toggle);
      },
    },
  };
  </script>
  