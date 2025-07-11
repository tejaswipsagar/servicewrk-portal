import { ListPartnerTaggedTerritory } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetPartnerTaggedTerritory = {
  data() {
    return {
      overlay: false,
      noDataText_territory: "",
      GetPartnerTaggedTerritoryList: [],
    };
  },
  methods: {
    async GetPartnerTaggedTerritoryMethod(user_id) {
      try {
        this.overlay = true;
        this.loading = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: user_id,
        };
        let result = await API.graphql(
          graphqlOperation(ListPartnerTaggedTerritory, {
            input: inputParams,
          })
        );
        this.GetPartnerTaggedTerritoryList = JSON.parse(
          result.data.ListPartnerTaggedTerritory
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetPartnerTaggedTerritoryList = [];
        this.noDataText_territory = error.errors[0].message;
      }
    },
  },
};
