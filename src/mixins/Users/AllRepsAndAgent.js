import { API, graphqlOperation } from "aws-amplify";
import { GetAllPartnerRepsAndDealerRepsInOrganization } from "@/graphql/queries.js";
export const AllPartnerRepsAndAgents = {
  data: () => ({
    overlay: false,
    loading: false,
    noDataText: "",
    next_token: "",
    AllPartnerRepsAndAgentsList: [],
  }),
  methods: {
    async AllPartnerRepsAndAgentsMethod(user_type, user_status, next_token) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(GetAllPartnerRepsAndDealerRepsInOrganization, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              user_type: user_type,
              user_status: user_status,
              next_token: next_token,
              limit: 51,
            },
          })
        );
        var ResultObj = JSON.parse(
          result.data.GetAllPartnerRepsAndDealerRepsInOrganization
        );
        if (ResultObj.status === "SUCCESS") {
          if (!this.next_token) {
            this.AllPartnerRepsAndAgentsList = [];
            this.AllPartnerRepsAndAgentsList = ResultObj.Data.items;
            this.next_token = ResultObj.next_token;
            this.overlay = false;
          } else {
            for (let i = 0; i < ResultObj.Data.items.length; i++) {
              this.AllPartnerRepsAndAgentsList.push({
                ...ResultObj.Data.items[i],
              });
            }
            this.next_token = ResultObj.next_token;
          }
          this.serial_numbers_data = ResultObj.serial_numbers_data;
          this.overlay = false;
          this.loading = false;
        }
      } catch (error) {
        this.AllPartnerRepsAndAgentsList = [];
        this.overlay = false;
        this.loading = false;
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
