import { GetAllMyOrganizations } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllMyOrganizationsNew = {
  data() {
    return {
      GetAllMyOrganization: [],
      overlay: false,
      noDataText: "",
    };
  },
  methods: {
    async GetAllMyOrganizationMethod() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(GetAllMyOrganizations, {
            input: {
              user_email_id:
                this.$store.getters.get_current_user_details.user_email_id,
            },
          })
        );
        this.GetAllMyOrganization = JSON.parse(
          result.data.GetAllMyOrganizations
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllOrganization = [];
      }
    },
  },
};
