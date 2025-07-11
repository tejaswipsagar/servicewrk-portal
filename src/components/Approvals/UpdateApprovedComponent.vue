<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" v-if="renderComp" />
    <v-dialog persistent width="90%" :value="UpdateApprovedComponentDialog">
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small>mdi-pencil</v-icon>
          <div class="ml-2">
            Update <span v-if="StoreObj.mrf_id">{{ StoreObj.mrf_id }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            dark
            text
            large
            class="mr-n4"
            @click="UpdateApprovedComponentDialogEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="12" xs="12" sm="12" md="4">
              <div style="border: 1px solid black" class="pa-2 mt-6">
                <h3 class="text-center black--text">Store Dispatch</h3>
                <v-form ref="form">
                  <v-row no-gutters>
                    <v-col cols="12" md="6" sm="12" xs="12">
                      <v-text-field
                        dense
                        outlined
                        label="Courier Name"
                        class="FontSize pt-4"
                        v-model="courier_name"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="12" xs="12">
                      <v-text-field
                        outlined
                        dense
                        label="Docket ID"
                        v-model="tracking_id"
                        class="FontSize pt-4 ml-1"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" md="6" xs="12" sm="12">
                      <v-text-field
                        dense
                        outlined
                        type="number"
                        class="FontSize"
                        label="Phone Number"
                        v-model="phone_number"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" xs="12" sm="12">
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
                            label="Date"
                            v-bind="attrs"
                            v-model="date"
                            text_value="date"
                            class="FontSize ml-1"
                            prepend-inner-icon="mdi-calendar"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          @input="selected_date = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-autocomplete
                    dense
                    outlined
                    class="FontSize"
                    item-value="master_id"
                    label="Additional Part"
                    item-text="master_name"
                    v-model="additional_part_details"
                    :items="GetAllAdditionalPartsList"
                    return-object
                  ></v-autocomplete>
                  <v-text-field
                    dense
                    outlined
                    class="FontSize"
                    label="Comments"
                    v-model="tracking_details_comments"
                  ></v-text-field>
                  <v-file-input
                    dense
                    outlined
                    multiple
                    v-model="files"
                    class="FontSize"
                    label="File input"
                    :prepend-icon="null"
                    append-icon="mdi-paperclip"
                  ></v-file-input>
                </v-form>
                <div
                  class="font-weight-bold mt-3 black--text text-center"
                  v-if="selected_files.length != 0"
                >
                  Selected Files
                </div>
                <v-data-table
                  dense
                  hide-default-footer
                  class="elevation-0"
                  :items="selected_files"
                  :headers="selected_files_header"
                  v-if="selected_files.length != 0"
                >
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
                <hr v-if="s3_files.length != 0" class="black--text mb-2" />
                <div
                  v-if="s3_files.length != 0"
                  class="font-weight-bold text-center black--text"
                >
                  Files Added
                </div>
                <v-data-table
                  dense
                  :items="s3_files"
                  class="elevation-0"
                  hide-default-footer
                  :headers="s3_files_header"
                  v-if="s3_files.length != 0"
                >
                  <template v-slot:[`item.file_name`]="{ item }">
                    <div class="FontSize">
                      {{ item.file_name }}
                    </div>
                    <div class="FontSize">
                      {{ item.file_type }}
                    </div>
                  </template>
                  <template v-slot:[`item.Action`]="{ item }">
                    <v-btn icon color="primary" @click="previewOfFiles(item)">
                      <v-icon small>mdi-paperclip</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="red"
                      @click="s3_files.splice(s3_files.indexOf(item), 1)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </div>
              <div
                v-if="
                  this.StoreObj.tracking_details != undefined &&
                  this.StoreObj.tracking_details.length != 0
                "
              >
                <div
                  class="font-weight-bold black--text mt-4"
                  v-if="this.StoreObj.tracking_details[0].updated_by_name"
                >
                  Updated By :
                  {{ this.StoreObj.tracking_details[0].updated_by_name }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-4">
              <div style="border: 1px solid black" class="pa-2 mt-2">
                <h3 class="text-center black--text mb-2">Local Purchase</h3>
                <v-form ref="local_purchase_form">
                  <v-text-field
                    dense
                    outlined
                    class="FontSize"
                    label="Purchase Number"
                    v-model="purchase_number"
                  >
                  </v-text-field>
                  <v-menu
                    offset-y
                    min-width="auto"
                    v-model="local_purchase_date"
                    transition="scale-transition"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind="attrs"
                        class="FontSize"
                        label="Purchase Date"
                        v-model="purchase_date"
                        prepend-inner-icon="mdi-calendar"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="purchase_date"
                      @input="local_purchase_date = false"
                    ></v-date-picker>
                  </v-menu>
                  <v-text-field
                    dense
                    outlined
                    class="FontSize"
                    label="Purchased By"
                    v-model="purchased_by"
                  >
                  </v-text-field>
                  <v-text-field
                    dense
                    outlined
                    class="FontSize"
                    label="Comments"
                    v-model="local_purchase_comments"
                  >
                  </v-text-field>
                  <v-file-input
                    dense
                    outlined
                    multiple
                    v-model="files_local_purchase"
                    class="FontSize"
                    label="File Input"
                    append-icon="mdi-paperclip"
                    :prepend-icon="null"
                  ></v-file-input>
                </v-form>
                <div
                  class="font-weight-bold mt-3 text-center black--text"
                  v-if="local_purchase_selected_files.length != 0"
                >
                  Selected Files
                </div>
                <v-data-table
                  dense
                  hide-default-footer
                  class="elevation-0"
                  :items="local_purchase_selected_files"
                  :headers="local_purchase_selected_files_headers"
                  v-if="local_purchase_selected_files.length != 0"
                >
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
                        local_purchase_selected_files.splice(
                          local_purchase_selected_files.indexOf(item),
                          1
                        )
                      "
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
                <hr
                  v-if="s3_files_local_purchase.length != 0"
                  class="black--text mb-2"
                />
                <div
                  v-if="s3_files_local_purchase.length != 0"
                  class="font-weight-bold text-center black--text"
                >
                  Files Added
                </div>
                <v-data-table
                  dense
                  :items="s3_files_local_purchase"
                  class="elevation-0"
                  hide-default-footer
                  :headers="s3_files_header"
                  v-if="s3_files_local_purchase.length != 0"
                >
                  <template v-slot:[`item.file_name`]="{ item }">
                    <div class="FontSize">
                      {{ item.file_name }}
                    </div>
                    <div class="FontSize">
                      {{ item.file_type }}
                    </div>
                  </template>
                  <template v-slot:[`item.Action`]="{ item }">
                    <v-btn icon color="primary" @click="previewOfFiles(item)">
                      <v-icon small>mdi-paperclip</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="red"
                      @click="
                        s3_files_local_purchase.splice(
                          s3_files_local_purchase.indexOf(item),
                          1
                        )
                      "
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </div>
              <div
                v-if="
                  this.StoreObj.LOP_deatails != undefined &&
                  this.StoreObj.LOP_deatails.length != 0
                "
              >
                <div
                  class="font-weight-bold black--text mt-4"
                  v-if="this.StoreObj.LOP_deatails[0].updated_by_name"
                >
                  Updated By :
                  {{ this.StoreObj.LOP_deatails[0].updated_by_name }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" xs="12" class="mt-4">
              <div style="border: 1px solid black" class="pa-2 mt-2">
                <h3 class="text-center mb-2 mt-0 black--text">
                  Indent to Factory
                </h3>
                <v-form ref="form_ito">
                  <v-menu
                    offset-y
                    min-width="auto"
                    :nudge-right="40"
                    v-model="iof_date"
                    transition="scale-transition"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        outlined
                        v-on="on"
                        v-bind="attrs"
                        class="FontSize"
                        label="Date Of Arraival"
                        v-model="date_of_arraival"
                        prepend-inner-icon="mdi-calendar"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      @input="iof_date = false"
                      v-model="date_of_arraival"
                    ></v-date-picker>
                  </v-menu>
                  <v-text-field
                    dense
                    outlined
                    class="FontSize"
                    label="Comments"
                    v-model="comments_itf_details"
                  ></v-text-field>
                  <v-file-input
                    dense
                    outlined
                    multiple
                    class="FontSize"
                    label="File Input"
                    v-model="files_itf"
                    :prepend-icon="null"
                    append-icon="mdi-paperclip"
                  ></v-file-input>
                </v-form>
                <div
                  class="font-weight-bold mt-3 text-center black--text"
                  v-if="itf_selected_files.length != 0"
                >
                  Selected Files
                </div>
                <v-data-table
                  dense
                  hide-default-footer
                  class="elevation-0"
                  :items="itf_selected_files"
                  :headers="itf_selected_files_headers"
                  v-if="itf_selected_files.length != 0"
                >
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
                        itf_selected_files.splice(
                          itf_selected_files.indexOf(item),
                          1
                        )
                      "
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
                <hr v-if="s3_files_itf.length != 0" class="black--text mb-2" />
                <div
                  v-if="s3_files_itf.length != 0"
                  class="font-weight-bold text-center black--text"
                >
                  Files Added
                </div>
                <v-data-table
                  dense
                  :items="s3_files_itf"
                  class="elevation-0"
                  hide-default-footer
                  :headers="s3_files_header"
                  v-if="s3_files_itf.length != 0"
                >
                  <template v-slot:[`item.file_name`]="{ item }">
                    <div class="FontSize">
                      {{ item.file_name }}
                    </div>
                    <div class="FontSize">
                      {{ item.file_type }}
                    </div>
                  </template>
                  <template v-slot:[`item.Action`]="{ item }">
                    <v-btn icon color="primary" @click="previewOfFiles(item)">
                      <v-icon small>mdi-paperclip</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="red"
                      @click="
                        s3_files_itf.splice(s3_files_itf.indexOf(item), 1)
                      "
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </div>
              <div
                v-if="
                  this.StoreObj.ITF_details != undefined &&
                  this.StoreObj.ITF_details.length != 0
                "
              >
                <div
                  class="font-weight-bold black--text mt-4"
                  v-if="this.StoreObj.ITF_details[0].updated_by_name"
                >
                  Updated By :
                  {{ this.StoreObj.ITF_details[0].updated_by_name }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            :loading="loading"
            @click="validateMethod()"
            class="white--text mb-2 mr-2"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { GenerateS3URL } from "@/mixins/Extras/GeneratePresignedUrl.js";
import { UpdateTrackingDetailsOfComponent } from "@/graphql/mutations.js";
import { GetAllAdditionalParts } from "@/mixins/MastersSetting/GetAllAdditionalParts.js";
export default {
  props: {
    StoreObj: Object,
    UpdateApprovedComponentDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  mixins: [GenerateS3URL, GetAllAdditionalParts],
  data: () => ({
    Toggle: 0,
    loading: false,
    iof_date: false,
    renderComp: true,
    selected_date: false,
    local_purchase_date: false,
    date: "",
    comments: "",
    tracking_id: "",
    courier_name: "",
    phone_number: "",
    purchased_by: "",
    purchase_date: "",
    purchase_number: "",
    date_of_arraival: "",
    comments_itf_details: "",
    additional_part_name: "",
    local_purchase_comments: "",
    tracking_details_comments: "",
    files: [],
    s3_files: [],
    files_itf: [],
    s3_files_itf: [],
    selected_files: [],
    itf_selected_files: [],
    files_local_purchase: [],
    s3_files_local_purchase: [],
    additional_part_details: [],
    GetAllAdditionalPartsList: [],
    local_purchase_selected_files: [],
    selected_files_header: [
      { text: "Name", value: "name", width: "60%" },
      { text: "Type", value: "type", width: "20%" },
      { text: "Action", value: "Action", width: "20%" },
    ],
    s3_files_header: [
      { text: "Name", value: "file_name" },
      { text: "Action", value: "Action" },
    ],
    local_purchase_selected_files_headers: [
      { text: "Name", value: "name", width: "60%" },
      { text: "Type", value: "type", width: "20%" },
      { text: "Action", value: "Action", width: "20%" },
    ],
    itf_selected_files_headers: [
      { text: "Name", value: "name", width: "60%" },
      { text: "Type", value: "type", width: "20%" },
      { text: "Action", value: "Action", width: "20%" },
    ],
    SnackBarComponent: {},
  }),
  watch: {
    files(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.selected_files.push(val[i]);
        }
      }
    },
    files_local_purchase(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.local_purchase_selected_files.push(val[i]);
        }
      }
    },
    files_itf(val) {
      if (val.length != 0 && val != undefined && val != null) {
        for (let i = 0; i < val.length; i++) {
          this.itf_selected_files.push(val[i]);
        }
      }
    },
    UpdateApprovedComponentDialog(val) {
      if (val == true) {
        this.GetAllAdditionalPartsMethod("ACTIVE");
        if (this.StoreObj.tracking_details != undefined) {
          this.phone_number = this.StoreObj.tracking_details[0].phone_number
            ? this.StoreObj.tracking_details[0].phone_number
            : undefined;
          this.date =
            this.StoreObj.tracking_details[0].date != undefined
              ? this.StoreObj.tracking_details[0].date
              : undefined;
          this.courier_name =
            this.StoreObj.tracking_details[0].courier_name != undefined
              ? this.StoreObj.tracking_details[0].courier_name
              : undefined;
          this.tracking_id =
            this.StoreObj.tracking_details[0].tracking_id != undefined
              ? this.StoreObj.tracking_details[0].tracking_id
              : undefined;
          this.s3_files =
            this.StoreObj.tracking_details[0].attachments != undefined
              ? this.StoreObj.tracking_details[0].attachments
              : [];
          this.tracking_details_comments =
            this.StoreObj.tracking_details[0].comments != undefined
              ? this.StoreObj.tracking_details[0].comments
              : undefined;
          this.additional_part_details =
            this.StoreObj.tracking_details[0].part_id != undefined
              ? this.StoreObj.tracking_details[0].part_id
              : undefined;
          this.additional_part_name =
            this.StoreObj.tracking_details[0].part_name != undefined
              ? this.StoreObj.tracking_details[0].part_name
              : undefined;
        }
        if (
          this.StoreObj.ITF_details != undefined &&
          this.StoreObj.ITF_details.length != 0
        ) {
          this.date_of_arraival =
            this.StoreObj.ITF_details[0].DOA != undefined
              ? this.StoreObj.ITF_details[0].DOA
              : undefined;
          this.comments_itf_details =
            this.StoreObj.ITF_details[0].comments != undefined
              ? this.StoreObj.ITF_details[0].comments
              : undefined;
          this.s3_files_itf =
            this.StoreObj.ITF_details[0].attachments != undefined
              ? this.StoreObj.ITF_details[0].attachments
              : [];
        }
        if (
          this.StoreObj.LOP_deatails != undefined &&
          this.StoreObj.LOP_deatails.length != 0
        ) {
          this.purchase_date =
            this.StoreObj.LOP_deatails[0].purchase_date != undefined
              ? this.StoreObj.LOP_deatails[0].purchase_date
              : undefined;
          this.purchased_by =
            this.StoreObj.LOP_deatails[0].purchased_by != undefined
              ? this.StoreObj.LOP_deatails[0].purchased_by
              : undefined;
          this.local_purchase_comments =
            this.StoreObj.LOP_deatails[0].comments != undefined
              ? this.StoreObj.LOP_deatails[0].comments
              : undefined;
          this.purchase_number =
            this.StoreObj.LOP_deatails[0].purchase_number != undefined
              ? this.StoreObj.LOP_deatails[0].purchase_number
              : undefined;
          this.s3_files_local_purchase =
            this.StoreObj.LOP_deatails[0].attachments != undefined
              ? this.StoreObj.LOP_deatails[0].attachments
              : [];
        }
      }
    },
  },
  methods: {
    previewOfFiles(item) {
      window.open(item.file_url);
    },
    async uploadMediaToS3() {
      this.loading = true;
      if (
        this.selected_files != undefined &&
        this.selected_files != [] &&
        this.selected_files.length != 0
      ) {
        for (let i = 0; i < this.selected_files.length; i++) {
          let result = await this.GenerateS3URLMethods(
            `${new Date().getTime()}.jpg`,
            this.selected_files[i]
          );
          let Obj = {
            file_name: this.selected_files[i].name,
            file_type: this.selected_files[i].type,
            file_url: result.profile_pic_url,
          };
          this.s3_files.push(Obj);
        }
      }
      if (
        this.local_purchase_selected_files != [] &&
        this.local_purchase_selected_files.length != 0 &&
        this.local_purchase_selected_files != undefined
      ) {
        for (let i = 0; i < this.local_purchase_selected_files.length; i++) {
          let result_local_purchase = await this.GenerateS3URLMethods(
            `${new Date().getTime()}.jpg`,
            this.local_purchase_selected_files[i]
          );
          let Obj_local_purchase = {
            file_name: this.local_purchase_selected_files[i].name,
            file_type: this.local_purchase_selected_files[i].type,
            file_url: result_local_purchase.profile_pic_url,
          };
          this.s3_files_local_purchase.push(Obj_local_purchase);
        }
      }
      if (
        this.itf_selected_files != undefined &&
        this.itf_selected_files.length != 0 &&
        this.itf_selected_files != []
      ) {
        for (let i = 0; i < this.itf_selected_files.length; i++) {
          let result_itf = await this.GenerateS3URLMethods(
            `${new Date().getTime()}.jpg`,
            this.itf_selected_files[i]
          );
          let Obj_itf = {
            file_name: this.itf_selected_files[i].name,
            file_type: this.itf_selected_files[i].type,
            file_url: result_itf.profile_pic_url,
          };
          this.s3_files_itf.push(Obj_itf);
        }
      }
      this.updateMethod();
    },
    validateMethod() {
      if (this.$refs.form.validate()) {
        if (
          this.selected_files.length == 0 &&
          this.local_purchase_selected_files.length == 0 &&
          this.itf_selected_files == 0
        ) {
          this.updateMethod();
        } else {
          this.uploadMediaToS3();
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
    async updateMethod() {
      if (
        (this.date_of_arraival != undefined &&
          this.date_of_arraival != "" &&
          this.date_of_arraival != null) ||
        (this.comments_itf_details != undefined &&
          this.comments_itf_details != "" &&
          this.comments_itf_details != null) ||
        (this.purchase_number != undefined &&
          this.purchase_number != "" &&
          this.purchase_number != null) ||
        (this.purchase_date != undefined &&
          this.purchase_date != "" &&
          this.purchase_date != null) ||
        (this.courier_name != undefined &&
          this.courier_name != "" &&
          this.courier_name != null) ||
        (this.tracking_id != undefined &&
          this.tracking_id != "" &&
          this.tracking_id != null)
      ) {
        var mutationname = UpdateTrackingDetailsOfComponent;
        var mutationresult = "UpdateTrackingDetailsOfComponent";
        var inputParams = {
          workflow_id: this.StoreObj.workflow_id,
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          ITF_details:
            (this.date_of_arraival != undefined &&
              this.date_of_arraival != "" &&
              this.date_of_arraival != null) ||
            (this.comments_itf_details != undefined &&
              this.comments_itf_details != "" &&
              this.comments_itf_details != null)
              ? [
                  {
                    DOA:
                      this.date_of_arraival != undefined &&
                      this.date_of_arraival != "" &&
                      this.date_of_arraival != null
                        ? this.date_of_arraival
                        : undefined,
                    comments:
                      this.comments_itf_details != undefined &&
                      this.comments_itf_details != "" &&
                      this.comments_itf_details != null
                        ? this.comments_itf_details
                        : undefined,
                    attachments:
                      this.s3_files_itf != [] &&
                      this.s3_files_itf != undefined &&
                      this.s3_files_itf.length != 0
                        ? this.s3_files_itf
                        : undefined,
                  },
                ]
              : undefined,
          LOP_deatails:
            this.purchase_number != undefined &&
            this.purchase_number != "" &&
            this.purchase_number != null
              ? [
                  {
                    purchase_number:
                      this.purchase_number != undefined &&
                      this.purchase_number != "" &&
                      this.purchase_number != null
                        ? this.purchase_number
                        : undefined,
                    purchase_date:
                      this.purchase_date != undefined &&
                      this.purchase_date != "" &&
                      this.purchase_date != null
                        ? this.purchase_date
                        : undefined,
                    purchased_by:
                      this.purchased_by != undefined &&
                      this.purchased_by != "" &&
                      this.purchased_by != null
                        ? this.purchased_by
                        : undefined,
                    comments:
                      this.local_purchase_comments != undefined &&
                      this.local_purchase_comments != "" &&
                      this.local_purchase_comments != null
                        ? this.local_purchase_comments
                        : undefined,
                    attachments:
                      this.s3_files_local_purchase != [] &&
                      this.s3_files_local_purchase.length != 0
                        ? this.s3_files_local_purchase
                        : undefined,
                  },
                ]
              : undefined,
          tracking_details:
            (this.courier_name != undefined &&
              this.courier_name != "" &&
              this.courier_name != null) ||
            (this.tracking_id != undefined &&
              this.tracking_id != "" &&
              this.tracking_id != null)
              ? [
                  {
                    date:
                      this.date != undefined && this.date != ""
                        ? this.date
                        : undefined,
                    tracking_id:
                      this.tracking_id != undefined && this.tracking_id != ""
                        ? this.tracking_id
                        : undefined,
                    courier_name:
                      this.courier_name != undefined && this.courier_name != ""
                        ? this.courier_name
                        : undefined,
                    phone_number:
                      this.phone_number != undefined && this.phone_number != ""
                        ? this.phone_number
                        : undefined,
                    comments:
                      this.tracking_details_comments != undefined &&
                      this.tracking_details_comments != "" &&
                      this.tracking_details_comments != null
                        ? this.tracking_details_comments
                        : undefined,
                    part_id:
                      typeof this.additional_part_details != "string"
                        ? this.additional_part_details != [] &&
                          this.additional_part_details != undefined
                          ? this.additional_part_details.master_id
                          : undefined
                        : this.additional_part_details,
                    part_name:
                      typeof this.additional_part_details != "string"
                        ? this.additional_part_details != [] &&
                          this.additional_part_details != undefined
                          ? this.additional_part_details.master_name
                          : undefined
                        : this.additional_part_name,
                    attachments:
                      this.s3_files != [] && this.s3_files.length != 0
                        ? this.s3_files
                        : undefined,
                  },
                ]
              : undefined,
        };
        try {
          this.loading = true;
          let result = await API.graphql(
            graphqlOperation(mutationname, {
              input: inputParams,
            })
          );
          var ResultObj = JSON.parse(result.data[mutationresult]);
          if (ResultObj.status == "SUCCESS") {
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                Top: true,
                SnackbarVmodel: true,
                SnackbarColor: "green",
                SnackbarText: ResultObj.Status_Message,
              };
              this.renderComp = true;
            });
            this.UpdateApprovedComponentDialogEmit((this.Toggle = 2));
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              Top: true,
              SnackbarVmodel: true,
              SnackbarColor: "red",
              SnackbarText: error.errors[0].message,
            };
            this.renderComp = true;
          });
        }
      } else {
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            Top: true,
            SnackbarVmodel: true,
            SnackbarColor: "red",
            SnackbarText: "Fill Details..!",
          };
          this.renderComp = true;
        });
      }
    },
    UpdateApprovedComponentDialogEmit(Toggle) {
      this.$refs.form.reset();
      this.s3_files = [];
      this.s3_files_itf = [];
      this.selected_files = [];
      this.itf_selected_files = [];
      this.s3_files_local_purchase = [];
      this.local_purchase_selected_files = [];
      this.$refs.form.reset();
      this.$refs.form_ito.reset();
      this.$refs.local_purchase_form.reset();
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
