import { List_Emails } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllRFTs = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllRFTsList: [],
    };
  },
  methods: {
    async GetAllRFTsMethod(list_email_type) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Emails, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              list_email_type: list_email_type,
            },
          })
        );
        this.GetAllRFTsList = JSON.parse(result.data.List_Emails).data.items;
        this.overlay = false;
        return this.GetAllRFTsList;
      } catch (error) {
        this.overlay = false;
        this.GetAllRFTsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
