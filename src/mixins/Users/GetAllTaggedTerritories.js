import { ListItemsByModuleIds } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllTaggedTerritories = {
  data() {
    return {
      loading: false,
      overlay: false,
      noDataText: "",
      GetAllTaggedTerritoriesList: [],
    };
  },
  methods: {
    async GetAllTaggedTerritoriesMethod(territory_ids) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListItemsByModuleIds, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              module_name: "TERRITORIES",
              user_id: this.$store.getters.get_current_user_details.user_id,
              territory_ids: territory_ids,
            },
          })
        );
        this.GetAllTaggedTerritoriesList = JSON.parse(
          result.data.ListItemsByModuleIds
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllTaggedTerritoriesList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
