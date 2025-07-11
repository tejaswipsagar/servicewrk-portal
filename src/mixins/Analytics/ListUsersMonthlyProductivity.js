import { ListUsersMonthlyProductivityNew } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetUserMonthlyProductivityReport = {
  data() {
    return {
      noDataText: "",
      overlay: false,
      isDataTableLoading: false,
      newArrayForExcelData: [],
      GetUserMonthlyProductivityReportList: [],
    };
  },
  methods: {
    async GetUserMonthlyProductivityReportMethod(
      month,
      ticket_creation_type,
      service_name,
      ticket_user_id,
      list_aging_action_type
    ) {
      try {
        this.overlay = true;
        this.isDataTableLoading = true;
        var inputParams = {
          organization_id:
            this.$store.getters.get_current_user_details.organization_id,
          user_id: this.$store.getters.get_current_user_details.user_id,
          month,
          ticket_creation_type,
          service_name,
          ticket_user_id,
          list_aging_action_type,
        };
        let result = await API.graphql(
          graphqlOperation(ListUsersMonthlyProductivityNew, {
            input: inputParams,
          })
        );
        this.GetUserMonthlyProductivityReportList = JSON.parse(
          result.data.ListUsersMonthlyProductivityNew
        ).data.items;
        this.newArrayForExcelData = [];
        if (list_aging_action_type == "USER") {
          for (
            let i = 0;
            i < this.GetUserMonthlyProductivityReportList.length;
            i++
          ) {
            let ticketDetails =
              this.GetUserMonthlyProductivityReportList[i].ticket_details;
            if (ticketDetails != undefined && ticketDetails.length != 0) {
              for (let k = 0; k < ticketDetails.length; k++) {
                let newObj = {
                  user_name:
                    k == 0
                      ? this.GetUserMonthlyProductivityReportList[i].user_name
                      : "",
                  user_full_number:
                    k == 0
                      ? this.GetUserMonthlyProductivityReportList[i]
                          .user_full_number
                      : "",
                  user_productivity:
                    k == 0
                      ? this.GetUserMonthlyProductivityReportList[i]
                          .user_productivity
                      : "",
                  ticket_count:
                    k == 0
                      ? this.GetUserMonthlyProductivityReportList[i]
                          .ticket_details.length
                      : "",
                  ticket_productivity: ticketDetails[k].ticket_productivity,
                  ticket_id:
                    ticketDetails[k].custom_ticket_id != undefined &&
                    ticketDetails[k].custom_ticket_id != "-"
                      ? ticketDetails[k].custom_ticket_id != undefined
                      : ticketDetails[k].ticket_id,
                  customer_company_name: ticketDetails[k].customer_company_name,
                  customer_name: ticketDetails[k].customer_name,
                  customer_phone_number: ticketDetails[k].customer_phone_number,
                  customer_unique_id: ticketDetails[k].customer_unique_id,
                  customer_email_id: ticketDetails[k].customer_email_id,
                  category_name: ticketDetails[k].category_name,
                  service_name: ticketDetails[k].service_name,
                  service_serial_number: ticketDetails[k].service_serial_number,
                  ticket_status: ticketDetails[k].ticket_status,
                  ticket_creation_type: ticketDetails[k].ticket_creation_type,
                };
                this.newArrayForExcelData.push(newObj);
              }
            } else {
              let newObj2 = {
                user_name:
                  this.GetUserMonthlyProductivityReportList[i].user_name,
                user_full_number:
                  this.GetUserMonthlyProductivityReportList[i].user_full_number,
                user_productivity:
                  this.GetUserMonthlyProductivityReportList[i]
                    .user_productivity,
                ticket_count: 0,
              };
              this.newArrayForExcelData.push(newObj2);
            }
          }
        } else if (list_aging_action_type == "SERVICE_TYPE") {
          for (
            let i = 0;
            i < this.GetUserMonthlyProductivityReportList.length;
            i++
          ) {
            let ticketDetails =
              this.GetUserMonthlyProductivityReportList[i].ticket_details;
            if (ticketDetails != undefined && ticketDetails.length != 0) {
              for (let k = 0; k < ticketDetails.length; k++) {
                let newObj = {
                  service_type_name:
                    k == 0
                      ? this.GetUserMonthlyProductivityReportList[i]
                          .service_type_name
                      : "",
                  user_productivity:
                    k == 0
                      ? this.GetUserMonthlyProductivityReportList[i]
                          .user_productivity
                      : "",
                  ticket_count:
                    k == 0
                      ? this.GetUserMonthlyProductivityReportList[i]
                          .ticket_details.length
                      : "",
                  ticket_productivity: ticketDetails[k].ticket_productivity,
                  ticket_id:
                    ticketDetails[k].custom_ticket_id != undefined &&
                    ticketDetails[k].custom_ticket_id != "-"
                      ? ticketDetails[k].custom_ticket_id
                      : ticketDetails[k].ticket_id,
                  customer_company_name: ticketDetails[k].customer_company_name,
                  customer_name: ticketDetails[k].customer_name,
                  customer_phone_number: ticketDetails[k].customer_phone_number,
                  customer_unique_id: ticketDetails[k].customer_unique_id,
                  customer_email_id: ticketDetails[k].customer_email_id,
                  category_name: ticketDetails[k].category_name,
                  service_name: ticketDetails[k].service_name,
                  service_serial_number: ticketDetails[k].service_serial_number,
                  ticket_status: ticketDetails[k].ticket_status,
                  ticket_creation_type: ticketDetails[k].ticket_creation_type,
                };
                this.newArrayForExcelData.push(newObj);
              }
            } else {
              let newObj2 = {
                service_type_name:
                  this.GetUserMonthlyProductivityReportList[i]
                    .service_type_name,
                user_productivity:
                  this.GetUserMonthlyProductivityReportList[i]
                    .user_productivity,
                ticket_count: 0,
              };
              this.newArrayForExcelData.push(newObj2);
            }
          }
        } else if (list_aging_action_type == "TICKET_CREATION_TYPE") {
          for (
            let i = 0;
            i < this.GetUserMonthlyProductivityReportList.length;
            i++
          ) {
            let ticketDetails =
              this.GetUserMonthlyProductivityReportList[i].ticket_details;
            if (ticketDetails != undefined && ticketDetails.length != 0) {
              for (let k = 0; k < ticketDetails.length; k++) {
                let newObj = {
                  ticket_creation_type:
                    k == 0
                      ? this.GetUserMonthlyProductivityReportList[i]
                          .ticket_creation_type
                      : "",
                  user_productivity:
                    k == 0
                      ? this.GetUserMonthlyProductivityReportList[i]
                          .user_productivity
                      : "",
                  ticket_count:
                    k == 0
                      ? this.GetUserMonthlyProductivityReportList[i]
                          .ticket_details.length
                      : "",
                  ticket_productivity: ticketDetails[k].ticket_productivity,
                  ticket_id:
                    ticketDetails[k].custom_ticket_id != undefined &&
                    ticketDetails[k].custom_ticket_id != "-"
                      ? ticketDetails[k].custom_ticket_id
                      : ticketDetails[k].ticket_id,
                  customer_company_name: ticketDetails[k].customer_company_name,
                  customer_name: ticketDetails[k].customer_name,
                  customer_phone_number: ticketDetails[k].customer_phone_number,
                  customer_unique_id: ticketDetails[k].customer_unique_id,
                  customer_email_id: ticketDetails[k].customer_email_id,
                  category_name: ticketDetails[k].category_name,
                  service_name: ticketDetails[k].service_name,
                  service_serial_number: ticketDetails[k].service_serial_number,
                  ticket_status: ticketDetails[k].ticket_status,
                };
                this.newArrayForExcelData.push(newObj);
              }
            } else {
              let newObj2 = {
                ticket_creation_type:
                  this.GetUserMonthlyProductivityReportList[i]
                    .ticket_creation_type,
                user_productivity:
                  this.GetUserMonthlyProductivityReportList[i]
                    .user_productivity,
                ticket_count: 0,
              };
              this.newArrayForExcelData.push(newObj2);
            }
          }
        }
        this.overlay = false;
        this.isDataTableLoading = false;
      } catch (error) {
        this.overlay = false;
        this.isDataTableLoading = false;
        this.GetUserMonthlyProductivityReportList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
