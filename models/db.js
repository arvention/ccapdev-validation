
// import module `mongoose`
const mongoose = require('mongoose');

// import module `User` from `../models/UserModel.js`
const User = require('./UserModel.js');

// ccapdev-validation is the name of the database
const url = 'mongodb+srv://arrenantioquia:pdRR6nU35IzYFblc@cluster0.d1l6be7.mongodb.net/?retryWrites=true&w=majority';

// additional connection options
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

// defines an object which contains necessary database functions
const database = {

    /*
        connects to database
    */
    connect: async function () {
        await mongoose.connect(url, options);
        console.log('Connected to: ' + url);
    },

    /*
        inserts a single `doc` to the database based on the model `model`
    */
    insertOne: async function(model, doc) {
        return await model.create(doc);
    },

    /*
        inserts multiple `docs` to the database based on the model `model`
    */
    insertMany: async function(model, docs) {
        return await model.insertMany(docs);
    },

    /*
        searches for a single document based on the model `model`
        filtered through the object `query`
        limits the fields returned based on the string `projection`
        callback function is called after the execution of findOne() function
    */
    findOne: async function(model, query, projection) {
        return await model.findOne(query, projection);
    },

    /*
        searches for multiple documents based on the model `model`
        filtered through the object `query`
        limits the fields returned based on the string `projection`
        callback function is called after the execution of findMany() function
    */
    findMany: async function(model, query, projection) {
        return await model.find(query, projection);
    },

    /*
        updates the value defined in the object `update`
        on a single document based on the model `model`
        filtered by the object `filter`
    */
    updateOne: async function(model, filter, update) {
        return await model.updateOne(filter, update);
    },

    /*
        updates the value defined in the object `update`
        on multiple documents based on the model `model`
        filtered using the object `filter`
    */
    updateMany: async function(model, filter, update) {
        return await model.updateMany(filter, update);
    },

    /*
        deletes a single document based on the model `model`
        filtered using the object `conditions`
    */
    deleteOne: async function(model, conditions) {
        return await model.deleteOne(conditions);
    },

    /*
        deletes multiple documents based on the model `model`
        filtered using the object `conditions`
    */
    deleteMany: async function(model, conditions) {
        return await model.deleteMany(conditions);
    }

}

/*
    exports the object `database` (defined above)
    when another script exports from this file
*/
module.exports = database;
