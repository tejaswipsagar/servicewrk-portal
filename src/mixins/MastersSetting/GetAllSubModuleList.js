import { API, graphqlOperation } from "aws-amplify";
import { ListModules } from "@/graphql/queries.js";
export const GetAllListSubModule = {
  data() {
    return {
      GetAllListRootModule: [],
    };
  },
  methods: {
    async getAllSubModuleListMethod(module_id) {
      try {
        var self = this;
        self.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListModules, {
            input: {
              user_email_id:
                this.$store.getters.get_current_user_details.user_email_id,
              module_id: module_id,
            },
          })
        );
        var ResultObj = JSON.parse(result.data.ListModules);
        self.overlay = false;
        return ResultObj.Status_Message;
      } catch (error) {
        self.overlay = false;
        self.GetAllListModule = [];
        console.log(error);
      }
    },
  },
};
