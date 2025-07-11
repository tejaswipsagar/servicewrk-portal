<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent width="400px" :value="AddWipStateDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small>{{
            StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          <div class="ml-2">
            {{ StoreObj.action == "CREATE" ? "Add " : "Edit " }} WIP State
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
            @click="AddWipStateDialogEmit((Toggle = 1))"
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
                  label="WIP State Name *"
                  class="FontSize field_label_size field_height mt-4"
                  v-model="create_setting.setting_name"
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
  Create_WIP_SubStages,
  Update_WIP_SubStage,
} from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    AddWipStateDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    price: 0,
    Toggle: 0,
    renderComp: true,
    isLoading: false,
    description: null,
    serialNumber: "",
    SnackBarComponent: {},
    create_setting: {
      setting_name: "",
      service_id: "",
    },
  }),
  watch: {
    AddWipStateDialog(val) {
      if (val == true) {
        if (this.StoreObj.action == "EDIT") {
          this.create_setting.setting_name = this.StoreObj.setting_name;
        }
      }
    },
  },
  methods: {
    async validateMethod() {
      if (this.$refs.form.validate()) {
        if (this.StoreObj.action == "CREATE") {
          var mutationname = Create_WIP_SubStages;
          var mutationresult = "Create_WIP_SubStages";
          var inputParams = {
            creator_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            setting_name: this.create_setting.setting_name,
          };
        } else if (this.StoreObj.action == "EDIT") {
          mutationname = Update_WIP_SubStage;
          mutationresult = "Update_WIP_SubStage";
          inputParams = {
            updater_user_id:
              this.$store.getters.get_current_user_details.user_id,
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            setting_id: this.StoreObj.setting_id,
            setting_name: this.create_setting.setting_name,
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
            this.AddWipStateDialogEmit((this.Toggle = 2));
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
    AddWipStateDialogEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
