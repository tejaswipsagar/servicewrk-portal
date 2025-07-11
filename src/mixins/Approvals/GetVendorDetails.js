import { GetProductOrComponentBasedVendors } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const ListAllVendorDetails = {
  data() {
    return {};
  },
  methods: {
    async ListAllVendorDetailsMethod(
      CATEGORY_ID,
      PRODUCT_ID,
      COMPONENT_ID,
      WORKFLOW_PINCODE,
      TERRITORY_ID
    ) {
      try {
        this.overlay = true;
        this.TerriLoading = true;
        let result = await API.graphql(
          graphqlOperation(GetProductOrComponentBasedVendors, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              category_id: CATEGORY_ID || undefined,
              product_id: PRODUCT_ID || undefined,
              component_id: COMPONENT_ID,
              workflow_pincode: WORKFLOW_PINCODE || undefined,
              territory_ids: TERRITORY_ID,
            },
          })
        );
        console.log(
          "VENDORS_DETAILS",
          JSON.parse(result.data.GetProductOrComponentBasedVendors).data.items
        );
        let response = JSON.parse(result.data.GetProductOrComponentBasedVendors)
          .data.items;
        this.overlay = false;
        this.TerriLoading = false;
        this.tableLoading = false;
        return response;
      } catch (error) {
        this.overlay = false;
        this.TerriLoading = false;
        this.NoDataText = error.errors[0].message;
        console.log("Error", error);
        this.tableLoading = false;
      }
    },
  },
};
