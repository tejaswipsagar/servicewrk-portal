import { List_All_Organizations_Service_Center } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllServiceCenter = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      isLoading: false,
      GetAllServiceCentersList: [],
    };
  },
  methods: {
    async GetAllServiceCentersMethod(service_center_status, territory_ids) {
      try {
        this.overlay = true;
        this.isLoading = true;
        let result = await API.graphql(
          graphqlOperation(List_All_Organizations_Service_Center, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              service_center_status: service_center_status,
              territory_ids: territory_ids,
            },
          })
        );
        this.GetAllServiceCentersList = JSON.parse(
          result.data.List_All_Organizations_Service_Center
        ).data.items;
        this.overlay = false;
        this.isLoading = false;
      } catch (error) {
        this.overlay = false;
        this.isLoading = false;
        this.GetAllServiceCentersList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
