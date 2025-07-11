import { List_Location_Based_Representatives } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllLocationBasedRepresentatives = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      creditsObject: {},
      SnackBarComponent: {},
      organizationObject: {},
      representativeObject: {},
      GetAllLocationBasedServiceCenterList: [],
      GetAllLocationBasedRepresentativesList: [],
    };
  },
  methods: {
    async GetAllLocationBasedRepresentativesMethod(
      ticket_latitude,
      ticket_longitude,
      service_id
    ) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(List_Location_Based_Representatives, {
            input: {
              organization_id: this.$store.getters.get_current_user_details
                .organization_id,
              ticket_latitude: ticket_latitude,
              ticket_longitude: ticket_longitude,
              service_id: service_id,
            },
          })
        );
        this.technician_availability = JSON.parse(
          result.data.List_UserType_And_Location_Based_Users
        ).technician_availability;
        if (this.technician_availability == true) {
          this.GetAllLocationBasedRepresentativesList = JSON.parse(
            result.data.List_Location_Based_Representatives
          ).data.items;
        } else {
          this.GetAllLocationBasedServiceCenterList = JSON.parse(
            result.data.List_Location_Based_Representatives
          ).data.items;
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllLocationBasedRepresentativesList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
