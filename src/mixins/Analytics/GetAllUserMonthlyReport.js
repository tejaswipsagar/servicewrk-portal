import { ListUserMonthlyReport } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllUserMonthlyReport = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      loading: false,
      newArrayForExcelData: [],
      GetAllUserMonthlyReportList: [],
    };
  },
  methods: {
    async GetAllUserMonthlyReportMethod(user_id, report_month) {
      try {
        this.overlay = true;
        this.loading = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id,
          report_month,
        };
        let result = await API.graphql(
          graphqlOperation(ListUserMonthlyReport, {
            input: inputParams,
          })
        );
        this.GetAllUserMonthlyReportList = JSON.parse(
          result.data.ListUserMonthlyReport
        ).data.items;
        this.newArrayForExcelData = [];
        for (let i = 0; i < this.GetAllUserMonthlyReportList.length; i++) {
          let visitDetails = this.GetAllUserMonthlyReportList[i].visit_details;
          if (visitDetails != undefined && visitDetails.length != 0) {
            for (let k = 0; k < visitDetails.length; k++) {
              let newObj = {
                user_name:
                  k == 0 ? this.GetAllUserMonthlyReportList[i].user_name : "",
                user_type:
                  k == 0 ? this.GetAllUserMonthlyReportList[i].user_type : "",
                report_date:
                  k == 0 ? this.GetAllUserMonthlyReportList[i].report_date : "",
                total_distance_travelled:
                  k == 0
                    ? this.GetAllUserMonthlyReportList[i]
                        .total_distance_travelled
                    : "",
                visit_details_length:
                  k == 0
                    ? this.GetAllUserMonthlyReportList[i].visit_details.length
                    : "",
                ticket_id:
                  visitDetails[k].custom_ticket_id != undefined &&
                  visitDetails[k].custom_ticket_id != "-"
                    ? visitDetails[k].custom_ticket_id
                    : visitDetails[k].ticket_id,
                category_name: visitDetails[k].category_name,
                service_name: visitDetails[k].service_name,
                service_serial_number: visitDetails[k].service_serial_number,
                customer_company_name: visitDetails[k].customer_company_name,
                customer_name: visitDetails[k].customer_name,
              };
              this.newArrayForExcelData.push(newObj);
            }
          } else {
            let newObj2 = {
              user_name: this.GetAllUserMonthlyReportList[i].user_name,
              user_type: this.GetAllUserMonthlyReportList[i].user_type,
              report_date: this.GetAllUserMonthlyReportList[i].report_date,
              total_distance_travelled:
                this.GetAllUserMonthlyReportList[i].total_distance_travelled,
              visit_details_length: 0,
            };
            this.newArrayForExcelData.push(newObj2);
          }
        }
        this.overlay = false;
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.GetAllUserMonthlyReportList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
