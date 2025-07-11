import { List_Organizations_Settings } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllCustomerCategory = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllCustomerCategoryList: [],
    };
  },
  methods: {
    async GetAllCustomerCategoryMethod(setting_status) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Organizations_Settings, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              setting_type: "CUSTOMER_CATEGORY",
              setting_status: setting_status,
            },
          })
        );
        this.GetAllCustomerCategoryList = JSON.parse(
          result.data.List_Organizations_Settings
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllCustomerCategoryList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
