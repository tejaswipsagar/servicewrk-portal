import { ListModules } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllModuleList = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllModuleList: [],
    };
  },
  methods: {
    async getAllModuleListMethod() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListModules, {
            input: {
              user_email_id: this.$store.getters.get_user_email,
            },
          })
        );
        var ResultObj = JSON.parse(result.data.ListModules).Status_Message;
        return ResultObj;
      } catch (error) {
        this.overlay = false;
        this.GetAllModuleList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
