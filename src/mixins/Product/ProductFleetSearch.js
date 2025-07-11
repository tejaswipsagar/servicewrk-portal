import { SearchCustomerAndSerialNo } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllSearchedSerialNumber = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      loading: false,
      GetAllListSerialNumbers: [],
    };
  },
  methods: {
    async searchcustomerandserialNoMethod(
      SettingStatus,
      field_value,
      field_name
    ) {
      try {
        this.GetAllListSerialNumbers = [];
        this.noDataText = "Please Wait Loading your Data..!";
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(SearchCustomerAndSerialNo, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              field_value: field_value,
              field_name: field_name,
              camparison_operator: "CONTAINS",
              setting_status: SettingStatus,
            },
          })
        );
        this.GetAllListSerialNumbers = JSON.parse(
          result.data.SearchCustomerAndSerialNo
        ).data.items;
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllListSerialNumbers = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
