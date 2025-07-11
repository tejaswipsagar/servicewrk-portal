<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent width="500px" :value="UpdateFormDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small>{{ "mdi-mail" }}</v-icon>
          <div class="ml-2">Send</div>
          <v-spacer></v-spacer>
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="UpdateFormDialogEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="12">
              <v-form ref="form">
                <v-row>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      readonly
                      label="Customer Name"
                      class="FontSize field_label_size field_height mt-4"
                      v-model="update_form.company_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      readonly
                      label="Contact Person Name"
                      class="FontSize field_label_size field_height mt-4"
                      v-model="update_form.customer_name"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n6">
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      readonly
                      label="Customer Contact Number"
                      class="FontSize field_label_size field_height"
                      v-model="update_form.customer_contact_number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" xs="12">
                    <v-text-field
                      outlined
                      dense
                      readonly
                      label="Customer Mail Id"
                      class="FontSize field_label_size field_height"
                      v-model="update_form.customer_email"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n6">
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      readonly
                      label="Category"
                      class="FontSize field_label_size field_height"
                      v-model="update_form.category_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      readonly
                      label="Product"
                      class="FontSize field_label_size field_height"
                      v-model="update_form.product_name"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-combobox
                  label="Send To *"
                  :items="GetAllUsersList"
                  outlined
                  multiple
                  class="FontSize"
                  item-text="user_email_id"
                  item-value="user_email_id"
                  :rules="[(v) => !!v || 'Required']"
                  dense
                  v-model="update_form.email_ids"
                  @change="CheckDataMethod"
                >
                </v-combobox>
                <v-row>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      label="Email Subject *"
                      class="FontSize field_label_size field_height"
                      v-model="update_form.email_subject"
                      :rules="[(v) => !!v || 'Required']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="12" xs="12">
                    <v-text-field
                      outlined
                      dense
                      label="Comments"
                      class="FontSize field_label_size field_height"
                      v-model="update_form.form_comments"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-textarea
                  outlined
                  dense
                  label="Email Body *"
                  row="1"
                  auto-grow
                  :rules="[(v) => !!v || 'Required']"
                  class="FontSize field_label_size field_height bodyPart"
                  v-model="update_form.email_body"
                ></v-textarea>
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
            >Send
            <v-icon class="white--text ma-1" small>mdi-send</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { UpdateForm } from "@/graphql/mutations.js";
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { GetAllUsers } from "@/mixins/Users/GetAllUsers.js";
export default {
  mixins: [GetAllUsers],
  props: {
    UpdateFormDialog: Boolean,
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    select: [],
    renderComp: true,
    Toggle: 0,
    GetAllUsersList: [],
    update_form: {
      customer_name: "",
      company_name: "",
      customer_contact_number: "",
      customer_email: "",
      category_name: "",
      product_name: "",
      form_comments: "",
      form_id: "",
      email_ids: "",
      email_body: "",
      email_subject: "",
    },
    isLoading: false,
    SnackBarComponent: {},
  }),
  watch: {
    UpdateFormDialog(val) {
      if (val == true) {
        this.update_form.customer_name = this.StoreObj.customer_name;
        this.update_form.customer_email = this.StoreObj.customer_email;
        this.update_form.customer_contact_number =
          this.StoreObj.customer_contact_number;
        this.update_form.category_name = this.StoreObj.category_name;
        this.update_form.product_name = this.StoreObj.product_name;
        this.update_form.form_comments = this.StoreObj.form_comments;
        this.form_id = this.StoreObj.form_id;
        this.update_form.email_ids = this.StoreObj.sent_to_email_ids;
        this.update_form.form_description = this.StoreObj.form_description;
        this.update_form.email_subject = this.StoreObj.email_subject;
        this.update_form.email_body = this.StoreObj.email_body.replaceAll(
          "<br/>",
          "\n"
        );
      }
    },
  },
  mounted() {
    this.GetAllUsersMethod(this.user_type, (this.user_status = "ACTIVE"));
  },
  methods: {
    CheckDataMethod(data) {
      data.map((item) => {
        let Object = {
          user_email_id:
            item.user_email_id != undefined ? item.user_email_id : item,
        };
        if (Object) {
          if (
            this.update_form.email_ids.filter(
              (x) => x.user_email_id === Object.user_email_id
            ).length === 0
          ) {
            this.update_form.email_ids.push(Object);
          }
        }
      });
    },
    async validateMethod() {
      if (this.$refs.form.validate()) {
        var mutationname = UpdateForm;
        var mutationresult = "UpdateForm";
        var inputParams = {
          updater_user_id: this.$store.getters.get_current_user_details.user_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          form_id: this.StoreObj.form_id,
        };
        if (
          this.update_form.email_ids.map((item) => item.user_email_id) !=
            undefined &&
          this.update_form.email_ids.map((item) => item.user_email_id) !=
            null &&
          this.update_form.email_ids.map((item) => item.user_email_id) != ""
        ) {
          inputParams.email_ids = this.update_form.email_ids.map(
            (item) => item.user_email_id
          );
        }
        if (
          this.update_form.action_comment != undefined &&
          this.update_form.action_comment != null &&
          this.update_form.action_comment != ""
        ) {
          inputParams.action_comment = this.update_form.action_comment;
        }
        if (
          this.update_form.form_comments != undefined &&
          this.update_form.form_comments != null &&
          this.update_form.form_comments != ""
        ) {
          inputParams.form_comments = this.update_form.form_comments;
        }
        if (
          this.update_form.email_body != undefined &&
          this.update_form.email_body != null &&
          this.update_form.email_body != ""
        ) {
          inputParams.email_body = this.update_form.email_body.replaceAll(
            "\n",
            "<br/>"
          );
        }
        if (
          this.update_form.email_subject != undefined &&
          this.update_form.email_subject != null &&
          this.update_form.email_subject != ""
        ) {
          inputParams.email_subject = this.update_form.email_subject;
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
            this.UpdateFormDialogEmit((this.Toggle = 2));
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

    UpdateFormDialogEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
