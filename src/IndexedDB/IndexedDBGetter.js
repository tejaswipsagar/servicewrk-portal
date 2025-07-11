import { get } from "idb-keyval";

export async function getOrgS3DataMethod() {
  try {
    const data = await get("org_s3_data");
    if (data) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("❌ Error retrieving org_s3_data:", error);
    return null;
  }
}
