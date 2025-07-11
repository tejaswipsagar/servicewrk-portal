import { ListInvaliedUser } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllInvalidUsers = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      loading : false,
      GetAllInvalidUsersList: [],
    };
  },
  methods: {
    async GetAllInvalidUsersMethod(user_type) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListInvaliedUser, {
            input: {
              organization_id: this.$store.getters.get_current_user_details.organization_id,
              user_type,
            },
          })
        );
        this.GetAllInvalidUsersList = JSON.parse(result.data.ListInvaliedUser).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllInvalidUsersList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
