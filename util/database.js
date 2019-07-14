const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

module.exports = cb => {
    MongoClient.connect(
        "mongodb+srv://@cluster0-e1rzc.mongodb.net/test?retryWrites=true&w=majority",
        { useNewUrlParser: true }
      )
      .then(client => cb(client))
      .catch(err => console.log(err));
};
