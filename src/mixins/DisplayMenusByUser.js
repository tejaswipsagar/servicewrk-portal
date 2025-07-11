import RouterListManager from "@/JsonFiles/RouterListManager.json";
import RouterListAdminOwner from "@/JsonFiles/RouterListAdminOwner.json";
import RouterListAgent from "@/JsonFiles/RouterListAgent.json";
import RouterListPartner from "@/JsonFiles/RouterListPartner.json";
import RouterListManagement from "@/JsonFiles/RouterListManagement.json";
import RouterListRSM from "@/JsonFiles/RouterListRSM.json";
import RouterListNSM from "@/JsonFiles/RouterListRSM.json";

export const GetDisplayModuleMenu = {
  data: () => ({}),
  methods: {
    GetDisplayMenuMethod(RouterArray) {
      var self = this;
      let subModuleArray = [];
      let localSubMenuListArray = [];
      self.NewRouterDetails = [];
      switch (self.$store.getters.get_current_user_details.user_type) {
        case "MANAGER":
          RouterListManager.map((MainRouter) => {
            RouterArray.map((StoreRouter) => {
              if (StoreRouter.module_name === MainRouter.MenuName) {
                StoreRouter.module_rights.map((root_module_rights) => {
                  if (root_module_rights.VIEW === true) {
                    subModuleArray.push(MainRouter);
                    if (StoreRouter.sub_modules) {
                      StoreRouter.sub_modules.map((sub_modle) => {
                        if (MainRouter.SubMenu) {
                          MainRouter.SubMenu.map((main_sub) => {
                            let Object = main_sub;
                            Object.root_module = MainRouter.MenuName;
                            if (
                              sub_modle.module_name
                                .toLowerCase()
                                .replaceAll(" ", "") ===
                              main_sub.MenuName.toLowerCase().replaceAll(
                                " ",
                                ""
                              )
                            ) {
                              sub_modle.module_rights.map((moduleRights) => {
                                if (moduleRights.VIEW === true) {
                                  localSubMenuListArray.push(main_sub);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    self.NewRouterDetails.push(MainRouter);
                  }
                });
              }
            });
          });
          subModuleArray.map((item) => {
            let Object = item;
            Object.subModule = [];
            localSubMenuListArray.map((sub_item) => {
              if (
                item.MenuName.toLowerCase().replaceAll(" ", "") ===
                sub_item.root_module.toLowerCase().replaceAll(" ", "")
              ) {
                if (item.has_child_routes == true) {
                  Object.subModule.push(sub_item);
                }
              }
            });
          });
          self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
          setTimeout(() => {
            this.RouterList = self.$store.getters.get_router_details;
            this.$router.push("/Dashboard");
          }, 2000);
          break;
        case "NSM":
          RouterListNSM.map((MainRouter) => {
            RouterArray.map((StoreRouter) => {
              if (StoreRouter.module_name === MainRouter.MenuName) {
                StoreRouter.module_rights.map((root_module_rights) => {
                  if (root_module_rights.VIEW === true) {
                    subModuleArray.push(MainRouter);
                    if (StoreRouter.sub_modules) {
                      StoreRouter.sub_modules.map((sub_modle) => {
                        if (MainRouter.SubMenu) {
                          MainRouter.SubMenu.map((main_sub) => {
                            let Object = main_sub;
                            Object.root_module = MainRouter.MenuName;
                            if (
                              sub_modle.module_name
                                .toLowerCase()
                                .replaceAll(" ", "") ===
                              main_sub.MenuName.toLowerCase().replaceAll(
                                " ",
                                ""
                              )
                            ) {
                              sub_modle.module_rights.map((moduleRights) => {
                                if (moduleRights.VIEW === true) {
                                  localSubMenuListArray.push(main_sub);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    self.NewRouterDetails.push(MainRouter);
                  }
                });
              }
            });
          });
          subModuleArray.map((item) => {
            let Object = item;
            Object.subModule = [];
            localSubMenuListArray.map((sub_item) => {
              if (
                item.MenuName.toLowerCase().replaceAll(" ", "") ===
                sub_item.root_module.toLowerCase().replaceAll(" ", "")
              ) {
                if (item.has_child_routes == true) {
                  Object.subModule.push(sub_item);
                }
              }
            });
          });
          self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
          setTimeout(() => {
            this.RouterList = self.$store.getters.get_router_details;
            this.$router.push("/Dashboard");
          }, 2000);
          break;
        case "MANAGEMENT":
          RouterListManagement.map((MainRouter) => {
            RouterArray.map((StoreRouter) => {
              if (StoreRouter.module_name === MainRouter.MenuName) {
                StoreRouter.module_rights.map((root_module_rights) => {
                  if (root_module_rights.VIEW === true) {
                    subModuleArray.push(MainRouter);
                    if (StoreRouter.sub_modules) {
                      StoreRouter.sub_modules.map((sub_modle) => {
                        if (MainRouter.SubMenu) {
                          MainRouter.SubMenu.map((main_sub) => {
                            let Object = main_sub;
                            Object.root_module = MainRouter.MenuName;
                            if (
                              sub_modle.module_name
                                .toLowerCase()
                                .replaceAll(" ", "") ===
                              main_sub.MenuName.toLowerCase().replaceAll(
                                " ",
                                ""
                              )
                            ) {
                              sub_modle.module_rights.map((moduleRights) => {
                                if (moduleRights.VIEW === true) {
                                  localSubMenuListArray.push(main_sub);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    self.NewRouterDetails.push(MainRouter);
                  }
                });
              }
            });
          });
          subModuleArray.map((item) => {
            let Object = item;
            Object.subModule = [];
            localSubMenuListArray.map((sub_item) => {
              if (
                item.MenuName.toLowerCase().replaceAll(" ", "") ===
                sub_item.root_module.toLowerCase().replaceAll(" ", "")
              ) {
                if (item.has_child_routes == true) {
                  Object.subModule.push(sub_item);
                }
              }
            });
          });
          self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
          setTimeout(() => {
            this.RouterList = self.$store.getters.get_router_details;
            this.$router.push("/Dashboard");
          }, 2000);
          break;

        case "RSM":
          RouterListRSM.map((MainRouter) => {
            RouterArray.map((StoreRouter) => {
              if (StoreRouter.module_name === MainRouter.MenuName) {
                StoreRouter.module_rights.map((root_module_rights) => {
                  if (root_module_rights.VIEW === true) {
                    subModuleArray.push(MainRouter);
                    if (StoreRouter.sub_modules) {
                      StoreRouter.sub_modules.map((sub_modle) => {
                        if (MainRouter.SubMenu) {
                          MainRouter.SubMenu.map((main_sub) => {
                            let Object = main_sub;
                            Object.root_module = MainRouter.MenuName;
                            if (
                              sub_modle.module_name
                                .toLowerCase()
                                .replaceAll(" ", "") ===
                              main_sub.MenuName.toLowerCase().replaceAll(
                                " ",
                                ""
                              )
                            ) {
                              sub_modle.module_rights.map((moduleRights) => {
                                if (moduleRights.VIEW === true) {
                                  localSubMenuListArray.push(main_sub);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    self.NewRouterDetails.push(MainRouter);
                  }
                });
              }
            });
          });
          subModuleArray.map((item) => {
            let Object = item;
            Object.subModule = [];
            localSubMenuListArray.map((sub_item) => {
              if (
                item.MenuName.toLowerCase().replaceAll(" ", "") ===
                sub_item.root_module.toLowerCase().replaceAll(" ", "")
              ) {
                if (item.has_child_routes == true) {
                  Object.subModule.push(sub_item);
                }
              }
            });
          });
          self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
          setTimeout(() => {
            this.RouterList = self.$store.getters.get_router_details;
            this.$router.push("/ActiveTickets");
          }, 2000);
          break;

        case "AGENT":
          RouterListAgent.map((MainRouter) => {
            RouterArray.map((StoreRouter) => {
              if (StoreRouter.module_name === MainRouter.MenuName) {
                StoreRouter.module_rights.map((root_module_rights) => {
                  if (root_module_rights.VIEW === true) {
                    subModuleArray.push(MainRouter);
                    if (StoreRouter.sub_modules) {
                      StoreRouter.sub_modules.map((sub_modle) => {
                        if (MainRouter.SubMenu) {
                          MainRouter.SubMenu.map((main_sub) => {
                            let Object = main_sub;
                            Object.root_module = MainRouter.MenuName;
                            if (
                              sub_modle.module_name
                                .toLowerCase()
                                .replaceAll(" ", "") ===
                              main_sub.MenuName.toLowerCase().replaceAll(
                                " ",
                                ""
                              )
                            ) {
                              sub_modle.module_rights.map((moduleRights) => {
                                if (moduleRights.VIEW === true) {
                                  localSubMenuListArray.push(main_sub);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    self.NewRouterDetails.push(MainRouter);
                  }
                });
              }
            });
          });
          subModuleArray.map((item) => {
            let Object = item;
            Object.subModule = [];
            localSubMenuListArray.map((sub_item) => {
              if (
                item.MenuName.toLowerCase().replaceAll(" ", "") ===
                sub_item.root_module.toLowerCase().replaceAll(" ", "")
              ) {
                if (item.has_child_routes == true) {
                  Object.subModule.push(sub_item);
                }
              }
            });
          });
          self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
          setTimeout(() => {
            this.RouterList = self.$store.getters.get_router_details;
            this.$router.push("/ActiveTickets");
          }, 2000);
          break;

        case "ADMIN":
          RouterListAdminOwner.map((MainRouter) => {
            RouterArray.map((StoreRouter) => {
              if (StoreRouter.module_name === MainRouter.MenuName) {
                StoreRouter.module_rights.map((root_module_rights) => {
                  if (root_module_rights.VIEW === true) {
                    subModuleArray.push(MainRouter);
                    if (StoreRouter.sub_modules) {
                      StoreRouter.sub_modules.map((sub_modle) => {
                        if (MainRouter.SubMenu) {
                          MainRouter.SubMenu.map((main_sub) => {
                            let Object = main_sub;
                            Object.root_module = MainRouter.MenuName;
                            if (
                              sub_modle.module_name
                                .toLowerCase()
                                .replaceAll(" ", "") ===
                              main_sub.MenuName.toLowerCase().replaceAll(
                                " ",
                                ""
                              )
                            ) {
                              sub_modle.module_rights.map((moduleRights) => {
                                if (moduleRights.VIEW === true) {
                                  localSubMenuListArray.push(main_sub);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    self.NewRouterDetails.push(MainRouter);
                  }
                });
              }
            });
          });
          subModuleArray.map((item) => {
            let Object = item;
            Object.subModule = [];
            localSubMenuListArray.map((sub_item) => {
              if (
                item.MenuName.toLowerCase().replaceAll(" ", "") ===
                sub_item.root_module.toLowerCase().replaceAll(" ", "")
              ) {
                if (item.has_child_routes == true) {
                  Object.subModule.push(sub_item);
                }
              }
            });
          });
          self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
          setTimeout(() => {
            this.RouterList = self.$store.getters.get_router_details;
            this.$router.push("/Dashboard");
          }, 2000);
          break;

        case "OWNER":
          RouterListAdminOwner.map((MainRouter) => {
            RouterArray.map((StoreRouter) => {
              if (StoreRouter.module_name === MainRouter.MenuName) {
                StoreRouter.module_rights.map((root_module_rights) => {
                  if (root_module_rights.VIEW === true) {
                    subModuleArray.push(MainRouter);
                    if (StoreRouter.sub_modules) {
                      StoreRouter.sub_modules.map((sub_modle) => {
                        if (MainRouter.SubMenu) {
                          MainRouter.SubMenu.map((main_sub) => {
                            let Object = main_sub;
                            Object.root_module = MainRouter.MenuName;
                            if (
                              sub_modle.module_name
                                .toLowerCase()
                                .replaceAll(" ", "") ===
                              main_sub.MenuName.toLowerCase().replaceAll(
                                " ",
                                ""
                              )
                            ) {
                              sub_modle.module_rights.map((moduleRights) => {
                                if (moduleRights.VIEW === true) {
                                  localSubMenuListArray.push(main_sub);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    self.NewRouterDetails.push(MainRouter);
                  }
                });
              }
            });
          });
          subModuleArray.map((item) => {
            let Object = item;
            Object.subModule = [];
            localSubMenuListArray.map((sub_item) => {
              if (
                item.MenuName.toLowerCase().replaceAll(" ", "") ===
                sub_item.root_module.toLowerCase().replaceAll(" ", "")
              ) {
                if (item.has_child_routes == true) {
                  Object.subModule.push(sub_item);
                }
              }
            });
          });
          self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
          setTimeout(() => {
            this.RouterList = self.$store.getters.get_router_details;
            this.$router.push("/Dashboard");
          }, 2000);
          break;

        case "SERVICE_PARTNER":
          RouterListAdminOwner.map((MainRouter) => {
            RouterArray.map((StoreRouter) => {
              if (StoreRouter.module_name === MainRouter.MenuName) {
                StoreRouter.module_rights.map((root_module_rights) => {
                  if (root_module_rights.VIEW === true) {
                    subModuleArray.push(MainRouter);
                    if (StoreRouter.sub_modules) {
                      StoreRouter.sub_modules.map((sub_modle) => {
                        if (MainRouter.SubMenu) {
                          MainRouter.SubMenu.map((main_sub) => {
                            let Object = main_sub;
                            Object.root_module = MainRouter.MenuName;
                            if (
                              sub_modle.module_name
                                .toLowerCase()
                                .replaceAll(" ", "") ===
                              main_sub.MenuName.toLowerCase().replaceAll(
                                " ",
                                ""
                              )
                            ) {
                              sub_modle.module_rights.map((moduleRights) => {
                                if (moduleRights.VIEW === true) {
                                  localSubMenuListArray.push(main_sub);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    self.NewRouterDetails.push(MainRouter);
                  }
                });
              }
            });
          });
          subModuleArray.map((item) => {
            let Object = item;
            Object.subModule = [];
            localSubMenuListArray.map((sub_item) => {
              if (
                item.MenuName.toLowerCase().replaceAll(" ", "") ===
                sub_item.root_module.toLowerCase().replaceAll(" ", "")
              ) {
                if (item.has_child_routes == true) {
                  Object.subModule.push(sub_item);
                }
              }
            });
          });
          self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
          setTimeout(() => {
            this.RouterList = self.$store.getters.get_router_details;
            this.$router.push("/Dashboard");
          }, 2000);
          break;

        case "STORE_MANAGER":
          RouterListAdminOwner.map((MainRouter) => {
            RouterArray.map((StoreRouter) => {
              if (StoreRouter.module_name === MainRouter.MenuName) {
                StoreRouter.module_rights.map((root_module_rights) => {
                  if (root_module_rights.VIEW === true) {
                    subModuleArray.push(MainRouter);
                    if (StoreRouter.sub_modules) {
                      StoreRouter.sub_modules.map((sub_modle) => {
                        if (MainRouter.SubMenu) {
                          MainRouter.SubMenu.map((main_sub) => {
                            let Object = main_sub;
                            Object.root_module = MainRouter.MenuName;
                            if (
                              sub_modle.module_name
                                .toLowerCase()
                                .replaceAll(" ", "") ===
                              main_sub.MenuName.toLowerCase().replaceAll(
                                " ",
                                ""
                              )
                            ) {
                              sub_modle.module_rights.map((moduleRights) => {
                                if (moduleRights.VIEW === true) {
                                  localSubMenuListArray.push(main_sub);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    self.NewRouterDetails.push(MainRouter);
                  }
                });
              }
            });
          });
          subModuleArray.map((item) => {
            let Object = item;
            Object.subModule = [];
            localSubMenuListArray.map((sub_item) => {
              if (
                item.MenuName.toLowerCase().replaceAll(" ", "") ===
                sub_item.root_module.toLowerCase().replaceAll(" ", "")
              ) {
                if (item.has_child_routes == true) {
                  Object.subModule.push(sub_item);
                }
              }
            });
          });
          self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
          setTimeout(() => {
            this.RouterList = self.$store.getters.get_router_details;
            this.$router.push("/Dashboard");
          }, 2000);
          break;

        case "PARTNER_AGENT":
          RouterListPartner.map((MainRouter) => {
            RouterArray.map((StoreRouter) => {
              if (StoreRouter.module_name === MainRouter.MenuName) {
                StoreRouter.module_rights.map((root_module_rights) => {
                  if (root_module_rights.VIEW === true) {
                    subModuleArray.push(MainRouter);
                    if (StoreRouter.sub_modules) {
                      StoreRouter.sub_modules.map((sub_modle) => {
                        if (MainRouter.SubMenu) {
                          MainRouter.SubMenu.map((main_sub) => {
                            let Object = main_sub;
                            Object.root_module = MainRouter.MenuName;
                            if (
                              sub_modle.module_name
                                .toLowerCase()
                                .replaceAll(" ", "") ===
                              main_sub.MenuName.toLowerCase().replaceAll(
                                " ",
                                ""
                              )
                            ) {
                              sub_modle.module_rights.map((moduleRights) => {
                                if (moduleRights.VIEW === true) {
                                  localSubMenuListArray.push(main_sub);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    self.NewRouterDetails.push(MainRouter);
                  }
                });
              }
            });
          });
          subModuleArray.map((item) => {
            let Object = item;
            Object.subModule = [];
            localSubMenuListArray.map((sub_item) => {
              if (
                item.MenuName.toLowerCase().replaceAll(" ", "") ===
                sub_item.root_module.toLowerCase().replaceAll(" ", "")
              ) {
                if (item.has_child_routes == true) {
                  Object.subModule.push(sub_item);
                }
              }
            });
          });
          self.$store.commit("SET_ROUTER_DETAILS", RouterListAdminOwner);
          setTimeout(() => {
            this.RouterList = self.$store.getters.get_router_details;
            this.$router.push("/Dashboard");
          }, 2000);
          break;
      }
    },
  },
};

// import RouterListManager from "@/JsonFiles/RouterListManager.json";
// import RouterListAdminOwner from "@/JsonFiles/RouterListAdminOwner.json";
// import RouterListAgent from "@/JsonFiles/RouterListAgent.json";
// import RouterListPartner from "@/JsonFiles/RouterListPartner.json";
// import RouterListManagement from "@/JsonFiles/RouterListManagement.json";
// import RouterListRSM from "@/JsonFiles/RouterListRSM.json";
// import RouterListNSM from "@/JsonFiles/RouterListRSM.json";
// import RouterListDealer from "@/JsonFiles/RouterListDealer.json";
// export const GetDisplayModuleMenu = {
//   data: () => ({}),
//   methods: {
//     GetDisplayMenuMethod(RouterArray) {
//       var self = this;
//       let subModuleArray = [];
//       let localSubMenuListArray = [];
//       self.NewRouterDetails = [];
//       switch (self.$store.getters.get_current_user_details.user_type) {
//         case "MANAGER":
//           RouterListManager.map((MainRouter) => {
//             RouterArray.map((StoreRouter) => {
//               if (StoreRouter.module_name === MainRouter.MenuName) {
//                 StoreRouter.module_rights.map((root_module_rights) => {
//                   if (root_module_rights.VIEW === true) {
//                     subModuleArray.push(MainRouter);
//                     if (StoreRouter.sub_modules) {
//                       StoreRouter.sub_modules.map((sub_modle) => {
//                         if (MainRouter.SubMenu) {
//                           MainRouter.SubMenu.map((main_sub) => {
//                             let Object = main_sub;
//                             Object.root_module = MainRouter.MenuName;
//                             if (
//                               sub_modle.module_name
//                                 .toLowerCase()
//                                 .replaceAll(" ", "") ===
//                               main_sub.MenuName.toLowerCase().replaceAll(
//                                 " ",
//                                 ""
//                               )
//                             ) {
//                               sub_modle.module_rights.map((moduleRights) => {
//                                 if (moduleRights.VIEW === true) {
//                                   localSubMenuListArray.push(main_sub);
//                                 }
//                               });
//                             }
//                           });
//                         }
//                       });
//                     }
//                     self.NewRouterDetails.push(MainRouter);
//                   }
//                 });
//               }
//             });
//           });
//           subModuleArray.map((item) => {
//             let Object = item;
//             Object.subModule = [];
//             localSubMenuListArray.map((sub_item) => {
//               if (
//                 item.MenuName.toLowerCase().replaceAll(" ", "") ===
//                 sub_item.root_module.toLowerCase().replaceAll(" ", "")
//               ) {
//                 if (item.has_child_routes == true) {
//                   Object.subModule.push(sub_item);
//                 }
//               }
//             });
//           });
//           self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
//           setTimeout(() => {
//             this.RouterList = self.$store.getters.get_router_details;
//             this.$router.push("/Dashboard");
//           }, 2000);
//           break;
//         case "NSM":
//           RouterListNSM.map((MainRouter) => {
//             RouterArray.map((StoreRouter) => {
//               if (StoreRouter.module_name === MainRouter.MenuName) {
//                 StoreRouter.module_rights.map((root_module_rights) => {
//                   if (root_module_rights.VIEW === true) {
//                     subModuleArray.push(MainRouter);
//                     if (StoreRouter.sub_modules) {
//                       StoreRouter.sub_modules.map((sub_modle) => {
//                         if (MainRouter.SubMenu) {
//                           MainRouter.SubMenu.map((main_sub) => {
//                             let Object = main_sub;
//                             Object.root_module = MainRouter.MenuName;
//                             if (
//                               sub_modle.module_name
//                                 .toLowerCase()
//                                 .replaceAll(" ", "") ===
//                               main_sub.MenuName.toLowerCase().replaceAll(
//                                 " ",
//                                 ""
//                               )
//                             ) {
//                               sub_modle.module_rights.map((moduleRights) => {
//                                 if (moduleRights.VIEW === true) {
//                                   localSubMenuListArray.push(main_sub);
//                                 }
//                               });
//                             }
//                           });
//                         }
//                       });
//                     }
//                     self.NewRouterDetails.push(MainRouter);
//                   }
//                 });
//               }
//             });
//           });
//           subModuleArray.map((item) => {
//             let Object = item;
//             Object.subModule = [];
//             localSubMenuListArray.map((sub_item) => {
//               if (
//                 item.MenuName.toLowerCase().replaceAll(" ", "") ===
//                 sub_item.root_module.toLowerCase().replaceAll(" ", "")
//               ) {
//                 if (item.has_child_routes == true) {
//                   Object.subModule.push(sub_item);
//                 }
//               }
//             });
//           });
//           self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
//           setTimeout(() => {
//             this.RouterList = self.$store.getters.get_router_details;
//             this.$router.push("/Dashboard");
//           }, 2000);
//           break;
//         case "MANAGEMENT":
//           RouterListManagement.map((MainRouter) => {
//             RouterArray.map((StoreRouter) => {
//               if (StoreRouter.module_name === MainRouter.MenuName) {
//                 StoreRouter.module_rights.map((root_module_rights) => {
//                   if (root_module_rights.VIEW === true) {
//                     subModuleArray.push(MainRouter);
//                     if (StoreRouter.sub_modules) {
//                       StoreRouter.sub_modules.map((sub_modle) => {
//                         if (MainRouter.SubMenu) {
//                           MainRouter.SubMenu.map((main_sub) => {
//                             let Object = main_sub;
//                             Object.root_module = MainRouter.MenuName;
//                             if (
//                               sub_modle.module_name
//                                 .toLowerCase()
//                                 .replaceAll(" ", "") ===
//                               main_sub.MenuName.toLowerCase().replaceAll(
//                                 " ",
//                                 ""
//                               )
//                             ) {
//                               sub_modle.module_rights.map((moduleRights) => {
//                                 if (moduleRights.VIEW === true) {
//                                   localSubMenuListArray.push(main_sub);
//                                 }
//                               });
//                             }
//                           });
//                         }
//                       });
//                     }
//                     self.NewRouterDetails.push(MainRouter);
//                   }
//                 });
//               }
//             });
//           });
//           subModuleArray.map((item) => {
//             let Object = item;
//             Object.subModule = [];
//             localSubMenuListArray.map((sub_item) => {
//               if (
//                 item.MenuName.toLowerCase().replaceAll(" ", "") ===
//                 sub_item.root_module.toLowerCase().replaceAll(" ", "")
//               ) {
//                 if (item.has_child_routes == true) {
//                   Object.subModule.push(sub_item);
//                 }
//               }
//             });
//           });
//           self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
//           setTimeout(() => {
//             this.RouterList = self.$store.getters.get_router_details;
//             this.$router.push("/Dashboard");
//           }, 2000);
//           break;

//         case "RSM":
//           RouterListRSM.map((MainRouter) => {
//             RouterArray.map((StoreRouter) => {
//               if (StoreRouter.module_name === MainRouter.MenuName) {
//                 StoreRouter.module_rights.map((root_module_rights) => {
//                   if (root_module_rights.VIEW === true) {
//                     subModuleArray.push(MainRouter);
//                     if (StoreRouter.sub_modules) {
//                       StoreRouter.sub_modules.map((sub_modle) => {
//                         if (MainRouter.SubMenu) {
//                           MainRouter.SubMenu.map((main_sub) => {
//                             let Object = main_sub;
//                             Object.root_module = MainRouter.MenuName;
//                             if (
//                               sub_modle.module_name
//                                 .toLowerCase()
//                                 .replaceAll(" ", "") ===
//                               main_sub.MenuName.toLowerCase().replaceAll(
//                                 " ",
//                                 ""
//                               )
//                             ) {
//                               sub_modle.module_rights.map((moduleRights) => {
//                                 if (moduleRights.VIEW === true) {
//                                   localSubMenuListArray.push(main_sub);
//                                 }
//                               });
//                             }
//                           });
//                         }
//                       });
//                     }
//                     self.NewRouterDetails.push(MainRouter);
//                   }
//                 });
//               }
//             });
//           });
//           subModuleArray.map((item) => {
//             let Object = item;
//             Object.subModule = [];
//             localSubMenuListArray.map((sub_item) => {
//               if (
//                 item.MenuName.toLowerCase().replaceAll(" ", "") ===
//                 sub_item.root_module.toLowerCase().replaceAll(" ", "")
//               ) {
//                 if (item.has_child_routes == true) {
//                   Object.subModule.push(sub_item);
//                 }
//               }
//             });
//           });
//           self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
//           setTimeout(() => {
//             this.RouterList = self.$store.getters.get_router_details;
//             this.$router.push("/ActiveTickets");
//           }, 2000);
//           break;

//         case "AGENT":
//           RouterListAgent.map((MainRouter) => {
//             RouterArray.map((StoreRouter) => {
//               if (StoreRouter.module_name === MainRouter.MenuName) {
//                 StoreRouter.module_rights.map((root_module_rights) => {
//                   if (root_module_rights.VIEW === true) {
//                     subModuleArray.push(MainRouter);
//                     if (StoreRouter.sub_modules) {
//                       StoreRouter.sub_modules.map((sub_modle) => {
//                         if (MainRouter.SubMenu) {
//                           MainRouter.SubMenu.map((main_sub) => {
//                             let Object = main_sub;
//                             Object.root_module = MainRouter.MenuName;
//                             if (
//                               sub_modle.module_name
//                                 .toLowerCase()
//                                 .replaceAll(" ", "") ===
//                               main_sub.MenuName.toLowerCase().replaceAll(
//                                 " ",
//                                 ""
//                               )
//                             ) {
//                               sub_modle.module_rights.map((moduleRights) => {
//                                 if (moduleRights.VIEW === true) {
//                                   localSubMenuListArray.push(main_sub);
//                                 }
//                               });
//                             }
//                           });
//                         }
//                       });
//                     }
//                     self.NewRouterDetails.push(MainRouter);
//                   }
//                 });
//               }
//             });
//           });
//           subModuleArray.map((item) => {
//             let Object = item;
//             Object.subModule = [];
//             localSubMenuListArray.map((sub_item) => {
//               if (
//                 item.MenuName.toLowerCase().replaceAll(" ", "") ===
//                 sub_item.root_module.toLowerCase().replaceAll(" ", "")
//               ) {
//                 if (item.has_child_routes == true) {
//                   Object.subModule.push(sub_item);
//                 }
//               }
//             });
//           });
//           self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
//           setTimeout(() => {
//             this.RouterList = self.$store.getters.get_router_details;
//             this.$router.push("/ActiveTickets");
//           }, 2000);
//           break;

//         case "ADMIN":
//           RouterListAdminOwner.map((MainRouter) => {
//             RouterArray.map((StoreRouter) => {
//               if (StoreRouter.module_name === MainRouter.MenuName) {
//                 StoreRouter.module_rights.map((root_module_rights) => {
//                   if (root_module_rights.VIEW === true) {
//                     subModuleArray.push(MainRouter);
//                     if (StoreRouter.sub_modules) {
//                       StoreRouter.sub_modules.map((sub_modle) => {
//                         if (MainRouter.SubMenu) {
//                           MainRouter.SubMenu.map((main_sub) => {
//                             let Object = main_sub;
//                             Object.root_module = MainRouter.MenuName;
//                             if (
//                               sub_modle.module_name
//                                 .toLowerCase()
//                                 .replaceAll(" ", "") ===
//                               main_sub.MenuName.toLowerCase().replaceAll(
//                                 " ",
//                                 ""
//                               )
//                             ) {
//                               sub_modle.module_rights.map((moduleRights) => {
//                                 if (moduleRights.VIEW === true) {
//                                   localSubMenuListArray.push(main_sub);
//                                 }
//                               });
//                             }
//                           });
//                         }
//                       });
//                     }
//                     self.NewRouterDetails.push(MainRouter);
//                   }
//                 });
//               }
//             });
//           });
//           subModuleArray.map((item) => {
//             let Object = item;
//             Object.subModule = [];
//             localSubMenuListArray.map((sub_item) => {
//               if (
//                 item.MenuName.toLowerCase().replaceAll(" ", "") ===
//                 sub_item.root_module.toLowerCase().replaceAll(" ", "")
//               ) {
//                 if (item.has_child_routes == true) {
//                   Object.subModule.push(sub_item);
//                 }
//               }
//             });
//           });
//           self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
//           setTimeout(() => {
//             this.RouterList = self.$store.getters.get_router_details;
//             this.$router.push("/Dashboard");
//           }, 2000);
//           break;

//         case "OWNER":
//           RouterListAdminOwner.map((MainRouter) => {
//             RouterArray.map((StoreRouter) => {
//               if (StoreRouter.module_name === MainRouter.MenuName) {
//                 StoreRouter.module_rights.map((root_module_rights) => {
//                   if (root_module_rights.VIEW === true) {
//                     subModuleArray.push(MainRouter);
//                     if (StoreRouter.sub_modules) {
//                       StoreRouter.sub_modules.map((sub_modle) => {
//                         if (MainRouter.SubMenu) {
//                           MainRouter.SubMenu.map((main_sub) => {
//                             let Object = main_sub;
//                             Object.root_module = MainRouter.MenuName;
//                             if (
//                               sub_modle.module_name
//                                 .toLowerCase()
//                                 .replaceAll(" ", "") ===
//                               main_sub.MenuName.toLowerCase().replaceAll(
//                                 " ",
//                                 ""
//                               )
//                             ) {
//                               sub_modle.module_rights.map((moduleRights) => {
//                                 if (moduleRights.VIEW === true) {
//                                   localSubMenuListArray.push(main_sub);
//                                 }
//                               });
//                             }
//                           });
//                         }
//                       });
//                     }
//                     self.NewRouterDetails.push(MainRouter);
//                   }
//                 });
//               }
//             });
//           });
//           subModuleArray.map((item) => {
//             let Object = item;
//             Object.subModule = [];
//             localSubMenuListArray.map((sub_item) => {
//               if (
//                 item.MenuName.toLowerCase().replaceAll(" ", "") ===
//                 sub_item.root_module.toLowerCase().replaceAll(" ", "")
//               ) {
//                 if (item.has_child_routes == true) {
//                   Object.subModule.push(sub_item);
//                 }
//               }
//             });
//           });
//           self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
//           setTimeout(() => {
//             this.RouterList = self.$store.getters.get_router_details;
//             this.$router.push("/Dashboard");
//           }, 2000);
//           break;

//         case "SERVICE_PARTNER":
//           RouterListPartner.map((MainRouter) => {
//             RouterArray.map((StoreRouter) => {
//               if (StoreRouter.module_name === MainRouter.MenuName) {
//                 StoreRouter.module_rights.map((root_module_rights) => {
//                   if (root_module_rights.VIEW === true) {
//                     subModuleArray.push(MainRouter);
//                     if (StoreRouter.sub_modules) {
//                       StoreRouter.sub_modules.map((sub_modle) => {
//                         if (MainRouter.SubMenu) {
//                           MainRouter.SubMenu.map((main_sub) => {
//                             let Object = main_sub;
//                             Object.root_module = MainRouter.MenuName;
//                             if (
//                               sub_modle.module_name
//                                 .toLowerCase()
//                                 .replaceAll(" ", "") ===
//                               main_sub.MenuName.toLowerCase().replaceAll(
//                                 " ",
//                                 ""
//                               )
//                             ) {
//                               sub_modle.module_rights.map((moduleRights) => {
//                                 if (moduleRights.VIEW === true) {
//                                   localSubMenuListArray.push(main_sub);
//                                 }
//                               });
//                             }
//                           });
//                         }
//                       });
//                     }
//                     self.NewRouterDetails.push(MainRouter);
//                   }
//                 });
//               }
//             });
//           });
//           subModuleArray.map((item) => {
//             let Object = item;
//             Object.subModule = [];
//             localSubMenuListArray.map((sub_item) => {
//               if (
//                 item.MenuName.toLowerCase().replaceAll(" ", "") ===
//                 sub_item.root_module.toLowerCase().replaceAll(" ", "")
//               ) {
//                 if (item.has_child_routes == true) {
//                   Object.subModule.push(sub_item);
//                 }
//               }
//             });
//           });
//           self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
//           setTimeout(() => {
//             this.RouterList = self.$store.getters.get_router_details;
//             this.$router.push("/Dashboard");
//           }, 2000);
//           break;

//         case "STORE_MANAGER":
//           RouterListAdminOwner.map((MainRouter) => {
//             RouterArray.map((StoreRouter) => {
//               if (StoreRouter.module_name === MainRouter.MenuName) {
//                 StoreRouter.module_rights.map((root_module_rights) => {
//                   if (root_module_rights.VIEW === true) {
//                     subModuleArray.push(MainRouter);
//                     if (StoreRouter.sub_modules) {
//                       StoreRouter.sub_modules.map((sub_modle) => {
//                         if (MainRouter.SubMenu) {
//                           MainRouter.SubMenu.map((main_sub) => {
//                             let Object = main_sub;
//                             Object.root_module = MainRouter.MenuName;
//                             if (
//                               sub_modle.module_name
//                                 .toLowerCase()
//                                 .replaceAll(" ", "") ===
//                               main_sub.MenuName.toLowerCase().replaceAll(
//                                 " ",
//                                 ""
//                               )
//                             ) {
//                               sub_modle.module_rights.map((moduleRights) => {
//                                 if (moduleRights.VIEW === true) {
//                                   localSubMenuListArray.push(main_sub);
//                                 }
//                               });
//                             }
//                           });
//                         }
//                       });
//                     }
//                     self.NewRouterDetails.push(MainRouter);
//                   }
//                 });
//               }
//             });
//           });
//           subModuleArray.map((item) => {
//             let Object = item;
//             Object.subModule = [];
//             localSubMenuListArray.map((sub_item) => {
//               if (
//                 item.MenuName.toLowerCase().replaceAll(" ", "") ===
//                 sub_item.root_module.toLowerCase().replaceAll(" ", "")
//               ) {
//                 if (item.has_child_routes == true) {
//                   Object.subModule.push(sub_item);
//                 }
//               }
//             });
//           });
//           self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
//           setTimeout(() => {
//             this.RouterList = self.$store.getters.get_router_details;
//             this.$router.push("/Dashboard");
//           }, 2000);
//           break;

//         case "PARTNER_AGENT":
//           RouterListPartner.map((MainRouter) => {
//             RouterArray.map((StoreRouter) => {
//               if (StoreRouter.module_name === MainRouter.MenuName) {
//                 StoreRouter.module_rights.map((root_module_rights) => {
//                   if (root_module_rights.VIEW === true) {
//                     subModuleArray.push(MainRouter);
//                     if (StoreRouter.sub_modules) {
//                       StoreRouter.sub_modules.map((sub_modle) => {
//                         if (MainRouter.SubMenu) {
//                           MainRouter.SubMenu.map((main_sub) => {
//                             let Object = main_sub;
//                             Object.root_module = MainRouter.MenuName;
//                             if (
//                               sub_modle.module_name
//                                 .toLowerCase()
//                                 .replaceAll(" ", "") ===
//                               main_sub.MenuName.toLowerCase().replaceAll(
//                                 " ",
//                                 ""
//                               )
//                             ) {
//                               sub_modle.module_rights.map((moduleRights) => {
//                                 if (moduleRights.VIEW === true) {
//                                   localSubMenuListArray.push(main_sub);
//                                 }
//                               });
//                             }
//                           });
//                         }
//                       });
//                     }
//                     self.NewRouterDetails.push(MainRouter);
//                   }
//                 });
//               }
//             });
//           });
//           subModuleArray.map((item) => {
//             let Object = item;
//             Object.subModule = [];
//             localSubMenuListArray.map((sub_item) => {
//               if (
//                 item.MenuName.toLowerCase().replaceAll(" ", "") ===
//                 sub_item.root_module.toLowerCase().replaceAll(" ", "")
//               ) {
//                 if (item.has_child_routes == true) {
//                   Object.subModule.push(sub_item);
//                 }
//               }
//             });
//           });
//           self.$store.commit("SET_ROUTER_DETAILS", RouterListAdminOwner);
//           setTimeout(() => {
//             this.RouterList = self.$store.getters.get_router_details;
//             this.$router.push("/Dashboard");
//           }, 2000);
//           break;
//         case "DEALER_OWNER":
//           RouterListDealer.map((MainRouter) => {
//             RouterArray.map((StoreRouter) => {
//               if (StoreRouter.module_name === MainRouter.MenuName) {
//                 StoreRouter.module_rights.map((root_module_rights) => {
//                   if (root_module_rights.VIEW === true) {
//                     subModuleArray.push(MainRouter);
//                     if (StoreRouter.sub_modules) {
//                       StoreRouter.sub_modules.map((sub_modle) => {
//                         if (MainRouter.SubMenu) {
//                           MainRouter.SubMenu.map((main_sub) => {
//                             let Object = main_sub;
//                             Object.root_module = MainRouter.MenuName;
//                             if (
//                               sub_modle.module_name
//                                 .toLowerCase()
//                                 .replaceAll(" ", "") ===
//                               main_sub.MenuName.toLowerCase().replaceAll(
//                                 " ",
//                                 ""
//                               )
//                             ) {
//                               sub_modle.module_rights.map((moduleRights) => {
//                                 if (moduleRights.VIEW === true) {
//                                   localSubMenuListArray.push(main_sub);
//                                 }
//                               });
//                             }
//                           });
//                         }
//                       });
//                     }
//                     self.NewRouterDetails.push(MainRouter);
//                   }
//                 });
//               }
//             });
//           });
//           subModuleArray.map((item) => {
//             let Object = item;
//             Object.subModule = [];
//             localSubMenuListArray.map((sub_item) => {
//               if (
//                 item.MenuName.toLowerCase().replaceAll(" ", "") ===
//                 sub_item.root_module.toLowerCase().replaceAll(" ", "")
//               ) {
//                 if (item.has_child_routes == true) {
//                   Object.subModule.push(sub_item);
//                 }
//               }
//             });
//           });
//           self.$store.commit("SET_ROUTER_DETAILS", self.NewRouterDetails);
//           setTimeout(() => {
//             this.RouterList = self.$store.getters.get_router_details;
//             this.$router.push("/ActiveTickets");
//           }, 2000);
//           break;
//       }
//     },
//   },
// };
