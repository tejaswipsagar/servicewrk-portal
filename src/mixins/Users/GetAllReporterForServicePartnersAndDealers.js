import { ListReporters } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllReportersForPartnersAndDelearUsers = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      loading: false,
      GetAllReportersForServciePartnersAndDealersList: [],
    };
  },
  methods: {
    async GetAllReportersForPartnersAndDelearUsersMethod(partner_id) {
      try {
        this.overlay = true;
        this.loading = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          partner_id: partner_id,
        };
        let result = await API.graphql(
          graphqlOperation(ListReporters, {
            input: inputParams,
          })
        );
        this.GetAllReportersForServciePartnersAndDealersList = JSON.parse(
          result.data.ListReporters
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllReportersForServciePartnersAndDealersList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
