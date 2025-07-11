import  { SearchComponent }  from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllComponentsBySearch = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllComponentsList: [],
    };
  },
  methods: {
    async GetAllComponentsBySearchMethod(
      status,
      field_value,
      field_name,
    ) {
      try {
        this.GetAllComponentsList = [];
        this.noDataText = "Please Wait Loading your Data..!";
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(SearchComponent, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              component_status: status,
              camparison_operator: "CONTAINS",
              field_name,
              field_value,
            },
          })
        );
        this.GetAllComponentsList = JSON.parse(
          result.data.SearchComponent
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllSearchComponentsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
