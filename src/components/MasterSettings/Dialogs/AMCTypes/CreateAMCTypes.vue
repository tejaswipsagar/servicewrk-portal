<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent width="400px" :value="CreateAMCTypesDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2">
            {{ StoreObj.action == "CREATE" ? "Add" : "Edit " }} Support Type
            <span v-if="StoreObj.action != 'CREATE'">{{
              StoreObj.setting_name
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="CreateAMCTypesDialogEmit((Toggle = 1))"
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
                  label="Name *"
                  :rules="[(v) => !!v || 'Required']"
                  class="FontSize field_label_size field_height mt-4"
                  v-model="create_setting.setting_name"
                ></v-text-field>
                <v-text-field
                  outlined
                  dense
                  type="number"
                  label="AMC Type Price"
                  class="FontSize field_label_size field_height"
                  v-model="create_setting.amc_price"
                ></v-text-field>
                <v-text-field
                  outlined
                  dense
                  label="Description"
                  class="FontSize field_label_size field_height"
                  v-model="create_setting.setting_description"
                ></v-text-field>
                <v-select
                  v-if="StoreObj.action == 'CREATE'"
                  dense
                  outlined
                  label="Support Type *"
                  :rules="[(v) => !!v || 'Required']"
                  class="FontSize field_label_size field_height"
                  item-text="text"
                  item-value="value"
                  :items="WarrentyType"
                  v-model="create_setting.support_type"
                ></v-select>
                <v-text-field
                  outlined
                  dense
                  label="Support Frequency *"
                  :rules="[(v) => !!v || 'Required']"
                  class="FontSize field_label_size field_height"
                  v-model="create_setting.support_frequency"
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
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { CreateAMCTypes, UpdateAMCTypes } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    CreateAMCTypesDialog: Boolean,
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    renderComp: true,
    isLoading: false,
    WarrentyType: [
      { text: "GUARANTEE", value: "GUARANTEE" },
      { text: "WARRANTY", value: "WARRANTY" },
      { text: "CONTRACT", value: "CONTRACT" },
      { text: "EXTENDED WARRANTY", value: "EXTENDED_WARRANTY" },
      { text: "NO WARRANTY", value: "NO_WARRANTY" },
    ],
    create_setting: {
      amc_price: "",
      setting_name: "",
      setting_description: "",
      support_type: "",
      support_frequency: 0,
    },
    SnackBarComponent: {},
  }),
  watch: {
    CreateAMCTypesDialog(val) {
      if (val == true) {
        if (this.StoreObj.action == "EDIT") {
          this.create_setting.setting_name = this.StoreObj.setting_name;
          this.create_setting.setting_description =
            this.StoreObj.setting_description;
          this.create_setting.amc_price = this.StoreObj.setting_price;
          this.create_setting.support_type = this.StoreObj.support_type;
          this.create_setting.support_frequency =
            this.StoreObj.support_frequency;
        }
      }
    },
  },
  methods: {
    async validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.StoreObj.action == "CREATE") {
          var mutationname = CreateAMCTypes;
          var mutationresult = "CreateAMCTypes";
          var inputParams = {
            creator_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            setting_name: this.create_setting.setting_name,
            support_type: this.create_setting.support_type,
            support_frequency: this.create_setting.support_frequency,
          };
          if (
            this.create_setting.amc_price != undefined &&
            this.create_setting.amc_price != null &&
            this.create_setting.amc_price != ""
          ) {
            inputParams.setting_price = this.create_setting.amc_price;
          }
          if (
            this.create_setting.setting_description != undefined &&
            this.create_setting.setting_description != null &&
            this.create_setting.setting_description != ""
          ) {
            inputParams.setting_description =
              this.create_setting.setting_description;
          }
        } else if (this.StoreObj.action == "EDIT") {
          mutationname = UpdateAMCTypes;
          mutationresult = "UpdateAMCTypes";
          inputParams = {
            updater_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            setting_name: this.create_setting.setting_name,
            setting_price: this.create_setting.amc_price,
            setting_id: this.StoreObj.setting_id,
            support_frequency: this.create_setting.support_frequency,
          };
          if (
            this.create_setting.setting_description != undefined &&
            this.create_setting.setting_description != null &&
            this.create_setting.setting_description != ""
          ) {
            inputParams.setting_description =
              this.create_setting.setting_description;
          }
        }
        try {
          this.isLoading = true;
          let result = await API.graphql(
            graphqlOperation(mutationname, {
              input: inputParams,
            })
          );
          var ResultObject = JSON.parse(result.data[mutationresult]);
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
            this.CreateAMCTypesDialogEmit((this.Toggle = 2));
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
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fill all the required details",
          };
          this.renderComp = true;
        });
      }
    },
    CreateAMCTypesDialogEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
