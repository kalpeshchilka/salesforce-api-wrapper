import { runQuery } from '../query/runQuery.js';
import { logError } from '../utils/logger.js';
import { retry } from '../utils/retry.js';
import { getRecord } from '../records/getRecord.js';

/**
 * Get RecordTypeId for a given Salesforce object and developer name
 * @param {Object} params
 * @param {string} params.token - Salesforce access token
 * @param {string} params.objectType - Salesforce object type (e.g. 'Lead')
 * @param {string} params.developerName - Developer name of the record type
 * @returns {Promise<string|undefined>} - Record Type Id if found
 */
export const getRecordTypeId = async ({ token, objectType, developerName }) => {
  const soql = `SELECT Id, SobjectType, DeveloperName FROM RecordType`;

  try {
    const { body } = await runQuery({ token, soql });
    const { records = [] } = body;

    const match = records.find(
      (r) =>
        r.SobjectType.toLowerCase() === objectType.toLowerCase() &&
        r.DeveloperName === developerName
    );

    if (match) {
      console.log(`🎯 RecordTypeId found: ${match.Id}`);
      return match.Id;
    }

    console.warn(`⚠️ No RecordTypeId found for ${objectType} and ${developerName}`);
    return undefined;
  } catch (error) {
    logError(error, null, { objectType, developerName }, 'Fetching RecordTypeId');
    throw new Error(`Failed to fetch RecordTypeId for ${objectType}`);
  }
};

/**
 * Waits for a specific field in a Salesforce record to become available (non-null)
 * and optionally pass a validation function.
 *
 * @param {Object} params
 * @param {string} params.token - Salesforce access token
 * @param {string} params.objectType - Salesforce object type (e.g., 'Opportunity')
 * @param {string} params.recordId - Salesforce record ID
 * @param {string} params.fieldName - Field to wait for (e.g., 'StageName')
 * @param {number} [params.maxRetries=10] - Max number of retries
 * @param {number} [params.interval=2000] - Delay between retries in ms
 * @returns {Promise<Object>} - The full record once the field is available and valid
 */
export const waitForRecordField = async ({
  token,
  objectType,
  recordId,
  fieldName,
  maxRetries = 15,
  interval = 3500,
}) => {
  try {
    return await retry({
      maxRetries,
      interval,
      fn: async () => {
        const response = await getRecord({
          token,
          objectType,
          recordId,
        });

        const value = response?.body?.[fieldName];
        console.log(`🔍 Current ${fieldName}: ${value}`);

        if (value !== null && value !== undefined) {
          console.log(`✅ ${fieldName} is available: ${value}`);
          return response.body;
        }

        console.log(`🔄 ${fieldName} is null or undefined. Retrying...`);
        return null;
      },
    });
  } catch (error) {
    logError(error, null, { objectType, recordId, fieldName }, 'Waiting for record field');
    throw new Error(`Failed to retrieve ${fieldName} from ${objectType} with ID: ${recordId}`);
  }
};

/**
 * Waits for a specific field from a Salesforce query to become available (non-null).
 * @param {Object} params
 * @param {string} params.token - Salesforce access token
 * @param {string} params.soql - SOQL query string
 * @param {string} params.fieldName - Field to wait for
 * @param {number} [params.maxRetries=10] - Max retries
 * @param {number} [params.interval=2000] - Retry interval in ms
 * @returns {Promise<*>} - The field value
 */
export const waitForRecordFieldByQuery = async ({
  token,
  soql,
  fieldName,
  maxRetries = 10,
  interval = 3500,
}) => {
  try {
    const result = await retry({
      maxRetries,
      interval,
      fn: async () => {
        const response = await runQuery({ token, soql, encode: true });

        const record = response?.body?.records;

        const value = record?.[0][fieldName];

        if (value !== null && value !== undefined) {
          console.log(`✅ ${fieldName} found: ${value}`);
          return record;
        }

        console.log(`🔄 ${fieldName} not found in query results. Retrying...`);
        return null;
      },
    });

    return result;
  } catch (error) {
    logError(error, null, { soql, fieldName }, 'Waiting for query field');
    throw new Error(`Failed to retrieve ${fieldName} using query: ${soql}`);
  }
};

/**
 * Verifies the number of Leads in Salesforce with a given mobile number.
 *
 * @param {Object} params
 * @param {string} params.token - Salesforce access token
 * @param {string} params.mobile - Mobile number to match (with or without "+")
 * @param {number} params.expectedCount - Expected number of leads
 * @param {number} [params.maxRetries=5] - Retry attempts
 * @param {number} [params.interval=2000] - Retry interval in ms
 * @returns {Promise<Object>} - Response body from Salesforce query
 */
export const verifyLeadCountByMobile = async ({
  token,
  mobile,
  expectedCount,
  maxRetries = 5,
  interval = 2000,
}) => {
  const soql = `SELECT fields(all) FROM Lead WHERE MobilePhone = '${mobile}' limit 10`

  const result = await retry({
    maxRetries,
    interval,
    fn: async () => {
      const response = await runQuery({ token, soql, encode: true });
      const recordCount = response?.body?.records?.length ?? 0;

      if (recordCount === expectedCount) {
        console.log(`✅ Found ${recordCount} leads for ${mobile}`);
        return response.body;
      }

      console.log(
        `🔄 Found ${recordCount} leads, expected ${expectedCount}. Retrying...`
      );
      return null;
    },
  });

  if (!result) {
    throw new Error(
      `❌ Expected ${expectedCount} leads for mobile: ${mobile}, but didn't match after ${maxRetries} retries.`
    );
  }

  return result;
};