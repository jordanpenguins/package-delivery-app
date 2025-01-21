
// Import the required libraries
const admin = require("firebase-admin");

//Get a reference to the private key
const serviceAccount = require("./service-account.json");

// initialize the access to Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
// Access Firestore database
const db = admin.firestore()
const docRef = db.collection('data').doc('stats');


/**
 * Initialize the CRUD count values
 * 
 * @function initialiseCRUDCount
 * @returns {Promise<void>}
 * 
 */

async function initialiseCRUDCount() {
    const doc = await docRef.get()
    if (!doc.exists) {
        // Initialize all the values if stats and data document do not exist
        await docRef.set({
            insert: 0,
            retrieve: 0,
            update: 0,
            delete: 0,
        });
        console.log('Document initialized with default values.');
    } else {
        console.log('Document already exists.');
    }

}

initialiseCRUDCount();

/**
 * Count the CRUD operations
 * @param {*} operationType 
 */
async function countCrudeOperations (operationType) {
    
    const doc = await docRef.get()
    const currentData = doc.data();
    console.log(currentData)
    const currentCount = currentData[operationType];
    const newCount = currentCount + 1;
    await docRef.update({ [operationType]: newCount });
    console.log(`Document updated with new ${operationType} count: ${newCount}`);
   
}


module.exports = {db,countCrudeOperations};
