import axios from 'axios';
import { logError } from './logger.js'; // Make sure the path is correct

/**
 * Performs a Salesforce API request with standard error handling
 * @param {Object} params
 * @param {string} params.method - HTTP method (GET, POST, etc.)
 * @param {string} params.url - Full Salesforce API URL
 * @param {Object} [params.headers] - Request headers
 * @param {Object|null} [params.data] - Request body data
 * @returns {Promise<Object>} - Axios response
 */
export const salesforceRequest = async ({ method, url, headers = {}, data = null }) => {
  try {
    const response = await axios({ method, url, headers, data });
    console.log(`✅ ${method.toUpperCase()} ${url}`);
    return response;
  } catch (error) {
    if (error.response) {
      const { status, data: errData } = error.response;
      const message = `[${status}] Salesforce API Error: ${errData[0]?.message || 'Unknown'}`;

      console.error(`❌ ${method.toUpperCase()} ${url}`);
      console.error(`🔹 Status: ${status}`);
      console.error(`🔹 Error:`, JSON.stringify(errData, null, 2));

      logError(error, url, data, message); // Unified error logging
      throw new Error(message);
    }

    logError(error, url, data, `Unhandled error during ${method.toUpperCase()} ${url}`);
    throw new Error(`Network or unexpected error during ${method.toUpperCase()} request`);
  }
};
