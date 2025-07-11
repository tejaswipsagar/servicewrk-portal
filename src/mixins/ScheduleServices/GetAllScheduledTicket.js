import { List_Scheduled_Ticket } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllScheduledTicket = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      next_token: "",
      active_scheduled_service: "",
      stoped_scheduled_service: "",
      ResultObj: [],
      GetAllScheduledTicketList: [],
    };
  },
  methods: {
    async GetAllScheduledTicketMethod(ticket_status, reportmonth, next_token) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Scheduled_Ticket, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              ticket_status: ticket_status,
              ticket_schedule_month: reportmonth,
              next_token: next_token,
              limit: 51,
            },
          })
        );
        var ResultObj = JSON.parse(result.data.List_Scheduled_Ticket);
        if (ResultObj.status == "SUCCESS") {
          if (!this.next_token) {
            this.GetAllScheduledTicketList = [];
            this.GetAllScheduledTicketList = ResultObj.data.items;
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
            this.stoped_scheduled_service =
              ResultObj.data.stoped_scheduled_service;
            this.active_scheduled_service =
              ResultObj.data.active_scheduled_service;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.GetAllScheduledTicketList.push({
                ...ResultObj.data.items[i],
              });
            }
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
          }
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllScheduledTicketList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
