import { GetSerialNumberDetails } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const getParticularProdFleetData = {
  methods: {
    async getParticularProdFleetDataMethod(settingId) {
      try {
        const result = await API.graphql(
          graphqlOperation(GetSerialNumberDetails, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              setting_id: settingId,
            },
          })
        );

        const response = JSON.parse(result.data.GetSerialNumberDetails).data
          .items;
        console.log("RESPONSE_PRO_FLEET", response);
        return response;
      } catch (error) {
        //
      }
    },
  },
};
