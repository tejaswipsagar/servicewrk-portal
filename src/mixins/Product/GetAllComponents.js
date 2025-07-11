import { List_Components } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllComponents = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      ResultObj: [],
      GetAllComponentsList: [],
    };
  },
  methods: {
    async GetAllComponentsMethod(status, next_token) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(List_Components, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              component_status: status,
              next_token: next_token,
              limit: 51,
            },
          })
        );
        var ResultObj = JSON.parse(result.data.List_Components);
        if (ResultObj.status == "SUCCESS") {
          if (!this.next_token) {
            this.GetAllComponentsList = [];
            this.GetAllComponentsList = ResultObj.data.items;
            this.next_token = ResultObj.next_token;
            this.overlay = false;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.GetAllComponentsList.push({ ...ResultObj.data.items[i] });
            }
            this.next_token = ResultObj.next_token;
          }
          this.overlay = false;
        }
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllComponentsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
