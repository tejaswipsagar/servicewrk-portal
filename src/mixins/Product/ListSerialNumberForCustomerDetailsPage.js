import { ListSerialNumbers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetSerialNumbers = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      ProductList: [],
      GetSerialNumbersList: [],
      GetSerialNumbersListWithoutFilter: [],
    };
  },
  methods: {
    async GetSerialNumbersMethod(products, category_id, type, next_token) {
      try {
        this.overlay = true;
        if (type == "FIRST") {
          this.GetSerialNumbersList = [];
        }
        let result = await API.graphql(
          graphqlOperation(ListSerialNumbers, {
            input: {
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              setting_status: "ACTIVE",
              product_id: products,
              category_id: category_id,
              limit: 1000,
              next_token: type == "NOT_FIRST" ? next_token : undefined,
            },
          })
        );
        let seriaNumberList = JSON.parse(result.data.ListSerialNumbers).data
          .items;
        for (let i = 0; i < seriaNumberList.length; i++) {
          this.GetSerialNumbersList.push(seriaNumberList[i]);
        }
        for (let i = 0; i < this.GetSerialNumbersList.length; i++) {
          this.GetSerialNumbersList[i].price = "";
          this.GetSerialNumbersList[i].purchased_on = "";
          this.GetSerialNumbersList[i].description = "";
        }
        if (JSON.parse(result.data.ListSerialNumbers).next_token) {
          this.GetSerialNumbersMethod(
            this.service_id,
            this.category_id,
            "NOT_FIRST",
            JSON.parse(result.data.ListSerialNumbers).next_token
          );
        }
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetSerialNumbersList = [];
        this.noDataText = error.errors[0].message;
      }
    },
    async GetSerialNumberMethodsWithoutFilter(products, customer_id) {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListSerialNumbers, {
            input: {
              setting_status: "ACTIVE",
              product_id: products == "ALL" ? undefined : products,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              customer_id: customer_id,
            },
          })
        );
        this.GetSerialNumbersListWithoutFilter = JSON.parse(
          result.data.ListSerialNumbers
        ).data.items;
        this.GetSerialNumbersListWithoutFilter.unshift({
          product_name: "ALL",
          product_id: "ALL",
        });
        for (let i = 0; i < this.GetSerialNumbersList.length; i++) {
          this.GetSerialNumbersList[i].price = "";
          this.GetSerialNumbersList[i].purchased_on = "";
          this.GetSerialNumbersList[i].description = "";
        }
        this.overlay = false;
        this;
      } catch (error) {
        this.overlay = false;
        this.GetSerialNumbersList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
