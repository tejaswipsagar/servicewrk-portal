import { ListComponentQuotationPdf } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllQuotations = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllQuotationList: [],
      nextToken: "",
    };
  },
  methods: {
    async GetAllQuotationsMethod(
      quotation_status,
      from_date,
      to_date,
      NEXT_TOKEN
    ) {
      try {
        this.GetAllQuotationList = [];
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListComponentQuotationPdf, {
            input: {
              limit: 100,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              pdf_type: "QUOTATION",
              from_date: from_date,
              to_date: to_date,
              quotation_status: quotation_status,
              next_token: NEXT_TOKEN,
            },
          })
        );
        const response = JSON.parse(result.data.ListComponentQuotationPdf);
        this.GetAllQuotationList = response.data.items;
        console.log("this.GetAllQuotationList", this.GetAllQuotationList);
        if (response.data.next_token) {
          this.nextToken = response.data.next_token;
        } else {
          this.nextToken = undefined;
        }
        // console.log(
        //   "QUO_RES",
        //   JSON.parse(result.data.ListComponentQuotationPdf).data.next_token
        // );
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllQuotationList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
