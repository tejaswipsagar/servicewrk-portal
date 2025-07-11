import { ListPartnerUsers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllPartnerAndReps = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      GetAllPartnerAndPartnerRepsList: [],
    };
  },
  methods: {
    async GetAllPartnerAndRepsMethod(user_type, user_status, partner_id) {
      try {
        this.overlay = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_type: user_type,
          user_id: this.$store.getters.get_current_user_details.user_id,
          user_status: user_status == undefined ? undefined : user_status,
          partner_id: partner_id ? partner_id : undefined,
        };
        let result = await API.graphql(
          graphqlOperation(ListPartnerUsers, {
            input: inputParams,
          })
        );
        return JSON.parse(
          result.data.ListPartnerUsers
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllPartnerAndPartnerRepsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
