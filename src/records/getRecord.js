import { BASE_URL, API_VERSION } from '../config.js';
import { salesforceRequest } from '../utils/request.js';
import { logError } from '../utils/logger.js';

/**
 * Get a Salesforce record for a given object type and record ID
 * @param {Object} params
 * @param {string} params.token - Salesforce access token
 * @param {string} params.objectType - Salesforce object type (e.g. 'Lead', 'Contact')
 * @param {string} params.recordId - ID of the record to retrieve
 * @returns {Promise<Object>} - Record data
 */
export const getRecord = async ({ token, objectType, recordId }) => {
  const url = `${BASE_URL}/data/${API_VERSION}/sobjects/${objectType}/${recordId}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const res = await salesforceRequest({ method: 'get', url, headers });
    console.log(`📄 ${objectType} with ID ${recordId} retrieved successfully`);
    return {
      status: res.status,
      body: res.data,
    }
  } catch (error) {
    logError(error, url, {}, `Getting ${objectType} with ID ${recordId}`);
    throw new Error(`Failed to get ${objectType} with ID ${recordId} from Salesforce`);
  }
};
