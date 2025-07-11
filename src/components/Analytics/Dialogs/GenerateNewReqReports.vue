<template>
  <div>
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <v-dialog v-model="GenerateNewReqReportsDialog" persistent width="500">
      <v-card>
        <v-toolbar elevation="0" dense color="primary white--text">
          <v-icon color="white" class="mr-2">mdi-microsoft-excel</v-icon>
          <div class="mr-1">Generate Excel</div>

          <v-spacer />
          <v-btn
            icon
            class="primary white--text"
            @click="GenerateNewReqReportsDialogEmit((Toggle = 1))"
          >
            <v-icon> mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-0 mt-8 text-center black--text">
          <div>Are you sure want to generate excel for customers?</div>
        </v-card-text>
        <v-card-actions class="mt-4">
          <v-spacer />

          <v-btn
            small
            :loading="btnLoading"
            @click="generateExcelMethod()"
            class="primary white--text mb-4"
            ><v-icon small class="mr-2">mdi-microsoft-excel</v-icon>
            Generate</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GenerateCustomerExcel } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";

export default {
  components: {
    Snackbar,
  },
  props: {
    GenerateNewReqReportsDialog: Boolean,
  },
  data: () => ({
    overlay: false,
    renderComp: true,
    SnackBarComponent: {},
    btnLoading: false,
  }),
  methods: {
    async generateExcelMethod() {
      try {
        this.btnLoading = true;
        const result = await API.graphql(
          graphqlOperation(GenerateCustomerExcel, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
            },
          })
        );

        const response = JSON.parse(result.data.GenerateCustomerExcel);
        if (response.statusCode === 200) {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: "Excel Generated..!",
            };
            this.renderComp = true;
          });
          this.btnLoading = false;
          this.GenerateNewReqReportsDialogEmit(2);
        }
      } catch (error) {
        console.log("Error", error);
      }
    },

    GenerateNewReqReportsDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>
