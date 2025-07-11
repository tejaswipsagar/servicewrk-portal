<template>
  <div>
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <div class="black--text font-weight-bold mt-3">Customer Information</div>
    <v-card flat outlined class="pa-2">
      <v-row>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Customer Type:</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div class="FontSize">
            {{ WindowPag1.customer_type }}
          </div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Customer :</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div class="FontSize" v-if="WindowPag1.customer_company_name">
            {{ WindowPag1.customer_company_name }}
          </div>
          <div v-else>-</div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Contact Person:</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div class="FontSize">
            {{ WindowPag1.customer_name }}
          </div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Customer ID:</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div class="FontSize" v-if="WindowPag1.customer_unique_id">
            {{ WindowPag1.customer_unique_id }}
          </div>
          <div v-else>-</div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Phone Number:</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div class="FontSize">
            {{ WindowPag1.country_code }} -{{
              WindowPag1.customer_contact_number
            }}
          </div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Secondary Ph Number:</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div class="FontSize" v-if="WindowPag1.secondary_customer_contact">
            {{ WindowPag1.secondary_customer_contact }}
          </div>
          <div v-else>-</div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12"><b>Email:</b></v-col>
        <v-col cols="12" md="2" sm="12" xs="12">
          <div class="FontSize" v-if="WindowPag1.customer_email_id">
            {{ WindowPag1.customer_email_id }}
          </div>
          <div v-else>-</div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12"><b>Saved Address:</b></v-col>
        <v-col cols="12" md="6" sm="12" xs="12">
          <div class="FontSize">
            {{ WindowPag1.service_address }}
          </div>
        </v-col>
      </v-row>
    </v-card>
    <div class="black--text font-weight-bold mt-3">Service Information</div>
    <v-card flat outlined class="pa-2">
      <v-data-table
        dense
        :items="WindowPag2"
        hide-default-footer
        :headers="TableHeaders"
      >
        <template v-slot:[`item.sl_no`]="{ item }">
          <div class="FontSize">{{ WindowPag2.indexOf(item) + 1 }}</div>
        </template>
        <template v-slot:[`item.product_name`]="{ item }">
          <div class="FontSize" v-if="item.category_name != undefined">
            <span class="font-weight-bold">Category : </span>
            {{ item.category_name }}
          </div>
          <div class="FontSize" v-if="item.product_name != undefined">
            <span class="font-weight-bold"> Product : </span>
            {{ item.product_name }}
          </div>
          <div
            class="FontSize"
            v-if="item.setting_name != undefined && item.setting_name != ''"
          >
            <span class="font-weight-bold"> Serial No : </span>
            {{ item.setting_name }}
          </div>
          <div v-else>Serial No : -</div>
          <div class="FontSize">
            <span class="font-weight-bold"> Asset Number : </span>
            {{ item.asset_number || "-" }}
          </div>
        </template>
        <template v-slot:[`item.ticket_creation_type`]="{ item }">
          <div
            v-if="
              item.ticket_creation_type != undefined &&
              item.ticket_creation_type != ''
            "
            class="FontSize"
          >
            {{ item.ticket_creation_type }}
          </div>
          <div v-else>-</div>
          <div v-if="item.service_type != undefined" class="FontSize">
            <span class="font-weight-bold">Service Type :</span>
            {{ item.service_type.service_type_name }}
          </div>
          <div v-if="item.problem_type != undefined" class="FontSize">
            <span class="font-weight-bold">Problem Desc. :</span>
            {{ item.problem_type }}
          </div>
        </template>
        <template v-slot:[`item.support_type`]="{ item }">
          <div class="FontSize" v-if="item.support_type != undefined">
            {{ item.support_type }}
          </div>
          <div class="FontSize" v-else-if="item.support_typeee">
            {{ item.support_typeee }}
          </div>
          <div v-else>-</div>
          <div class="FontSize" v-if="item.warranty_type != undefined">
            {{ item.warranty_type }}
          </div>
          <div class="FontSize" v-else-if="item.warranty_typeee">
            {{ item.warranty_typeee.setting_name }}
          </div>
          <div v-else>-</div>
          <div class="FontSize green--text" v-if="item.is_free_of_cost == true">
            <span class="black--text FontSize">FOC :</span> Yes
          </div>
          <div class="FontSize red--text" v-else>
            <span class="black--text FontSize">FOC :</span> No
          </div>
        </template>
        <template v-slot:[`item.product_purchased_on`]="{ item }">
          <div
            class="FontSize"
            v-if="
              item.product_purchased_on != undefined &&
              item.product_purchased_on != ''
            "
          >
            {{ item.product_purchased_on }}
          </div>
          <div v-else>-</div>
          <div class="FontSize" v-if="item.invoice_date">
            Invoice Date : {{ item.invoice_date }}
          </div>
          <div v-else class="FontSize">Invoice Date : -</div>
          <div class="FontSize" v-if="item.invoice_number">
            Invoice No : {{ item.invoice_number }}
          </div>
          <div v-else class="FontSize">Invoice No : -</div>
        </template>
        <template v-slot:[`item.additional_comments`]="{ item }">
          <div class="FontSize" v-if="item.additional_comments">
            {{ item.additional_comments }}
          </div>
          <div v-else>-</div>
        </template>
        <template v-slot:[`item.UploadedFile`]="{ item }">
          <div class="FontSize">
            <v-card
              flat
              outlined
              class="pa-2"
              v-for="(img, idx) in item.UploadedFile"
              :key="idx"
            >
              <v-img
                contain
                max-height="50px"
                max-width="50px"
                :src="img.file_url"
              />
            </v-card>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <div class="black--text font-weight-bold mt-3">Assignee Information</div>
    <v-card outlined flat class="pa-2">
      <v-row>
        <v-col cols="12" md="1" sm="12" xs="12" class="mb-n4"
          ><b>User :</b></v-col
        >
        <v-col cols="12" md="3" sm="12" xs="12" class="mb-n4">
          <div class="FontSize">
            {{ WindowPag3.UserType }}
          </div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Primary Rep:</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div class="FontSize">
            {{ WindowPag3.select_representative.user_name }}
          </div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Secondary Rep:</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div
            class="FontSize"
            v-if="WindowPag3.select_representative1 != undefined"
          >
            <span
              v-if="
                WindowPag3.select_representative.user_name !=
                WindowPag3.select_representative1.user_name
              "
            >
              {{ WindowPag3.select_representative1.user_name }}
            </span>
          </div>
          <div v-else>-</div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Ticket Priority :</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div
            class="FontSize"
            v-if="
              WindowPag3.ticket_priority != undefined &&
              WindowPag3.ticket_priority != ''
            "
          >
            {{ WindowPag3.ticket_priority }}
          </div>
          <div v-else>-</div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Preferred Visit Date:</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div class="FontSize">
            {{ WindowPag3.date }}
          </div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Preferred Visit Time:</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div class="FontSize">
            {{ WindowPag3.time }}
          </div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Call Received Date:</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div
            class="FontSize"
            v-if="
              WindowPag3.customer_call_date != undefined &&
              WindowPag3.customer_call_date != ''
            "
          >
            {{ WindowPag3.customer_call_date }}
          </div>
          <div v-else>-</div>
        </v-col>
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4"
          ><b>Call Received Time:</b></v-col
        >
        <v-col cols="12" md="2" sm="12" xs="12" class="mb-n4">
          <div
            class="FontSize"
            v-if="
              WindowPag3.customer_call_time != undefined &&
              WindowPag3.customer_call_time != ''
            "
          >
            {{ WindowPag3.customer_call_time }}
          </div>
          <div v-else>-</div>
        </v-col>
        <v-col cols="12" md="2" xs="12" sm="12" class="mb-n4">
          <b>Call Source :</b>
        </v-col>
        <v-col cols="12" md="2" xs="12" sm="12" class="mb-n4">
          <div
            v-if="
              WindowPag3.ticket_call_source != undefined &&
              WindowPag3.ticket_call_source != ''
            "
          >
            {{ WindowPag3.ticket_call_source }}
          </div>
          <div v-else>-</div>
        </v-col>
        <v-col cols="12" md="2" xs="12" sm="12" class="mb-n4">
          <b>Pincode Type :</b>
        </v-col>
        <v-col cols="12" md="2" xs="12" sm="12" class="mb-n4">
          <div
            v-if="
              WindowPag3.Pincode_Type != undefined &&
              WindowPag3.Pincode_Type.pincode_type_name &&
              WindowPag3.Pincode_Type.pincode_type_name != ''
            "
          >
            {{ WindowPag3.Pincode_Type.pincode_type_name }}
          </div>
          <div v-else>-</div>
        </v-col>

        <v-col cols="12" md="2" xs="12" sm="12">
          <b>Remarks :</b>
        </v-col>
        <v-col cols="12" md="2" xs="12" sm="12">
          <div
            v-if="
              WindowPag3.source_remark != undefined &&
              WindowPag3.source_remark != ''
            "
          >
            {{ WindowPag3.source_remark }}
          </div>
          <div v-else>-</div>
        </v-col>

        <v-col cols="12" md="2" xs="12" sm="12">
          <b>Territory Classification Name:</b>
        </v-col>
        <v-col>
          <div>
            {{
              WindowPag3?.Pincode_Type?.pincode_territory_type ||
              WindowPag3?.Pincode_Type?.pincode_type_name ||
              "-"
            }}
          </div>
        </v-col>
        <v-col cols="12" md="2" xs="12" sm="12">
          <b>Estimated Time:</b>
        </v-col>
        <v-col>
          <div>
            {{ WindowPag3?.Pincode_Type?.estimated_time || "-" }}
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import Snackbar from "@/components/Extras/SnackbarView.vue";
import { API, graphqlOperation } from "aws-amplify";
import { CreateAssignedTicketV2 } from "@/graphql/mutations.js";
import { GetAllOrganizationSetting } from "@/mixins/MastersSetting/GetAllOrganizationSettings.js";

export default {
  mixins: [GetAllOrganizationSetting],
  props: {
    loading: Boolean,
    WindowPag2: Array,
    WindowPag1: Object,
    WindowPag3: Object,
    currentWindow: Number,
    RFSObj: Object,
    CreateFrom: String,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    renderComp: true,
    SnackBarComponent: {},
    TableHeaders: [
      { text: "#", value: "sl_no", width: "4%" },
      { text: "Product", value: "product_name", sortable: false },
      { text: "Ticket Type", value: "ticket_creation_type", sortable: false },
      { text: "Support", value: "support_type", sortable: false },
      {
        text: "Installation Date",
        value: "product_purchased_on",
        sortable: false,
      },
      { text: "Comments", value: "additional_comments", sortable: false },
      { text: "Attachment", value: "UploadedFile", sortable: false },
    ],
  }),
  mounted() {
    console.log("STOREOBJ_RFS", this.RFSObj);
  },
  watch: {
    currentWindow(val) {
      if (val == 5) {
        this.CreateTicketWindow();
      }
    },
  },
  methods: {
    WindowPage4Emit(Toggle) {
      this.$emit("clicked", Toggle);
    },
    async CreateTicketWindow() {
      try {
        let Local_Array = [];
        let setting_id;
        for (let i = 0; i < this.WindowPag2.length; i++) {
          console.log("CHECK_TYPE", this.WindowPag2[i]);

          if (
            this.WindowPag2[i].warranty_type &&
            this.WindowPag2[i].support_type
          ) {
            await this.GetAllAMCTypeMethod(
              "ACTIVE",
              this.WindowPag2[i].support_type
            );
            console.log("LISTTEJ", this.GetAllAMCTypeList);
            let matchedItem = this.GetAllAMCTypeList.find(
              (item) => item.setting_name === this.WindowPag2[i].warranty_type
            );
            setting_id = matchedItem ? matchedItem.setting_id : null;
            console.log("Matched Setting ID:", setting_id);
          }
          let Object = {
            category_id: this.WindowPag2[i].category_id,
            service_id: this.WindowPag2[i].product_id,
            service_serial_number: this.WindowPag2[i].setting_name,
            asset_number: this.WindowPag2[i].asset_number || undefined,
            service_type_id: this.WindowPag2[i].service_type.service_type_id,
            service_ticket_description: this.WindowPag2[i].problem_type,
            additional_comments:
              this.WindowPag2[i].additional_comments != undefined &&
              this.WindowPag2[i].additional_comments != "" &&
              this.WindowPag2[i].additional_comments != null
                ? this.WindowPag2[i].additional_comments
                : undefined,
            product_attachments:
              this.WindowPag2[i]?.product_attachments || undefined,
            is_free_of_cost: this.WindowPag2[i].is_free_of_cost,
            ticket_warranty_type:
              this.WindowPag2[i].support_type != undefined
                ? this.WindowPag2[i].support_type
                : this.WindowPag2[i].support_typeee,
            support_type:
              this.WindowPag2[i].warranty_type != undefined
                ? this.WindowPag2[i].warranty_type
                : this.WindowPag2[i].warranty_typeee?.setting_name || undefined,
            support_type_id:
              this.WindowPag2[i].warranty_type != undefined
                ? setting_id
                : this.WindowPag2[i].warranty_typeee?.setting_id || undefined,
            // support_type_id
            // ticket_warranty_type: (() => {
            //   let value1 = this.WindowPag2[i].warranty_type;
            //   let value2 = this.WindowPag2[i].support_type;
            //   let value3 = this.WindowPag2[i].support_typeee;

            //   // Check if value is uppercase with or without underscores
            //   if (value1 && /^[A-Z_]+$/.test(value1)) return value1;
            //   if (value2 && /^[A-Z_]+$/.test(value2)) return value2;
            //   if (value3 && /^[A-Z_]+$/.test(value3)) return value3;
            //   return undefined;
            // })(),

            // support_type: (() => {
            //   let value1 = this.WindowPag2[i].support_type;
            //   let value2 = this.WindowPag2[i].warranty_type;
            //   let value3 = this.WindowPag2[i].warranty_typeee;

            //   // Assign only if not fully uppercase with underscores
            //   if (value1 && !/^[A-Z_]+$/.test(value1)) return value1;
            //   if (value2 && !/^[A-Z_]+$/.test(value2)) return value2;
            //   if (value3 && !/^[A-Z_]+$/.test(value3)) return value3;

            //   return undefined;
            // })(),

            // ticket_warranty_type:
            //   this.WindowPag2[i].warranty_type ||
            //   this.WindowPag2[i].support_type ||
            //   this.WindowPag2[i].support_typeee ||
            //   undefined,
            // support_type:
            //   this.WindowPag2[i].support_type ||
            //   this.WindowPag2[i].warranty_type ||
            //   this.WindowPag2[i].warranty_typeee ||
            //   undefined,
            installation_date:
              this.WindowPag2[i].product_purchased_on != undefined &&
              this.WindowPag2[i].product_purchased_on != "" &&
              this.WindowPag2[i].product_purchased_on != null
                ? this.WindowPag2[i].product_purchased_on
                : undefined,
            ticket_warranty_details:
              (this.WindowPag2[i].invoice_number != undefined &&
                this.WindowPag2[i].invoice_number != null &&
                this.WindowPag2[i].invoice_number != "") ||
              (this.WindowPag2[i].invoice_date != undefined &&
                this.WindowPag2[i].invoice_date != null &&
                this.WindowPag2[i].invoice_date != "")
                ? {
                    ticket_invoice_number:
                      this.WindowPag2[i].invoice_number != undefined &&
                      this.WindowPag2[i].invoice_number != null &&
                      this.WindowPag2[i].invoice_number != ""
                        ? this.WindowPag2[i].invoice_number
                        : undefined,
                    ticket_invoice_date:
                      this.WindowPag2[i].invoice_date != undefined &&
                      this.WindowPag2[i].invoice_date != null &&
                      this.WindowPag2[i].invoice_date != ""
                        ? this.WindowPag2[i].invoice_date
                        : undefined,
                  }
                : undefined,
            ticket_s3_files: this.WindowPag2[i].UploadedFile,
            ticket_creation_type:
              this.WindowPag2[i].ticket_creation_type != ""
                ? this.WindowPag2[i].ticket_creation_type
                : undefined,
            pincode_type_name:
              this.WindowPag3.Pincode_Type?.pincode_type_name ||
              this.WindowPag3.Pincode_Type?.pincode_territory_type ||
              undefined,
            pincode_type_id:
              this.WindowPag3.Pincode_Type?.pincode_type_id ||
              this.WindowPag3.Pincode_Type?.pincode_id ||
              undefined,
            estimated_time: this.WindowPag3.Estimated_Time,
          };
          Local_Array.push(Object);
          console.log("CHECK_OBJ", Local_Array);
        }
        var inputparams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          creator_user_id: this.$store.getters.get_current_user_details.user_id,
          customer_name: this.WindowPag1.customer_name,
          is_rft_ticket: false,
          customer_type: this.WindowPag1.customer_type,
          customer_unique_id:
            this.WindowPag1.customer_unique_id != "" &&
            this.WindowPag1.customer_unique_id != undefined
              ? this.WindowPag1.customer_unique_id
              : undefined,
          is_tag_territory:
            this.WindowPag1.is_tag_territory != undefined
              ? this.WindowPag1.is_tag_territory
              : false,
          customer_id:
            this.WindowPag1.customer_id != undefined &&
            this.WindowPag1.customer_id != null &&
            this.WindowPag1.customer_id != ""
              ? this.WindowPag1.customer_id
              : undefined,
          customer_company_name:
            this.WindowPag1.customer_company_name != "" &&
            this.WindowPag1.customer_company_name != undefined &&
            this.WindowPag1.customer_company_name != null
              ? this.WindowPag1.customer_company_name
              : undefined,
          ticket_latitude: this.WindowPag1.latitude,
          ticket_longitude: this.WindowPag1.longitude,
          customer_country_code: this.WindowPag1.country_code,
          customer_phone_number: this.WindowPag1.customer_contact_number,
          secondary_customer_contact:
            this.WindowPag1.secondary_customer_contact != "" &&
            this.WindowPag1.secondary_customer_contact != undefined &&
            this.WindowPag1.secondary_customer_contact != null
              ? this.WindowPag1.secondary_customer_contact
              : undefined,
          customer_category_id:
            this.WindowPag1.customer_category_id != undefined &&
            this.WindowPag1.customer_category_id != null &&
            this.WindowPag1.customer_category_id != ""
              ? this.WindowPag1.customer_category_id
              : undefined,
          ticket_address:
            this.WindowPag1.service_address || this.WindowPag1.customer_address,
          add_customer_to_db:
            this.WindowPag1.Add_Customer_to_dB == true ? true : false,
          ticket_dependency_details: Local_Array,
          tagged_territories:
            this.WindowPag3.territory_id != undefined &&
            this.WindowPag3.territory_id != [] &&
            this.WindowPag3.territory_id != "" &&
            this.WindowPag3.territory_id.length != 0
              ? this.WindowPag3.territory_id
              : undefined,
          assignee_user_id: this.WindowPag3.select_representative.user_id,
          prefered_visit_date: this.WindowPag3.date,
          prefered_visit_time: this.WindowPag3.time,
          is_call_initiated_ticket:
            this.CreateFrom === "RFS" ? true : undefined,
          call_initiated_ticket:
            this.CreateFrom === "RFS" ? this.RFSObj.rfs_id : undefined,
        };
        if (
          this.WindowPag1.ticket_pincode != "" &&
          this.WindowPag1.ticket_pincode != undefined &&
          this.WindowPag1.ticket_pincode != null
        ) {
          inputparams.ticket_pincode = this.WindowPag1.ticket_pincode;
        }
        if (
          this.WindowPag1.ticket_state != undefined &&
          this.WindowPag1.ticket_state != null &&
          this.WindowPag1.ticket_state != ""
        ) {
          inputparams.ticket_state = this.WindowPag1.ticket_state;
        }
        if (
          this.WindowPag1.ticket_city != undefined &&
          this.WindowPag1.ticket_city != null &&
          this.WindowPag1.ticket_city != ""
        ) {
          inputparams.ticket_city = this.WindowPag1.ticket_city;
        }
        if (
          this.WindowPag3.ticket_priority != undefined &&
          this.WindowPag3.ticket_priority != null &&
          this.WindowPag3.ticket_priority != ""
        ) {
          inputparams.ticket_priority = this.WindowPag3.ticket_priority;
        }
        if (
          this.WindowPag3.select_representative1 != undefined &&
          this.WindowPag3.select_representative1 != null &&
          this.WindowPag3.select_representative1 != ""
        ) {
          if (
            this.WindowPag3.select_representative1.user_id !=
            this.WindowPag3.select_representative.user_id
          ) {
            inputparams.secondary_technician_id =
              this.WindowPag3.select_representative1.user_id;
          }
        }
        if (
          this.WindowPag1.customer_email_id != "" &&
          this.WindowPag1.customer_email_id != undefined &&
          this.WindowPag1.customer_email_id != null
        ) {
          inputparams.customer_email_id = this.WindowPag1.customer_email_id;
        }
        if (
          this.WindowPag3.customer_call_time != undefined &&
          this.WindowPag3.customer_call_time != null &&
          this.WindowPag3.customer_call_time != ""
        ) {
          inputparams.customer_call_time = this.WindowPag3.customer_call_time;
        }
        if (
          this.WindowPag3.ticket_call_source != undefined &&
          this.WindowPag3.ticket_call_source != null &&
          this.WindowPag3.ticket_call_source != ""
        ) {
          inputparams.ticket_call_source = this.WindowPag3.ticket_call_source;
        }
        if (
          this.WindowPag3.source_remark != undefined &&
          this.WindowPag3.source_remark != null &&
          this.WindowPag3.source_remark != ""
        ) {
          inputparams.source_remark = this.WindowPag3.source_remark;
        }
        if (
          this.WindowPag3.customer_call_date != undefined &&
          this.WindowPag3.customer_call_date != null &&
          this.WindowPag3.customer_call_date != ""
        ) {
          inputparams.customer_call_date = this.WindowPag3.customer_call_date;
        }
        let result = await API.graphql(
          graphqlOperation(CreateAssignedTicketV2, {
            input: inputparams,
          })
        );
        var ResultObject = JSON.parse(result.data.CreateAssignedTicketV2);
        if (ResultObject.status == "SUCCESS") {
          this.renderComp = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              timeout: 50,
              SnackbarText: ResultObject.status_message,
              Top: true,
            };
            this.renderComp = true;
          });
          setTimeout(() => {
            this.WindowPage4Emit(2);
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        this.WindowPage4Emit(3);
        this.renderComp = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            timeout: 50,
            SnackbarText: error.errors[0].message,
            Top: true,
          };
          this.renderComp = true;
        });
      }
    },
  },
};
</script>
