<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog v-model="AddPaymentDetailsDialog" persistent max-width="800px">
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Add Payment Details</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="AddPaymentDetailsDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-5 pb-0">
          <v-form ref="form">
            <v-row align="center">
              <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                <div style="display: flex; flex-direction: column">
                  <div>
                    <v-select
                      dense
                      outlined
                      label="Mode of Payment*"
                      v-model="paymentMode"
                      :items="paymentModeItems"
                      item-text="text"
                      item-key="key"
                      :rules="[(v) => !!v || 'Required']"
                    >
                    </v-select>
                  </div>
                  <div>
                    <v-menu
                      offset-y
                      min-width="auto"
                      :nudge-right="40"
                      v-model="selected_date"
                      transition="scale-transition"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          outlined
                          v-on="on"
                          label="Date of Payment Order*"
                          v-bind="attrs"
                          v-model="formattedPaymentDate"
                          class="FontSize ml-1"
                          prepend-inner-icon="mdi-calendar"
                          :rules="[(v) => !!v || 'Required']"
                          readonly
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="paymentDate"
                        @input="formatDate"
                      ></v-date-picker>
                    </v-menu>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                <div style="display: flex; flex-direction: column">
                  <div>
                    <v-select
                      dense
                      outlined
                      label="Payment Type*"
                      v-model="paymentType"
                      :items="paymentTypeItems"
                      item-text="text"
                      item-value="value"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-select>
                  </div>
                  <div>
                    <v-text-field
                      dense
                      outlined
                      label="Payment Ref Num*"
                      v-model="paymentRefNum"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </div>
                  <div>
                    <v-text-field
                      type="number"
                      dense
                      outlined
                      label="Value of Payment*"
                      v-model="paymentValue"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-form>
          <div>
            <v-form ref="remarkField">
              <v-text-field
                dense
                outlined
                class="FontSize"
                v-model="comments"
                label="Remarks*"
                :rules="[(v) => !!v || 'Required']"
              ></v-text-field>
            </v-form>
            <v-file-input
              dense
              outlined
              multiple
              v-model="files"
              class="FontSize"
              :prepend-icon="null"
              label="Attachements"
              append-icon="mdi-paperclip"
            >
            </v-file-input>
          </div>
          <div v-if="s3_files.length !== 0 || selected_files.length != 0">
            <div
              v-if="selected_files.length !== 0"
              class="font-weight-bold mt-n3"
            >
              Selected Files
              <v-data-table
                v-if="selected_files.length !== 0"
                dense
                class="elevation-0"
                :headers="selected_files_header"
                :items="selected_files"
              >
                <template v-slot:[`item.sl_no`]="{ item }">
                  <div class="FontSize">
                    {{ selected_files.indexOf(item) + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                  <div class="FontSize">
                    {{ item.name }}
                  </div>
                </template>
                <template v-slot:[`item.type`]="{ item }">
                  <div class="FontSize">
                    {{ item.type }}
                  </div>
                </template>
                <template v-slot:[`item.Action`]="{ item }">
                  <v-btn
                    icon
                    color="red"
                    @click="
                      selected_files.splice(selected_files.indexOf(item), 1)
                    "
                  >
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pt-0 mr-2">
          <v-spacer></v-spacer>
          <v-btn
            small
            :loading="loading"
            color="primary"
            @click="validateMethod()"
            class="white--text mb-2"
            >Add</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { UpdateWarrantyDetailsInTicket } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
export default {
  mixins: [GenerateS3URL],
  props: {
    StoreObj: Object,
    AddPaymentDetailsDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    paymentMode: "",
    paymentDate: "",
    paymentType: "",
    paymentRefNum: "",
    paymentValue: null,
    comments: "",
    formattedPaymentDate: "",
    files: [],
    s3_files: [],
    selected_files: [],
    SnackBarComponent: {},
    paymentModeItems: [
      { text: "ONLINE", value: "ONLINE" },
      { text: "CASH", value: "OFFLINE" },
      { text: "CHEQUE", value: "CHEQUE" },
    ],
    paymentTypeItems: [
      { text: "PAYMENT", value: "PAYMENT" },
      { text: "PURCHASE ORDER", value: "PURCHASE_ORDER" },
    ],
    s3_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "file_name" },
      { text: "Type", value: "file_type" },
      { text: "Action", value: "Action" },
    ],
    selected_files_header: [
      { text: "Sl No.", value: "sl_no" },
      { text: "Name", value: "name" },
      { text: "Type", value: "type" },
      { text: "Action", value: "Action" },
    ],
    selected_date: false,
    loading: false,
    renderComp: true,
  }),
  watch: {
    AddPaymentDetailsDialog(val) {
      if (val) {
        if (this.StoreObj.from === "ticket") {
          this.paymentTypeItems = [
            { text: "PAYMENT", value: "PAYMENT" },
            { text: "PURCHASE ORDER", value: "PURCHASE_ORDER" },
          ];
          console.log("CHECK_OBJ", this.StoreObj);
        } else {
          this.paymentTypeItems = [
            { text: "PAYMENT", value: "PAYMENT" },
            { text: "PURCHASE ORDER", value: "PURCHASE_ORDER" },
          ];
        }
      }
    },

    files(val) {
      if (val.length !== 0 && val !== undefined && val !== null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },

    selected_files(val) {
      if (val.length === 0) {
        this.files = [];
      }
    },
  },

  methods: {
    formatDate() {
      if (this.paymentDate) {
        const [year, month, day] = this.paymentDate.split("-");
        this.formattedPaymentDate = `${day}-${month}-${year}`;
      }
      this.selected_date = false;
    },
    async validateMethod() {
      if (this.$refs.form.validate() && this.$refs.remarkField.validate()) {
        if (this.selected_files.length > 0) {
          await this.s3FileUploadMethod();
          await this.callPaymentInfoApiMethod();
        } else {
          await this.callPaymentInfoApiMethod();
        }
      } else {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please fill all the required fields",
          };
          this.renderComp = true;
        });
      }
    },

    async callPaymentInfoApiMethod() {
      try {
        this.loading = true;
        const result = await API.graphql(
          graphqlOperation(UpdateWarrantyDetailsInTicket, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              updater_user_id:
                this.$store.getters.get_current_user_details.user_id,
              ticket_id: this.StoreObj.ticket_id || this.StoreObj.a,
              comments: this.comments,
              payment_details: {
                mode_of_payment: this.paymentMode,
                date_of_payment: this.formattedPaymentDate,
                payment_type: this.paymentType,
                payment_reference_number: this.paymentRefNum,
                payment_value: this.paymentValue,
              },
              attachment_file:
                this.s3_files.length > 0 ? this.s3_files : undefined,
            },
          })
        );
        const response = JSON.parse(result.data.UpdateWarrantyDetailsInTicket);
        if (response.status === "SUCCESS") {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: response.Status_Message,
            };
            this.renderComp = true;
          });
          this.loading = false;
          this.AddPaymentDetailsDialogEmit(2);
        }
      } catch (error) {
        this.loading = false;
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

    async s3FileUploadMethod() {
      this.loading_btn = true;
      for (let i = 0; i < this.selected_files.length; i++) {
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}`,
          this.selected_files[i]
        );
        let Obj = {
          file_name: this.selected_files[i].name,
          file_type: this.selected_files[i].type,
          file_url: result.profile_pic_url,
          source_type: "TICKET_PAYMENT_DETAILS",
        };
        this.s3_files.push(Obj);
      }
    },

    AddPaymentDetailsDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
      this.$refs.form.reset();
      this.$refs.remarkField.reset();
      this.files = [];
      this.selected_files = [];
      this.s3_files = [];
    },
  },
};
</script>
