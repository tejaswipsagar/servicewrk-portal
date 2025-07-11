import { GetParticularSerialNumberDetails } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const listServiceInformation = {
  methods: {
    async listServiceInformationMethod(SERIAL_NUMBER, ORGZN_ID) {
      try {
        const result = await API.graphql(
          graphqlOperation(GetParticularSerialNumberDetails, {
            input: {
              serial_number: SERIAL_NUMBER,
              organization_id: ORGZN_ID,
            },
          })
        );
        console.log("SER_RESPONSE", result);
        const response = JSON.parse(
          result.data.GetParticularSerialNumberDetails
        ).data.items[0];
        return response;
      } catch (error) {
        console.log("Error", error);
      }
    },
  },
};
