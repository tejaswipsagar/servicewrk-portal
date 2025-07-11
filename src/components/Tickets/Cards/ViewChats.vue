<template>
  <div>
    <Overlay :overlay="overlay" />
    <v-card
      outlined
      height="400"
      max-width="1010"
      class="overflow-y-auto"
      style="border: 1px solid grey"
    >
      <v-row>
        <v-col
          cols="12"
          md="12"
          sm="12"
          xs="12"
          v-for="(message, index) in GetAllChatMessageList"
          :key="index"
        >
          <v-card
            class="black--text text-left pa-3"
            outlined
            color="transparent"
            v-if="message.chat_user_type == 'Receiver'"
          >
            <span style="font-size: 13px" class="primary--text"
              ><v-icon size="15" class="pr-1">mdi-account</v-icon
              >{{ message.user_name }} ({{ message.contact_info }})</span
            >
            <div class="pl-5">
              {{ message.message_content }}
            </div>
            <div style="font-size: 13px" class="grey--text">
              {{ new Date(message.log_created_on * 1000).toLocaleString("en-GB") }}
            </div>
          </v-card>
          <v-card
            class="black--text text-right pa-3"
            outlined
            color="transparent"
            v-else
          >
            <span style="font-size: 13px" class="primary--text">
              <v-icon size="15" class="pr-1">mdi-account</v-icon
              >{{ message.user_name }}( {{ message.contact_info }} )
            </span>
            <div>
              {{ message.message_content }}
            </div>
            <div class="grey--text text-right" style="font-size: 13px">
              {{ new Date(message.log_created_on * 1000).toLocaleString("en-GB") }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card-actions>
      <v-row>
        <v-col cols="12" md="9" sm="12" xs="12">
          <v-text-field
            outlined
            dense
            label="Type here..."
            v-model="message_content"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="1" sm="12" xs="12">
          <v-btn @click="sendMessage()" small color="primary">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="1" sm="12" xs="12">
          <v-btn @click="reloadChat()" small color="primary">
            <v-icon>mdi-reload</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </div>
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";
import { API, graphqlOperation } from "aws-amplify";
import Overlay from "@/components/Extras/OverlayView.vue";
import { TicketInteraction } from "@/graphql/mutations.js";
import { GetAllChatMessages } from "@/mixins/Tickets/GetAllChatMessages.js";
Vue.component("downloadExcel", JsonExcel);
export default {
  props: {
    StoreObj: Object,
  },
  mixins: [GetAllChatMessages],
  components: {
    Overlay,
  },
  data: () => ({
    overlay: false,
    readonly: false,
    message_content: "",
    ListComponent: [],
    GetAllChatMessageList: [],
  }),
  mounted() {
    this.GetAllChatMessageMethod(this.StoreObj.ticket_id);
  },
  methods: {
    reloadChat() {
      this.GetAllChatMessageMethod(this.StoreObj.ticket_id);
    },
    sendMessage() {
      this.sendMessageMethod();
    },
    async sendMessageMethod() {
      var mutationname = TicketInteraction;
      var mutationresult = "TicketInteraction";
      var inputParams = {
        organization_id:
          this.$store.getters.get_current_user_details.organization_id,
        user_id: this.$store.getters.get_current_user_details.user_id,
        ticket_id: this.StoreObj.ticket_id,
        message_content: this.message_content,
      };
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
        }
        this.isLoading = false;
        this.GetAllChatMessageMethod(this.StoreObj.ticket_id);
        this.message_content = "";
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
    },
  },
};
</script>
