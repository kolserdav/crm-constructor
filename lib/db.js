const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://172.18.0.4:27017';

// Database Name
const dbName = 'rwer';

// Use connect method to connect to the server
MongoClient.connect(url, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
}, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});


