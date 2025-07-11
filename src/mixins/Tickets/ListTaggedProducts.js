import { API, graphqlOperation } from "aws-amplify";
import { ListTaggedProducts } from "@/graphql/queries.js";
export const GetTaggedProduct = {
  data: () => ({
    overlay: false,
    loading: false,
    noDataText: "",
    ResultObj: [],
    GetTaggedProductList: [],
  }),
  methods: {
    async GetTaggedProductMethod(customer_id, products, next_token) {
      try {
        this.noDataText = "";
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListTaggedProducts, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              customer_id: customer_id,
              product_id: products,
              next_token: next_token,
              limit: 101,
            },
          })
        );
        var ResultObj = JSON.parse(result.data.ListTaggedProducts);
        if (ResultObj.status === "SUCCESS") {
          if (!this.next_token) {
            this.GetTaggedProductList = [];
            this.GetTaggedProductList = ResultObj.data.items;
            this.GetTaggedProductList.map((item) => {
              let Obj = item;
              Obj.sl_no = this.GetTaggedProductList.indexOf(item) + 1;
              if (
                Obj.extended_warranty_details != undefined &&
                Obj.extended_warranty_details.length != 0
              ) {
                let currentDate = new Date();
                let currentEpochTimeInSeconds = Math.floor(
                  currentDate.getTime() / 1000
                );
                if (
                  Obj.warranty_end_date != undefined &&
                  Obj.warranty_end_date != "-" &&
                  Obj.warranty_end_date != ""
                ) {
                  let supportEndDate = new Date(
                    Obj.warranty_end_date
                  ).getTime();
                  let supportEndDateInsecs = supportEndDate / 1000;
                  if (supportEndDateInsecs < currentEpochTimeInSeconds) {
                    for (
                      let k = 0;
                      k < Obj.extended_warranty_details.length;
                      k++
                    ) {
                      let extended_warranty_end_date =
                        Obj.extended_warranty_details[k]
                          .extendedWarrantyEndEate;
                      let extendedSupportEndDate = new Date(
                        extended_warranty_end_date
                      ).getTime();
                      let extendedSupportEndDateinSecs =
                        extendedSupportEndDate / 1000;
                      let extended_warranty_start_date =
                        Obj.extended_warranty_details[k]
                          .extendedWarrantyStartDate;
                      let extendedSupportStartDate =
                        (extended_warranty_start_date = new Date(
                          extended_warranty_start_date
                        ).getTime());
                      let extendedSupportStartDateInSecs =
                        extendedSupportStartDate / 1000;
                      if (
                        currentEpochTimeInSeconds <
                          extendedSupportEndDateinSecs &&
                        currentEpochTimeInSeconds >
                          extendedSupportStartDateInSecs
                      ) {
                        Obj.support_type =
                          Obj.extended_warranty_details[
                            k
                          ].extended_ticket_warranty_type;
                        Obj.warranty_type =
                          Obj.extended_warranty_details[
                            k
                          ].extended_warranty_type;
                        Obj.warranty_start_date =
                          Obj.extended_warranty_details[
                            k
                          ].extendedWarrantyStartDate;
                        Obj.warranty_end_date =
                          Obj.extended_warranty_details[
                            k
                          ].extendedWarrantyEndEate;
                      }
                    }
                  }
                }
              }
              return Obj;
            });
            this.next_token = ResultObj.data.next_token;
            this.overlay = false;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.GetTaggedProductList.push({ ...ResultObj.data.items[i] });
            }
            this.GetTaggedProductList.map((item) => {
              let Obj = item;
              Obj.sl_no = this.GetTaggedProductList.indexOf(item) + 1;
              return Obj;
            });
            this.next_token = ResultObj.data.next_token;
          }
          this.overlay = false;
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
        this.overlay = false;
        this.loading = false;
        this.GetTaggedProductList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
