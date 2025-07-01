import { BASE_URL, API_VERSION } from '../config.js';
import { salesforceRequest } from '../utils/request.js';
import { logError } from '../utils/logger.js';

/**
 * Create a new Salesforce record for a given object type
 * @param {Object} params
 * @param {string} params.token - Salesforce access token
 * @param {string} params.objectType - Salesforce object type (e.g. 'Lead', 'Contact')
 * @param {Object} params.body - Record payload
 * @returns {Promise<Object>} - Created record data
 */
export const createRecord = async ({ token, objectType, body }) => {
  const url = `${BASE_URL}/data/${API_VERSION}/sobjects/${objectType}/`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const res = await salesforceRequest({ method: 'post', url, headers, data: body });
    console.log(`✅ ${objectType} created successfully:`, res.data);
    return {
      status: res.status,
      body: res.data,
    }
  } catch (error) {
    logError(error, url, body, `Creating ${objectType}`);
    throw new Error(`Failed to create ${objectType} in Salesforce`);
  }
};
