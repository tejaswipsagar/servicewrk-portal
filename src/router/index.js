import Vue from "vue";
import VueRouter from "vue-router";
import LoginPage from "../views/MainHomePages/LoginPage.vue";
import NewLoginPage from "@/views/MainHomePages/NewLoginPage.vue";
import LandingPage from "../views/MainHomePages/LandingPage.vue";
import ReportIssue from "../views/ChildHomePages/ReportIssue.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/ReportIssue",
    name: "ReportIssue",
    component: ReportIssue,
  },
  // {
  //   path: "/",
  //   name: "LoginPage",
  //   component: LoginPage,
  // },
  {
    path: "/",
    name: "NewLoginPage",
    component: NewLoginPage,
  },
  {
    path: "/LandingPage",
    name: "LandingPage",
    component: LandingPage,
    children: [
      {
        name: "Dashboard",
        path: "/Dashboard",
        component: () =>
          import("@/views/ChildHomePages/Dashboard/DashboardView.vue"),
      },
      // {
      //   name: "ActiveTickets",
      //   path: "/ActiveTickets",
      //   component: () =>
      //     import("@/views/ChildHomePages/Tickets/ActiveTickets.vue"),
      // },
      // {
      //   name: "PartiallyClosedTickets",
      //   path: "/PartiallyClosedTickets",
      //   component: () =>
      //     import("@/views/ChildHomePages/Tickets/PartiallyClosedTickets.vue"),
      // },
      // {
      //   name: "ClosedTickets",
      //   path: "/ClosedTickets",
      //   component: () =>
      //     import("@/views/ChildHomePages/Tickets/ClosedTickets.vue"),
      // },
      // {
      //   name: "InactiveTickets",
      //   path: "/InactiveTickets",
      //   component: () =>
      //     import("@/views/ChildHomePages/Tickets/InactiveTickets.vue"),
      // },
      // {
      //   name: "ActiveTickets",
      //   path: "/ActiveTickets",
      //   component: () =>
      //     import("@/views/ChildHomePages/Tickets/ActiveTickets.vue"),
      // },
      // {
      //   name: "ClosedTickets",
      //   path: "/ClosedTickets",
      //   component: () =>
      //     import("@/views/ChildHomePages/Tickets/ClosedTickets.vue"),
      // },
      {
        name: "RequestForServices",
        path: "/RequestForServices",
        component: () =>
          import(
            "@/views/ChildHomePages/RequestForServices/RequestForServices.vue"
          ),
      },
      {
        name: "ScheduleServices",
        path: "/ScheduleServices",
        component: () =>
          import(
            "@/views/ChildHomePages/ScheduleServices/ScheduleServices.vue"
          ),
      },
      {
        name: "MRFTickets",
        path: "/MRFTickets",
        component: () =>
          import("@/views/ChildHomePages/MRFTickets/MRFTickets.vue"),
      },
      {
        name: "QuotationsList",
        path: "/QuotationsList",
        component: () =>
          import("@/views/ChildHomePages/Quotations/QuotationsList.vue"),
      },
      {
        name: "TemplateList",
        path: "/TemplateList",
        component: () =>
          import("@/views/ChildHomePages/Quotations/TemplateList.vue"),
      },
      {
        name: "ContractsList",
        path: "/ContractsList",
        component: () =>
          import("@/views/ChildHomePages/Contracts/ContractsList.vue"),
      },
      {
        name: "TemplateList",
        path: "/TemplateList",
        component: () =>
          import("@/views/ChildHomePages/Contracts/TemplateList.vue"),
      },
      {
        name: "AttendenceReport",
        path: "/AttendenceReport",
        component: () =>
          import("@/views/ChildHomePages/Analytics/AttendenceReport.vue"),
      },

      {
        name: "MonthlyUserReport",
        path: "/MonthlyUserReport",
        component: () =>
          import("@/views/ChildHomePages/Analytics/MonthlyUserReport.vue"),
      },
      {
        name: "MonthlyTicketReports",
        path: "/MonthlyTicketReports",
        component: () =>
          import("@/views/ChildHomePages/Analytics/MonthlyTicketReports.vue"),
      },
      {
        name: "AmcRenewalDue",
        path: "/AmcRenewalDue",
        component: () =>
          import("@/views/ChildHomePages/Analytics/AmcRenewalDue.vue"),
      },
      {
        name: "ServiceTypeReport",
        path: "/ServiceTypeReport",
        component: () =>
          import("@/views/ChildHomePages/Analytics/ServiceTypeReport.vue"),
      },
      {
        name: "TicketAgingReport",
        path: "/TicketAgingReport",
        component: () =>
          import("@/views/ChildHomePages/Analytics/TicketAgingReport.vue"),
      },
      {
        name: "ProductivityReport",
        path: "/ProductivityReport",
        component: () =>
          import("@/views/ChildHomePages/Analytics/ProductivityReport.vue"),
      },
      {
        name: "CustomerProducts",
        path: "/CustomerProducts",
        component: () =>
          import("@/views/ChildHomePages/Analytics/CustomerProducts.vue"),
      },
      {
        name: "TicketReports",
        path: "/TicketReports",
        component: () =>
          import("@/views/ChildHomePages/Analytics/TicketReports.vue"),
      },
      {
        name: "DealersView",
        path: "/DealersView",
        component: () => import("@/views/ChildHomePages/Users/DealersView.vue"),
      },

      {
        name: "EnterpriseUsers",
        path: "/EnterpriseUsers",
        component: () =>
          import("@/views/ChildHomePages/Users/EnterpriseUsers.vue"),
      },
      {
        name: "EnterpriseTechnicians",
        path: "/EnterpriseTechnicians",
        component: () =>
          import("@/views/ChildHomePages/Users/EnterpriseTechnicians.vue"),
      },
      {
        name: "ServicePartners",
        path: "/ServicePartners",
        component: () =>
          import("@/views/ChildHomePages/Users/ServicePartners.vue"),
      },
      {
        name: "AllRepsAndAgents.vue",
        path: "/AllRepsAndAgents",
        component: () =>
          import("@/views/ChildHomePages/Users/AllRepsAndAgents.vue"),
      },
      {
        name: "InvalidUsers",
        path: "/InvalidUsers",
        component: () =>
          import("@/views/ChildHomePages/Users/InvalidUsers.vue"),
      },
      {
        name: "ProductCatalogue",
        path: "/ProductCatalogue",
        component: () =>
          import("@/views/ChildHomePages/Products/ProductCatalogue.vue"),
      },
      {
        name: "ProductFleet",
        path: "/ProductFleet",
        component: () =>
          import("@/views/ChildHomePages/Products/ProductFleet2.vue"),
      },
      {
        name: "ComponentsView",
        path: "/ComponentsView",
        component: () =>
          import("@/views/ChildHomePages/Products/ComponentsView.vue"),
      },
      {
        name: "TerritoriesView",
        path: "/TerritoriesView",
        component: () =>
          import("@/views/ChildHomePages/Territories/TerritoriesView.vue"),
      },
      {
        name: "ServiceCenter",
        path: "/ServiceCenter",
        component: () =>
          import("@/views/ChildHomePages/Locations/ServiceCenter.vue"),
      },
      {
        name: "InventoryView",
        path: "/InventoryView",
        component: () =>
          import("@/views/ChildHomePages/Locations/InventoryView.vue"),
      },
      {
        name: "ProductFleetInventory",
        path: "/ProductFleetInventory",
        component: () =>
          import("@/views/ChildHomePages/Locations/ProductFleetInventory.vue"),
      },
      {
        name: "CustomersView",
        path: "/CustomersView",
        props: true,
        component: () =>
          import("@/views/ChildHomePages/Customers/CustomersView.vue"),
      },
      {
        name: "ServicePartnerCustomersView",
        path: "/PartnersCustomerView",
        props: true,
        component: () =>
          import(
            "@/views/ChildHomePages/ServicePartnerCustomers/ServicePartnerCustomers.vue"
          ),
      },
      // {
      //   name: "CustomersView",
      //   path: "/CustomersView",
      //   props: true,
      //   component: () =>
      //     import("@/views/ChildHomePages/Customers/CustomerViewOrig.vue"),
      // },
      {
        name: "SupportTypes",
        path: "/SupportTypes",
        component: () =>
          import("@/views/ChildHomePages/MastersSettings/AmcTypes.vue"),
      },
      {
        name: "ProductFleetStatus",
        path: "/ProductFleetStatus",
        component: () =>
          import(
            "@/views/ChildHomePages/MastersSettings/ProductFleetStatus.vue"
          ),
      },
      {
        name: "ServiceTypes",
        path: "/ServiceTypes",
        component: () =>
          import("@/views/ChildHomePages/MastersSettings/ServiceTypes.vue"),
      },
      {
        name: "AdditionalParts",
        path: "/AdditionalParts",
        component: () =>
          import("@/views/ChildHomePages/MastersSettings/AdditionalParts.vue"),
      },
      {
        name: "TerritoryCategories",
        path: "/TerritoryCategories",
        component: () =>
          import(
            "@/views/ChildHomePages/MastersSettings/TerritoryCategories.vue"
          ),
      },
      {
        name: "WipState",
        path: "/WipState",
        component: () =>
          import("@/views/ChildHomePages/MastersSettings/WipState.vue"),
      },
      {
        name: "EscalationNotification",
        path: "/EscalationNotification",
        component: () =>
          import(
            "@/views/ChildHomePages/MastersSettings/EscalationNotification.vue"
          ),
      },
      {
        name: "ProblemDescription",
        path: "/ProblemDescription",
        component: () =>
          import(
            "@/views/ChildHomePages/MastersSettings/ProblemDescription.vue"
          ),
      },
      {
        name: "ClosureRemarks",
        path: "/ClosureRemarks",
        component: () =>
          import("@/views/ChildHomePages/MastersSettings/ClosureRemarks.vue"),
      },
      {
        name: "CustomerCategory",
        path: "/CustomerCategory",
        component: () =>
          import("@/views/ChildHomePages/MastersSettings/CustomerCategory.vue"),
      },
      {
        name: "WorkflowSettings",
        path: "/WorkflowSettings",
        component: () =>
          import("@/views/ChildHomePages/MastersSettings/WorkflowSettings.vue"),
      },
      {
        name: "OrganizationSettings",
        path: "/OrganizationSettings",
        component: () =>
          import(
            "@/views/ChildHomePages/MastersSettings/OrganizationSettings.vue"
          ),
      },
      {
        name: "Designations",
        path: "/DesignationsView",
        component: () =>
          import("@/views/ChildHomePages/MastersSettings/DesignationsView.vue"),
      },
      {
        name: "Forms",
        path: "/ProductSales",
        component: () => import("@/views/ChildHomePages/Forms/FormsView.vue"),
      },
      {
        name: "AuditLogs",
        path: "/AuditLogs",
        component: () => import("@/views/ChildHomePages/Logs/AuditLogs.vue"),
      },
      {
        name: "AllModules",
        path: "/AllModules",
        component: () =>
          import("@/views/ChildHomePages/AllModules/AllModules.vue"),
      },
      {
        name: "ComponentsTransactionHistory",
        path: "/ComponentsTransactionHistory",
        component: () =>
          import(
            "@/views/ChildHomePages/Logs/ComponentsTransactionHistory.vue"
          ),
      },
      {
        name: "PartnerServiceCoOrdinators",
        path: "/PartnerServiceCoOrdinators",
        component: () =>
          import(
            "@/views/ChildHomePages/PartnerAgent/PartnerServiceCoOrdinators.vue"
          ),
      },
      {
        name: "PartnerReps",
        path: "/PartnerRepresentatives",
        component: () =>
          import(
            "@/views/ChildHomePages/PartnerReps/PartnerRepresentatives.vue"
          ),
      },
      {
        name: "DealerAgent",
        path: "/DealerAgent",
        component: () =>
          import("@/views/ChildHomePages/DealerAgent/DealerAgent.vue"),
      },
      {
        name: "DealerAgent",
        path: "/DealerAgent",
        component: () =>
          import("@/views/ChildHomePages/DealerAgent/DealerAgent.vue"),
      },
      {
        name: "DealerRepresentative",
        path: "/DealerRepresentative",
        component: () =>
          import(
            "@/views/ChildHomePages/DealerRepresentative/DealerRepresentative.vue"
          ),
      },
      {
        name: "Approvals",
        path: "/Approvals",
        component: () =>
          import("@/views/ChildHomePages/Approval/ApprovalView.vue"),
      },
      {
        name: "Payout Approvals",
        path: "/PayoutApprovals",
        component: () =>
          import("@/views/ChildHomePages/Approval/PayoutApproval.vue"),
      },
      {
        name: "ProductFleetApprovals",
        path: "/ProductFleetApprovals",
        component: () =>
          import("@/views/ChildHomePages/Approval/ProductFleetApprovals.vue"),
      },
      {
        name: "Product Fleet Tagging Approval",
        path: "/ProductFleetTaggingApproval",
        component: () =>
          import(
            "@/views/ChildHomePages/Approval/ProductFleetTaggingApproval.vue"
          ),
      },
      {
        name: "Quotation Approvals",
        path: "/QuotationApprovals",
        component: () =>
          import("@/views/ChildHomePages/Approval/QuotationApprovals.vue"),
      },
      {
        name: "QuotationsView",
        path: "/QuotationsView",
        component: () =>
          import("@/views/ChildHomePages/QuatationsNew/QuatationsView.vue"),
      },
      {
        name: "Vendors",
        path: "/VendorsView",
        component: () =>
          import("@/views/ChildHomePages/Vendors/VendorsView.vue"),
      },
      {
        name: "PurchaseOrder",
        path: "/PurchaseOrder",
        component: () =>
          import("@/views/ChildHomePages/PurchaseOrder/PurchaseOrder.vue"),
      },
      {
        name: "Cabinet",
        path: "/Cabinet",
        component: () =>
          import("@/views/ChildHomePages/Cabinet/CabinetView.vue"),
      },
      {
        name: "FGR",
        path: "/FgrApprovals",
        component: () => import("@/views/ChildHomePages/FGR/FgrApprovals.vue"),
      },
      {
        name: "FGR",
        path: "/FgrView",
        component: () => import("@/views/ChildHomePages/FGR/FgrView.vue"),
      },
      {
        name: "Product Fleet",
        path: "/DealerProducts",
        component: () =>
          import("@/views/ChildHomePages/DealerProduct/ProductFleet.vue"),
      },
      {
        name: "My Customers",
        path: "/MyCustomer",
        component: () =>
          import("@/views/ChildHomePages/DealerCustomer/DealerCustomer.vue"),
      },
      {
        name: "RFS",
        path: "/RFS",
        component: () =>
          import("@/views/ChildHomePages/DealerRFS/DealerRFS.vue"),
      },
      {
        name: "Tickets",
        path: "/Tickets",
        component: () =>
          import("@/views/ChildHomePages/NewTicketsTab/TicketView.vue"),
        children: [
          {
            name: "ActiveTickets",
            path: "/ActiveTickets",
            component: () =>
              import("@/views/ChildHomePages/Tickets/ActiveTickets.vue"),
          },
          {
            name: "PartiallyClosedTickets",
            path: "/PartiallyClosedTickets",
            component: () =>
              import(
                "@/views/ChildHomePages/Tickets/PartiallyClosedTickets.vue"
              ),
          },
          {
            name: "ClosedTickets",
            path: "/ClosedTickets",
            component: () =>
              import("@/views/ChildHomePages/Tickets/ClosedTickets.vue"),
          },
          {
            name: "InactiveTickets",
            path: "/InactiveTickets",
            component: () =>
              import("@/views/ChildHomePages/Tickets/InactiveTickets.vue"),
          },
          {
            name: "CostConfiguration",
            path: "/CostConfiguration",
            component: () =>
              import("@/views/ChildHomePages/CostConfig/CostConfiguration.vue"),
          },
          {
            name: "ServicePartnerPayout",
            path: "/ServicePartnerPayout",
            component: () =>
              import(
                "@/views/ChildHomePages/ServicePartnerPayout/ServicePartnerMT.vue"
              ),
          },
        ],
      },
      {
        name: "PartnersClosedTicketReports",
        path: "/PartnersClosedTicketReports",
        component: () =>
          import(
            "@/views/ChildHomePages/Analytics/PartnersClosedTicketReports.vue"
          ),
      },
      // {
      //   name: "Tickets",
      //   path: "/Tickets",
      //   component: () =>
      //     import("@/views/ChildHomePages/NewTicketsTab/NewTicketView.vue"),
      //   children: [
      //     {
      //       name: "ActiveTickets",
      //       path: "/ActiveTickets",
      //       component: () =>
      //         import("@/views/ChildHomePages/Tickets/NewActiveTickets.vue"),
      //     },
      //     {
      //       name: "ClosedTickets",
      //       path: "/ClosedTickets",
      //       component: () =>
      //         import("@/views/ChildHomePages/Tickets/NewClosedTickets.vue"),
      //     },
      //     {
      //       name: "PartiallyClosedTickets",
      //       path: "/PartiallyClosedTickets",
      //       component: () =>
      //         import(
      //           "@/views/ChildHomePages/Tickets/NewPartiallyClosedTickets.vue"
      //         ),
      //     },
      //   ],
      // },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
