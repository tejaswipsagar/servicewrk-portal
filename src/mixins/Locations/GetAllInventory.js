import { ListComponentsInventory } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllInventory = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllInventoryList: [],
    };
  },
  methods: {
    async GetAllComponentsMethod(next_token, required_user_type) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListComponentsInventory, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              next_token: next_token,
              limit: 100,
              required_user_type: required_user_type,
            },
          })
        );
        const response = JSON.parse(result.data.ListComponentsInventory);
        this.GetAllInventoryList = response.data.Items;
        this.next_token = response.data.next_token;
        // if (!next_token) {
        //   this.GetAllInventoryList = JSON.parse(
        //     result.data.ListComponentsInventory
        //   ).data.Items;
        //   this.next_token = JSON.parse(
        //     result.data.ListComponentsInventory
        //   ).data.next_token;
        // } else {
        //   let TestArray = JSON.parse(result.data.ListComponentsInventory).data
        //     .Items;
        //   for (
        //     let i = 0;
        //     i <
        //     JSON.parse(result.data.ListComponentsInventory).data.Items.length;
        //     i++
        //   ) {
        //     this.GetAllInventoryList.push({
        //       ...JSON.parse(result.data.ListComponentsInventory).data.Items[i],
        //     });
        //   }
        //   this.next_token = JSON.parse(
        //     result.data.ListComponentsInventory
        //   ).data.next_token;
        // }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllInventoryList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
