import { ListTransferProductFleet } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllAvailableProductFleetsFromTech = {
  data() {
    return {
      overlay: false,
      loading: false,
      noDataText: "",
      ListAllAvailableProductFleetsFromTechnician: [],
    };
  },
  methods: {
    async ListAllAvailableProductFleetsFromTechnicianMethod(representative_id) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListTransferProductFleet, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
                representative_id : representative_id
            },
          })
        );
        this.ListAllAvailableProductFleetsFromTechnician = JSON.parse(
          result.data.ListTransferProductFleet
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.ListAllAvailableProductFleetsFromTechnician = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
