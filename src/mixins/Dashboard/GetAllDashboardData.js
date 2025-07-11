import { OrganizationDashboard } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllDashboardData = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      active_ticket_count: "",
      closed_ticket_count: "",
      creditsObject: {},
      TicketDetailsObject: {},
      AttendenceDetailsObject: {},
      GetAllDashboardDataList: [],
    };
  },
  methods: {
    async GetAllDashboardDataMethod() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(OrganizationDashboard, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id:
                this.$store.getters.get_current_user_details.user_type ==
                  "DEALER_OWNER" ||
                this.$store.getters.get_current_user_details.user_type ==
                  "SERVICE_PARTNER" ||
                this.$store.getters.get_current_user_details.user_type ==
                  "DEALER_AGENT"
                  ? this.$store.getters.get_current_user_details.user_id
                  : undefined,
            },
          })
        );
        this.GetAllDashboardDataList = JSON.parse(
          result.data.OrganizationDashboard
        ).data.items;
        if (
          this.$store.getters.get_current_user_details.user_type !=
            "SERVICE_PARTNER" &&
          this.$store.getters.get_current_user_details.user_type !=
            "DEALER_OWNER" &&
          this.$store.getters.get_current_user_details.user_type !=
            "DEALER_AGENT"
        ) {
          this.AttendenceDetailsObject = this.GetAllDashboardDataList[1];
          this.TicketDetailsObject = this.GetAllDashboardDataList[0];
          this.creditsObject =
            this.GetAllDashboardDataList[2].organization_credits;
          this.active_ticket_count =
            this.TicketDetailsObject.monthly_and_daily_tickets.active_tickets;
          this.closed_ticket_count =
            this.TicketDetailsObject.monthly_and_daily_tickets.closed_tickets;
        } else {
          if (
            this.GetAllDashboardDataList[0].monthly_and_daily_tickets !=
            undefined
          ) {
            this.TicketDetailsObject = this.GetAllDashboardDataList[0];
            this.active_ticket_count =
              this.TicketDetailsObject.monthly_and_daily_tickets.active_tickets;
            this.closed_ticket_count =
              this.TicketDetailsObject.monthly_and_daily_tickets.closed_tickets;
          } else if (
            this.GetAllDashboardDataList[1].monthly_and_daily_tickets !=
            undefined
          ) {
            this.TicketDetailsObject = this.GetAllDashboardDataList[1];
            this.active_ticket_count =
              this.TicketDetailsObject.monthly_and_daily_tickets.active_tickets;
            this.closed_ticket_count =
              this.TicketDetailsObject.monthly_and_daily_tickets.closed_tickets;
          } else if (
            this.GetAllDashboardDataList[2].monthly_and_daily_tickets !=
            undefined
          ) {
            this.TicketDetailsObject = this.GetAllDashboardDataList[2];
            this.active_ticket_count =
              this.TicketDetailsObject.monthly_and_daily_tickets.active_tickets;
            this.closed_ticket_count =
              this.TicketDetailsObject.monthly_and_daily_tickets.closed_tickets;
          }
          if (this.GetAllDashboardDataList[0].daily_swipe_counts != undefined) {
            this.AttendenceDetailsObject = this.GetAllDashboardDataList[0];
          } else if (
            this.GetAllDashboardDataList[1].daily_swipe_counts != undefined
          ) {
            this.AttendenceDetailsObject = this.GetAllDashboardDataList[1];
          } else if (
            this.GetAllDashboardDataList[2].daily_swipe_counts != undefined
          ) {
            this.AttendenceDetailsObject = this.GetAllDashboardDataList[2];
          }
          if (
            this.GetAllDashboardDataList[0].organization_credits != undefined
          ) {
            this.creditsObject =
              this.GetAllDashboardDataList[0].organization_credits;
          } else if (
            this.GetAllDashboardDataList[1].organization_credits != undefined
          ) {
            this.creditsObject =
              this.GetAllDashboardDataList[1].organization_credits;
          } else if (
            this.GetAllDashboardDataList[2].organization_credits != undefined
          ) {
            this.creditsObject =
              this.GetAllDashboardDataList[2].organization_credits;
          }
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllDashboardDataList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
