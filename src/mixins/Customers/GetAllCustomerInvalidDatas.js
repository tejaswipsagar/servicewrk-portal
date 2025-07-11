import { ListAllInvalidCustomers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllInvalidCustomers = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      ResultObj: [],
      GetAllCustomerInvalidList: [],
    };
  },
  methods: {
    async GetAllInvalidCustomersMethod(next_token) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListAllInvalidCustomers, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              next_token : next_token,
              limit : 51,
            },
          })
        );
        var ResultObj = JSON.parse(
          result.data.ListAllInvalidCustomers
        );
        if(ResultObj.status == 'SUCCESS') {
          if(!this.next_token) {
            this.GetAllCustomerInvalidList = [];
            this.GetAllCustomerInvalidList = ResultObj.data.items;
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.GetAllCustomerInvalidList.push({...ResultObj.data.items[i]})
            }
            this.next_token = ResultObj.data.next_token;
          }
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllUsersList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
