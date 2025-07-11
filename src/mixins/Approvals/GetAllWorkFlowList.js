import { ListWorkFlows } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllWorkFlowList = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      ResultObj: [],
      WorkFlowList: [],
    };
  },
  methods: {
    async GetAllWorkFlowListMethod(
      status,
      approval_type,
      workflow_type,
      next_token,
      FILTER_STATUS
    ) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListWorkFlows, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              user_id: this.$store.getters.get_current_user_details.user_id,
              workflow_type: workflow_type,
              workflow_status: status,
              approval_type: approval_type,
              next_token: next_token,
              limit: 51,
              filter_status: status === "APPROVED" ? FILTER_STATUS : undefined,
            },
          })
        );
        var ResultObj = JSON.parse(result.data.ListWorkFlows);
        console.log("ResultObjResultObj", ResultObj);
        if (ResultObj.status == "SUCCESS") {
          if (!this.next_token) {
            this.WorkFlowList = [];
            this.WorkFlowList = ResultObj.data.items;
            for (let i = 0; i < this.WorkFlowList.length; i++) {
              if (
                this.WorkFlowList[i].workflow_items != undefined &&
                this.WorkFlowList[i].workflow_items.length != 0
              ) {
                this.WorkFlowList[i].component_names = this.WorkFlowList[
                  i
                ].workflow_items
                  .map((item) => item.component_name)
                  .join();
              }
              if (
                this.WorkFlowList[i].workflow_items != undefined &&
                this.WorkFlowList[i].workflow_items.length != 0
              ) {
                this.WorkFlowList[i].component_codes = this.WorkFlowList[
                  i
                ].workflow_items
                  .map((item) => item.component_code)
                  .join();
              }
              if (
                this.WorkFlowList[i].workflow_items != undefined &&
                this.WorkFlowList[i].workflow_items.length != 0
              ) {
                this.WorkFlowList[i].component_descriptions = this.WorkFlowList[
                  i
                ].workflow_items
                  .map((item) => item.component_description)
                  .join();
              }
              if (
                this.WorkFlowList[i].workflow_items != undefined &&
                this.WorkFlowList[i].workflow_items.length != 0
              ) {
                this.WorkFlowList[i].component_prices = this.WorkFlowList[
                  i
                ].workflow_items
                  .map((item) => item.component_price)
                  .join();
              }
              if (
                this.WorkFlowList[i].workflow_items != undefined &&
                this.WorkFlowList[i].workflow_items.length != 0
              ) {
                this.WorkFlowList[i].requested_component_quantitys =
                  this.WorkFlowList[i].workflow_items
                    .map((item) => item.requested_component_quantity)
                    .join();
              }
              if (
                this.WorkFlowList[i].workflow_items != undefined &&
                this.WorkFlowList[i].workflow_items.length != 0
              ) {
                this.WorkFlowList[i].approved_component_quantitys =
                  this.WorkFlowList[i].workflow_items
                    .map((item) => item.approved_component_quantity)
                    .join();
              }
              if (
                this.WorkFlowList[i].workflow_items != undefined &&
                this.WorkFlowList[i].workflow_items.length != 0
              ) {
                this.WorkFlowList[i].added_multiple_comments =
                  this.WorkFlowList[i].workflow_items
                    .map((item) => item.comments)
                    .join();
              }
              if (
                this.WorkFlowList[i].workflow_items != undefined &&
                this.WorkFlowList[i].workflow_items.length != 0
              ) {
                this.WorkFlowList[i].service_center_names = this.WorkFlowList[
                  i
                ].workflow_items
                  .map((item) => item.service_center_name)
                  .join();
              }
            }
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.WorkFlowList.push({ ...ResultObj.data.items[i] });
              for (let i = 0; i < this.WorkFlowList.length; i++) {
                if (
                  this.WorkFlowList[i].workflow_items != undefined &&
                  this.WorkFlowList[i].workflow_items.length != 0
                ) {
                  this.WorkFlowList[i].component_names = this.WorkFlowList[
                    i
                  ].workflow_items
                    .map((item) => item.component_name)
                    .join();
                }
                if (
                  this.WorkFlowList[i].workflow_items != undefined &&
                  this.WorkFlowList[i].workflow_items.length != 0
                ) {
                  this.WorkFlowList[i].component_codes = this.WorkFlowList[
                    i
                  ].workflow_items
                    .map((item) => item.component_code)
                    .join();
                }
                if (
                  this.WorkFlowList[i].workflow_items != undefined &&
                  this.WorkFlowList[i].workflow_items.length != 0
                ) {
                  this.WorkFlowList[i].component_descriptions =
                    this.WorkFlowList[i].workflow_items
                      .map((item) => item.component_description)
                      .join();
                }
                if (
                  this.WorkFlowList[i].workflow_items != undefined &&
                  this.WorkFlowList[i].workflow_items.length != 0
                ) {
                  this.WorkFlowList[i].component_prices = this.WorkFlowList[
                    i
                  ].workflow_items
                    .map((item) => item.component_price)
                    .join();
                }
                if (
                  this.WorkFlowList[i].workflow_items != undefined &&
                  this.WorkFlowList[i].workflow_items.length != 0
                ) {
                  this.WorkFlowList[i].requested_component_quantitys =
                    this.WorkFlowList[i].workflow_items
                      .map((item) => item.requested_component_quantity)
                      .join();
                }
                if (
                  this.WorkFlowList[i].workflow_items != undefined &&
                  this.WorkFlowList[i].workflow_items.length != 0
                ) {
                  this.WorkFlowList[i].approved_component_quantitys =
                    this.WorkFlowList[i].workflow_items
                      .map((item) => item.approved_component_quantity)
                      .join();
                }
                if (
                  this.WorkFlowList[i].workflow_items != undefined &&
                  this.WorkFlowList[i].workflow_items.length != 0
                ) {
                  this.WorkFlowList[i].added_multiple_comments =
                    this.WorkFlowList[i].workflow_items
                      .map((item) => item.comments)
                      .join();
                }
                if (
                  this.WorkFlowList[i].workflow_items != undefined &&
                  this.WorkFlowList[i].workflow_items.length != 0
                ) {
                  this.WorkFlowList[i].service_center_names = this.WorkFlowList[
                    i
                  ].workflow_items
                    .map((item) => item.service_center_name)
                    .join();
                }
              }
            }
            this.next_token = ResultObj.data.next_token;
          }
          this.overlay = false;
        }
        console.log("LIST", this.WorkFlowList);
        this.loading = false;
      } catch (error) {
        this.overlay = false;
        this.loading = false;
        this.WorkFlowList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
