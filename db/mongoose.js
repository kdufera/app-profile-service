'use strict';

const mongoose = require ('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/userProfile",{ 
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

var db = mongoose.connection;
db.once("open", function(callback) {
console.log("Connected to mongodB..." )
});

module.exports = { mongoose };
