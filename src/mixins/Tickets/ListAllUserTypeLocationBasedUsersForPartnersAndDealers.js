import { ListLocationBasedPartnersorDealers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const ListAllUserTypeLocationBasedUsersForPartnersAndDealers = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      nongeo_territory_ids : [],
      GetAllUsrTypeLocationBasedUsersForPartnersAndDealers: [],
    };
  },
  methods: {
    async GetAllUerTypeLocationBasedUsersForPartnersAndDealers(
      ticket_latitude,
      ticket_longitude,
      service_id,
      user_id,
      required_user_type,
      nongeo_territory_ids,
      customer_pincode,
      is_reassign_ticket
    ) {
      try {
        this.overlay = true;
        var inputParams = {
          organization_id: this.$store.getters.get_current_user_details
            .organization_id,
          user_id: user_id,
          required_user_type: required_user_type,
          ticket_latitude: ticket_latitude,
          ticket_longitude: ticket_longitude,
          service_id: service_id,
          nongeo_territory_ids : nongeo_territory_ids,
          customer_pincode : customer_pincode,
          is_reassign_ticket: is_reassign_ticket
        };
        let result = await API.graphql(
          graphqlOperation(ListLocationBasedPartnersorDealers, {
            input: inputParams,
          })
        );
        this.GetAllUsrTypeLocationBasedUsersForPartnersAndDealers = JSON.parse(
          result.data.ListLocationBasedPartnersorDealers
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllUsrTypeLocationBasedUsersForPartnersAndDealers = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
