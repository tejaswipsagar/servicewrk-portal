import { ListMasterCategories } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllMasterCategories = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllMasterCategoriesList: [],
      GetAllMasterCategoriesListFilter: [],
    };
  },
  methods: {
    async GetAllMasterCategoriesMethod() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListMasterCategories, {
            input: {},
          })
        );
        this.GetAllMasterCategoriesList = JSON.parse(
          result.data.ListMasterCategories
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllMasterCategoriesList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
