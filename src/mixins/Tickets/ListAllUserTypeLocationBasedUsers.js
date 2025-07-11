import { List_UserType_And_Location_Based_Users } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const ListAllUserTypeLocationBasedUsers = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      technician_availability: false,
      nongeo_territory_ids: [],
      GetAllUsrTypeLocationBasedUsers: [],
      GetAllLocationBasedServiceCenterList: [],
    };
  },
  methods: {
    async GetAllUerTypeLocationBasedUsers(
      ticket_latitude,
      ticket_longitude,
      service_id,
      user_id,
      required_user_type,
      nongeo_territory_ids
    ) {
      try {
        this.overlay = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: user_id,
          required_user_type: required_user_type,
          ticket_latitude: ticket_latitude,
          ticket_longitude: ticket_longitude,
          service_id: service_id,
          nongeo_territory_ids: nongeo_territory_ids,
        };
        let result = await API.graphql(
          graphqlOperation(List_UserType_And_Location_Based_Users, {
            input: inputParams,
          })
        );
        this.technician_availability = JSON.parse(
          result.data.List_UserType_And_Location_Based_Users
        ).technician_availability;
        this.GetAllUsrTypeLocationBasedUsers = JSON.parse(
          result.data.List_UserType_And_Location_Based_Users
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllUsrTypeLocationBasedUsers = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
