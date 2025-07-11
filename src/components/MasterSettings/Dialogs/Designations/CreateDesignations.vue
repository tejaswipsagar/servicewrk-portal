<template>
  <div>
    <v-dialog
      fullscreen
      persistent
      :value="createDesignationDailog"
      transition="dialog-top-transition"
      v-if="renderComp"
    >
      <Overlay :overlay="overlay" />
      <v-card>
        <v-toolbar dense flat color="primary" dark>
          <div>
            {{ StoreObj.action == "CREATE" ? "Create Role" : "Update Role" }}
          </div>
          <v-spacer />
          <v-btn icon small @click="createEditRoleDialogEmit(1)"
            ><v-icon small>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-form ref="form">
          <v-toolbar flat outlined>
            <v-text-field
              outlined
              dense
              class="pa-2 mt-5 FontSize"
              :rules="[(v) => !!v || 'Required']"
              label="Role Name"
              v-model="CreateRole.RoleName"
            ></v-text-field>
            <v-spacer />
            <v-btn
              small
              depressed
              color="primary"
              :loading="loading"
              class="ma-0 mb-2 text-capitalize"
              @click="ValidateMethod()"
              >{{
                StoreObj.action == "CREATE" ? "Create Role" : "Update Role"
              }}</v-btn
            >
          </v-toolbar>
        </v-form>
        <v-card flat outlined height="450px" class="overflow-auto">
          <div class="font-weight-bold pa-2">Module Access</div>
          <v-card-text class="ma-0 pa-0">
            <div v-for="(Module, idx) in ModuleDeatils" :key="idx">
              <v-card flat class="pa-5" outlined>
                <v-row>
                  <v-col cols="12" md="2" sm="12" xs="12" align="">
                    <div class="font-weight-bold">
                      {{ Module.RootModule.module_name }}
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    sm="12"
                    xs="12"
                    v-for="(ModuleRights, rightsIndex) in Module.RootModule
                      .moduleAccess"
                    :key="rightsIndex"
                  >
                    <v-checkbox
                      class="pa-0 ma-0"
                      dense
                      :label="ModuleRights.name"
                      v-model="ModuleRights.value"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <div v-if="Module.SubModule != undefined">
                  <div class="font-weight-bold black--text">
                    {{ Module.RootModule.module_name }} Sub Modules
                  </div>
                  <v-card
                    flat
                    class="pa-2"
                    v-for="(subModule, subIndex) in Module.SubModule"
                    :key="subIndex"
                  >
                    <v-row>
                      <v-col cols="12" md="2" sm="12" xs="12">
                        {{ subModule.module_name }}
                      </v-col>
                      <v-col
                        cols="12"
                        md="2"
                        sm="12"
                        xs="12"
                        v-for="(
                          SubModuleRights, SubrightsIndex
                        ) in subModule.moduleAccess"
                        :key="SubrightsIndex"
                      >
                        <v-checkbox
                          class="pa-0 ma-0"
                          dense
                          v-model="SubModuleRights.value"
                          :label="SubModuleRights.name"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-card>
                </div>
              </v-card>
              <div style="border-bottom: 1px solid black"></div>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { GetAllModuleList } from "@/mixins/MastersSetting/GetAllModuleList.js";
import { GetAllListSubModule } from "@/mixins/MastersSetting/GetAllSubModuleList.js";
import Overlay from "@/components/Extras/OverlayView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { CreateDesignation, UpdateDesignation } from "@/graphql/mutations.js";
export default {
  props: {
    createDesignationDailog: Boolean,
    StoreObj: Object,
  },
  mixins: [GetAllModuleList, GetAllListSubModule],
  components: {
    Overlay,
  },
  data: () => ({
    ModuleDeatils: [],
    SnackBarComponent: {},
    renderComp: true,
    CreateRole: {
      RoleName: "",
      RoleDescripton: "",
      organzation_id: "",
    },
    overlay: false,
    loading: false,
  }),
  watch: {
    createDesignationDailog(val) {
      if (val == true) {
        this.CommonAPICallMethod();
        if (this.StoreObj.action == "EDIT") {
          this.CreateRole.RoleName = this.StoreObj.setting_name;
          this.$store.getters.get_current_user_details.organization_details[0].root_organization[0].sub_organizations.map(
            (org_ids) => {
              if (org_ids.organization_id === this.StoreObj.organization_id) {
                this.CreateRole.organzation_id = org_ids;
              }
            }
          );
          this.CreateRole.RoleName = this.StoreObj.setting_name;
        }
      }
    },
  },
  methods: {
    async CommonAPICallMethod() {
      var self = this;
      this.ModuleDeatils = [];
      let Array = await this.getAllModuleListMethod();
      console.log("Array", Array);
      for (let i = 0; i < Array.length; i++) {
        let RooObject = {
          RootModule: Array[i],
          SubModule: await this.getAllSubModuleListMethod(Array[i].module_id),
        };
        this.ModuleDeatils.push(RooObject);
        console.log("Root Object by Sravan", this.ModuleDeatils);
        this.ModuleDeatils.map((mod) => {
          let rootObj = mod.RootModule;
          var tempArray = [];
          for (let r = 0; r < mod.RootModule.module_rights.length; r++) {
            Object.entries(mod.RootModule.module_rights[r]).map((kry) => {
              let moduleObj = {
                name: kry[0],
                value: kry[1],
              };
              tempArray.push(moduleObj);
            });
            // for(const [key,value] of Obje)
          }
          rootObj.moduleAccess = tempArray;
          // if (mod.RootModule.module_rights === "All rights") {
          //   tempArray = [];
          //   let LocalRootArray = ["CREATE", "EDIT", "DELETE", "VIEW"];
          //   for (let r = 0; r < LocalRootArray.length; r++) {
          //     let newObj = {
          //       name: LocalRootArray[r],
          //       value: true,
          //     };
          //     tempArray.push(newObj);
          //   }
          //   rootObj.moduleAccess = tempArray;
          // } else {
          //   tempArray = [];
          //   for (
          //     let rs = 0;
          //     rs < mod.RootModule.module_rights.split(",").length;
          //     rs++
          //   ) {
          //     let newObj = {
          //       name: mod.RootModule.module_rights.split(",")[rs],
          //       value: true,
          //     };
          //     tempArray.push(newObj);
          //   }
          //   rootObj.moduleAccess = tempArray;
          // }
          if (mod.SubModule != undefined) {
            tempArray = [];
            for (let s = 0; s < mod.SubModule.length; s++) {
              tempArray = [];
              for (
                let subArray = 0;
                subArray < mod.SubModule[s].module_rights.length;
                subArray++
              ) {
                Object.entries(mod.SubModule[s].module_rights[subArray]).map(
                  (subkey) => {
                    let moduleObj = {
                      name: subkey[0],
                      value: subkey[1],
                    };
                    tempArray.push(moduleObj);
                  }
                );
              }
              mod.SubModule[s].moduleAccess = tempArray;
              // if (mod.SubModule[s].module_rights == "All rights") {
              //   let LocalRootArray = ["CREATE", "EDIT", "DELETE", "VIEW"];
              //   for (
              //     let subArray = 0;
              //     subArray < LocalRootArray.length;
              //     subArray++
              //   ) {
              //     let newObj = {
              //       name: LocalRootArray[subArray],
              //       value: true,
              //     };
              //     tempArray.push(newObj);
              //   }
              //   mod.SubModule[s].moduleAccess = tempArray;
              // } else {
              //   tempArray = [];
              //   for (
              //     let subArray = 0;
              //     subArray < mod.SubModule[s].module_rights.split(",").length;
              //     subArray++
              //   ) {
              //     let newObj = {
              //       name: mod.SubModule[s].module_rights.split(",")[subArray],
              //       value: true,
              //     };
              //     tempArray.push(newObj);
              //   }
              //   mod.SubModule[s].moduleAccess = tempArray;
              // }
            }
          }
          rootObj.SubModules = mod.SubModule;
          return rootObj;
        });
      }
      setTimeout(() => {
        this.overlay = false;
      }, 5000);
      if (self.StoreObj.action == "EDIT") {
        self.EditDetailsMethod();
      }
    },
    ValidateMethod() {
      let LocalArray = [];
      let FialObj = {};

      for (let i = 0; i < this.ModuleDeatils.length; i++) {
        let superPower = {};
        // let severalPower = {};
        let StoreArrayObject = [];
        // let StoreChildArrayObject = [];
        FialObj = {
          module_id: this.ModuleDeatils[i].RootModule.module_id,
          module_name: this.ModuleDeatils[i].RootModule.module_name,
          module_rights: (() => {
            if (
              this.ModuleDeatils[i] &&
              this.ModuleDeatils[i].RootModule &&
              this.ModuleDeatils[i].RootModule.moduleAccess
            ) {
              superPower = this.ModuleDeatils[i].RootModule.moduleAccess.reduce(
                (acc, super_vishwa) => {
                  acc[super_vishwa.name] = super_vishwa.value;
                  return acc;
                },
                {}
              );
            }
            StoreArrayObject.push(superPower);

            return StoreArrayObject;
          })(),
          sub_modules:
            this.ModuleDeatils[i].RootModule.SubModules != undefined
              ? this.ModuleDeatils[i].RootModule.SubModules.map((item) => {
                  let SampleObj = {};
                  item.moduleAccess.forEach((right) => {
                    SampleObj[right.name] = right.value;
                  });
                  return {
                    module_name: item.module_name,
                    module_id: item.module_id,
                    module_rights: [SampleObj],
                  };
                  // let Object = {
                  //   module_name: item.module_name,
                  //   module_id: item.module_id,
                  //   module_rights: (() => {

                  //     severalPower = item.moduleAccess.reduce(
                  //       (acc, poda_panni) => {
                  //         acc[poda_panni.name] = poda_panni.value;
                  //         return acc;
                  //       },
                  //       {}
                  //     );
                  //
                  //     StoreChildArrayObject.push(severalPower);
                  //     // return StoreChildArrayObject;
                  //   })(),
                  // };
                  // return Object;
                })
              : undefined,
        };
        let duplicate = LocalArray.find(
          (item) => item.module_id === FialObj.module_id
        );
        if (!duplicate) {
          LocalArray.push(FialObj);
        }
      }
      if (this.$refs.form.validate()) {
        this.CreateEditModuleMethod(LocalArray);
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please fill the mandatory field",
          };
          this.renderComp = true;
        });
      }
    },
    async CreateEditModuleMethod(ModuleRights) {
      this.loading = true;
      var mutation_name =
        this.StoreObj.action == "CREATE"
          ? CreateDesignation
          : UpdateDesignation;
      var mutation_result =
        this.StoreObj.action == "CREATE"
          ? "CreateDesignation"
          : "UpdateDesignation";
      var InputParams = {
        creator_user_id:
          this.StoreObj.action == "CREATE"
            ? this.$store.getters.get_current_user_details.user_id
            : undefined,
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        setting_name: this.CreateRole.RoleName,
        accessing_module: ModuleRights,
        setting_id:
          this.StoreObj.action != "CREATE"
            ? this.StoreObj.setting_id
            : undefined,
        updater_user_id:
          this.StoreObj.action != "CREATE"
            ? this.$store.getters.get_current_user_details.user_id
            : undefined,
      };
      try {
        let result = await API.graphql(
          graphqlOperation(mutation_name, {
            input: InputParams,
          })
        );
        var ResultObj = JSON.parse(result.data[mutation_result]);
        if (ResultObj.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObj.Status_Message,
            };
            this.renderComp = true;
          });

          this.createEditRoleDialogEmit(2);
          this.loading = false;
        }
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
    createEditRoleDialogEmit(Toggle) {
      this.$refs.form.reset();
      this.ModuleDeatils = [];
      this.$emit("clicked", Toggle);
    },
    EditDetailsMethod() {
      for (let i = 0; i < this.StoreObj.accessing_module.length; i++) {
        for (let j = 0; j < this.ModuleDeatils.length; j++) {
          if (
            this.StoreObj.accessing_module[i].module_name ===
            this.ModuleDeatils[j].RootModule.module_name
          ) {
            this.StoreObj.accessing_module[i].module_rights.map((it) => {
              this.ModuleDeatils[j].RootModule.moduleAccess.map((eee) => {
                Object.entries(it).map((name) => {
                  if (eee.name === name[0]) {
                    eee.name = name[0];
                    eee.value = name[1];
                  }
                });
              });
            });
          }
          if (this.StoreObj.accessing_module[i].sub_modules) {
            for (
              let m = 0;
              m < this.StoreObj.accessing_module[i].sub_modules.length;
              m++
            ) {
              if (this.ModuleDeatils[j].SubModule != undefined) {
                for (
                  let n = 0;
                  n < this.ModuleDeatils[j].SubModule.length;
                  n++
                ) {
                  if (
                    this.StoreObj.accessing_module[i].sub_modules[m]
                      .module_name ===
                    this.ModuleDeatils[j].SubModule[n].module_name
                  ) {
                    this.StoreObj.accessing_module[i].sub_modules[
                      m
                    ].module_rights.map((st) => {
                      this.ModuleDeatils[j].SubModule[n].moduleAccess.map(
                        (stt) => {
                          Object.entries(st).map((names) => {
                            if (stt.name === names[0]) {
                              stt.name = names[0];
                              stt.value = names[1];
                            }
                          });
                        }
                      );
                    });
                  }
                }
              }
            }
          }
        }
      }
    },
  },
};
</script>

<style></style>
