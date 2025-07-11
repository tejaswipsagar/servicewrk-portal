<template>
    <div>
      <v-card class="elevation-0">
        <v-toolbar class="elevation-0">
          <v-col cols="12" md="7">
            <h4>
              {{ preview == false ? "Create Template" : "Preview Template" }}
            </h4>
          </v-col>
          <v-col cols="12" sm="12" md="5" xs="12">
            <v-spacer v-if="preview == true" />
            <v-toolbar dense class="elevation-0">
              <v-select
                v-model="customer_name"
                label="Select Active Fields"
                :items="active_fields"
                outlined
                dense
                item-value="value"
                item-text="text"
                class="mt-5 mr-2"
                v-if="preview == false"
              ></v-select>
              <v-btn
                @click="add_active_fields()"
                class="primary white--text mr-2"
                small
                v-if="preview == false"
                >ADD</v-btn
              >
              <v-btn
                v-if="preview == false"
                small
                color="primary"
                class="mr-2"
                @click="gotoPreview()"
                :disabled="disabled_buttons == true"
                ><v-icon small class="mr-2">mdi-eye</v-icon>Preview</v-btn
              >
              <v-spacer v-if="preview == true" />
              <v-btn
                v-if="preview == true"
                small
                color="primary"
                :class="preview == false ? 'mr-2' : 'mr-n2'"
                @click="preview = false"
                ><v-icon>mdi-chevron-double-left</v-icon>Go to create
                template</v-btn
              >
              <v-btn
                small
                v-if="preview == false"
                color="primary"
                @click="CreateTicketCardEmit((Toggle = 1))"
                ><v-icon>mdi-chevron-double-left</v-icon>Back</v-btn
              >
            </v-toolbar>
          </v-col>
        </v-toolbar>
        <v-row
          v-if="preview == false && current_view == 'CREATE'"
          class="mx-2 mt-5"
        >
          <v-col cols="12" md="1"></v-col>
          <v-card width="930px" id="edi">
            <vue-editor id="content1" v-model="content"> </vue-editor>
          </v-card>
          <v-col cols="12" md="1"></v-col>
          <v-col cols="12" md="6">
            <v-card
              height="0"
              class="overflow-y-auto"
              ref="content"
              :v-html="content"
            ></v-card>
          </v-col>
        </v-row>
  
        <v-row
          v-if="preview == false && current_view == 'EDIT'"
          class="mx-2 mt-5"
        >
          <v-col cols="12" md="1"></v-col>
          <v-card
            width="930px"
            id="edi"
            v-show="renderMe && current_view == 'EDIT'"
            v-for="(html, idx) in StoreObj.html_array"
            :key="idx"
          >
            <vue-editor
              id="content2"
              v-model="html.html_contents"
              @input="get_details(html.html_contents)"
            >
            </vue-editor>
          </v-card>
          <v-col cols="12" md="1"></v-col>
          <v-col cols="12" md="6">
            <v-card
              height="0"
              class="overflow-y-auto"
              ref="content"
              :v-html="content"
            ></v-card>
            <v-card
              height="0"
              class="overflow-y-auto"
              ref="content2"
              v-for="(html, idx) in StoreObj.html_array"
              :key="idx"
              :v-html="html.html_contents"
            ></v-card>
          </v-col>
        </v-row>
  
        <!-- <v-card
          v-show="renderMe && current_view == 'EDIT'"
          v-for="(html, idx) in StoreObj.html_array"
          :key="idx"
          width="930px"
        >
          <vue-editor
            id="content2"
            v-bind="html_contents_edit"
            v-model="html.html_contents"
            @input="get_details(html.html_contents)"
          >
          </vue-editor>
        </v-card> -->
        <v-row class="mx-5" v-if="preview == true && current_view == 'CREATE'">
          <v-row class="mt-2 mx-1">
            <v-col cols="12" md="1"></v-col>
            <v-col
              v-for="(preview, index) in live_html_array"
              :key="index"
              cols="12"
              md="10"
            >
              <v-card height="1250" width="920px" ref="content">
                <div
                  class="mb-1 pa-3 elevation-0"
                  v-html="preview.html_contents"
                  style="white-space: pre-wrap"
                ></div>
              </v-card>
              <v-card-text
                style="font-weight: bold; font-size: 11px"
                :v-text="`Page: ${index + 1} / ${preview.page_no}`"
                class="ma-0 mt-n1 mb-0 pa-0 mr-3"
                align="right"
              >
              </v-card-text>
            </v-col>
            <v-col cols="12" md="1"></v-col>
          </v-row>
        </v-row>
        <v-row class="mx-5" v-if="preview == true && current_view == 'EDIT'">
          <v-row class="mt-2 mx-1">
            <v-col cols="12" md="1"></v-col>
            <v-col
              v-for="(preview, index) in live_html_array"
              :key="index"
              cols="12"
              md="10"
            >
              <v-card height="1250" width="920px" ref="content2">
                <div
                  class="mb-1 pa-3 elevation-0"
                  v-html="preview.html_contents"
                  style="white-space: pre-wrap; line-height: 0.2"
                ></div>
              </v-card>
              <v-card-text
                style="font-weight: bold; font-size: 11px"
                :v-text="`Page: ${index + 1} / ${preview.page_no}`"
                class="ma-0 mt-n1 mb-0 pa-0 mr-3"
                align="right"
              >
              </v-card-text>
            </v-col>
            <v-col cols="12" md="1"></v-col>
          </v-row>
        </v-row>
        <v-data-table
          v-if="insert_table == 'PRODUCT'"
          dense
          :headers="quotationBuilderHeader"
        >
        </v-data-table>
      </v-card>
      <v-card-actions>
        <v-spacer />
        <v-dialog persistent v-model="dialog" max-width="400px">
          <template v-slot:activator="{ on, attrs }">
            <v-card-text align="center">
              <div class="primary--text mt-n3 mb-5">
                <b>
                  {{
                    disabled_buttons == true
                      ? "Update Template to Save / Preview"
                      : ""
                  }}</b
                >
              </div>
              <v-btn
                v-if="preview == false"
                small
                color="primary"
                class="mr-2"
                @click="gotoPreview()"
                :disabled="disabled_buttons == true"
                ><v-icon small class="mr-2">mdi-eye</v-icon>Preview & Save</v-btn
              >
              <v-btn
                v-on="on"
                v-if="preview == true"
                :disabled="disabled_buttons == true"
                v-bind="attrs"
                @click="save_template()"
                color="primary"
                small
                >Save Template
              </v-btn>
            </v-card-text>
          </template>
          <v-toolbar dense class="primary white--text" elevation="0">
            <v-card-title>Enter Template Name</v-card-title>
            <v-spacer />
            <v-btn @click="dialog = false" text>
              <v-icon class="white--text">mdi-close </v-icon>
            </v-btn>
          </v-toolbar>
          <v-card class="overflow-hidden">
            <v-col cols="12" md="12">
              <v-text-field
                v-model="template_name"
                label="Template Name *"
                dense
                outlined
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="12" md="12" class="mt-n4">
              <v-select
                v-model="template_type"
                label="Template Type *"
                dense
                outlined
                :items="temp_type"
              ></v-select>
            </v-col> -->
  
            <v-card-text align="center">
              <v-btn color="primary" small @click="call_save_template_method()"
                >Submit</v-btn
              >
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </div>
  </template>
  <script>
  import { API } from "aws-amplify";
  import { VueEditor } from "vue2-editor";
  // import { GetAllCustomer } from "@/mixins/Users/GetAllCustomer.js";
  // var striptags = require("striptags");
  
  // import addquotationdetailsDialog from "@/components/Quotation/addquotationdetailsDialog.vue";
  export default {
    components: {
      VueEditor,
    },
    props: {
      StoreObj: Object,
      current_view: String,
    },
    // mixins: [GetAllCustomer],
  
    data: () => ({
      height: 0,
      preview: false,
      template_type: "",
      temp_type: ["QUOTATION", "CONTRACT"],
      GetAllCustomerList: [],
      insert_table_items: ["PRODUCT", "COMPONENT", "AMC TYPES", "SERVICE TYPE"],
      insert_table: "",
      dialog: false,
      content1: "",
      content: ``,
      // active_fields: ["Customer Name", "Customer Address", "Date"],
      active_fields: [
        { text: "Header", value: "Header" },
        { text: "Organization Address", value: "Organization_Address" },
        { text: "Organization logo", value: "Organization_logo" },
        { text: "Customer Name", value: "Customer_Name" },
        // { text: "Customer_Address", value: "Customer_Address" },
        { text: "Date Selection", value: "Date_Selection" },
        { text: "Quotation Table", value: "Quotation_Table" },
        { text: "Footer", value: "Footer" },
      ],
      addText: {
        content: "",
        content_type: "",
      },
      template_name: "",
      add_active_field: {
        template_name: "",
        customer_name: "",
      },
      customer_name: "",
      html_contents_edit: "",
      quotationBuilderHeader: [
        {
          text: "Product",
          value: "product",
        },
        {
          text: "Qty",
          value: "qty",
        },
        {
          text: "Price",
          value: "price",
        },
        {
          text: "Total",
          value: "total",
        },
      ],
      live_html_array: [
        {
          page_no: 1,
          html_contents: "",
        },
      ],
      content2: "",
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu: false,
      prev_content: ``,
      disabled_buttons: true,
      comp: false,
      renderMe: true,
    }),
    created() {
      if (this.current_view == "EDIT") {
        this.renderMe = false;
        setTimeout(() => {
          this.renderMe = true;
        }, 100);
      }
    },
    watch: {
      async content(val) {
        this.prev_content = val;
        this.live_html_array = [
          {
            page_no: 1,
            html_contents: ``,
          },
        ];
        setTimeout(() => {
          var template_a4_array = this.$refs.content.$refs.link.childNodes;
          var count = 1;
          var height = 0;
          for (let i = 0; i < template_a4_array.length; i++) {
            if (height > 1040) {
              height = 0;
              count += 1;
              this.live_html_array.push({
                page_no: count,
                html_contents: ``,
              });
            }
            this.live_html_array[count - 1].html_contents +=
              template_a4_array[i].outerHTML;
            height += template_a4_array[i].offsetHeight;
          }
          if (this.live_html_array[0].html_contents.includes("$_{Header}")) {
            for (let j = 0; j < this.live_html_array.length; j++) {
              if (
                this.live_html_array[0].html_contents.includes(
                  '<p class="ql-align-right"> $_{Header} </p>'
                )
              ) {
                if (j != 0) {
                  this.live_html_array[j].html_contents =
                    '<p class="ql-align-right"> $_{Header} </p>' +
                    this.live_html_array[j].html_contents;
                }
              } else if (
                this.live_html_array[0].html_contents.includes(
                  '<p class="ql-align-center"> $_{Header} </p>'
                )
              ) {
                if (j != 0) {
                  this.live_html_array[j].html_contents =
                    '<p class="ql-align-center"> $_{Header} </p>' +
                    this.live_html_array[j].html_contents;
                }
              } else if (
                this.live_html_array[0].html_contents.includes(
                  '<p class="ql-align-left"> $_{Header} </p>'
                )
              ) {
                if (j != 0) {
                  this.live_html_array[j].html_contents =
                    '<p class="ql-align-left"> $_{Header} </p>' +
                    this.live_html_array[j].html_contents;
                }
              } else {
                if (j != 0) {
                  this.live_html_array[j].html_contents =
                    '<p class="ql-align-left"> $_{Header} </p>' +
                    this.live_html_array[j].html_contents;
                }
              }
            }
          }
          // --------------------------------------------------------------------
          if (
            this.live_html_array[
              this.live_html_array.length - 1
            ].html_contents.includes("$_{Footer}")
          ) {
            for (let j = 0; j < this.live_html_array.length; j++) {
              // ---------------------------------------------------------------------------------------------------
              if (
                this.live_html_array[
                  this.live_html_array.length - 1
                ].html_contents.includes(
                  '<p class="ql-align-right"> $_{Footer} </p>'
                )
              ) {
                this.live_html_array[j].html_contents =
                  this.live_html_array[j].html_contents +
                  '<p class="ql-align-right" style="position: absolute; bottom: 1px; right:1px"> $_{Footer} </p>';
              }
              // -----------------------------------------------------------------------------------------------------
              if (
                this.live_html_array[
                  this.live_html_array.length - 1
                ].html_contents.includes(
                  '<p class="ql-align-center"> $_{Footer} </p>'
                )
              ) {
                this.live_html_array[j].html_contents =
                  this.live_html_array[j].html_contents +
                  '<p class="ql-align-center" style="position: absolute; bottom: 1px; left: 50%; transform: translateX(-50%)"> $_{Footer} </p>';
              }
              // --------------------------------------------------------------------------------------------------------------
              if (
                this.live_html_array[
                  this.live_html_array.length - 1
                ].html_contents.includes(
                  '<p class="ql-align-left"> $_{Footer} </p>'
                )
              ) {
                this.live_html_array[j].html_contents =
                  this.live_html_array[j].html_contents +
                  '<p class="ql-align-left" style="position: absolute; bottom: 1px"> $_{Footer} </p>';
              }
              // ---------------------------------------------------------------------------------------------------------
              if (
                this.live_html_array[
                  this.live_html_array.length - 1
                ].html_contents.includes("<p> $_{Footer} </p>")
              ) {
                // this.live_html_array[j].html_contents = this.live_html_array[
                //   j
                // ].html_contents.includes(
                //   '<p class="ql-align-left"> $_{Footer} </p>'
                // )
                //   ? this.live_html_array[j].html_contents +
                //     `<p style="position: absolute; bottom: 1px"> $_{Footer} </p>`
                //   : this.live_html_array[j].html_contents;
                this.live_html_array[j].html_contents =
                  this.live_html_array[j].html_contents +
                  '<p style="position: absolute; bottom: 1px"> $_{Footer} </p>';
              }
            }
          }
          this.get_live_data();
          this.disabled_buttons = false;
        }, 10);
      },
      customer_name() {
        this.disabled_buttons = true;
      },
      insert_table(val) {
        if (val == "PRODUCT") {
          this.headers = this.quotationBuilderHeader;
        }
      },
      "StoreObj.action"(val) {
        if (val == "EDIT") {
          for (let i = 0; i < this.StoreObj.html_array.length; i++) {
            this.live_html_array[i].html_contents =
              this.StoreObj.html_array[i].html_contents;
            this.live_html_array[i].page_no = this.StoreObj.html_array[i].page_no;
          }
        }
      },
    },
    async mounted() {
      this.height = window.innerHeight;
    },
    methods: {
      get_details(val) {
        this.prev_content = val;
        this.live_html_array = [
          {
            page_no: 1,
            html_contents: ``,
          },
        ];
        setTimeout(() => {
          var template_a4_array = this.$refs.content2[0].$refs.link.childNodes;
          var count = 1;
          var height = 0;
          for (let i = 0; i < template_a4_array.length; i++) {
            if (height > 1040) {
              height = 0;
              count += 1;
              this.live_html_array.push({
                page_no: count,
                html_contents: ``,
              });
            }
            this.live_html_array[count - 1].html_contents +=
              template_a4_array[i].outerHTML;
            height += template_a4_array[i].offsetHeight;
          }
          if (this.live_html_array[0].html_contents.includes("$_{Header}")) {
            for (let j = 0; j < this.live_html_array.length; j++) {
              if (
                this.live_html_array[0].html_contents.includes(
                  '<p class="ql-align-right"> $_{Header} </p>'
                )
              ) {
                if (j != 0) {
                  this.live_html_array[j].html_contents =
                    '<p class="ql-align-right"> $_{Header} </p>' +
                    this.live_html_array[j].html_contents;
                }
              } else if (
                this.live_html_array[0].html_contents.includes(
                  '<p class="ql-align-center"> $_{Header} </p>'
                )
              ) {
                if (j != 0) {
                  this.live_html_array[j].html_contents =
                    '<p class="ql-align-center"> $_{Header} </p>' +
                    this.live_html_array[j].html_contents;
                }
              } else if (
                this.live_html_array[0].html_contents.includes(
                  '<p class="ql-align-left"> $_{Header} </p>'
                )
              ) {
                if (j != 0) {
                  this.live_html_array[j].html_contents =
                    '<p class="ql-align-left"> $_{Header} </p>' +
                    this.live_html_array[j].html_contents;
                }
              } else {
                if (j != 0) {
                  this.live_html_array[j].html_contents =
                    '<p class="ql-align-left"> $_{Header} </p>' +
                    this.live_html_array[j].html_contents;
                }
              }
            }
          }
          // --------------------------------------------------------------------
          if (
            this.live_html_array[
              this.live_html_array.length - 1
            ].html_contents.includes("$_{Footer}")
          ) {
            for (let j = 0; j < this.live_html_array.length; j++) {
              // ---------------------------------------------------------------------------------------------------
              if (
                this.live_html_array[
                  this.live_html_array.length - 1
                ].html_contents.includes(
                  '<p class="ql-align-right"> $_{Footer} </p>'
                )
              ) {
                this.live_html_array[j].html_contents =
                  this.live_html_array[j].html_contents +
                  '<p class="ql-align-right" style="position: absolute; bottom: 1px; right:1px"> $_{Footer} </p>';
              }
              // -----------------------------------------------------------------------------------------------------
              if (
                this.live_html_array[
                  this.live_html_array.length - 1
                ].html_contents.includes(
                  '<p class="ql-align-center"> $_{Footer} </p>'
                )
              ) {
                this.live_html_array[j].html_contents =
                  this.live_html_array[j].html_contents +
                  '<p class="ql-align-center" style="position: absolute; bottom: 1px; left: 50%; transform: translateX(-50%)"> $_{Footer} </p>';
              }
              // --------------------------------------------------------------------------------------------------------------
              if (
                this.live_html_array[
                  this.live_html_array.length - 1
                ].html_contents.includes(
                  '<p class="ql-align-left"> $_{Footer} </p>'
                )
              ) {
                this.live_html_array[j].html_contents =
                  this.live_html_array[j].html_contents +
                  '<p class="ql-align-left" style="position: absolute; bottom: 1px"> $_{Footer} </p>';
              }
              // ---------------------------------------------------------------------------------------------------------
              if (
                this.live_html_array[
                  this.live_html_array.length - 1
                ].html_contents.includes("<p> $_{Footer} </p>")
              ) {
                this.live_html_array[j].html_contents =
                  this.live_html_array[j].html_contents +
                  '<p style="position: absolute; bottom: 1px"> $_{Footer} </p>';
              }
            }
          }
          this.get_live_data();
          this.disabled_buttons = false;
        }, 10);
      },
      get_live_data() {
        this.content = this.content + "";
      },
      gotoPreview() {
        if (this.live_html_array.length == 1) {
          if (
            this.live_html_array[0].html_contents.includes(
              '<p class="ql-align-right"> $_{Footer} </p>'
            )
          ) {
            this.live_html_array[0].html_contents =
              this.live_html_array[0].html_contents.replace(
                '<p class="ql-align-right"> $_{Footer} </p>',
                ""
              );
          }
          if (
            this.live_html_array[0].html_contents.includes(
              '<p class="ql-align-left"> $_{Footer} </p>'
            )
          ) {
            this.live_html_array[0].html_contents =
              this.live_html_array[0].html_contents.replace(
                '<p class="ql-align-left"> $_{Footer} </p>',
                ""
              );
          }
          if (
            this.live_html_array[0].html_contents.includes(
              '<p class="ql-align-center"> $_{Footer} </p>'
            )
          ) {
            this.live_html_array[0].html_contents =
              this.live_html_array[0].html_contents.replace(
                '<p class="ql-align-center"> $_{Footer} </p>',
                ""
              );
          }
          if (
            this.live_html_array[0].html_contents.includes("<p> $_{Footer} </p>")
          ) {
            this.live_html_array[0].html_contents =
              this.live_html_array[0].html_contents.replace(
                "<p> $_{Footer} </p>",
                ""
              );
          }
        } else {
          if (
            this.live_html_array[
              this.live_html_array.length - 1
            ].html_contents.includes('<p class="ql-align-right"> $_{Footer} </p>')
          ) {
            this.live_html_array[this.live_html_array.length - 1].html_contents =
              this.live_html_array[
                this.live_html_array.length - 1
              ].html_contents.replace(
                '<p class="ql-align-right"> $_{Footer} </p>',
                ""
              );
          }
          if (
            this.live_html_array[
              this.live_html_array.length - 1
            ].html_contents.includes('<p class="ql-align-left"> $_{Footer} </p>')
          ) {
            this.live_html_array[this.live_html_array.length - 1].html_contents =
              this.live_html_array[
                this.live_html_array.length - 1
              ].html_contents.replace(
                '<p class="ql-align-left"> $_{Footer} </p>',
                ""
              );
          }
          if (
            this.live_html_array[
              this.live_html_array.length - 1
            ].html_contents.includes(
              '<p class="ql-align-center"> $_{Footer} </p>'
            )
          ) {
            this.live_html_array[this.live_html_array.length - 1].html_contents =
              this.live_html_array[
                this.live_html_array.length - 1
              ].html_contents.replace(
                '<p class="ql-align-center"> $_{Footer} </p>',
                ""
              );
          }
          if (
            this.live_html_array[
              this.live_html_array.length - 1
            ].html_contents.includes("<p> $_{Footer} </p>")
          ) {
            this.live_html_array[this.live_html_array.length - 1].html_contents =
              this.live_html_array[
                this.live_html_array.length - 1
              ].html_contents.replace("<p> $_{Footer} </p>", "");
          }
        }
        this.preview = true;
      },
      add_active_fields() {
        let myHTML = "";
        switch (this.customer_name) {
          case "Header":
            myHTML = "<p> $_{Header} </p>".concat(this.content);
            this.content = myHTML;
            break;
          case "Footer":
            myHTML = this.content.concat("<p> $_{Footer} </p>");
            this.content = myHTML;
            break;
          case "Organization_Address":
            myHTML =
              this.content +
              `${this.$store.getters.get_current_user_details.organization_details.organization_address}`;
            this.content = myHTML;
            break;
          case "Organization_logo":
            myHTML =
              this.content +
              `<img width="150" height="80" src='${this.$store.getters.get_current_user_details.organization_details.organization_logo_url}' />`;
            this.content = myHTML;
            break;
          case "Customer_Name":
            myHTML = this.content + `$_{Customer_Name}`;
            this.content = myHTML;
            break;
          case "Customer_Address":
            myHTML = this.content + `$_{Customer_Address}`;
            this.content = myHTML;
            break;
          case "Date_Selection":
            myHTML = this.content + `$_{Date_Selection}`;
            this.content = myHTML;
            break;
          case "Quotation_Table":
            myHTML = this.content + `$_{Quotation_Table}`;
            this.content = myHTML;
            break;
        }
        setTimeout(() => {
          this.disabled_buttons = true;
          this.$forceUpdate();
        }, 100);
      },
      save_template() {
        this.dialog = true;
        if (this.StoreObj.action == "EDIT") {
          this.template_name = this.StoreObj.template_name;
        }
      },
      call_save_template_method() {
        this.saveTemplate();
      },
      async saveTemplate() {
        var self = this;
        var new_array = [];
        for (let i = 0; i < this.live_html_array.length; i++) {
          new_array.push({
            html_contents: `<p style="white-space: pre-wrap">${this.live_html_array[i].html_contents}</p><style>
            .ql-align-center {
              text-align: center;
            }
            .ql-align-left {
              text-align: left;
            }
            .ql-align-right {
              text-align: right;
            }
            .ql-align-justify {
              text-align: justify;
            }
            .main_div {
              position: relative;
              height: 1000px;
              display: flow-root;
            }
            .sub_div {
              position: absolute;
              bottom: 0px;
            }
            .margin-top {
              margin-top: 150px;
            }
            .center {
              margin: auto;
              width: 50%;
            }
            .ql-font-monospace {
              font-family: "Courier New", monospace;
            }
            .ql-font-serif {
              font-family: Georgia, serif;
            }
            * {
              margin: 0;
              padding: 0;
            }
            .v-application p {
              margin-bottom: 0px;
            }
            </style>`,
            page_no: this.live_html_array[i].page_no,
          });
        }
        const path =
          this.StoreObj.action == "CREATE"
            ? "createtemplatedesigner"
            : "updatetemplatedesigner";
        const myInit = {
          body: {
            command:
              this.StoreObj.action == "CREATE"
                ? "createTemplateDesigner"
                : "updateTemplateDesigner",
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            creator_user_id:
              this.StoreObj.action == "CREATE"
                ? this.$store.getters.get_current_user_details.user_id
                : undefined,
            template_name: this.template_name,
            template_type: "QUOTATION",
            html_array: new_array,
            // template_type:
            //   this.StoreObj.action == "CREATE" ? "QUOTATION" : undefined,
            updater_user_id:
              this.StoreObj.action == "EDIT"
                ? this.$store.getters.get_current_user_details.user_id
                : undefined,
            template_id:
              this.StoreObj.action == "EDIT"
                ? this.StoreObj.template_id
                : undefined,
          },
        };
        API.post("SERVICEWRK", path, myInit)
          .then(() => {
            this.CreateTicketCardEmit((this.Toggle = 2));
          })
          .catch(() => {
            self.overlay = true;
          });
      },
  
      CreateTicketCardEmit(Toggle) {
        this.$emit("clicked", Toggle);
      },
    },
  };
  </script>
  <style>
  .ql-align-center {
    text-align: center;
  }
  .ql-align-left {
    text-align: left;
  }
  .ql-align-right {
    text-align: right;
  }
  .ql-align-justify {
    text-align: justify;
  }
  .main_div {
    position: relative;
    height: 1000px;
    display: flow-root;
  }
  .sub_div {
    position: absolute;
    bottom: 0px;
  }
  .margin-top {
    margin-top: 150px;
  }
  .center {
    margin: auto;
    width: 50%;
  }
  .ql-font-monospace {
    font-family: "Courier New", monospace;
  }
  .ql-font-serif {
    font-family: Georgia, serif;
  }
  /* body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    font-size: 2rem;
  } */
  #edi {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #2c3e50;
    /* margin-top: 60px; */
  }
  /* .width_style {
    inline-size: 150px;
    overflow-wrap: break-word;
    hyphens: manual;
  } */
  </style>
  
  
  
  
  //  footer_html = `
  //                   <div class=" ql-align-left" id="FooterLeft${
  //                     this.pageItems[i].page_number
  //                   }" style="padding-top:${
  //               this.pageItems[i].templateItems[7].paddingTop
  //             }px;padding-left:${
  //               this.pageItems[i].templateItems[7].paddingLeft
  //             }px; position:absolute;width:unset">