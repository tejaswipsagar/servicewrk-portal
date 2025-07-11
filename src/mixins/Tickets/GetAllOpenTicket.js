import { List_Open_Tickets } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllOpenTicket = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      next_token: "",
      active_tickets_count: "",
      ResultObj: [],
      GetAllOpenTicketList: [],
    };
  },
  methods: {
    async GetAllOpenTicketMethod(
      ticket_status,
      selectServiceType,
      selectTechnicianType,
      from_date,
      to_date,
      selectProduct,
      ticket_creation_type,
      support,
      support_type,
      next_token,
      user_type,
      wip_sub_stage_id,
      filter_user_type
    ) {
      try {
        this.overlay = true;
        this.loading_active_tickets = true;
        // console.log("CHECK_THAT_TYPE", filter_user_type);
        let result = await API.graphql(
          graphqlOperation(List_Open_Tickets, {
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
              // ticket_user_id:
              //   this.$store.getters.get_user_type === "DEALER_OWNER" ||
              //   this.$store.getters.get_user_type === "DEALER_AGENT"
              //     ? this.$store.getters.get_current_user_details.partner_id
              //     : selectTechnicianType == "ALL"
              //     ? undefined
              //     : selectTechnicianType,
              from_date: from_date
                ? new Date(from_date).getTime() / 1000
                : undefined,
              to_date: to_date
                ? new Date(to_date).getTime() / 1000 + 86399
                : undefined,
              service_id: selectProduct == "ALL" ? undefined : selectProduct,
              ticket_creation_type:
                ticket_creation_type == "ALL"
                  ? undefined
                  : ticket_creation_type,
              ticket_warranty_type: support == "ALL" ? undefined : support,
              support_type: support_type == "ALL" ? undefined : support_type,
              next_token: next_token,
              limit: 205,
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
        var ResultObj = JSON.parse(result.data.List_Open_Tickets);
        if (ResultObj.status == "SUCCESS") {
          if (!this.next_token) {
            this.GetAllOpenTicketList = [];
            this.GetAllOpenTicketList = ResultObj.data.items;
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
            this.active_tickets_count = ResultObj.data.active_tickets_count;
            for (let i = 0; i < this.GetAllOpenTicketList.length; i++) {
              this.GetAllOpenTicketList[i].new_ticket_closed_on = new Date(
                this.GetAllOpenTicketList[i].ticket_closed_time * 1000
              ).toLocaleString();
              this.GetAllOpenTicketList[i].new_ticket_type =
                this.GetAllOpenTicketList[i].ticket_type.includes("_")
                  ? this.GetAllOpenTicketList[i].ticket_type.replace("_", " ")
                  : this.GetAllOpenTicketList[i].ticket_type;
              this.GetAllOpenTicketList[i].new_ticket_status =
                this.GetAllOpenTicketList[i].ticket_status.includes("_")
                  ? this.GetAllOpenTicketList[i].ticket_status.replaceAll(
                      "_",
                      " "
                    )
                  : this.GetAllOpenTicketList[i].ticket_status;
              if (
                this.GetAllOpenTicketList[i].component_list != undefined &&
                this.GetAllOpenTicketList[i].component_list.length != 0
              ) {
                this.GetAllOpenTicketList[i].new_component_list =
                  this.GetAllOpenTicketList[i].component_list
                    .map((item) => item.component_name)
                    .join();
              }
              if (this.$route.name == "ActiveTickets") {
                this.formExcelFormatOpenTicket();
              }
            }
            this.overlay = false;
            this.loading_active_tickets = false;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.GetAllOpenTicketList.push({ ...ResultObj.data.items[i] });
            }
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
            this.loading_active_tickets = false;
          }
        }
        this.overlay = false;
      } catch (error) {
        // console.log(error);
        this.noDataText = error.errors[0].message;
        this.overlay = false;
        this.loading_active_tickets = false;
        this.GetAllOpenTicketList = [];
      }
    },
    formExcelFormatOpenTicket() {
      try {
        this.loading_active_tickets = false;
        this.newGetAllOpenTicketList = [];
        let GetAllOpenTicketList = [];
        for (let i = 0; i < this.GetAllOpenTicketList.length; i++) {
          GetAllOpenTicketList.push(this.GetAllOpenTicketList[i]);
        }
        var firstArray = [];
        for (let i = 0; i < GetAllOpenTicketList.length; i++) {
          if (GetAllOpenTicketList[i].component_list.length > 1) {
            var newObject = { ...GetAllOpenTicketList[i] };
            GetAllOpenTicketList.splice(i, 1);
            firstArray.push(newObject);
          }
        }
        for (let j = 0; j < firstArray.length; j++) {
          for (let k = 0; k < firstArray[j].component_list.length; k++) {
            let testObj = {};
            for (let key in firstArray[j]) {
              testObj[key] = k == 0 ? firstArray[j][key] : "";
              testObj.ticket_id = firstArray[j].ticket_id;
              testObj.component_list = [];
              testObj.component_list.push({
                component_name: firstArray[j].component_list[k].component_name,
              });
            }
            GetAllOpenTicketList.push(testObj);
          }
        }
        for (let l = 0; l < GetAllOpenTicketList.length; l++) {
          let object = GetAllOpenTicketList[l];
          object.new_component_list = GetAllOpenTicketList[l].component_list
            .map((item) => item.component_name)
            .join();
          this.newGetAllOpenTicketList.push(object);
        }
      } catch (error) {
        // console.warn(error);
        this.overlay = false;
        this.loading_active_tickets = false;
        this.GetAllOpenTicketList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
