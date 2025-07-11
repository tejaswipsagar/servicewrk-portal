<template>
    <div>
      <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
      <v-dialog persistent width="400px" :value="AddEditTerritoryCategoryDialog">
        <v-card>
          <v-toolbar color="primary" class="white--text elevation-0" dense dark>
            <v-icon small>{{
              StoreObj.action == "CREATE" ? "mdi-plus" : "mdi-pencil"
            }}</v-icon>
            <div class="ml-2">
              {{ StoreObj.action == "CREATE" ? "Add Territory Category" : "Edit " }}
              <span v-if="StoreObj.action != 'CREATE'">{{
                StoreObj.territory_name
              }}</span>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              large
              class="mr-n4"
              dark
              text
              @click="AddEditTerritoryCategoryDialogEmit((Toggle = 1))"
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
                    label="Territory Category *"
                    :rules="[(v) => !!v || 'Required']"
                    class="FontSize field_label_size field_height mt-4"
                    v-model="territory_name"
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
    CreateTerritoryType,
    UpdateTerritoryTypes,
  } from "@/graphql/mutations.js";
  import Snackbar from "@/components/Extras/SnackbarView.vue";
  export default {
    props: {
      StoreObj: Object,
      AddEditTerritoryCategoryDialog: Boolean,
    },
    components: {
      Snackbar,
    },
    data: () => ({
      Toggle: 0,
      territory_name: "",
      renderComp: true,
      isLoading: false,
      SnackBarComponent: {},
    }),
    watch: {
      AddEditTerritoryCategoryDialog(val) {
        if (val == true) {
          if (this.StoreObj.action == "EDIT") {
            this.territory_name = this.StoreObj.territory_name;
          }
        }
      },
    },
    methods: {
      async validateMethod() {
        if (this.$refs.form.validate()) {
          if (this.StoreObj.action == "CREATE") {
            var mutationname = CreateTerritoryType;
            var mutationresult = "CreateTerritoryType";
            var inputParams = {
              user_id: this.$store.getters.get_current_user_details.user_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              territory_name: this.territory_name,
            };
          } else if (this.StoreObj.action == "EDIT") {
            mutationname = UpdateTerritoryTypes;
            mutationresult = "UpdateTerritoryTypes";
            inputParams = {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              territory_name: this.territory_name,
              territory_id: this.StoreObj.master_id,
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
              this.AddEditTerritoryCategoryDialogEmit((this.Toggle = 2));
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
      AddEditTerritoryCategoryDialogEmit(Toggle) {
        if (this.$refs.form != undefined) {
          this.$refs.form.reset();
        }
        this.$emit("clicked", Toggle);
      },
    },
  };
  </script>
  