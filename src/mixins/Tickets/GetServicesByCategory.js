import { List_Services_By_Category } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetServicesByCategory = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetServiceByCategoriesList: [],
    };
  },
  methods: {
    async GetServicesByCategoriesMethod(category_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Services_By_Category, {
            input: {
              category_id: category_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
            },
          })
        );
        this.GetServiceByCategoriesList = JSON.parse(
          result.data.List_Services_By_Category
        ).data.items;
        console.log(
          this.GetServiceByCategoriesList,
          "GetServiceByCategoriesList"
        );
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetServiceByCategoriesList = [];
        this.noDataText = error.errors[0].message;
        return;
      }
    },
  },
};
