import { List_Organizations_Settings } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllDesignations = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      RouterList: [],
      GetAllDesignationsList: [],
    };
  },
  methods: {
    async GetAllDesignationsMethod(status) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Organizations_Settings, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              setting_type: "DESIGNATION",
              setting_status: status,
            },
          })
        );
        this.GetAllDesignationsList = JSON.parse(
          result.data.List_Organizations_Settings
        ).data.items;
        for (let i = 0; i < this.GetAllDesignationsList.length; i++) {
          this.GetAllDesignationsList[i].status =
            this.GetAllDesignationsList[i].service_type_status;
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllDesignationsList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
