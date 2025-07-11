import { ListRepresentativeComponents } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllAvailableComponentsFromTech = {
  data() {
    return {
      overlay: false,
      loading: false,
      noDataText: "",
      ListAllAvailableComponentsFromTechnician: [],
    };
  },
  methods: {
    async ListAllAvailableComponentsFromTechnicianMethod(representative_id) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListRepresentativeComponents, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              representative_id : representative_id
            },
          })
        );
        this.ListAllAvailableComponentsFromTechnician = JSON.parse(
          result.data.ListRepresentativeComponents
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.ListAllAvailableComponentsFromTechnician = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
