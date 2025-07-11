import { ListComponentBasedServiceCenters } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetStoreNamesAndCompCount = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      availableCompCountAtRep: "",
      GetStoreNamesAndCompCountList: [],
    };
  },
  methods: {
    async GetStoreNamesAndCompCountMethod(component_id, representative_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListComponentBasedServiceCenters, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              service_center_status: "ACTIVE",
              component_id: component_id,
              representative_id: representative_id,
            },
          })
        );
        this.GetStoreNamesAndCompCountList = JSON.parse(
          result.data.ListComponentBasedServiceCenters
        ).data.items;
        this.overlay = false;
        return (this.availableCompCountAtRep =
          this.GetStoreNamesAndCompCountList[0].components_in_stock);
      } catch (error) {
        this.overlay = false;
        this.availableCompCountAtRep = 0;
        this.GetStoreNamesAndCompCountList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
