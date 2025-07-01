import { BASE_URL } from '../config.js';
import { salesforceRequest } from '../utils/request.js';
import { logError } from '../utils/logger.js';

/**
 * Send data to Salesforce Apex REST endpoint for lead opportunity processing
 * @param {Object} params
 * @param {string} params.token - Salesforce access token
 * @param {Object} params.body - Payload to send to the Apex REST endpoint
 * @returns {Promise<Object>} - Response from Apex REST
 */
export const processLeadOpportunity = async ({ token, body }) => {
  const url = `${BASE_URL}/apexrest/leadOpportunityProcessor/`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const res = await salesforceRequest({
      method: 'post',
      url,
      headers,
      data: body,
    });
    console.log('🚀 Lead opportunity processed successfully');
    return {
      status: res.status,
      body: res.data,
    };
  } catch (error) {
    logError(error, url, body, 'Processing lead opportunity via Apex REST');
    throw new Error('Failed to process lead opportunity in Salesforce');
  }
};
