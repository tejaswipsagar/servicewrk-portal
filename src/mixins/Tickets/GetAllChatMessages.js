import { ListTicketInteractions } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllChatMessages = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      RouterList: [],
      GetAllChatMessageList: [],
    };
  },
  methods: {
    async GetAllChatMessageMethod(ticket_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListTicketInteractions, {
            input: {
              ticket_id: ticket_id,
            },
          })
        );
        this.GetAllChatMessageList = JSON.parse(
          result.data.ListTicketInteractions
        ).data.items;
        this.GetAllChatMessageList.map((item) => {
          let Obj = item;
          if (item.user_id === this.$store.getters.get_current_user_details.user_id) {
            Obj.chat_user_type = "Sender";
          } else {
            Obj.chat_user_type = "Receiver";
          }
          return Obj;
        });
        if (
          this.$route.name == "OpenTicket" ||
          this.$route.name == "ClosedTicket"
        ) {
          this.GetAllChatMessageList.unshift({
            service_type_name: "ALL",
            service_type_id: "ALL",
          });
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllChatMessageList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
