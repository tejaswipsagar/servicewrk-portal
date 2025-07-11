import { List_Organizations_Settings } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllClouserRemarks = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllClosureRemarksList: [],
    };
  },
  methods: {
    async GetAllClosureRemarksMethod(setting_status) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Organizations_Settings, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              setting_type: "CLOSE_REMARKS",
              setting_status: setting_status,
            },
          })
        );
        this.GetAllClosureRemarksList = JSON.parse(
          result.data.List_Organizations_Settings
        ).data.items;
        if (
          this.$route.name == "ActiveTickets" ||
          this.$route.name == "ClosedTickets" || 
          this.$route.name == 'InactiveTickets'
        ) {
          this.GetAllClosureRemarksList.unshift({
            service_type_name: "ALL",
            setting_name: "ALL",
          });
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllClosureRemarksList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
