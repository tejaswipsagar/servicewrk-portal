import { GetParticularQuotationDetails } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const GetParticularQuotData = {
  data: () => ({}),
  methods: {
    async GetParticularQuotDataMethod(QUOTATION_ID) {
      try {
        const result = await API.graphql(
          graphqlOperation(GetParticularQuotationDetails, {
            input: {
              quotation_id: QUOTATION_ID,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
            },
          })
        );
        const response = JSON.parse(result.data.GetParticularQuotationDetails)
          .data.items;

        return response[0];
      } catch (error) {
        console.log("Error", error);
      }
    },
  },
};
