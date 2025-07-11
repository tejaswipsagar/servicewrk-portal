import { List_Representatives } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllServiceRepresentative = {
  data() {
    return {
      overlay: false,
      loading: false,
      noDataTextReps: "",
      filteredItems: [],
      GetAllServiceRepresentativeList: [],
    };
  },
  methods: {
    async GetAllServiceRepresentativeMethod(user_status) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(List_Representatives, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_status: user_status,
            },
          })
        );
        this.GetAllServiceRepresentativeList = JSON.parse(
          result.data.List_Representatives
        ).data.Items;
        this.filteredItems = this.GetAllServiceRepresentativeList;
        if (
          this.$route.name == "ActiveTickets" ||
          this.$route.name == "ClosedTickets" ||
          this.$route.name == "MonthlyUserReport" ||
          this.$route.name == "ProductivityReport" ||
          this.$route.name == "TicketAgingReport" ||
          this.$route.name == "AttendenceReport" ||
          this.$route.name == "ProductFleet" ||
          this.$route.name == "InactiveTickets"
        ) {
          this.GetAllServiceRepresentativeList.unshift({
            user_name: "ALL",
            user_id: "ALL",
          });
        }
        setTimeout(() => {
          this.overlay = false;
          this.loading = false;
        }, 500);
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllServiceRepresentativeList = [];
        this.noDataTextReps = error.errors[0].message;
      }
    },
  },
};
