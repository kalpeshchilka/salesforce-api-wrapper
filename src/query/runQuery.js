import { BASE_URL, API_VERSION } from '../config.js';
import { salesforceRequest } from '../utils/request.js';
import { logError } from '../utils/logger.js';

/**
 * Run a SOQL query against Salesforce data
 * @param {Object} params
 * @param {string} params.token - Salesforce access token
 * @param {string} params.soql - SOQL query string
 * @param {boolean} [params.encode=false] - Whether to URL-encode the query
 * @returns {Promise<Object>} - Query result data
 */
export const runQuery = async ({ token, soql, encode = false }) => {
  const query = encode ? encodeURIComponent(soql) : soql;
  const url = `${BASE_URL}/data/${API_VERSION}/query?q=${query}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const res = await salesforceRequest({ method: 'get', url, headers });
    console.log(`🔍 SOQL query executed successfully`);
    return {
      status: res.status,
      body: res.data,
    };
  } catch (error) {
    logError(error, url, { soql }, 'Running SOQL query');
    throw new Error('Failed to execute SOQL query in Salesforce');
  }
};
