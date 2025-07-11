<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog
      v-model="UpdatePayoutPaymentDialog"
      persistent
      :width="
        s3_files.length == 0 && selected_files.length == 0 ? '800px' : '1100px'
      "
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="primary">
          <div>Update Payout Payment Details</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="UpdatePayoutPaymentDialogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="black--text mt-5 pb-0">
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
            "
          >
            <!-- <div>
              <v-select
                dense
                outlined
                label="Confirmation Status*"
                :items="payment_status_items"
                v-model="payment_method"
                class="FontSize"
              >
              </v-select>
            </div> -->
            <!-- <div v-if="payment_method === 'PAYMENT_CANCELLED'">
              <v-text-field
                dense
                outlined
                class="FontSize"
                v-model="comments"
                label="Remarks*"
              ></v-text-field>
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
            </div> -->
            <div v-if="payment_method === 'PAYMENT_DONE'">
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
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>

          <v-btn
            v-show="payment_method !== ''"
            small
            class="mr-2"
            color="primary"
            :loading="loading_btn"
            @click="validateMethod()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { UpdatePaymentDetailsOfPayout } from "@/graphql/mutations.js";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
export default {
  props: {
    StoreObj: Object,
    UpdatePayoutPaymentDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  mixins: [GenerateS3URL],
  data: () => ({
    Toggle: 0,
    renderComp: true,
    loading_btn: false,
    comments: "",
    payment_method: "PAYMENT_DONE",
    files: [],
    s3_files: [],
    selected_files: [],
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
    SnackBarComponent: {},
    payment_status_items: [
      { text: "CONFIRMED", value: "PAYMENT_DONE" },
      { text: "REJECTED", value: "PAYMENT_CANCELLED" },
    ],
    paymentMode: "",
    paymentModeItems: [
      { text: "ONLINE", value: "ONLINE" },
      { text: "CASH", value: "OFFLINE" },
      { text: "CHEQUE", value: "CHEQUE" },
    ],
    // inrAmount: null,
    paymentDate: "",
    paymentTypeItems: [
      { text: "PAYMENT", value: "PAYMENT" },
      { text: "PURCHASE ORDER", value: "PURCHASE_ORDER" },
    ],
    paymentType: "",
    paymentValue: null,
    paymentRefNum: "",
    paymentOrderNumber: "",
    selected_date: false,
    ddmmyyyyPaymentFormate: "",
    formattedPaymentDate: "",
  }),
  watch: {
    files(val) {
      if (val.length !== 0 && val !== undefined && val !== null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },

    payment_method(val) {
      if (val === "PAYMENT_DONE") {
        this.files = [];
        this.s3_files = [];
        this.selected_files = [];
      } else {
        this.files = [];
        this.s3_files = [];
        this.selected_files = [];
      }
    },

    selected_files(val) {
      if (val.length === 0) {
        this.files = [];
      }
    },

    paymentDate(val) {
      if (val) {
        const [year, month, day] = val.split("-");
        this.ddmmyyyyPaymentFormate = `${day}-${month}-${year}`;
        console.log("CHECK_DATE", this.ddmmyyyyPaymentFormate);
      }
    },
  },

  methods: {
    previewAttachment(item) {
      window.open(item.file_url);
    },
    formatDate() {
      if (this.paymentDate) {
        const [year, month, day] = this.paymentDate.split("-");
        this.formattedPaymentDate = `${day}-${month}-${year}`;
      }
      this.selected_date = false;
    },
    async uploadMediaToS3() {
      this.loading_btn = true;
      for (let i = 0; i < this.selected_files.length; i++) {
        const fileFormat = this.selected_files[i].type.split("/")[1];
        console.log("SELECTED_FILES", this.selected_files[i]);
        let result = await this.GenerateS3URLMethods(
          `${new Date().getTime()}.${fileFormat}`,
          this.selected_files[i]
        );
        let Obj = {
          file_name: this.selected_files[i].name,
          file_type: this.selected_files[i].type,
          file_url: result.profile_pic_url,
          source_type: "PAYOUT",
        };
        this.s3_files.push(Obj);
      }
      this.updatePaymentDetailsMethod();
    },
    async validateMethod() {
      console.log("VALIDATE_METHOD");
      if (this.payment_method === "PAYMENT_CANCELLED") {
        if (this.comments !== "") {
          if (this.selected_files.length !== 0) {
            this.count = 0;
            this.uploadMediaToS3();
          } else {
            this.updatePaymentDetailsMethod();
          }
        } else {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Kindly provide remarks!",
          };
        }
      } else {
        if (this.$refs.form.validate() && this.$refs.remarkField.validate()) {
          if (this.selected_files.length !== 0) {
            this.count = 0;
            this.uploadMediaToS3();
          } else {
            this.updatePaymentDetailsMethod();
          }
        } else {
          console.log("NOT_SATISFIED");
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Kindly fill the mandatory fields(*) with remarks*!",
          };
        }
      }
    },
    async updatePaymentDetailsMethod() {
      try {
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          payment_id: this.StoreObj.payment_id,
          comments: this.comments,
          //   payment_method: this.payment_method,
          attachment_file:
            this.s3_files.length !== 0 ? this.s3_files : undefined,
          payment_details:
            this.payment_method === "PAYMENT_DONE"
              ? {
                  mode_of_payment: this.paymentMode,
                  date_of_payment: this.formattedPaymentDate,
                  payment_type: this.paymentType,
                  payment_reference_number: this.paymentRefNum,
                  payment_value: parseFloat(this.paymentValue),
                }
              : undefined,
        };
        this.loading_btn = true;
        let result = await API.graphql(
          graphqlOperation(UpdatePaymentDetailsOfPayout, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.UpdatePaymentDetailsOfPayout);
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.status_message,
            };
            this.renderComp = true;
          });
          this.UpdatePayoutPaymentDialogEmit((this.Toggle = 2));
        }
        this.loading_btn = false;
      } catch (error) {
        this.loading_btn = false;
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
    UpdatePayoutPaymentDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
      this.comments = "";
      this.files = [];
      this.paymentMode = "";
      this.paymentDate = "";
      this.paymentType = "";
      this.paymentRefNum = "";
      this.paymentValue = "";
    },
  },
};
</script>
