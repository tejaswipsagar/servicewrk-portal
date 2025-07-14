import { set, del } from "idb-keyval";

export async function fetchAndStoreOrgS3DataMethod(orgDetails) {
  try {
    const timestamp = Date.now();
    await del("org_s3_data");
    const productFleetUrl = `${orgDetails.organization_details.productfleet_s3_url}?cb=${timestamp}`;
    const customerListUrl = `${orgDetails.organization_details.customer_list_s3_url}?cb=${timestamp}`;
    const productFleetRes = await fetch(productFleetUrl);
    // const productFleetData = await productFleetRes.json();
    const customerListRes = await fetch(customerListUrl);
    const customerData = await customerListRes.json();
    const combinedData = {
      // product_fleet_data: productFleetData,
      customer_data: {
        customer_data_list: customerData,
        customer_version_id: orgDetails.organization_details.version_id,
      },
      current_org_id: orgDetails.organization_id,
    };
    await set("org_s3_data", combinedData);
    console.log("✅ org_s3_data refreshed in IndexedDB");
  } catch (error) {
    console.error("❌ Error storing org_s3_data:", error);
  }
}
