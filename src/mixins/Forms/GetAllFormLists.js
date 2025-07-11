import { ListForms } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllFormList = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllFormsList: [],
    };
  },
  methods: {
    async GetAllFormListMethod(email_status) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListForms, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              form_type: "PRODUCT_SALES",
              email_status: email_status,
            },
          })
        );
        this.GetAllFormsList = JSON.parse(result.data.ListForms).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllFormsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
