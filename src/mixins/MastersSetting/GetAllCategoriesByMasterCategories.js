import { List_Categories_By_Selected_Master_Category } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllCategoriesByMasterCategories = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetCategoriesByMasterCategoryList: [],
    };
  },
  methods: {
    async GetCategoriesByMasterCategoryMethod(master_category_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Categories_By_Selected_Master_Category, {
            input: {
              master_category_id: master_category_id,
            },
          })
        );
        this.GetCategoriesByMasterCategoryList =
          result.data.List_Categories_By_Selected_Master_Category.data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetCategoriesByMasterCategoryList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
