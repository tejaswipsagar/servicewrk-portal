import { ListExcelGeneratesOfOrganizationTickets } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllMonthlyTickets = {
  data() {
    return {
      overlay: false,
      loading: false,
      noDataText: "",
      GetAllCustomTicketReport: [],
      GetAllMonthlyTicketsList: [],
      GetAllMonthlyTicketsReport: [],
      GetAllCurrentDayTicketReport: [],
    };
  },
  methods: {
    async GetAllMonthlyTicketsMethod(
      list_type,
      C1_required,
      C2_required,
      required_both
    ) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListExcelGeneratesOfOrganizationTickets, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              list_type: list_type,
              C1_required: C1_required,
              C2_required: C2_required,
              required_both: required_both,
            },
          })
        );
        this.GetAllMonthlyTicketsList = JSON.parse(
          result.data.ListExcelGeneratesOfOrganizationTickets
        ).items;
        this.overlay = false;
        this.loading = false;
        this.GetAllCustomTicketReport = this.GetAllMonthlyTicketsList[0].CUSTOM;
        this.GetAllMonthlyTicketsReport =
          this.GetAllMonthlyTicketsList[0].MONTHLY;
        this.GetAllCurrentDayTicketReport =
          this.GetAllMonthlyTicketsList[0].CURRENT_DAY;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllMonthlyTicketsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
