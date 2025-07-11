import { List_Users } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllUsers = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      loading : false,
      filteredItems: [],
      GetAllUsersList: [],
    };
  },
  methods: {
    async GetAllUsersMethod(user_type, user_status, partner_id) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(List_Users, {
            input: {
              organization_id: this.$store.getters.get_current_user_details.organization_id,
              user_type,
              user_status: this.$route.name == "Attendance" ? "ACTIVE" : user_status,
              partner_id,
            },
          })
        );
        this.GetAllUsersList = JSON.parse(result.data.List_Users).data.items;
        this.filteredItems = this.GetAllUsersList
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllUsersList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
