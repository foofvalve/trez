'use strict';
const db = require('@arangodb').db;
var collectionName = 'testResults';

if (!db._collection(collectionName)) {
  db._createDocumentCollection(collectionName);
}