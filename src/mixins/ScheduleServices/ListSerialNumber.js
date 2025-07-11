import { API, graphqlOperation } from "aws-amplify";
import { ListSerialNumbers } from "@/graphql/queries.js";
export const ListSerialNumber = {
  data: () => ({
    overlay: false,
    noDataText: "",
    next_token: "",
    serial_numbers_data: "",
    tagged_serial_numbers: "",
    un_tagged_serial_numbers: "",
    GetAllListSerialNumbers: [],
  }),
  methods: {
    async GetAllListSerialNumberMethod(
      setting_status,
      product_id,
      representative_id,
      next_token,
      request_status,
    ) {
      try {
        this.overlay = true;
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(ListSerialNumbers, {
            input: {
              setting_status,
              product_id,
              organization_id:
                this.$store.getters.get_current_user_details.organization_id,
              next_token: next_token,
              limit: 51,
              representative_id: representative_id,
              request_status: request_status,
            },
          })
        );
        var ResultObj = JSON.parse(result.data.ListSerialNumbers);
        if (ResultObj.status === "SUCCESS") {
          if (!this.next_token) {
            this.GetAllListSerialNumbers = [];
            this.GetAllListSerialNumbers = ResultObj.data.items;
            this.next_token = ResultObj.next_token;
            this.overlay = false;
            this.tagged_serial_numbers = ResultObj.data.tagged_serial_numbers;
            this.un_tagged_serial_numbers =
              ResultObj.data.un_tagged_serial_numbers;
            this.inactive_serial_numbers =
              ResultObj.data.inactive_serial_numbers;
          } else {
            for (let i = 0; i < ResultObj.data.items.length; i++) {
              this.GetAllListSerialNumbers.push({ ...ResultObj.data.items[i] });
            }
            this.next_token = ResultObj.next_token;
          }
          this.serial_numbers_data = ResultObj.serial_numbers_data;
          this.overlay = false;
          this.loading = false;
        }
      } catch (error) {
        this.GetAllListSerialNumbers = [];
        this.overlay = false;
        this.loading = false;
        this.noDataText = error.errors[0].message;
        console.log(error);
      }
    },
  },
};
