import { ListAllInvalidNumbers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllInvalidSerialNumbers = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      ResultObj: [],
      GetAllInvalidSerialNumberList: [],
    };
  },
  methods: {
    async GetAllInvalidSerialNumbersMethod(next_token, invalid_at) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListAllInvalidNumbers, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              next_token: next_token,
              limit: 51,
              invalid_at: invalid_at,
            },
          })
        );
        var ResultObj = JSON.parse(result.data.ListAllInvalidNumbers);
        if (ResultObj.status == "SUCCESS") {
          if (!this.next_token) {
            this.GetAllInvalidSerialNumberList = [];
            this.GetAllInvalidSerialNumberList = ResultObj.data.items;
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.GetAllInvalidSerialNumberList.push({
                ...ResultObj.data.items[i],
              });
            }
            this.next_token = ResultObj.data.next_token;
          }
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllUsersList = [];
        this.noDataText = error.errors[0].message;
        this.GetAllInvalidSerialNumberList = [];
      }
    },
  },
};
