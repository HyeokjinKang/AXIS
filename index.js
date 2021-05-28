const app = require('express')();
const config = require('./config/config.json');
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = process.env.PORT || 80;

client.connect(err => {
  const collection = client.db(config.db.name).collection("users");
  collection.find({}).toArray((err, docs) => {
    console.log(err);
    console.log(docs);
    client.close();
  });
});


app.get('/', (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});