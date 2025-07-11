import { List_Service_Type } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllServiceTypes = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllServiceTypeList: [],
    };
  },
  methods: {
    async GetAllServiceTypeMethod(setting_status) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Service_Type, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              service_type_status: setting_status,
            },
          })
        );
        this.GetAllServiceTypeList = JSON.parse(
          result.data.List_Service_Type
        ).data.items;
        for (let i = 0; i < this.GetAllServiceTypeList.length; i++) {
          this.GetAllServiceTypeList[i].status =
            this.GetAllServiceTypeList[i].service_type_status;
        }
        if (
          this.$route.name == "ActiveTickets" ||
          this.$route.name == "ClosedTickets" ||
          this.$route.name == "ProductivityReport" || 
          this.$route.name == 'InactiveTickets'
        ) {
          this.GetAllServiceTypeList.unshift({
            service_type_name: "ALL",
            service_type_id: "ALL",
          });
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllServiceTypeList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
