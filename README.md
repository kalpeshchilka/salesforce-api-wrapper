# Salesforce API Wrapper

![📦 Publish](https://github.com/kalpeshchilka/salesforce-api-wrapper/actions/workflows/publish.yml/badge.svg)

Reusable Node.js module for interacting with Salesforce API.  
Intended for use in E2E test automation (e.g. Cypress).

## ✅ Features
- Get OAuth token
- Create / update / delete / get records (any Salesforce object)
- Run SOQL queries
- Built-in error logging
- Configurable retries
- Centralized request logic
- Cypress task integration

## 📁 Folder Structure

```
src/
├── auth/               // Auth (access token)
│   └── getAccessToken.js
├── helpers/            // Salesforce helper functions
│   └── salesforceHelper.js
├── query/              // SOQL queries
│   └── runQuery.js
├── records/            // CRUD functions
│   ├── createRecord.js
│   ├── deleteRecord.js
│   ├── getRecord.js
│   └── updateRecord.js
├── tasks/              // Cypress tasks
│   └── cypressTasks.js
├── utils/              // Shared utilities
│   ├── logger.js       // Logging utility
│   ├── request.js      // Axios wrapper
│   ├── retry.js        // Retry mechanism
│   ├── config.js       // Env variable handler
│   └── index.js        // Utility exports

.env.example             // Sample env config
.gitignore               // Git ignore rules
```

## 🚀 Usage

### Installing dependency

```js
//package.json
  "dependencies": {
    "@kalpeshchilka/salesforce-api-wrapper": "1.1.3"
  }
```

### In Your Cypress Test Repo (using Cypress tasks)

```js
//cypress.config.js - add as cypress task
  e2e: {
    async setupNodeEvents(on, config) {
      // Copy Cypress env vars into process.env
      Object.assign(process.env, config.env);

      const { default: salesforceTasks } = await import('@kalpeshchilka/salesforce-api-wrapper/src/tasks/cypressTasks.js');
      on("task", salesforceTasks); // register wrapper functions as Cypress tasks
    }
  }

//e2e.js - fetch salesforce token
  before(() => {
    cy.sf('getAccessToken').then((token) => {
      // Store the salesforce token globally
      Cypress.env('SALESFORCE_TOKEN', token);
      cy.log('Salesforce access token fetched and saved!');
    });
  });

//commands.js - add salesforce custom command
  Cypress.Commands.add("sf", (taskName, params = {}) => {
    const allowedTasks = [
      "getAccessToken",
      "getRecord",
      "createRecord",
      "updateRecord",
      "runQuery",
      "deleteRecord",
      "getRecordTypeId",
      "waitForRecordField",
      "waitForRecordFieldByQuery",
      "verifyLeadCountByMobile",
      "getRecord",
      "processLeadOpportunity",
    ];

    if (!allowedTasks.includes(taskName)) {
      throw new Error(`❌ Unsupported Salesforce task: ${taskName}`);
    }

    return cy.task(taskName, params);
  });
```

### Example usage in E2E Tests repo

```js
//Creating an account
  let accountDetails = {
    "Account_Status__c": "active",
    "Channel_Type__c": "REA",
    "Name": "sf-agency-" + faker.person.firstName() + Cypress.dayjs(),
    "State_Region__c": "Dubai",
    "Type_of_Company__c": "Agency"
  }

  cy.sf('createRecord', {
    token: Cypress.env('SALESFORCE_TOKEN'),
    objectType: "account",
    body: accountDetails
  }).then(
    (accountResponse) => {
      expect(accountResponse.status).to.be.equal(201);
    });
```

### Direct API Use Example

```js
import * as sf from '@kalpeshchilka/salesforce-api-wrapper';

cy.task('createLead', ({ token, body }) =>
  sf.createRecord({ token, objectType: 'Lead', body })
);
```

## 🛠️ Environment Variables

Make sure to have Salesforce env variables in your test repo:

```bash
.env.example
```
Make sure to configure your Salesforce credentials accordingly.

---
