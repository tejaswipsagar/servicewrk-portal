import { ListProductFleetsInServiceCenter } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllAvailableProductFleet = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      AvailableFleetList: [],
    };
  },
  methods: {
    async GetAvailableFleetMethod(service_center_id) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListProductFleetsInServiceCenter, {
            input: {
              service_center_id : service_center_id,
            },
          })
        );
        this.AvailableFleetList = JSON.parse(
          result.data.ListProductFleetsInServiceCenter
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.AvailableFleetList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
