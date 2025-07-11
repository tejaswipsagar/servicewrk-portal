import { ListTerritoryTypes } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllTerritoryCategories = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllTerritoryCategoryList: [],
    };
  },
  methods: {
    async GetAllTerritoryCategoryMethod(master_status) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListTerritoryTypes, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              territory_status: master_status,
            },
          })
        );
        this.GetAllTerritoryCategoryList = JSON.parse(
          result.data.ListTerritoryTypes
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllTerritoryCategoryList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
