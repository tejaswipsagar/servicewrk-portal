/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const Get_Current_User_Details = /* GraphQL */ `
  query Get_Current_User_Details($input: GetCurrentUserDetailsInput) {
    Get_Current_User_Details(input: $input)
  }
`;
export const OrganizationDashboard = /* GraphQL */ `
  query OrganizationDashboard($input: OrganizationIDInput) {
    OrganizationDashboard(input: $input)
  }
`;
export const List_Users = /* GraphQL */ `
  query List_Users($input: ListUsersInput) {
    List_Users(input: $input)
  }
`;
export const List_Logs = /* GraphQL */ `
  query List_Logs($input: ListLogsInput) {
    List_Logs(input: $input)
  }
`;
export const List_Categories = /* GraphQL */ `
  query List_Categories($input: ListCategoriesInput) {
    List_Categories(input: $input)
  }
`;
export const List_Services_By_Category = /* GraphQL */ `
  query List_Services_By_Category($input: ListServicesByCategoryInput) {
    List_Services_By_Category(input: $input)
  }
`;
export const ListMasterCategories = /* GraphQL */ `
  query ListMasterCategories {
    ListMasterCategories
  }
`;
export const ListAllActiveCategories = /* GraphQL */ `
  query ListAllActiveCategories($input: ListAllActiveCategoriesInput) {
    ListAllActiveCategories(input: $input)
  }
`;
export const ListAllActiceManufacturers = /* GraphQL */ `
  query ListAllActiceManufacturers {
    ListAllActiceManufacturers
  }
`;
export const List_All_Organizations_Service_Center = /* GraphQL */ `
  query List_All_Organizations_Service_Center(
    $input: ListAllOrganizationsServiceCenterInput
  ) {
    List_All_Organizations_Service_Center(input: $input)
  }
`;
export const ListAllCategoriesOfOrganization = /* GraphQL */ `
  query ListAllCategoriesOfOrganization(
    $input: ListAllCategoriesOfOrganizationInput
  ) {
    ListAllCategoriesOfOrganization(input: $input)
  }
`;
export const List_Service_Type = /* GraphQL */ `
  query List_Service_Type($input: ListServiceTypeInput) {
    List_Service_Type(input: $input)
  }
`;
export const List_Services = /* GraphQL */ `
  query List_Services($input: ListServicesInput) {
    List_Services(input: $input) {
      status
      data {
        items {
          service_id
          category_id
          master_category_id
          service_display_id
          service_enable_type
          organization_id
          component_count
          component_ids
          is_visible
          service_price
          service_technician_enabled
          service_created_by
          service_created_on
          service_name
          service_credits
          s3_key
          service_s3_files {
            file_name
            file_type
            file_url
            file_size
            __typename
          }
          service_type_ids
          category_name
          manufacturer_name
          service_source
          service_status
          service_ticket_prefix
          autotag_to_users
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;
export const List_Territories = /* GraphQL */ `
  query List_Territories($input: ListTerritoriesInput) {
    List_Territories(input: $input)
  }
`;
export const List_Components = /* GraphQL */ `
  query List_Components($input: ListComponentsInput) {
    List_Components(input: $input)
  }
`;
export const List_Service_Based_Components = /* GraphQL */ `
  query List_Service_Based_Components($input: ListServiceBasedComponentsInput) {
    List_Service_Based_Components(input: $input)
  }
`;
export const List_Representatives = /* GraphQL */ `
  query List_Representatives($input: ListRepresentativesInput) {
    List_Representatives(input: $input)
  }
`;
export const List_Service_Based_ServiceTypes = /* GraphQL */ `
  query List_Service_Based_ServiceTypes(
    $input: ListServiceBasedServiceTypesInput
  ) {
    List_Service_Based_ServiceTypes(input: $input)
  }
`;
export const List_Open_Tickets = /* GraphQL */ `
  query List_Open_Tickets($input: ListTicketsInput) {
    List_Open_Tickets(input: $input)
  }
`;
export const List_closed_Tickets = /* GraphQL */ `
  query List_closed_Tickets($input: ListTicketsInput) {
    List_closed_Tickets(input: $input)
  }
`;
export const List_Organizations_Settings = /* GraphQL */ `
  query List_Organizations_Settings($input: ListOrganizationsSettingsInput) {
    List_Organizations_Settings(input: $input)
  }
`;
export const List_Emails = /* GraphQL */ `
  query List_Emails($input: ListEmailsInput) {
    List_Emails(input: $input)
  }
`;
export const List_Categories_By_Selected_Master_Category = /* GraphQL */ `
  query List_Categories_By_Selected_Master_Category(
    $input: ListCategoriesByMasterCategoryInput
  ) {
    List_Categories_By_Selected_Master_Category(input: $input) {
      status
      data {
        items {
          category_id
          category_created_on
          master_category_id
          master_category_name
          category_name
          category_status
          category_type
          category_ticket_prefix
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;
export const Get_Enterprise_Details = /* GraphQL */ `
  query Get_Enterprise_Details($input: OrganizationIDInput) {
    Get_Enterprise_Details(input: $input)
  }
`;
export const List_UserType_And_Location_Based_Users = /* GraphQL */ `
  query List_UserType_And_Location_Based_Users(
    $input: ListUserTypeAndLocationBasedUsersInput
  ) {
    List_UserType_And_Location_Based_Users(input: $input)
  }
`;
export const List_Location_Based_Representatives = /* GraphQL */ `
  query List_Location_Based_Representatives(
    $input: ListLocationBasedRepresentativesInput
  ) {
    List_Location_Based_Representatives(input: $input)
  }
`;
export const List_Scheduled_Ticket = /* GraphQL */ `
  query List_Scheduled_Ticket($input: ListScheduledTicketInput) {
    List_Scheduled_Ticket(input: $input)
  }
`;
export const List_Enterprise_Customers = /* GraphQL */ `
  query List_Enterprise_Customers($input: ListEnterpriseCustomersInput) {
    List_Enterprise_Customers(input: $input)
  }
`;
export const List_Primary_Customer_Locations = /* GraphQL */ `
  query List_Primary_Customer_Locations(
    $input: ListLocationsOfPrimaryCustomerInput
  ) {
    List_Primary_Customer_Locations(input: $input)
  }
`;
export const Search_CustomerBy_Name_Email_PhoneNo_ID = /* GraphQL */ `
  query Search_CustomerBy_Name_Email_PhoneNo_ID(
    $input: SearchCustomerByNameEmailPhoneNoIDInput
  ) {
    Search_CustomerBy_Name_Email_PhoneNo_ID(input: $input)
  }
`;
export const ListPartnerUsers = /* GraphQL */ `
  query ListPartnerUsers($input: ListPartnerUsersInput) {
    ListPartnerUsers(input: $input)
  }
`;
export const ListCreditRecharges = /* GraphQL */ `
  query ListCreditRecharges($input: ListCreditRechargesInput) {
    ListCreditRecharges(input: $input)
  }
`;
export const ListEnterpriseDealers = /* GraphQL */ `
  query ListEnterpriseDealers($input: ListDealersInput) {
    ListEnterpriseDealers(input: $input)
  }
`;
export const listAttendanceHistory = /* GraphQL */ `
  query ListAttendanceHistory($input: ListAttendanceInput) {
    listAttendanceHistory(input: $input)
  }
`;
export const ListCreditsTransactionLogs = /* GraphQL */ `
  query ListCreditsTransactionLogs($input: ListCreditsTransactionLogsInput) {
    ListCreditsTransactionLogs(input: $input)
  }
`;
export const ListTaggedComponentsOfServices = /* GraphQL */ `
  query ListTaggedComponentsOfServices(
    $input: ListTaggedComponentsOfServicesInput
  ) {
    ListTaggedComponentsOfServices(input: $input)
  }
`;
export const ListComponentTransactionHistory = /* GraphQL */ `
  query ListComponentTransactionHistory($input: OrganizationIDInput) {
    ListComponentTransactionHistory(input: $input)
  }
`;
export const ListComponentsInventory = /* GraphQL */ `
  query ListComponentsInventory($input: OrganizationIDInput) {
    ListComponentsInventory(input: $input)
  }
`;
export const ListAvailableComponentsInServiceCenter = /* GraphQL */ `
  query ListAvailableComponentsInServiceCenter($input: ServiceCenterIDInput) {
    ListAvailableComponentsInServiceCenter(input: $input)
  }
`;
export const ListTicketWorkLogs = /* GraphQL */ `
  query ListTicketWorkLogs($input: ListTicketWorkLogsInput) {
    ListTicketWorkLogs(input: $input)
  }
`;
export const ListQuotations = /* GraphQL */ `
  query ListQuotations($input: ListQuotationsInput) {
    ListQuotations(input: $input)
  }
`;
export const ListWorkFlows = /* GraphQL */ `
  query ListWorkFlows($input: ListWorkFlowsInput) {
    ListWorkFlows(input: $input)
  }
`;
export const ListTaggedProducts = /* GraphQL */ `
  query ListTaggedProducts($input: ListTaggedProductsInput) {
    ListTaggedProducts(input: $input)
  }
`;
export const ListSerialNumbers = /* GraphQL */ `
  query ListSerialNumbers($input: ListSerialNumbersInput) {
    ListSerialNumbers(input: $input)
  }
`;
export const ListOrganizationsReport = /* GraphQL */ `
  query ListOrganizationsReport($input: ListOrganizationsReportInput) {
    ListOrganizationsReport(input: $input)
  }
`;
export const ListTaggedItemsToTerritory = /* GraphQL */ `
  query ListTaggedItemsToTerritory($input: ListTaggedItemsToTerritoryInput) {
    ListTaggedItemsToTerritory(input: $input)
  }
`;
export const ListItemsByModuleIds = /* GraphQL */ `
  query ListItemsByModuleIds($input: ListItemsByModuleIdsInput) {
    ListItemsByModuleIds(input: $input)
  }
`;
export const GetAllMyOrganizations = /* GraphQL */ `
  query GetAllMyOrganizations($input: GetAllMyOrganizationsInput) {
    GetAllMyOrganizations(input: $input)
  }
`;
export const ListUsersMonthlyProductivity = /* GraphQL */ `
  query ListUsersMonthlyProductivity(
    $input: ListUsersMonthlyProductivityInput
  ) {
    ListUsersMonthlyProductivity(input: $input)
  }
`;
export const ListForms = /* GraphQL */ `
  query ListForms($input: ListFormsInput) {
    ListForms(input: $input)
  }
`;
export const ListIndividualOrBusinessCustomers = /* GraphQL */ `
  query ListIndividualOrBusinessCustomers(
    $input: ListIndividualOrBusinessCustomersInput
  ) {
    ListIndividualOrBusinessCustomers(input: $input)
  }
`;
export const ListProductFleetsInServiceCenter = /* GraphQL */ `
  query ListProductFleetsInServiceCenter(
    $input: listProductFleetsInServiceCenterInput
  ) {
    ListProductFleetsInServiceCenter(input: $input)
  }
`;
export const ListTutorialFiles = /* GraphQL */ `
  query ListTutorialFiles {
    ListTutorialFiles
  }
`;
export const ListTransactions = /* GraphQL */ `
  query ListTransactions($input: ListTransactionsInput) {
    ListTransactions(input: $input)
  }
`;
export const ListTicketInteractions = /* GraphQL */ `
  query ListTicketInteractions($input: ListTicketInteractionsInput) {
    ListTicketInteractions(input: $input)
  }
`;
export const GetCustomerTickets = /* GraphQL */ `
  query GetCustomerTickets($input: GetCustomerTicketsInput) {
    GetCustomerTickets(input: $input)
  }
`;
export const GetNearestCustomers = /* GraphQL */ `
  query GetNearestCustomers($input: GetNearestCustomerInput) {
    GetNearestCustomers(input: $input)
  }
`;
export const ListTicketTypes = /* GraphQL */ `
  query ListTicketTypes {
    ListTicketTypes
  }
`;
export const ListRepresentativeTickets = /* GraphQL */ `
  query ListRepresentativeTickets($input: ListRepresentativeTicketsInput) {
    ListRepresentativeTickets(input: $input)
  }
`;
export const ListModules = /* GraphQL */ `
  query ListModules($input: ListModulesInput) {
    ListModules(input: $input)
  }
`;
export const ListDesignationRole = /* GraphQL */ `
  query ListDesignationRole($input: ListDesignationRoleInput) {
    ListDesignationRole(input: $input)
  }
`;
export const GetDetailsOfDesignationRole = /* GraphQL */ `
  query GetDetailsOfDesignationRole($input: GetDetailsOfDesignationRoleInput) {
    GetDetailsOfDesignationRole(input: $input)
  }
`;
export const ListProductFleetStatusType = /* GraphQL */ `
  query ListProductFleetStatusType($input: ListProductFleetStatusTypeInput) {
    ListProductFleetStatusType(input: $input)
  }
`;
export const SearchCustomer = /* GraphQL */ `
  query SearchCustomer($input: SearchCustomerInput) {
    SearchCustomer(input: $input)
  }
`;
export const ListRepresentativeCustomers = /* GraphQL */ `
  query ListRepresentativeCustomers($input: ListRepresentativeCustomersInput) {
    ListRepresentativeCustomers(input: $input)
  }
`;
export const ListProductTicketDetails = /* GraphQL */ `
  query ListProductTicketDetails($input: ListProductTicketDetailsInput) {
    ListProductTicketDetails(input: $input)
  }
`;
export const GetCustomerDetails = /* GraphQL */ `
  query GetCustomerDetails($input: GetCustomerDetailsInput) {
    GetCustomerDetails(input: $input)
  }
`;
export const SearchCustomerAndSerialNo = /* GraphQL */ `
  query SearchCustomerAndSerialNo($input: SearchCustomerAndSerialNoInput) {
    SearchCustomerAndSerialNo(input: $input)
  }
`;
export const SearchTickets = /* GraphQL */ `
  query SearchTickets($input: SearchTicketsInput) {
    SearchTickets(input: $input)
  }
`;
export const ListSerialNoBasedTickets = /* GraphQL */ `
  query ListSerialNoBasedTickets($input: ListSerialNoBasedTicketsInput) {
    ListSerialNoBasedTickets(input: $input)
  }
`;
export const ListUserDailyReport = /* GraphQL */ `
  query ListUserDailyReport($input: ListUserDailyReportInput) {
    ListUserDailyReport(input: $input)
  }
`;
export const ListUserMonthlyReport = /* GraphQL */ `
  query ListUserMonthlyReport($input: ListUserMonthlyReportInput) {
    ListUserMonthlyReport(input: $input)
  }
`;
export const ListUsersMonthlyProductivityNew = /* GraphQL */ `
  query ListUsersMonthlyProductivityNew(
    $input: ListUsersMonthlyProductivityInput
  ) {
    ListUsersMonthlyProductivityNew(input: $input)
  }
`;
export const listPartiallyClosedTicket = /* GraphQL */ `
  query ListPartiallyClosedTicket($input: listPartiallyClosedTicketInput) {
    listPartiallyClosedTicket(input: $input)
  }
`;
export const ListCustomerTaggedRepresentative = /* GraphQL */ `
  query ListCustomerTaggedRepresentative(
    $input: ListCustomerTaggedRepresentativeInput
  ) {
    ListCustomerTaggedRepresentative(input: $input)
  }
`;
export const ListAllInvalidCustomers = /* GraphQL */ `
  query ListAllInvalidCustomers($input: ListAllInvalidCustomersInput) {
    ListAllInvalidCustomers(input: $input)
  }
`;
export const ListAllInvalidNumbers = /* GraphQL */ `
  query ListAllInvalidNumbers($input: ListAllInvalidNumbersInput) {
    ListAllInvalidNumbers(input: $input)
  }
`;
export const GetTotalDistanceForTicket = /* GraphQL */ `
  query GetTotalDistanceForTicket($input: GetTotalDistanceForTicketInput) {
    GetTotalDistanceForTicket(input: $input)
  }
`;
export const SearchScheduledTicket = /* GraphQL */ `
  query SearchScheduledTicket($input: SearchScheduledTicketInput) {
    SearchScheduledTicket(input: $input)
  }
`;
export const GetMonthlyTicketReport = /* GraphQL */ `
  query GetMonthlyTicketReport($input: GetMonthlyTicketReportInput) {
    GetMonthlyTicketReport(input: $input)
  }
`;
export const GetMonthlyClosedTicketReport = /* GraphQL */ `
  query GetMonthlyClosedTicketReport($input: GetMonthlyTicketReportInput) {
    GetMonthlyClosedTicketReport(input: $input)
  }
`;
export const ListRepresentativeComponents = /* GraphQL */ `
  query ListRepresentativeComponents(
    $input: ListRepresentativeComponentsInput
  ) {
    ListRepresentativeComponents(input: $input)
  }
`;
export const ListTransferProductFleet = /* GraphQL */ `
  query ListTransferProductFleet($input: ListTransferProductFleetInput) {
    ListTransferProductFleet(input: $input)
  }
`;
export const ListInvaliedUser = /* GraphQL */ `
  query ListInvaliedUser($input: ListInvaliedUserInput) {
    ListInvaliedUser(input: $input)
  }
`;
export const ListTransferProductFleetHistory = /* GraphQL */ `
  query ListTransferProductFleetHistory(
    $input: ListTransferProductFleetHistoryInput
  ) {
    ListTransferProductFleetHistory(input: $input)
  }
`;
export const ListLocationBasedPartnersorDealers = /* GraphQL */ `
  query ListLocationBasedPartnersorDealers(
    $input: ListUserTypeAndLocationBasedUsersInput
  ) {
    ListLocationBasedPartnersorDealers(input: $input)
  }
`;
export const SearchComponent = /* GraphQL */ `
  query SearchComponent($input: SearchComponentInput) {
    SearchComponent(input: $input)
  }
`;
export const ListReporters = /* GraphQL */ `
  query ListReporters($input: ListPartnerUsersInput) {
    ListReporters(input: $input)
  }
`;
export const ListAdditionalParts = /* GraphQL */ `
  query ListAdditionalParts($input: ListAdditionalPartsInput) {
    ListAdditionalParts(input: $input)
  }
`;
export const ListActiveTicketsForDealerAndPatner = /* GraphQL */ `
  query ListActiveTicketsForDealerAndPatner($input: ListTicketsInput) {
    ListActiveTicketsForDealerAndPatner(input: $input)
  }
`;
export const ListTerritoryTypes = /* GraphQL */ `
  query ListTerritoryTypes($input: ListTerritoryTypesInput) {
    ListTerritoryTypes(input: $input)
  }
`;
export const ListProductFleetReplacedHistory = /* GraphQL */ `
  query ListProductFleetReplacedHistory(
    $input: ListProductFleetReplacedHistoryInput
  ) {
    ListProductFleetReplacedHistory(input: $input)
  }
`;
export const ListRepresentivesProductFleet = /* GraphQL */ `
  query ListRepresentivesProductFleet(
    $input: ListRepresentivesProductFleetInput
  ) {
    ListRepresentivesProductFleet(input: $input)
  }
`;
export const GetCountOfCustomerTickets = /* GraphQL */ `
  query GetCountOfCustomerTickets($input: GetCountOfCustomerTicketsInput) {
    GetCountOfCustomerTickets(input: $input)
  }
`;
export const ListCustomerVisits = /* GraphQL */ `
  query ListCustomerVisits($input: ListCustomerVisitsInput) {
    ListCustomerVisits(input: $input)
  }
`;
export const ListComponentBasedServiceCenters = /* GraphQL */ `
  query ListComponentBasedServiceCenters(
    $input: ListComponentBasedServiceCentersInput
  ) {
    ListComponentBasedServiceCenters(input: $input)
  }
`;
export const ListSpecificTicketID = /* GraphQL */ `
  query ListSpecificTicketID($input: ListSpecificTicketIDInput) {
    ListSpecificTicketID(input: $input)
  }
`;
export const GetAllPartnerRepsAndDealerRepsInOrganization = /* GraphQL */ `
  query GetAllPartnerRepsAndDealerRepsInOrganization(
    $input: GetAllPartnerRepsAndDealerRepsInOrganizationInput
  ) {
    GetAllPartnerRepsAndDealerRepsInOrganization(input: $input)
  }
`;
export const GetTicketBasedRequestedComponent = /* GraphQL */ `
  query GetTicketBasedRequestedComponent(
    $input: GetTicketBasedRequestedComponentInput
  ) {
    GetTicketBasedRequestedComponent(input: $input)
  }
`;
export const ListVendors = /* GraphQL */ `
  query ListVendors($input: ListVendorsInput) {
    ListVendors(input: $input)
  }
`;
export const ListExcelGeneratesOfOrganizationTickets = /* GraphQL */ `
  query ListExcelGeneratesOfOrganizationTickets(
    $input: ListExcelGeneratesOfOrganizationTicketsInput
  ) {
    ListExcelGeneratesOfOrganizationTickets(input: $input)
  }
`;
export const ListTerritoriesAndPincodes = /* GraphQL */ `
  query ListTerritoriesAndPincodes($input: ListTerritoriesAndPincodesInput) {
    ListTerritoriesAndPincodes(input: $input)
  }
`;
export const ListExcelGeneratesOfMRF = /* GraphQL */ `
  query ListExcelGeneratesOfMRF($input: ListExcelGeneratesOfMRFInput) {
    ListExcelGeneratesOfMRF(input: $input)
  }
`;
export const ListGenerateExcelReportParams = /* GraphQL */ `
  query ListGenerateExcelReportParams(
    $input: ListGenerateExcelReportParamsInput
  ) {
    ListGenerateExcelReportParams(input: $input)
  }
`;
export const ListComponentsForTicket = /* GraphQL */ `
  query ListComponentsForTicket($input: ListServiceBasedComponentsInput) {
    ListComponentsForTicket(input: $input)
  }
`;
export const ListMRFTickets = /* GraphQL */ `
  query ListMRFTickets($input: ListMRFTicketsInput) {
    ListMRFTickets(input: $input)
  }
`;
export const SearchMRF = /* GraphQL */ `
  query SearchMRF($input: SearchMRFInput) {
    SearchMRF(input: $input)
  }
`;
export const ListPartnerTaggedTerritory = /* GraphQL */ `
  query ListPartnerTaggedTerritory($input: ListPartnerTaggedTerritoryInput) {
    ListPartnerTaggedTerritory(input: $input)
  }
`;
export const CheckUserForWorkflowApproval = /* GraphQL */ `
  query CheckUserForWorkflowApproval(
    $input: CheckUserForWorkflowApprovalInput
  ) {
    CheckUserForWorkflowApproval(input: $input)
  }
`;
export const ListComponentQuotationPdf = /* GraphQL */ `
  query ListComponentQuotationPdf($input: ListQuotationsInput) {
    ListComponentQuotationPdf(input: $input)
  }
`;
export const ListWorkflowsOfQuotations = /* GraphQL */ `
  query ListWorkflowsOfQuotations($input: ListWorkflowsOfQuotationsInput) {
    ListWorkflowsOfQuotations(input: $input)
  }
`;
export const SearchQuotationPdf = /* GraphQL */ `
  query SearchQuotationPdf($input: SearchQuotationPdfInput) {
    SearchQuotationPdf(input: $input)
  }
`;
export const GetParticularQuotationDetails = /* GraphQL */ `
  query GetParticularQuotationDetails(
    $input: GetParticularQuotationDetailsInput
  ) {
    GetParticularQuotationDetails(input: $input)
  }
`;
export const ListTagProductOrComponentsToVendor = /* GraphQL */ `
  query ListTagProductOrComponentsToVendor(
    $input: ListTagProductOrComponentsToVendorInput
  ) {
    ListTagProductOrComponentsToVendor(input: $input)
  }
`;
export const ListTagVendorsToProdcut = /* GraphQL */ `
  query ListTagVendorsToProdcut($input: ListTagVendorsToProdcutInput) {
    ListTagVendorsToProdcut(input: $input)
  }
`;
export const ListPurchaseOrder = /* GraphQL */ `
  query ListPurchaseOrder($input: ListPurchaseOrderInput) {
    ListPurchaseOrder(input: $input)
  }
`;
export const GetProductOrComponentBasedVendors = /* GraphQL */ `
  query GetProductOrComponentBasedVendors(
    $input: GetProductOrComponentBasedVendorsInput
  ) {
    GetProductOrComponentBasedVendors(input: $input)
  }
`;
export const GetTaggedProductsOrComponentsIdsOfVendor = /* GraphQL */ `
  query GetTaggedProductsOrComponentsIdsOfVendor(
    $input: GetTaggedProductsOrComponentsIdsOfVendorInput
  ) {
    GetTaggedProductsOrComponentsIdsOfVendor(input: $input)
  }
`;
export const GetParticularSerialNumberDetails = /* GraphQL */ `
  query GetParticularSerialNumberDetails(
    $input: GetParticularSerialNumberDetailsInput
  ) {
    GetParticularSerialNumberDetails(input: $input)
  }
`;
export const ListCustomerTaggedProducts = /* GraphQL */ `
  query ListCustomerTaggedProducts($input: ListCustomerTaggedProductsInput) {
    ListCustomerTaggedProducts(input: $input)
  }
`;
export const ListCabinetFolders = /* GraphQL */ `
  query ListCabinetFolders($input: ListCabinetFoldersInput) {
    ListCabinetFolders(input: $input)
  }
`;
export const GetProductReleatedTickets = /* GraphQL */ `
  query GetProductReleatedTickets($input: GetProductReleatedTicketsInput) {
    GetProductReleatedTickets(input: $input)
  }
`;
export const ListFGR = /* GraphQL */ `
  query ListFGR($input: ListFGRInput) {
    ListFGR(input: $input)
  }
`;
export const ListPincodeTypes = /* GraphQL */ `
  query ListPincodeTypes($input: ListPincodeTypesInput) {
    ListPincodeTypes(input: $input)
  }
`;
export const ListParticularHistory = /* GraphQL */ `
  query ListParticularHistory($input: ListParticularHistoryInput) {
    ListParticularHistory(input: $input)
  }
`;
export const getFGRDetails = /* GraphQL */ `
  query GetFGRDetails($input: GetFGRDetailsInput) {
    getFGRDetails(input: $input)
  }
`;
export const SearchPurchasedOrder = /* GraphQL */ `
  query SearchPurchasedOrder($input: SearchPurchasedOrderInput) {
    SearchPurchasedOrder(input: $input)
  }
`;
export const ListCustomerRFSTickets = /* GraphQL */ `
  query ListCustomerRFSTickets($input: ListCustomerRFSTicketsInput) {
    ListCustomerRFSTickets(input: $input)
  }
`;
export const ListDealerOrPartnerTaggedProducts = /* GraphQL */ `
  query ListDealerOrPartnerTaggedProducts(
    $input: ListDealerOrPartnerTaggedProductsInput
  ) {
    ListDealerOrPartnerTaggedProducts(input: $input)
  }
`;
export const GetDealersOrPartnerCustomers = /* GraphQL */ `
  query GetDealersOrPartnerCustomers(
    $input: GetDealersOrPartnerCustomersInput
  ) {
    GetDealersOrPartnerCustomers(input: $input)
  }
`;
export const GetOverallCustomersMap = /* GraphQL */ `
  query GetOverallCustomersMap($input: GetOverallCustomersMapInput) {
    GetOverallCustomersMap(input: $input)
  }
`;
export const ListDealerOrPartnerRFS = /* GraphQL */ `
  query ListDealerOrPartnerRFS($input: ListDealerOrPartnerRFSInput) {
    ListDealerOrPartnerRFS(input: $input)
  }
`;
export const ListFOC = /* GraphQL */ `
  query ListFOC($input: ListFOCInput) {
    ListFOC(input: $input)
  }
`;
export const ListFOCApprovals = /* GraphQL */ `
  query ListFOCApprovals($input: ListFOCInput) {
    ListFOCApprovals(input: $input)
  }
`;
export const ListHelloWRKRFS = /* GraphQL */ `
  query ListHelloWRKRFS($input: ListHelloWRKRFSInput) {
    ListHelloWRKRFS(input: $input)
  }
`;
export const GetCustomerDetailsForPhoneNumber = /* GraphQL */ `
  query GetCustomerDetailsForPhoneNumber(
    $input: GetCustomerDetailsForPhoneNumberInput
  ) {
    GetCustomerDetailsForPhoneNumber(input: $input)
  }
`;
export const ListCostConfiguration = /* GraphQL */ `
  query ListCostConfiguration($input: ListCostConfigurationInput) {
    ListCostConfiguration(input: $input)
  }
`;
export const ListClosedTicketsForInvoiceGenerate = /* GraphQL */ `
  query ListClosedTicketsForInvoiceGenerate(
    $input: ListClosedTicketsForInvoiceGenerateInput
  ) {
    ListClosedTicketsForInvoiceGenerate(input: $input)
  }
`;
export const ListInvoice = /* GraphQL */ `
  query ListInvoice($input: ListInvoiceInput) {
    ListInvoice(input: $input)
  }
`;
export const GetTicketServices = /* GraphQL */ `
  query GetTicketServices($input: GetTicketServicesInput) {
    GetTicketServices(input: $input)
  }
`;
export const ListWorkFlowPayments = /* GraphQL */ `
  query ListWorkFlowPayments($input: ListWorkFlowPaymentsInput) {
    ListWorkFlowPayments(input: $input)
  }
`;
export const UsersWorkFlowPayments = /* GraphQL */ `
  query UsersWorkFlowPayments($input: ListWorkFlowPaymentsInput) {
    UsersWorkFlowPayments(input: $input)
  }
`;
export const ListDealersRepOrAgentAttendance = /* GraphQL */ `
  query ListDealersRepOrAgentAttendance($input: ListAttendanceInput) {
    ListDealersRepOrAgentAttendance(input: $input)
  }
`;
export const ListDealersReport = /* GraphQL */ `
  query ListDealersReport($input: ListOrganizationsReportInput) {
    ListDealersReport(input: $input)
  }
`;
export const ListCustomerExcelOfOrganization = /* GraphQL */ `
  query ListCustomerExcelOfOrganization(
    $input: ListCustomerExcelOfOrganizationInput
  ) {
    ListCustomerExcelOfOrganization(input: $input)
  }
`;
export const GetSerialNumberDetails = /* GraphQL */ `
  query GetSerialNumberDetails($input: GetSerialNumberDetailsInput) {
    GetSerialNumberDetails(input: $input)
  }
`;
export const listApprovedComponentForTheTicket = /* GraphQL */ `
  query ListApprovedComponentForTheTicket(
    $input: listApprovedComponentForTheTicketInput
  ) {
    listApprovedComponentForTheTicket(input: $input)
  }
`;
export const GetCustomeByPhoneNumber = /* GraphQL */ `
  query GetCustomeByPhoneNumber($input: GetCustomeByPhoneNumberInput) {
    GetCustomeByPhoneNumber(input: $input)
  }
`;
export const GetCustomeByEmail = /* GraphQL */ `
  query GetCustomeByEmail($input: GetCustomeByEmailInput) {
    GetCustomeByEmail(input: $input)
  }
`;
export const GetParticularAttendanceDetails = /* GraphQL */ `
  query GetParticularAttendanceDetails(
    $input: GetParticularAttendanceDetailsInput
  ) {
    GetParticularAttendanceDetails(input: $input)
  }
`;
export const ListExcelOfSharedMonthlyClosedTicketReportDetailsToPartners = /* GraphQL */ `
  query ListExcelOfSharedMonthlyClosedTicketReportDetailsToPartners(
    $input: ListExcelOfSharedMonthlyClosedTicketReportDetailsToPartnersInput
  ) {
    ListExcelOfSharedMonthlyClosedTicketReportDetailsToPartners(input: $input)
  }
`;
export const GetPartnerCustomers = /* GraphQL */ `
  query GetPartnerCustomers($input: GetPartnerCustomersInput) {
    GetPartnerCustomers(input: $input)
  }
`;
