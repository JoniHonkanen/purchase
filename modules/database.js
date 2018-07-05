
const admin = require("firebase-admin");
const config = require('../config');
const moment = require('moment');

const serviceAccount = require("../keys/" + config.firebasePrivateKey);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://purchase-requests-ac4bf.firebaseio.com"
});

const db = admin.database();
const ref = db.ref("/")


//tietokantaan tallennus
const savePurchaseRequest = async (userId, item) => {
    const response = ref.push({
        userId,
        item,
        timestamp: moment().valueOf()
    })
    return response.key;
};

// tallennetaan varmistuksen päätös
const recordPurchaseRequestDecision = (key, decision) => {
    const ref = db.ref('/');
    ref.child(key).update({
        decision
    })
}

//tietokannasta luku
const readFromDatabase = async (key) => {
    const ref = db.ref('/');
    const snapshot = await ref.child(key).once('value');
    return snapshot.val();
}
// kaikki
const readAllFromDatabase = async (key) => {
    const ref = db.ref('/');
    const snapshot = await ref.once('value');
    return snapshot.val();
}

module.exports = {
    savePurchaseRequest,
    recordPurchaseRequestDecision,
    readFromDatabase,
    readAllFromDatabase
};