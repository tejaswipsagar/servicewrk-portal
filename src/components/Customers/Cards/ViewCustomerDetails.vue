<template>
  <div>
    <TicketsBasedOnCustomer
      :StoreObjTickets="StoreObjTickets"
      :DialogTicketsBasedOnCustomer="DialogTicketsBasedOnCustomer"
      @clicked="DialogTicketsBasedOnCustomerEmit"
    />
    <TechVisitsOnCustomer
      :StoreObjTechVisits="StoreObjTechVisits"
      :DialogTechVisitsBasedOnCustomer="DialogTechVisitsBasedOnCustomer"
      @clicked="DialogTechVisitsBasedOnCustomerEmit"
    />
    <v-card elevation="0" flat class="ml-3 pa-4" style="border: 1px gray solid">
      <h4 class="mb-2">Customer Details</h4>
      <v-row dense class="FontSize">
        <v-row>
          <v-col cols="12" sm="12" md="4" xs="12" class="mb-n6">
            <p>
              <b> Created On : </b>
              {{
                new Date(
                  this.StoreObj.customer_created_on * 1000
                ).toLocaleString("en-GB")
              }}
            </p>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12" class="mb-n6">
            <p><b>Customer ID :</b> {{ this.StoreObj.customer_unique_id }}</p>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12" class="mb-n6">
            <p><b>Customer Type : </b>{{ this.StoreObj.customer_type }}</p>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12" class="mb-n6">
            <p><b>Contact Person : </b>{{ this.StoreObj.customer_name }}</p>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="4"
            xs="12"
            v-if="this.StoreObj.customer_type != 'INDIVIDUAL'"
            class="mb-n6"
          >
            <p>
              <b>Customer Name :</b> {{ this.StoreObj.customer_company_name }}
            </p>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12" class="mb-n6">
            <p>
              <b> Primary Contact No :</b>
              {{ this.StoreObj.customer_primary_contact_number }}
            </p>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12" class="mb-n6">
            <p>
              <b> Secondary Contact No : </b>
              {{ this.StoreObj.customer_secondary_contact_number }}
            </p>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12" class="mb-n6">
            <p><b>Email Id :</b> {{ this.StoreObj.customer_email_id }}</p>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12" class="mb-n6">
            <p>
              <b>Customer Category :</b>
              {{ this.StoreObj.customer_category_name }}
            </p>
          </v-col>
        </v-row>
        <v-row class="ml-0">
          <v-col cols="12" sm="12" md="4" xs="12">
            <p>
              <b>Shipping Address : </b>{{ this.StoreObj.customer_address }}
            </p>
            <p v-if="this.StoreObj.city != undefined">
              <b> City : </b>{{ this.StoreObj.city }}
            </p>
            <p v-else-if="this.StoreObj.customer_city != undefined">
              <b> City : </b>{{ this.StoreObj.customer_city }}
            </p>
            <p v-if="this.StoreObj.state != undefined">
              <b> State : </b>{{ this.StoreObj.state }}
            </p>
            <p v-else-if="this.StoreObj.customer_state != undefined">
              <b> State : </b>{{ this.StoreObj.customer_state }}
            </p>
            <p v-if="this.StoreObj.customer_pincode != undefined">
              <b> Pincode : </b>{{ this.StoreObj.customer_pincode }}
            </p>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12">
            <p>
              <b>Billing Address : </b
              >{{ this.StoreObj.customer_billing_address }}
            </p>
            <p v-if="this.StoreObj.customer_billing_city != undefined">
              <b> City : </b>{{ this.StoreObj.customer_billing_city }}
            </p>
            <p v-if="this.StoreObj.customer_billing_state != undefined">
              <b> State : </b>{{ this.StoreObj.customer_billing_state }}
            </p>
            <p v-if="this.StoreObj.customer_billing_pincode != undefined">
              <b> Pincode : </b>{{ this.StoreObj.customer_billing_pincode }}
            </p>
          </v-col>
          <v-col
            v-if="this.StoreObj.customer_type != 'INDIVIDUAL'"
            cols="12"
            sm="12"
            md="4"
            xs="12"
          >
            <b>Website : </b> {{ this.StoreObj.customer_website }}
          </v-col>
        </v-row>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" sm="12" xs="12">
          <p class="FontSize">
            <b>Primary Tagged Representative :</b>
            <span
              v-if="this.StoreObj.primary_representative_details != undefined"
            >
              {{ this.StoreObj.primary_representative_details.user_name }}
            </span>
          </p>
        </v-col>
        <v-col cols="12" md="4" sm="12" xs="12">
          <p class="FontSize">
            <b>Secondary Tagged Representative :</b>
            <span
              v-if="this.StoreObj.secondary_representative_details != undefined"
            >
              {{ this.StoreObj.secondary_representative_details.user_name }}
            </span>
          </p>
        </v-col>
        <v-col cols="12" md="4" sm="12" xs="12">
          <p class="FontSize font-weight-bold">
            Tech Visits :
            <span
              class="font-weight-regular"
              v-if="this.StoreObj.representative_visit_count"
            >
              {{ this.StoreObj.representative_visit_count }}
              <v-icon
                color="primary"
                v-if="this.StoreObj.representative_visit_count != 0"
                small
                @click="openVisitDeatils()"
                >mdi-account-wrench</v-icon
              >
            </span>
            <span v-else class="font-weight-regular">0</span>
          </p>
        </v-col>
      </v-row>
      <h3 class="mt-2 mb-2">Ticket Details</h3>
      <v-row class="FontSize">
        <v-col cols="12" sm="12" md="4" xs="12">
          <p>
            Total Active Tickets : {{ this.ActiveTicketsCount }}
            <v-icon
              @click="viewTickets('ACTIVE_TICKETS')"
              small
              color="primary"
              v-if="this.ActiveTicketsCount != 0"
              >mdi-ticket</v-icon
            >
          </p>
        </v-col>
        <v-col cols="12" sm="12" md="4" xs="12">
          <p>
            Total Closed Tickets : {{ this.ClosedTicketsCount }}
            <v-icon
              @click="viewTickets('CLOSED_TICKETS')"
              small
              color="primary"
              v-if="this.ClosedTicketsCount != 0"
              >mdi-ticket</v-icon
            >
          </p>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import { GetAllTicketsBasedOnCustomer } from "@/mixins/Customers/TicketsBasedOnCustomer.js";
import TechVisitsOnCustomer from "@/components/Customers/Dialogs/TechVisitsOnCustomer.vue";
import TicketsBasedOnCustomer from "@/components/Customers/Dialogs/TicketsBasedOnCustomer.vue";
export default {
  props: {
    StoreObj: Object,
  },
  mixins: [GetAllTicketsBasedOnCustomer],
  components: {
    TechVisitsOnCustomer,
    TicketsBasedOnCustomer,
  },
  data: () => ({
    StoreObjTickets: {},
    StoreObjTechVisits: {},
    ActiveTicketsCount: 0,
    ClosedTicketsCount: 0,
    DialogTicketsBasedOnCustomer: false,
    DialogTechVisitsBasedOnCustomer: false,
    GetAllTicketsBasedOnCustomerList: [],
  }),
  methods: {
    openVisitDeatils() {
      this.StoreObjTechVisits = this.StoreObj;
      this.DialogTechVisitsBasedOnCustomer = true;
    },
    viewTickets(action) {
      this.StoreObjTickets = this.GetAllTicketsBasedOnCustomerList[0];
      this.StoreObjTickets.action = action;
      this.DialogTicketsBasedOnCustomer = true;
    },
    DialogTicketsBasedOnCustomerEmit() {
      this.DialogTicketsBasedOnCustomer = false;
    },
    DialogTechVisitsBasedOnCustomerEmit() {
      this.DialogTechVisitsBasedOnCustomer = false;
    },
  },
  mounted() {
    this.GetAllTicketsBasedOnCustomerMethod(this.StoreObj.customer_id);
  },
};
</script>

<style></style>
