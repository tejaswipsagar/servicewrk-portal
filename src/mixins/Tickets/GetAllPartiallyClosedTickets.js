import { API, graphqlOperation } from "aws-amplify";
import { listPartiallyClosedTicket } from "@/graphql/queries.js";
export const GetAllPartiallyClosedTicket = {
  data: () => ({
    overlay: false,
    loading: false,
    noDataText: "",
    ResultObj: [],
    GetAllPartiallyClosedTicketList: [],
  }),
  methods: {
    async GetAllPartiallyClosedTicketMethod(partially_closed_by, next_token) {
      try {
        this.noDataText = "Please Wait Loading Your Data !!";
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(listPartiallyClosedTicket, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id:
                this.$store.getters.get_user_type === "DEALER_OWNER" ||
                this.$store.getters.get_user_type === "DEALER_AGENT"
                  ? this.$store.getters.get_current_user_details.partner_id
                  : this.$store.getters.get_current_user_details.user_id,
              partially_closed_by: partially_closed_by,
              next_token: next_token,
              limit: 51,
            },
          })
        );
        var ResultObj = JSON.parse(result.data.listPartiallyClosedTicket);
        if (ResultObj.status === "SUCCESS") {
          if (!this.next_token) {
            this.GetAllPartiallyClosedTicketList = [];
            this.GetAllPartiallyClosedTicketList = ResultObj.data.items;
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.GetAllPartiallyClosedTicketList.push({
                ...ResultObj.data.items[i],
              });
            }
            this.next_token = ResultObj.data.next_token;
          }
          this.overlay = false;
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
        this.overlay = false;
        this.loading = false;
        this.GetAllPartiallyClosedTicketList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
