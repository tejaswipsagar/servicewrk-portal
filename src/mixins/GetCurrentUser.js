import { API, graphqlOperation } from "aws-amplify";
import { Get_Current_User_Details } from "@/graphql/queries.js";
import { GetDisplayModuleMenu } from "@/mixins/DisplayMenusByUser.js";
import RouterListRSM from "@/JsonFiles/RouterListRSM.json";
import RouterListNSM from "@/JsonFiles/RouterListNSM.json";
import RouterListAgent from "@/JsonFiles/RouterListAgent.json";
import RouterListDealer from "@/JsonFiles/RouterListDealer.json";
import RouterListDealerAgent from "@/JsonFiles/RouterListDealerAgent.json";
import RouterListPartner from "@/JsonFiles/RouterListPartner.json";
import RouterListManager from "@/JsonFiles/RouterListManager.json";
import RouterListAdminOwner from "@/JsonFiles/RouterListAdminOwner.json";
import RouterListManagement from "@/JsonFiles/RouterListManagement.json";
export const GetCurrentUser = {
  mixins: [GetDisplayModuleMenu],
  data() {
    return {
      overlay: false,
      noDataText: "",
      RouterList: [],
      RouterListNSM: [],
      RouterListRSM: [],
      RouterListAgent: [],
      RouterListDealer: [],
      RouterListDealerAgent: [],
      RouterListManager: [],
      RouterListPartner: [],
      RouterListAdminOwner: [],
      RouterListManagement: [],
      get_Current_User_DetailsObject: {},
    };
  },
  methods: {
    async GetCurrentUser() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(Get_Current_User_Details, {
            input: {
              user_email_id: this.$store.getters.get_user_email,
            },
          })
        );
        this.currentdetails = JSON.parse(
          result.data.Get_Current_User_Details
        ).data.items;

        this.user_type = JSON.parse(
          result.data.Get_Current_User_Details
        ).data.items[0].user_type;

        this.$store.commit(
          "SET_CURRENTUSER_DETAILS",
          JSON.parse(result.data.Get_Current_User_Details).data.items[0]
        );
        this.$store.commit(
          "SET_USER_TYPE",
          JSON.parse(result.data.Get_Current_User_Details).data.items[0]
            .user_type
        );
        switch (this.user_type) {
          case "OWNER":
            const partnerReportBtnEnabled =
              this.$store.getters.get_current_user_details.organization_details
                .is_enable_partners_monthly_closed_ticket_report_tab ?? false;

            if (partnerReportBtnEnabled) {
              this.RouterList = RouterListAdminOwner;
            } else {
              RouterListAdminOwner[1].SubMenu.pop();
              this.RouterList = RouterListAdminOwner;
            }
            // this.RouterList = RouterListAdminOwner;
            if (this.$route.name == "LandingPage") {
              this.$router.push("/Dashboard");
            }
            break;
          case "MANAGEMENT":
            if (
              JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                .organization_details.is_access_control_enable == true
            ) {
              if (
                JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                  .designation_id != undefined
              ) {
                this.$store.commit(
                  "SET_ACCESS_MODULE",
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
                this.GetDisplayMenuMethod(
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
              } else {
                alert(
                  "Designation is not Updated, Kindly contact Admin to update Designation..!"
                );
                this.$router.push("/");
              }
            } else {
              this.RouterList = RouterListManagement;
              if (this.$route.name == "LandingPage") {
                this.$router.push("/Dashboard");
              }
            }
            break;
          case "NSM":
            if (
              JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                .organization_details.is_access_control_enable == true
            ) {
              if (
                JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                  .designation_id != undefined
              ) {
                this.$store.commit(
                  "SET_ACCESS_MODULE",
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
                this.GetDisplayMenuMethod(
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
              } else {
                alert(
                  "Designation is not Updated, Kindly contact Admin to update Designation..!"
                );
                this.$router.push("/");
              }
            } else {
              this.RouterList = RouterListNSM;
              if (this.$route.name == "LandingPage") {
                this.$router.push("/Dashboard");
              }
            }
            break;
          case "RSM":
            if (
              JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                .organization_details.is_access_control_enable == true
            ) {
              if (
                JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                  .designation_id != undefined
              ) {
                this.$store.commit(
                  "SET_ACCESS_MODULE",
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
                this.GetDisplayMenuMethod(
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
              } else {
                alert(
                  "Designation is not Updated, Kindly contact Admin to update Designation..!"
                );
                this.$router.push("/");
              }
            } else {
              this.RouterList = RouterListRSM;
              if (this.$route.name == "LandingPage") {
                this.$router.push("/ActiveTickets");
              }
            }
            break;
          case "ADMIN":
            // this.RouterList = RouterListAdminOwner;
            const partnerReportBtnEnabled2 =
              this.$store.getters.get_current_user_details.organization_details
                .is_enable_partners_monthly_closed_ticket_report_tab ?? false;

            if (partnerReportBtnEnabled2) {
              this.RouterList = RouterListAdminOwner;
            } else {
              RouterListAdminOwner[1].SubMenu.pop();
              this.RouterList = RouterListAdminOwner;
            }
            if (this.$route.name == "LandingPage") {
              this.$router.push("/Dashboard");
            }
            break;
          case "MANAGER":
            if (
              JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                .organization_details.is_access_control_enable == true
            ) {
              if (
                JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                  .designation_id != undefined
              ) {
                this.$store.commit(
                  "SET_ACCESS_MODULE",
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
                this.GetDisplayMenuMethod(
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
              } else {
                alert(
                  "Designation is not Updated, Kindly contact Admin to update Designation..!"
                );
                this.$router.push("/");
              }
            } else {
              this.RouterList = RouterListManager;
              if (this.$route.name == "LandingPage") {
                this.$router.push("/Dashboard");
              }
            }
            break;
          case "AGENT":
            if (
              JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                .organization_details.is_access_control_enable == true
            ) {
              if (
                JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                  .designation_id != undefined
              ) {
                this.$store.commit(
                  "SET_ACCESS_MODULE",
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
                this.GetDisplayMenuMethod(
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
              } else {
                alert(
                  "Designation is not Updated, Kindly contact Admin to update Designation..!"
                );
                this.$router.push("/");
              }
            } else {
              this.RouterList = RouterListAgent;
              if (this.$route.name == "LandingPage") {
                this.$router.push("/ActiveTickets");
              }
            }
            break;
          case "STORE_MANAGER":
            if (
              JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                .organization_details.is_access_control_enable == true
            ) {
              if (
                JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                  .designation_id != undefined
              ) {
                this.$store.commit(
                  "SET_ACCESS_MODULE",
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
                this.GetDisplayMenuMethod(
                  JSON.parse(result.data.Get_Current_User_Details).data.items[0]
                    .designation_detail.accessing_module
                );
              } else {
                alert(
                  "Designation is not Updated, Kindly contact Admin to update Designation..!"
                );
                this.$router.push("/");
              }
            } else {
              this.RouterList = RouterListAgent;
              if (this.$route.name == "LandingPage") {
                this.$router.push("/ActiveTickets");
              }
            }
            break;
          case "SERVICE_PARTNER":
            this.RouterList = RouterListPartner;
            if (this.$route.name == "LandingPage") {
              this.$router.push("/ActiveTickets");
            }
            break;
          case "PARTNER_AGENT":
            this.RouterList = RouterListPartner;
            if (this.$route.name == "LandingPage") {
              this.$router.push("/ActiveTickets");
            }
            break;
          case "DEALER_OWNER":
            console.warn(
              "SER_CO",
              this.$store.getters.get_current_user_details
                .enable_service_co_ordinators_tab
            );
            console.warn(
              "REP",
              this.$store.getters.get_current_user_details
                .enable_representatives_tab
            );
            const getCurrent = this.$store.getters.get_current_user_details;
            const activeInactiveTabs = {
              reports_tab: getCurrent.is_report_tab_visible ?? false,
              product_fleet_tab:
                getCurrent.is_product_fleet_tab_visible ?? false,
              customer_tab: getCurrent.is_customer_tab_visible ?? false,
              service_co_ordinator_tab:
                getCurrent.enable_service_co_ordinators_tab ?? false,
              representative_tab:
                getCurrent.enable_representatives_tab ?? false,
            };
            this.RouterList = RouterListDealer.filter((item, index) => {
              if (index === 1 && activeInactiveTabs.reports_tab) return true;
              if (index === 3 && activeInactiveTabs.product_fleet_tab)
                return true;
              if (index === 4 && activeInactiveTabs.customer_tab) return true;
              if (index === 5 && activeInactiveTabs.service_co_ordinator_tab)
                return true;
              if (index === 6 && activeInactiveTabs.representative_tab)
                return true;
              return ![1, 3, 4, 5, 6].includes(index); // keep other routes untouched
            });
            // console.log("ROUTERS", RouterListDealer);
            // const getCurrent = this.$store.getters.get_current_user_details;
            // const activeInactiveTabs = {
            //   reports_tab: getCurrent.is_report_tab_visible ?? true,
            //   product_fleet_tab:
            //     getCurrent.is_product_fleet_tab_visible ?? true,
            //   customer_tab: getCurrent.is_customer_tab_visible ?? true,
            // };
            // this.RouterList = RouterListDealer.filter((item, index) => {
            //   if (index === 1 || index === 3 || index === 4) {
            //     Object.keys(activeInactiveTabs).map(
            //       (item2) => activeInactiveTabs[item2]
            //     );
            //   }
            // });
            // const productFleetVisibilityForDealer =
            //   this.$store.getters.get_current_user_details.organization_details
            //     .disable_productfleet_for_dealer ?? true;
            // if (productFleetVisibilityForDealer) {
            //   this.RouterList = RouterListDealer;
            // } else {
            //   this.RouterList = RouterListDealer.filter(
            //     (item) => item.MenuRoute !== "DealerProducts"
            //   );
            // }
            if (this.$route.name == "LandingPage") {
              this.$router.push("/ActiveTickets");
            }
            break;
          case "DEALER_AGENT":
            // this.RouterList = RouterListDealerAgent;
            // const productFleetVisibilityDAgent =
            //   this.$store.getters.get_current_user_details.organization_details
            //     .disable_productfleet_for_dealer ?? true;
            // if (productFleetVisibilityDAgent) {
            //   this.RouterList = RouterListDealerAgent;
            // } else {
            //   this.RouterList = RouterListDealerAgent.filter(
            //     (item) => item.MenuRoute !== "DealerProducts"
            //   );
            // }
            const getCurrent2 = this.$store.getters.get_current_user_details;
            const activeInactiveTabs2 = {
              reports_tab: getCurrent2.is_report_tab_visible ?? false,
              product_fleet_tab:
                getCurrent2.is_product_fleet_tab_visible ?? false,
              customer_tab: getCurrent2.is_customer_tab_visible ?? false,
              service_co_ordinator_tab:
                getCurrent2.enable_service_co_ordinators_tab ?? false,
              representative_tab:
                getCurrent2.enable_representatives_tab ?? false,
            };

            this.RouterList = RouterListDealer.filter((item, index) => {
              if (index === 1 && activeInactiveTabs2.reports_tab) return true;
              if (index === 3 && activeInactiveTabs2.product_fleet_tab)
                return true;
              if (index === 4 && activeInactiveTabs2.customer_tab) return true;
              if (index === 5 && activeInactiveTabs2.service_co_ordinator_tab)
                return true;
              if (index === 6 && activeInactiveTabs2.representative_tab)
                return true;
              return ![1, 3, 4, 5, 6].includes(index); // keep other routes untouched
            });
            if (this.$route.name == "LandingPage") {
              this.$router.push("/ActiveTickets");
            }
        }
        this.overlay = false;
      } catch (error) {
        this.noDataText = error.errors[0].message;
        if (
          this.noDataText.includes("Not Found") ||
          this.noDataText.includes("Temporarily Suspended")
        ) {
          this.$router.push("/");
          alert(`${this.noDataText}`);
        }
      }
    },
  },
};

// import { API, graphqlOperation } from "aws-amplify";
// import { Get_Current_User_Details } from "@/graphql/queries.js";
// import { GetDisplayModuleMenu } from "@/mixins/DisplayMenusByUser.js";
// import RouterListRSM from "@/JsonFiles/RouterListRSM.json";
// import RouterListNSM from "@/JsonFiles/RouterListNSM.json";
// import RouterListAgent from "@/JsonFiles/RouterListAgent.json";
// import RouterListDealer from "@/JsonFiles/RouterListDealer.json";
// import RouterListPartner from "@/JsonFiles/RouterListPartner.json";
// import RouterListManager from "@/JsonFiles/RouterListManager.json";
// import RouterListAdminOwner from "@/JsonFiles/RouterListAdminOwner.json";
// import RouterListManagement from "@/JsonFiles/RouterListManagement.json";
// export const GetCurrentUser = {
//   mixins: [GetDisplayModuleMenu],
//   data() {
//     return {
//       overlay: false,
//       noDataText: "",
//       RouterList: [],
//       RouterListNSM: [],
//       RouterListRSM: [],
//       RouterListAgent: [],
//       RouterListDealer: [],
//       RouterListManager: [],
//       RouterListPartner: [],
//       RouterListAdminOwner: [],
//       RouterListManagement: [],
//       get_Current_User_DetailsObject: {},
//     };
//   },
//   methods: {
//     async GetCurrentUser() {
//       try {
//         this.overlay = true;
//         let result = await API.graphql(
//           graphqlOperation(Get_Current_User_Details, {
//             input: {
//               user_email_id: this.$store.getters.get_user_email,
//             },
//           })
//         );
//         this.currentdetails = JSON.parse(
//           result.data.Get_Current_User_Details
//         ).data.items;
//         this.user_type = JSON.parse(
//           result.data.Get_Current_User_Details
//         ).data.items[0].user_type;
//         this.$store.commit(
//           "SET_CURRENTUSER_DETAILS",
//           JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//         );
//         this.$store.commit(
//           "SET_USER_TYPE",
//           JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//             .user_type
//         );
//         switch (this.user_type) {
//           case "OWNER":
//             this.RouterList = RouterListAdminOwner;
//             if (this.$route.name == "LandingPage") {
//               this.$router.push("/Dashboard");
//             }
//             break;
//           case "MANAGEMENT":
//             if (
//               JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                 .organization_details.is_access_control_enable == true
//             ) {
//               if (
//                 JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                   .designation_id != undefined
//               ) {
//                 this.$store.commit(
//                   "SET_ACCESS_MODULE",
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//                 this.GetDisplayMenuMethod(
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//               } else {
//                 alert(
//                   "Designation is not Updated, Kindly contact Admin to update Designation..!"
//                 );
//                 this.$router.push("/");
//               }
//             } else {
//               this.RouterList = RouterListManagement;
//               if (this.$route.name == "LandingPage") {
//                 this.$router.push("/Dashboard");
//               }
//             }
//             break;
//           case "NSM":
//             if (
//               JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                 .organization_details.is_access_control_enable == true
//             ) {
//               if (
//                 JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                   .designation_id != undefined
//               ) {
//                 this.$store.commit(
//                   "SET_ACCESS_MODULE",
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//                 this.GetDisplayMenuMethod(
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//               } else {
//                 alert(
//                   "Designation is not Updated, Kindly contact Admin to update Designation..!"
//                 );
//                 this.$router.push("/");
//               }
//             } else {
//               this.RouterList = RouterListNSM;
//               if (this.$route.name == "LandingPage") {
//                 this.$router.push("/Dashboard");
//               }
//             }
//             break;
//           case "RSM":
//             if (
//               JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                 .organization_details.is_access_control_enable == true
//             ) {
//               if (
//                 JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                   .designation_id != undefined
//               ) {
//                 this.$store.commit(
//                   "SET_ACCESS_MODULE",
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//                 this.GetDisplayMenuMethod(
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//               } else {
//                 alert(
//                   "Designation is not Updated, Kindly contact Admin to update Designation..!"
//                 );
//                 this.$router.push("/");
//               }
//             } else {
//               this.RouterList = RouterListRSM;
//               if (this.$route.name == "LandingPage") {
//                 this.$router.push("/ActiveTickets");
//               }
//             }
//             break;
//           case "ADMIN":
//             this.RouterList = RouterListAdminOwner;
//             if (this.$route.name == "LandingPage") {
//               this.$router.push("/Dashboard");
//             }
//             break;
//           case "MANAGER":
//             if (
//               JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                 .organization_details.is_access_control_enable == true
//             ) {
//               if (
//                 JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                   .designation_id != undefined
//               ) {
//                 this.$store.commit(
//                   "SET_ACCESS_MODULE",
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//                 this.GetDisplayMenuMethod(
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//               } else {
//                 alert(
//                   "Designation is not Updated, Kindly contact Admin to update Designation..!"
//                 );
//                 this.$router.push("/");
//               }
//             } else {
//               this.RouterList = RouterListManager;
//               if (this.$route.name == "LandingPage") {
//                 this.$router.push("/Dashboard");
//               }
//             }
//             break;
//           case "AGENT":
//             if (
//               JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                 .organization_details.is_access_control_enable == true
//             ) {
//               if (
//                 JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                   .designation_id != undefined
//               ) {
//                 this.$store.commit(
//                   "SET_ACCESS_MODULE",
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//                 this.GetDisplayMenuMethod(
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//               } else {
//                 alert(
//                   "Designation is not Updated, Kindly contact Admin to update Designation..!"
//                 );
//                 this.$router.push("/");
//               }
//             } else {
//               this.RouterList = RouterListAgent;
//               if (this.$route.name == "LandingPage") {
//                 this.$router.push("/ActiveTickets");
//               }
//             }
//             break;
//           case "STORE_MANAGER":
//             if (
//               JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                 .organization_details.is_access_control_enable == true
//             ) {
//               if (
//                 JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                   .designation_id != undefined
//               ) {
//                 this.$store.commit(
//                   "SET_ACCESS_MODULE",
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//                 this.GetDisplayMenuMethod(
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//               } else {
//                 alert(
//                   "Designation is not Updated, Kindly contact Admin to update Designation..!"
//                 );
//                 this.$router.push("/");
//               }
//             } else {
//               this.RouterList = RouterListAgent;
//               if (this.$route.name == "LandingPage") {
//                 this.$router.push("/ActiveTickets");
//               }
//             }
//             break;
//           case "SERVICE_PARTNER":
//             if (
//               JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                 .organization_details.is_access_control_enable == true
//             ) {
//               if (
//                 JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                   .designation_id != undefined
//               ) {
//                 this.$store.commit(
//                   "SET_ACCESS_MODULE",
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//                 this.GetDisplayMenuMethod(
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//               } else {
//                 this.RouterList = RouterListPartner;
//                 if (this.$route.name == "LandingPage") {
//                   this.$router.push("/ActiveTickets");
//                 }
//               }
//             } else {
//               this.RouterList = RouterListPartner;
//               if (this.$route.name == "LandingPage") {
//                 this.$router.push("/ActiveTickets");
//               }
//             }
//           case "PARTNER_AGENT":
//             this.RouterList = RouterListPartner;
//             if (this.$route.name == "LandingPage") {
//               this.$router.push("/ActiveTickets");
//             }
//             break;
//           case "DEALER_OWNER":
//             if (
//               JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                 .organization_details.is_access_control_enable == true
//             ) {
//               if (
//                 JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                   .designation_id != undefined
//               ) {
//                 this.$store.commit(
//                   "SET_ACCESS_MODULE",
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//                 this.GetDisplayMenuMethod(
//                   JSON.parse(result.data.Get_Current_User_Details).data.items[0]
//                     .designation_detail.accessing_module
//                 );
//               } else {
//                 this.RouterList = RouterListDealer;
//                 if (this.$route.name == "LandingPage") {
//                   this.$router.push("/ActiveTickets");
//                 }
//               }
//             } else {
//               this.RouterList = RouterListDealer;
//               if (this.$route.name == "LandingPage") {
//                 this.$router.push("/ActiveTickets");
//               }
//             }
//         }
//         this.overlay = false;
//       } catch (error) {
//         this.noDataText = error.errors[0].message;
//         if (
//           this.noDataText.includes("Not Found") ||
//           this.noDataText.includes("Temporarily Suspended")
//         ) {
//           this.$router.push("/");
//           alert(`${this.noDataText}`);
//         }
//       }
//     },
//   },
// };
