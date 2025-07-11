import { ListTerritoriesAndPincodes } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllTerritories = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllTerritoriesList: [],
    };
  },
  methods: {
    async GetAllTerritoriesMethod(
      territory_status,
      territory_type,
      territory_pincode,
      required_type,
      territory_id,
      Pincode_Type
    ) {
      try {
        this.overlay = true;

        let result = await API.graphql(
          graphqlOperation(ListTerritoriesAndPincodes, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              territory_status:
                territory_status == undefined ? "ACTIVE" : territory_status,
              territory_type:
                territory_type == "ALL" ? undefined : territory_type,
              territory_pincode: territory_pincode,
              required_type: required_type,
              territory_id: territory_id,
              pincode_type_id:
                required_type == "TERRITORY"
                  ? undefined
                  : Pincode_Type && Pincode_Type != "ALL"
                  ? Pincode_Type.pincode_id
                  : undefined,
            },
          })
        );
        this.GetAllTerritoriesList = JSON.parse(
          result.data.ListTerritoriesAndPincodes
        ).data.Items;
        this.overAllTerritoryDetails = JSON.parse(
          result.data.ListTerritoriesAndPincodes
        ).overAllTerritoryDetails;

        if (this.$route.name == "DealersView") {
          this.GetAllTerritoriesList.unshift({
            territory_name: "ALL",
            territory_id: "ALL",
          });
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllTerritoriesList = [];
        console.log("error", error);
        // this.noDataText = error.errors[0].message;
      }
    },
  },
};
