import { ListAvailableComponentsInServiceCenter } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllAvailableCompLoc = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      AvailableCompLocList: [],
    };
  },
  methods: {
    async GetAvailableCompLocMethod(service_center_id) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListAvailableComponentsInServiceCenter, {
            input: {
              service_center_id: service_center_id,
            },
          })
        );
        this.AvailableCompLocList = JSON.parse(
          result.data.ListAvailableComponentsInServiceCenter
        ).data.Items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.AvailableCompLocList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
