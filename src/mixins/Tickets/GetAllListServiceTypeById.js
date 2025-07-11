import { List_Service_Based_ServiceTypes } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllServiceTypeBasedOnServiceID = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllServiceTypeByServiceIDList: [],
    };
  },
  methods: {
    async GetAllServiceTypeByServiceIDMethod(service_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Service_Based_ServiceTypes, {
            input: {
              service_id: service_id,
            },
          })
        );
        this.overlay = false;
        this.GetAllServiceTypeByServiceIDList = JSON.parse(
          result.data.List_Service_Based_ServiceTypes
        );
        return JSON.parse(result.data.List_Service_Based_ServiceTypes);
      } catch (error) {
        this.overlay = false;
        this.GetAllServiceTypeByServiceIDList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
