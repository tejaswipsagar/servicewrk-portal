<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog :value="dialogDeleteReps" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>
            <v-icon small class="mr-2">mdi-delete</v-icon>Delete Service
            Representative
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogDeleteRepsEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-icon size="50px" color="red">mdi-delete</v-icon>
          <div>
            Are you sure you want to delete request send to
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
            @click="DeleteMethod()"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { DeleteInvitedRepresentative } from "@/graphql/mutations.js";
export default {
  props: {
    StoreObj: Object,
    dialogDeleteReps: Boolean,
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
    async DeleteMethod() {
      try {
        var inputParams = {
          representative_user_id: this.StoreObj.user_id,
          deleter_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(DeleteInvitedRepresentative, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.DeleteInvitedRepresentative);
        if (ResultObject.status == "SUCCESS") {
          (this.renderComp = false),
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "green",
                Top: true,
                SnackbarText: ResultObject.Status_Message,
              };
              this.renderComp = true;
            });
          this.dialogDeleteRepsEmit((this.Toggle = 2));
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
    dialogDeleteRepsEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
