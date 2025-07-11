<template>
  <div>
    <Snackbar
      :SnackBarComponent="SnackBarComponent"
      v-if="renderComp == true"
    />
    <v-dialog persistent width="500" :value="dialogTransferRep">
      <Overlay :overlay="overlay" />
      <v-card>
        <v-toolbar color="primary" class="white--text elevation-0" dense dark>
          <v-icon small color="green">mdi-transfer-right</v-icon>
          Tranfer {{ StoreObj.user_name }}
          <v-spacer />
          <v-btn
            large
            class="mr-n4"
            dark
            text
            @click="dialogTransferRepEmit((Toggle = 1))"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-form ref="form">
            <v-select
              dense
              outlined
              class="FontSize mt-4"
              v-model="transfer_type"
              :items="user_type_items"
              :rules="[(v) => !!v || 'Required']"
              label="Transfer to User Type *"
            >
            </v-select>
            <v-autocomplete
              dense
              outlined
              class="FontSize"
              v-model="new_partner_id"
              :items="
                transfer_type == 'DEALER_TECHNICIAN'
                  ? this.GetDealersList
                  : transfer_type == 'PARTNER_REPRESENTATIVE'
                  ? this.GetAllPartnerAndPartnerUserList
                  : transfer_type == 'REPRESENTATIVE'
                  ? GetAllUsersList
                  : []
              "
              label="Transfer to *"
              item-text="user_name"
              item-value="partner_id"
              return-object
              :rules="[(v) => !!v || 'Required']"
            >
            </v-autocomplete>
            <v-autocomplete
              dense
              outlined
              multiple
              return-object
              class="FontSize"
              label="Territories"
              v-model="territory_ids"
              item-value="territory_id"
              item-text="territory_name"
              :no-data-text="noDataText_territory"
              :items="GetPartnerTaggedTerritoryList"
            >
            </v-autocomplete>
          </v-form>
          <div v-if="openTickets.length != 0">
            <v-toolbar dense elevation="0" class="mt-n4">
              <h4 class="primary--text">
                Assigned Tickets to {{ StoreObj.user_name }} :
              </h4>
              <v-spacer />
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    v-on="on"
                    v-bind="attrs"
                    @click="exporttoexcel"
                    class="primary white--text"
                    ><v-icon>mdi-file-excel-outline</v-icon></v-btn
                  >
                </template>
                <span>Download excel</span>
              </v-tooltip>
            </v-toolbar>
            <v-data-table
              dense
              :headers="open_ticket_headers"
              :items="openTickets"
            >
              <template v-slot:[`item.ticket_id`]="{ item }">
                <div class="FontSize">
                  {{ item.ticket_id }}
                </div>
              </template>
              <template v-slot:[`item.representative_name`]="{ item }">
                <div class="FontSize">
                  {{ item.representative_name }}
                </div>
              </template>
            </v-data-table>
            <h4 class="primary--text">
              Reassign the above tickets to other representative, and
              transfer..!
            </h4>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            v-if="isTransfer"
            :loading="isLoading"
            @click="transferMethods()"
            class="primary white--text mb-4"
            >Transfer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/OverlayView.vue";
import Snackbar from "@/components/Extras/SnackbarView.vue";
var xlsx = require("json-as-xlsx");
import { API, graphqlOperation } from "aws-amplify";
import { GetAllUsers } from "@/mixins/Users/GetAllUsers.js";
import { GetAllDealers } from "@/mixins/Users/GetAllDealers.js";
import { TransferRepresentative } from "@/graphql/mutations.js";
import { GetAllPartnerUser } from "@/mixins/Users/GetAllPartnerUser.js";
import { GetPartnerTaggedTerritory } from "@/mixins/Users/GetPartnerTaggedTerritory.js";
export default {
  props: {
    StoreObj: Object,
    dialogTransferRep: Boolean,
  },
  mixins: [
    GetAllUsers,
    GetAllDealers,
    GetAllPartnerUser,
    GetPartnerTaggedTerritory,
  ],
  components: { Overlay, Snackbar },
  data() {
    return {
      overlay: false,
      renderComp: true,
      isTransfer: true,
      isLoading: false,
      transfer_type: "",
      new_partner_id: "",
      noDataText_territory: "",
      openTickets: [],
      territory_ids: [],
      GetDealersList: [],
      GetAllUsersList: [],
      GetPartnerTaggedTerritoryList: [],
      GetAllPartnerAndPartnerUserList: [],
      open_ticket_headers: [
        { text: "Ticket Id", value: "ticket_id" },
        { text: "Representative", value: "representative_name" },
      ],
      user_type_items: [
        { text: "Enterprise", value: "REPRESENTATIVE" },
        { text: "Service Partner", value: "PARTNER_REPRESENTATIVE" },
        { text: "Dealer", value: "DEALER_TECHNICIAN" },
      ],
      SnackBarComponent: {},
    };
  },
  watch: {
    transfer_type(val) {
      if (val == "PARTNER_REPRESENTATIVE") {
        this.GetAllPartnerUserMethod("SERVICE_PARTNER", "ACTIVE");
      } else if (val == "DEALER_TECHNICIAN") {
        this.GetDealersMethod("DEALER_OWNER", "ACTIVE");
      } else if (val == "REPRESENTATIVE") {
        this.GetAllUsersMethod(undefined, "ACTIVE", undefined);
      }
    },
    new_partner_id(val) {
      this.GetPartnerTaggedTerritoryMethod(
        this.transfer_type == "REPRESENTATIVE" ? val.user_id : val.partner_id
      );
    },
  },
  methods: {
    exporttoexcel() {
      let data = [
        {
          sheet: `Tickets on ${this.StoreObj.user_name}`,
          columns: [
            { label: "Ticket ID", value: "ticket_id" },
            { label: "Representative", value: "representative_name" },
          ],
          content: this.openTickets,
        },
      ];
      let settings = {
        fileName: `Assigned Tickets to ${this.StoreObj.user_name}`,
        extraLength: 6,
        writeOptions: {},
      };
      xlsx(data, settings);
    },
    dialogTransferRepEmit(Toggle) {
      this.openTickets = [];
      this.$refs.form.reset();
      this.isTransfer = true;
      this.$emit("clicked", Toggle);
    },
    async transferMethods() {
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        try {
          let mutation_name = TransferRepresentative;
          let mutation_result = "TransferRepresentative";
          var inputParams = {
            organization_id:
              this.$store.getters.get_current_user_details.organization_id,
            user_id: this.$store.getters.get_current_user_details.user_id,
            transfer_type: this.transfer_type,
            new_partner_id:
              this.transfer_type == "REPRESENTATIVE"
                ? this.new_partner_id.user_id
                : this.new_partner_id.partner_id,
            representative_id: this.StoreObj.user_id,
            territory_ids:
              this.territory_ids != [] &&
              this.territory_ids != undefined &&
              this.territory_ids.length != 0
                ? this.territory_ids.map((item) => item.territory_id)
                : undefined,
            territory_names:
              this.territory_ids != [] &&
              this.territory_ids != undefined &&
              this.territory_ids.length != 0
                ? this.territory_ids.map((item) => item.territory_name)
                : undefined,
          };
          let result = await API.graphql(
            graphqlOperation(mutation_name, {
              input: inputParams,
            })
          );
          let ResultObject = JSON.parse(result.data[mutation_result]);
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
            this.dialogTransferRepEmit((this.Toggle = 2));
          } else if (ResultObject.status == "OPEN_TICKETS") {
            this.openTickets = ResultObject.Data.items;
            this.isTransfer = false;
            this.renderComp = false;
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                SnackbarText:
                  "This Represenative has few Assigned Active Tickets, Kindly reassign the tickets to other representative, and try to transfer..!",
              };
              this.renderComp = true;
            });
          }
          this.isLoading = false;
        } catch (error) {
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
          this.isLoading = false;
        }
      }
    },
  },
};
</script>

<style></style>
