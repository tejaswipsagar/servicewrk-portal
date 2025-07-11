divdiv
<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog v-model="DeleteTerrClassDialog" persistent :width="500">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Delete Territory Classification</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="DeleteTerrClassDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-5"> Do you want to delete? </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="btnLoader"
            color="primary"
            small
            @click="DeleteTerritoryClassificationMethod()"
            >Delete<v-icon>mdi-delete</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { DeleteTerritoryClassification } from "@/graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
export default {
  props: {
    DeleteTerrClassDialog: Boolean,
    TerritoryObj: Object,
  },
  components: { Snackbar },
  data: () => ({
    btnLoader: false,
    SnackBarComponent: {},
  }),

  methods: {
    async DeleteTerritoryClassificationMethod() {
      try {
        this.btnLoader = true;
        const result = await API.graphql(
          graphqlOperation(DeleteTerritoryClassification, {
            input: {
              updater_user_id:
                this.$store.getters.get_current_user_details.user_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              territory_classification_id: this.TerritoryObj.pincode_id,
            },
          })
        );
        const response = JSON.parse(result.data.DeleteTerritoryClassification);
        if (response.status === "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: Status_Message,
            };
            this.renderComp = true;
          });
          this.DeleteTerrClassDialogEmit(2);
          this.btnLoader = false;
        }
      } catch (error) {
        this.btnLoader = false;
        console.log("Error", error);
      }
    },

    DeleteTerrClassDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
