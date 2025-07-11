import { ListAdditionalParts } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllAdditionalParts = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllAdditionalPartsList: [],
    };
  },
  methods: {
    async GetAllAdditionalPartsMethod(master_status) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListAdditionalParts, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              part_status: master_status,
            },
          })
        );
        this.GetAllAdditionalPartsList = JSON.parse(
          result.data.ListAdditionalParts
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllAdditionalPartsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
