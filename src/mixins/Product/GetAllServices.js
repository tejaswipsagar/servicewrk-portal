import { List_Services } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllServices = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllServicesList: [],
    };
  },
  methods: {
    async GetAllServicesMethod(service_enable_type, service_status) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Services, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              service_enable_type: service_enable_type,
              service_status:
                service_status == undefined ? "ACTIVE" : service_status,
            },
          })
        );
        this.GetAllServicesList = result.data.List_Services.data.items;
        if (
          this.$route.name == "ActiveTickets" ||
          this.$route.name == "ClosedTickets" ||
          this.$route.name == "ProductFleet"
        ) {
          this.GetAllServicesList.unshift({
            service_name: "ALL",
            service_id: "ALL",
          });
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllServicesList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
