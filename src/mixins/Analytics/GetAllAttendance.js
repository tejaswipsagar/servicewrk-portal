import {
  listAttendanceHistory,
  ListDealersRepOrAgentAttendance,
} from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
var moment = require("moment");
export const GetAllAttendance = {
  data() {
    return {
      noDataText: "",
      moment: null,
      GetAttendanceList: [],
      GetAttendanceList1: [],
    };
  },
  mounted() {
    this.moment = moment;
  },
  methods: {
    async GetAttendanceMethod(
      attendance_status,
      from_date,
      to_date,
      user_id,
      selectedUserType,
      selectedUserID
    ) {
      const queryName =
        this.$store.getters.get_user_type === "DEALER_OWNER" ||
        this.$store.getters.get_user_type === "DEALER_AGENT"
          ? ListDealersRepOrAgentAttendance
          : listAttendanceHistory;
      const queryNameString =
        this.$store.getters.get_user_type === "DEALER_OWNER" ||
        this.$store.getters.get_user_type === "DEALER_AGENT"
          ? "ListDealersRepOrAgentAttendance"
          : "listAttendanceHistory";
      try {
        this.overlay = true;
        this.loading = true;
        await API.graphql(
          graphqlOperation(queryName, {
            input: {
              attendance_status:
                attendance_status == "ALL" ? undefined : attendance_status,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id:
                this.$store.getters.get_user_type === "DEALER_OWNER" ||
                this.$store.getters.get_user_type === "DEALER_AGENT"
                  ? this.$store.getters.get_current_user_details.user_id
                  : user_id,
              // user_id: user_id
              //   ? user_id
              //   : this.$store.getters.get_user_type === "DEALER_OWNER" ||
              //     this.$store.getters.get_user_type === "DEALER_AGENT"
              //   ? this.$store.getters.get_current_user_details.user_id
              //   : undefined,
              from_date: from_date,
              to_date: to_date,
              user_type:
                queryNameString === "ListDealersRepOrAgentAttendance"
                  ? selectedUserType
                  : undefined,
              requested_user_id:
                queryNameString === "ListDealersRepOrAgentAttendance"
                  ? selectedUserID === "ALL"
                    ? undefined
                    : selectedUserID
                  : undefined,
            },
          })
        ).then((result) => {
          this.GetAttendanceList1 = JSON.parse(result.data[queryNameString]);
          this.GetAttendanceList = this.GetAttendanceList1.data.items;
          this.filteredItems_attendance = this.GetAttendanceList;
        });
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAttendanceList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
