import { ListCustomerTaggedRepresentative } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllCustomerBySearchTech = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllSearchCustomerList: [],
    };
  },
  methods: {
    async GetAllCustomerBySearchTechMethod(representative_id, customer_type) {
      try {
        this.GetAllSearchCustomerList = [];
        this.noDataText = "Please Wait Loading your Data..!";
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListCustomerTaggedRepresentative, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              representative_id: representative_id,
              customer_status: "ACTIVE",
              customer_type: customer_type,
            },
          })
        );
        this.GetAllSearchCustomerList = JSON.parse(
          result.data.ListCustomerTaggedRepresentative
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllSearchCustomerList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
