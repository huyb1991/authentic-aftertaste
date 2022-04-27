// FireStore helper
const db = require('../configs').firebase.database;

// Format data return for FireStore Document and Collections
const mapDocumentToEntity = doc => ({ id: doc.id, ...doc.data() })
const mapCollectionToEntities = collection => (
  Array.from(collection.docs.map(doc => ({ id: doc.id, ...doc.data() })))
)

// Query data from FireStore
const getDocument = path => (
  db.doc(path).get()
    .then(mapDocumentToEntity)
    .catch(error => console.log(error))
)

/**
 * Get Collection
 * @param {*} path 
 * @param {*} limit Limit, default 0 is no limit
 * @returns 
 */
const getCollection = (path, limit=0) => (
  db.collection(path)
    .limit(limit)
    .get()
    .then(mapCollectionToEntities)
    .catch(error => console.log(error))
)

/**
 * Get single document with multiple conditions
 * @param {String} path
 * @param {Array} conditions
 * @return {Object} document
 */
const getDocumentWithConditions = (path, conditions) => {
  let dbRef = db.collection(path)

  conditions.forEach(({ fieldName, operator, value }) => {
    dbRef = dbRef.where(fieldName, operator, value)
  });

  return dbRef.get()
    .then(mapCollectionToEntities)
    .then(results => (results.length ? results[0] : null))
    .catch(error => console.log(error))
}

/**
 * Get documents of collection with multiple conditions
 * @param {String} path
 * @param {Array} conditions
 * @return {Array} documents
 */
const getCollectionWithConditions = (path, conditions, limit=0) => {
  let dbRef = db.collection(path)

  conditions.forEach(({ fieldName, operator, value }) => {
    dbRef = dbRef.where(fieldName, operator, value)
  });

  return dbRef
    .limit(limit)
    .get()
    .then(mapCollectionToEntities)
    .catch(error => console.log(error))
}

const getCollectionOrderingWithConditions = (path, orderBy, conditions, limit=0) => {
  let dbRef = db.collection(path)

  conditions.forEach(({ fieldName, operator, value }) => {
    dbRef = dbRef.where(fieldName, operator, value)
  });

  return dbRef
    .orderBy(orderBy)
    .limitToLast(limit)
    .get()
    .then(mapCollectionToEntities)
    .catch(error => console.log(error))
}

/**
 * Get documents of collection with multiple ids
 * @param {String} path
 * @param {Array} listId
 */
const getDocumentWithListId = (path, ids) => {
  return Promise.all(ids.map(id => getDocument(`${path}/${id}`)))
}

// Add data
const addDocument = (path, data) => (
  db.collection(path).add(data)
    .then(docRef => docRef.id)
    .catch(error => console.log(error))
)

const addDocumentWithId = (path, id, data) => (
  db.collection(path).doc(id).set(data)
    .then(() => id)
    .catch(error => console.log(error))
)

// Update data
const updateDocument = (path, data) => (
  db.doc(path).update(data)
)

const updateDocumentNotExist = (path, data) => (
  db.doc(path).set(data)
)

// Delete
const deleteDocument = (collection, docId) => db.collection(collection).doc(docId).delete();

module.exports = {
  mapDocumentToEntity,
  mapCollectionToEntities,

  getDocument,
  getCollection,
  getDocumentWithConditions,
  getCollectionWithConditions,
  getCollectionOrderingWithConditions,
  getDocumentWithListId,

  addDocument,
  addDocumentWithId,

  updateDocument,
  updateDocumentNotExist,

  deleteDocument,
}
