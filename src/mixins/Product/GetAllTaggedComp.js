import { ListTaggedComponentsOfServices } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllTaggedComp = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllTagCompList: [],
      GetAllTagCompList1: [],
    };
  },
  methods: {
    async GetAllTagCompMethod(service_id) {
      try {
        console.log("NOW_CHECK_FOR_PROD_DATA");
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListTaggedComponentsOfServices, {
            input: {
              service_id: service_id,
            },
          })
        );
        this.GetAllTagCompList1 = JSON.parse(
          result.data.ListTaggedComponentsOfServices
        );
        this.GetAllTagCompList = this.GetAllTagCompList1.data.items;
        this.overlay = false;
        this.loading = false;
        return this.GetAllTagCompList;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllTagCompList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
