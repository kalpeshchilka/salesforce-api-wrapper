export const logError = (error, url, body = null) => {
  if (error.response) {
    console.error("❌ Salesforce API Error");
    console.error("🔹 URL:", url);
    if (body) console.error("🔹 Request Body:", JSON.stringify(body, null, 2));
    console.error("🔹 Status:", error.response.status, error.response.statusText);
    console.error("🔹 Response Body:", JSON.stringify(error.response.data, null, 2));
  } else if (error.request) {
    console.error("⚠️ No response received");
    console.error("🔹 Request:", error.request);
  } else {
    console.error("💥 Error:", error.message);
  }
};