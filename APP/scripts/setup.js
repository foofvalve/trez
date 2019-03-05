'use strict';
const db = require('@arangodb').db;
var collectionName = 'testResults';

if (!db._collection(collectionName)) {
  db._createDocumentCollection(collectionName);
  db[collectionName].ensureIndex({
    type: 'hash',
    fields: ['testSuite','testName', 'execution', 'project', 'execution_date'],
    unique: true
  });
}