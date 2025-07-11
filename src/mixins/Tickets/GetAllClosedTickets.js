import { List_closed_Tickets } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllClosedTickets = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      next_token: "",
      closed_tickets_count: "",
      ResultObj: [],
      GetAllClosedTicketList: [],
    };
  },
  methods: {
    async GetAllClosedTicketMethod(
      ticket_status,
      selectServiceType,
      selectTechnicianType,
      from_date,
      to_date,
      closure_remarks,
      ticket_creation_type,
      next_token,
      user_type,
      wip_sub_stage_id,
      filter_user_type
    ) {
      this.overlay = true;
      this.loading_closed_tickets = true;
      try {
        let result = await API.graphql(
          graphqlOperation(List_closed_Tickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              ticket_type: "ASSIGNED_TICKET",
              ticket_status: ticket_status == "ALL" ? undefined : ticket_status,
              service_type_id:
                selectServiceType == "ALL" ? undefined : selectServiceType,
              ticket_user_id:
                selectTechnicianType === "ALL"
                  ? undefined
                  : selectTechnicianType ||
                    (this.$store.getters.get_user_type === "DEALER_OWNER" ||
                    this.$store.getters.get_user_type === "DEALER_AGENT"
                      ? this.$store.getters.get_current_user_details.partner_id
                      : undefined),
              closure_remarks:
                closure_remarks == "ALL" ? undefined : closure_remarks,
              from_date: from_date
                ? new Date(from_date).getTime() / 1000
                : undefined,
              to_date: to_date
                ? new Date(to_date).getTime() / 1000 + 86399
                : undefined,
              ticket_creation_type:
                ticket_creation_type == "ALL"
                  ? undefined
                  : ticket_creation_type,
              next_token: next_token,
              limit: 51,
              user_type,
              wip_sub_stage_id: wip_sub_stage_id,
              filter_user_type:
                this.$store.getters.get_user_type === "DEALER_OWNER" ||
                this.$store.getters.get_user_type === "DEALER_AGENT"
                  ? "DEALER_OWNER"
                  : filter_user_type,
            },
          })
        );
        var ResultObj = JSON.parse(result.data.List_closed_Tickets);
        if (ResultObj.status == "SUCCESS") {
          if (!this.next_token) {
            this.GetAllClosedTicketList = [];
            this.GetAllClosedTicketList = ResultObj.data.items;
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
            this.closed_tickets_count = ResultObj.data.closed_tickets_count;
            for (let i = 0; i < this.GetAllClosedTicketList.length; i++) {
              this.GetAllClosedTicketList[i].new_ticket_type =
                this.GetAllClosedTicketList[i].ticket_type.includes("_")
                  ? this.GetAllClosedTicketList[i].ticket_type.replace("_", " ")
                  : this.GetAllClosedTicketList[i].ticket_type;
              if (
                this.GetAllClosedTicketList[i].component_list != undefined &&
                this.GetAllClosedTicketList[i].component_list.length != 0
              ) {
                this.GetAllClosedTicketList[i].new_component_list =
                  this.GetAllClosedTicketList[i].component_list
                    .map((item) => item.component_name)
                    .join();
              }
              if (this.$route.name == "ClosedTicket") {
                this.formExcelFormatForClosedTicket();
              }
            }
            this.overlay = false;
            this.loading_closed_tickets = false;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.GetAllClosedTicketList.push({ ...ResultObj.data.items[i] });
            }
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
            this.loading_closed_tickets = false;
          }
        }
      } catch (error) {
        this.overlay = false;
        this.loading_closed_tickets = false;
        this.GetAllClosedTicketList = [];
        this.noDataText = error.errors[0].message;
      }
    },
    formExcelFormatForClosedTicket() {
      try {
        this.newGetAllClosedTicketList = [];
        let GetAllClosedTicketList = [];
        for (let i = 0; i < this.GetAllClosedTicketList.length; i++) {
          GetAllClosedTicketList.push(this.GetAllClosedTicketList[i]);
        }
        var firstClosedArray = [];
        for (let i = 0; i < GetAllClosedTicketList.length; i++) {
          if (GetAllClosedTicketList[i].component_list.length > 1) {
            var newObject1 = { ...GetAllClosedTicketList[i] };
            GetAllClosedTicketList.splice(i, 1);
            firstClosedArray.push(newObject1);
          }
        }
        for (let j = 0; j < firstClosedArray.length; j++) {
          for (let k = 0; k < firstClosedArray[j].component_list.length; k++) {
            let testObj1 = {};
            for (let key in firstClosedArray[j]) {
              testObj1[key] = k == 0 ? firstClosedArray[j][key] : "";
              testObj1.ticket_id = firstClosedArray[j].ticket_id;
              testObj1.component_list = [];
              testObj1.component_list.push({
                component_name:
                  firstClosedArray[j].component_list[k].component_name,
              });
            }
            GetAllClosedTicketList.push(testObj1);
          }
        }
        for (let l = 0; l < GetAllClosedTicketList.length; l++) {
          let object = GetAllClosedTicketList[l];
          object.new_component_list = GetAllClosedTicketList[l].component_list
            .map((item) => item.component_name)
            .join();
          object.ticket_total_time = this.GetTotalTime(
            GetAllClosedTicketList[l]
          );
          this.newGetAllClosedTicketList.push(object);
        }
      } catch (error) {
        console.warn(error);
      }
    },
  },
};
