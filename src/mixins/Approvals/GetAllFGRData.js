import { ListFGR } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";

export const listFgrData = {
  methods: {
    async listFgrDataMethod(FGR_STATUS, Claimed_Status) {
      try {
        this.overlay = true;
        const result = await API.graphql(
          graphqlOperation(ListFGR, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              fgr_status: FGR_STATUS,
              fgr_claim_status:
                FGR_STATUS != "APPROVED"
                  ? undefined
                  : Claimed_Status == "ALL"
                  ? undefined
                  : Claimed_Status,
            },
          })
        );
        const response = JSON.parse(result.data.ListFGR).data.items;
        console.log("FGR", response);
        this.overlay = false;
        return response;
      } catch (error) {
        this.fgrDataItems = [];
        this.overlay = false;
        //
      }
    },
  },
};
