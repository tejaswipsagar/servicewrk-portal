import { ListProductFleetStatusType } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllProductFleetStatus = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllProductFleetStatusList: [],
    };
  },
  methods: {
    async GetAllProductFleetStatusMethod(status) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListProductFleetStatusType, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              setting_status: status,
            },
          })
        );
        this.GetAllProductFleetStatusList = JSON.parse(
          result.data.ListProductFleetStatusType
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllProductFleetStatusList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
