import { BASE_URL, API_VERSION } from '../config.js';
import { salesforceRequest } from '../utils/request.js';
import { logError } from '../utils/logger.js';

/**
 * Update a Salesforce record for a given object type and record ID
 * @param {Object} params
 * @param {string} params.token - Salesforce access token
 * @param {string} params.objectType - Salesforce object type (e.g. 'Lead', 'Contact')
 * @param {string} params.recordId - ID of the record to update
 * @param {Object} params.body - Record payload
 * @returns {Promise<Object>} - Updated record data
 */
export const updateRecord = async ({ token, objectType, recordId, body }) => {
  const url = `${BASE_URL}/data/${API_VERSION}/sobjects/${objectType}/${recordId}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const res = await salesforceRequest({ method: 'patch', url, headers, data: body });
    console.log(`🔄 ${objectType} with ID ${recordId} updated successfully`);
    return {
      status: res.status,
      body: res.data,
    }
  } catch (error) {
    logError(error, url, body, `Updating ${objectType} with ID ${recordId}`);
    throw new Error(`Failed to update ${objectType} with ID ${recordId} in Salesforce`);
  }
};
