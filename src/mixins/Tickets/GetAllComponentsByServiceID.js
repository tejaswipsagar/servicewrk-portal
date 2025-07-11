import { List_Service_Based_Components } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllComponentsByServiceID = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllComponentsByServiceIDList: [],
    };
  },
  methods: {
    async GetAllComponentsByServiceIDMethod(service_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Service_Based_Components, {
            input: {
              service_id: service_id,
            },
          })
        );
        this.GetAllComponentsByServiceIDList = JSON.parse(
          result.data.List_Service_Based_Components
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllComponentsByServiceIDList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
