import { ListTicketTypes } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllTicketTypes = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      GetAllTicketTypesList: [],
    };
  },
  methods: {
    async GetAllTicketTypesMethod() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(ListTicketTypes, {
            input: {},
          })
        );
        this.GetAllTicketTypesList = JSON.parse(
          result.data.ListTicketTypes
        ).data.items;
        this.overlay = false;
      } catch (error) {
        this.overlay = false;
        this.GetAllTicketTypesList = [];
        this.noDataText = error.errors[0].message;
      }
    },
  },
};
