import { getAccessToken } from "../auth/getAccessToken.js";
import { createRecord } from "../records/createRecord.js";
import { getRecord } from "../records/getRecord.js";
import { updateRecord } from "../records/updateRecord.js";
import { getRecordTypeId, waitForRecordField, waitForRecordFieldByQuery, verifyLeadCountByMobile } from "../helpers/salesforceHelper.js";
import { runQuery } from "../query/runQuery.js";
import { processLeadOpportunity } from "../apexRest/processLeadOpportunity.js";

const tasks = {
  getAccessToken,
  createRecord,
  getRecordTypeId,
  runQuery,
  waitForRecordField,
  waitForRecordFieldByQuery,
  verifyLeadCountByMobile,
  getRecord,
  processLeadOpportunity,
  updateRecord,
};

export default tasks;