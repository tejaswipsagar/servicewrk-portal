<template>
  <div>
    <ViewEditedTicketDetails
      :StoreObjNew="StoreObjNew"
      :dialogViewEditedTicketDetails="dialogViewEditedTicketDetails"
      @clicked="dialogViewEditedTicketDetailsEmit"
    />
    <v-card
      class="elevation-0 mb-3 mx-auto"
      style="border: solid 1px gray"
      max-width="1010"
    >
      <v-card-title>
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="6" xs="12">
            <span class="FontSize font-weight-bold black--text"
              >Ticket-Id :<span v-if="StoreObj.custom_ticket_id">{{
                StoreObj.custom_ticket_id
              }}</span>
              <span v-else>{{ StoreObj.ticket_id }}</span>
            </span>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Ticket Type : {{ StoreObj.ticket_type.replace("_", " ") }}
            </div>
          </v-col>
          <v-col cols="12" sm="12" md="4" xs="12">
            <div class="FontSize font-weight-bold black--text">
              Customer Email :
              <span v-if="StoreObj.customer_email_id">{{
                StoreObj.customer_email_id
              }}</span>
              <span v-else>-</span>
            </div>
            <div class="FontSize font-weight-bold black--text mt-n2">
              Customer Number : {{ StoreObj.customer_full_number }}
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card class="elevation-0 ml-8 mr-8">
        <div v-if="GetAllChatMessageList.length != 0">Remarks :</div>
        <v-col v-for="(item, i) in GetAllChatMessageList" :key="i">
          <div class="mx-auto mt-n3">
            {{ i + 1 }}. {{ item.message_content }}
          </div>
        </v-col>
      </v-card>
      <v-card flat>
        <v-card flat :height="height" class="overflow-y-auto mb-5">
          <v-col
            v-for="(item, i) in StoreObj.ticket_transaction_history"
            :key="i"
          >
            <v-card
              dark
              outlined
              max-width="950"
              class="mx-auto mt-n3"
              color="purple lighten-5"
              style="border: 1px solid black"
            >
              <v-card-title>
                <v-row no-gutters>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <div class="FontSize mt-n2 black--text">
                      <div>
                        Action Type :<span class="font-weight-light">
                          <span v-if="item.action_type">
                            {{
                              item.action_type.includes("_")
                                ? item.action_type.replaceAll("_", " ")
                                : item.action_type
                            }}
                          </span>
                          <v-icon
                            v-if="item.action_type == 'EDITED TICKET DETAILS'"
                            small
                            color="primary"
                            @click="viewEditedTicketDetail(item, 'EDITED_TICKET_DETAILS')"
                            >mdi-information</v-icon
                          >
                          <v-icon
                            v-if="item.action_type == 'REQUEST_TO_EDIT_PRODUCT_DETAILS'"
                            small
                            color="primary"
                            @click="viewEditedTicketDetail(item , 'REQUESTED_TO_EDIT_PRODUCT_DETAILS')"
                            >mdi-information</v-icon
                          >
                          <v-icon
                            v-if="item.action_type == 'EDITED_PRODUCT_DETAILS_IN_EXISTING_WORKFLOW'"
                            small
                            color="primary"
                            @click="viewEditedTicketDetail(item , 'EDITED_PRODUCT_DETAILS_IN_EXISTING_WORKFLOW')"
                            >mdi-information</v-icon
                          >
                        </span>
                      </div>
                      <div v-if="item.action_type == 'REPEAT TICKET CREATED'">
                        <span v-if="item.custom_ticket_id" class="FontSize"
                          >(from : {{ item.custom_ticket_id }})</span
                        >
                        <span v-else class="FontSize"
                          >(from : {{ item.ticket_id }})</span
                        >
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <div class="ml-4 mt-n2 FontSize black--text">
                      Taken On :
                      <span class="font-weight-light">
                        {{ item.action_time }}</span
                      >
                    </div>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <div class="mt-n2 FontSize black--text">
                      Action By :<span class="font-weight-light">
                        {{ item.action_taken_by }}</span
                      >
                    </div>
                  </v-col>
                  <v-col cols="12" md="12" sm="12" xs="12">
                    <div class="FontSize black--text">
                      Action Taken :
                      <span class="font-weight-light">
                        {{ item.action_taken }}</span
                      >
                    </div>
                  </v-col>
                  <v-col cols="12" md="12" sm="12" xs="12">
                    <div v-if="i != 0" class="FontSize black--text">
                      Components Used :
                      <span class="font-weight-light">
                        {{ item.components_used }}</span
                      >
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="12"
                    sm="12"
                    xs="12"
                    v-if="item.mrf_approved_or_rejected_comments != undefined"
                  >
                    <div class="FontSize black--text">
                      <span v-if="item.action_type == 'APPROVED'"
                        >Approved</span
                      >
                      <span v-else-if="item.action_type == 'REJECTED'"
                        >Rejected</span
                      >
                      Comments :
                      <span class="font-weight-light">{{
                        item.mrf_approved_or_rejected_comments
                      }}</span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-title>
            </v-card>
          </v-col>
        </v-card>
      </v-card>
    </v-card>
  </div>
</template>
<script>
import { GetAllChatMessages } from "@/mixins/Tickets/GetAllChatMessages.js";
import ViewEditedTicketDetails from "@/components/Tickets/Dialogs/ViewEditedTicketDetails.vue";
export default {
  props: {
    StoreObj: Object,
  },
  components: {
    ViewEditedTicketDetails,
  },
  mixins: [GetAllChatMessages],
  data: () => ({
    height: 0,
    search: "",
    message_content: "",
    StoreObjNew: {},
    GetAllChatMessageList: [],
    ticket_transaction_history: [],
    dialogViewEditedTicketDetails: false,
  }),
  mounted() {
    this.height = window.innerHeight - 110;
    this.GetAllChatMessageMethod(this.StoreObj.ticket_id);
  },
  methods: {
    viewEditedTicketDetail(item, action) {
      this.StoreObjNew = item;
      this.StoreObjNew.action = action;
      this.dialogViewEditedTicketDetails = true;
    },
    dialogViewEditedTicketDetailsEmit() {
      this.dialogViewEditedTicketDetails = false;
    },
    ViewTicketHistoryEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
