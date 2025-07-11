import { ListAllActiveCategories } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllActiveCategories = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllActiveCategoriesList: [],
    };
  },
  methods: {
    async GetAllActiveCategoriesMethod(master_category_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListAllActiveCategories, {
            input: {
              master_category_id: master_category_id,
            },
          })
        );
        this.GetAllActiveCategoriesList = JSON.parse(
          result.data.ListAllActiveCategories
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllActiveCategoriesList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
