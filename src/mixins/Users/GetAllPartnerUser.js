import { ListPartnerUsers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllPartnerUser = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      loading_service_partners: false,
      GetAllPartnerAndPartnerUserList: [],
    };
  },
  methods: {
    async GetAllPartnerUserMethod(user_type, user_status, partner_id) {
      try {
        this.overlay = true;
        this.loading_service_partners = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_type: user_type,
          user_id: this.$store.getters.get_current_user_details.user_id,
          user_status: user_status == undefined ? undefined : user_status,
          partner_id: partner_id ? partner_id : undefined,
        };
        let result = await API.graphql(
          graphqlOperation(ListPartnerUsers, {
            input: inputParams,
          })
        );
        this.GetAllPartnerAndPartnerUserList = JSON.parse(
          result.data.ListPartnerUsers
        ).data.items;
        if (
          this.$route.name == "ActiveTickets" ||
          this.$route.name == "ClosedTickets" ||
          this.$route.name == "AttendenceReport"
        ) {
          this.GetAllPartnerAndPartnerUserList.unshift({
            user_name: "ALL",
            user_id: "ALL",
            partner_id: "ALL",
          });
        }
        this.overlay = false;
        this.loading_service_partners = false;
      } catch (error) {
        this.overlay = false;
        this.loading_service_partners = false;
        this.GetAllPartnerAndPartnerUserList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
