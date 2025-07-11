import { ListComponentsForTicket } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllComponentsByProduct = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllComponentsByProductList: [],
    };
  },
  methods: {
    async GetAllComponentsByServiceIDMethod(service_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListComponentsForTicket, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              service_id: service_id,
            },
          })
        );
        this.GetAllComponentsByProductList = JSON.parse(
          result.data.ListComponentsForTicket
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllComponentsByProductList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
