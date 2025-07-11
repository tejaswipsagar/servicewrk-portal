<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent width="400px" :value="AddEditProductFleetStatusDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2">
            {{ StoreObj.action == "CREATE" ? "Add " : "Edit " }}Product Fleet
            Status
          </div>
          <v-spacer></v-spacer>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="AddEditProductFleetStatusDialogEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="12">
              <v-form ref="form">
                <v-text-field
                  outlined
                  dense
                  label="Product Fleet Status"
                  class="FontSize field_label_size field_height mt-4"
                  v-model="create_setting.products_fleet_status"
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="isLoading"
            color="primary"
            @click="validateMethod()"
            class="white--text mb-2 mr-2"
            >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import {
  CreateProductFleetStatusType,
  UpdateProductFleetStatusType,
} from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";

export default {
  props: {
    AddEditProductFleetStatusDialog: Boolean,
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    renderComp: true,
    Toggle: 0,
    create_setting: {
      products_fleet_status: "",
    },
    isLoading: false,
    SnackBarComponent: {},
  }),
  watch: {
    AddEditProductFleetStatusDialog(val) {
      if (val == true) {
        if (this.StoreObj.action == "EDIT") {
          this.create_setting.products_fleet_status =
            this.StoreObj.setting_name;
        }
      }
    },
  },
  methods: {
    async validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.StoreObj.action == "CREATE") {
          var mutationname = CreateProductFleetStatusType;
          var mutationresult = "CreateProductFleetStatusType";
          var inputParams = {
            creator_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            products_fleet_status: this.create_setting.products_fleet_status,
          };
        } else if (this.StoreObj.action == "EDIT") {
          mutationname = UpdateProductFleetStatusType;
          mutationresult = "UpdateProductFleetStatusType";
          inputParams = {
            creator_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            setting_id: this.StoreObj.setting_id,
            products_fleet_status: this.create_setting.products_fleet_status,
          };
        }

        try {
          this.isLoading = true;
          let result = await API.graphql(
            graphqlOperation(mutationname, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(result.data[mutationresult]);
          if (ResultObject.status == "Success") {
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

            this.AddEditProductFleetStatusDialogEmit((this.Toggle = 2));
          }
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
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
      } else if (!this.$refs.form.validate()) {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          Top: true,
          SnackbarText: "Fill all the required details",
        };
      }
    },
    AddEditProductFleetStatusDialogEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
