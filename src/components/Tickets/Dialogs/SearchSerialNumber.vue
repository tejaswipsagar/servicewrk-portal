<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="SearchSerialNumberDialog" persistent max-width="400px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Search Serial Number</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="searchSerialNumberDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-btn
            block
            color="primary"
            class="mb-2 text-capitalize"
            small
            @click="searchSerialNumberDialogEmit(2, [], 'WITHOUT')"
            >Continue Without A Serial Nuber</v-btn
          >
          <div class="mt-2 mb-2">
            <strong> OR </strong>
          </div>
          <v-form ref="form">
            <v-text-field
              v-model="serialNumber"
              dense
              outlined
              label="Enter Serial Number to Search"
              :rules="[(v) => !!v || 'Required']"
              class="FontSize"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            :loading="btnLoading"
            @click="searchSerialNumberMethod()"
            class="white--text mb-5 mr-2 text-capitalize"
            >Search</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GetParticularSerialNumberDetails } from "@/graphql/queries.js";

export default {
  props: {
    SearchSerialNumberDialog: Boolean,
  },

  components: {
    Snackbar,
  },

  data: () => ({
    serialNumber: "",
    SnackBarComponent: {},
    renderComp: true,
    btnLoading: false,
  }),

  methods: {
    async searchSerialNumberMethod() {
      if (this.$refs.form.validate()) {
        let data = [];
        try {
          this.btnLoading = true;
          const result = await API.graphql(
            graphqlOperation(GetParticularSerialNumberDetails, {
              input: {
                organization_id:
                  this.$store.getters.get_current_user_details.organization_id,
                serial_number: this.serialNumber,
              },
            })
          );
          data = JSON.parse(result.data.GetParticularSerialNumberDetails).data
            .items;
        } catch (error) {
          //
        } finally {
          // if (Array.isArray(data) && data.length > 0) {
          //   this.searchSerialNumberDialogEmit(2, data);
          // } else {
          //   this.renderComp = false;
          //   this.$nextTick(() => {
          //     this.SnackBarComponent = {
          //       SnackbarVmodel: true,
          //       SnackbarColor: "red",
          //       Top: true,
          //       SnackbarText: "Serial number is not valid..!",
          //     };
          //     this.renderComp = true;
          //   });
          // }
          this.searchSerialNumberDialogEmit(2, data, "WITH");
          this.btnLoading = false;
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please enter serial number..!",
          };
          this.renderComp = true;
        });
      }
    },
    searchSerialNumberDialogEmit(Toggle, data, existence) {
      this.$refs.form.reset();
      this.$emit("clicked", Toggle, data, existence);
    },
  },
};
</script>
