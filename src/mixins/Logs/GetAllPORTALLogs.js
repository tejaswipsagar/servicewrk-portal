import { List_Logs } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllPORTALLogs = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllPORTALLogs: [],
      GetAllPORTALLogsFilter: [],
    };
  },
  methods: {
    async GetAllPORTALLogsMethod() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Logs, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              limit: 100,
            },
          })
        );
        this.GetAllPORTALLogs = JSON.parse(result.data.List_Logs).data.items;
        this.GetAllPORTALLogsFilter = JSON.parse(
          result.data.List_Logs
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllPORTALLogs = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
