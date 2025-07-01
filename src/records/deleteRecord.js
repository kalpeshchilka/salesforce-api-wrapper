import { BASE_URL, API_VERSION } from '../config.js';
import { salesforceRequest } from '../utils/request.js';
import { logError } from '../utils/logger.js';

/**
 * Delete a Salesforce record for a given object type and record ID
 * @param {Object} params
 * @param {string} params.token - Salesforce access token
 * @param {string} params.objectType - Salesforce object type (e.g. 'Lead', 'Contact')
 * @param {string} params.recordId - ID of the record to delete
 * @returns {Promise<Object>} - Result of the delete operation
 */
export const deleteRecord = async ({ token, objectType, recordId }) => {
  const url = `${BASE_URL}/data/${API_VERSION}/sobjects/${objectType}/${recordId}`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await salesforceRequest({ method: 'delete', url, headers });
    console.log(`🗑️ ${objectType} with ID ${recordId} deleted successfully`);
    return {
      status: res.status,
      body: res.data,
    }
  } catch (error) {
    logError(error, url, { objectType, recordId }, `Deleting ${objectType} with ID ${recordId}`);
    throw new Error(`Failed to delete ${objectType} with ID ${recordId} in Salesforce`);
  }
};
