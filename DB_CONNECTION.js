const {MongoClient} = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
let db;

const connectToMongo = () =>{
    return new Promise((resolve, reject) => {
        client.connect()
            .then(()=>{
                db = client.db('kaavianDB');
                resolve();
            })
            .catch((err) =>{
                console.log('Error happend while trying to connect mongoDB..',err);
                reject(err);
            });  
    });
} 

const getCollection = (collectionName) =>{
    return db.collection(collectionName);
}

module.exports= {connectToMongo,getCollection};