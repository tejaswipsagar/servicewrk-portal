import { List_Organizations_Settings } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllWipState = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllWIPStateList: [],
    };
  },
  methods: {
    async GetAllWipStateMethod(setting_status) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Organizations_Settings, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              setting_type: "WIP_SUB_STAGE",
              setting_status: setting_status,
            },
          })
        );
        this.GetAllWIPStateList = JSON.parse(
          result.data.List_Organizations_Settings
        ).data.items;
        if (
          this.$route.name == "ActiveTickets" ||
          this.$route.name == "ClosedTickets" || 
          this.$route.name == 'InactiveTickets'
        ) {
          this.GetAllWIPStateList.unshift({
            setting_name: "ALL",
            setting_id: "ALL",
          });
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllWIPStateList = [];
        this.noDataText = "No Data Found";
      }
    },
  },
};
