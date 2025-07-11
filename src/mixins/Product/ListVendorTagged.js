import { ListTagVendorsToProdcut } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllTaggedVendors = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllTaggedVendorsList: [],
    };
  },
  methods: {
    async GetAllTaggedVendorsMethod(CategoryId, ProductId) {
      try {
        this.overlay = true;
        this.TableLoading = true;
        let result = await API.graphql(
          graphqlOperation(ListTagVendorsToProdcut, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              category_id: CategoryId,
              product_id: ProductId,
            },
          })
        );
        this.GetAllServicesList = JSON.parse(
          result.data.ListTagVendorsToProdcut
        ).data.items;

        console.log("this.GetAllServicesList", this.GetAllServicesList);
        this.overlay = false;
        this.TableLoading = false;

        return this.GetAllServicesList;
      } catch (error) {
        this.overlay = false;
        this.TableLoading = false;
        this.GetAllServicesList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
