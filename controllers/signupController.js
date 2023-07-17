
// import module `validationResult` from `express-validator`
const { validationResult } = require('express-validator');

// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/UserModel.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for `signup` paths in the server
*/
const signupController = {

    /*
        executed when the client sends an HTTP GET request `/signup`
        as defined in `../routes/routes.js`
    */
    getSignUp: function (req, res) {
        res.render('signup');
    },

    /*
        executed when the client sends an HTTP POST request `/signup`
        as defined in `../routes/routes.js`

        prior to the execution of this function, values are validated
        with an array of validation middlewares
        defined in the object `validation` in `../helpers/validation.js`
    */
    postSignUp: async function (req, res) {

        // checks if there are validation errors
        var errors = validationResult(req);

        // if there are validation errors
        if (!errors.isEmpty()) {

            // get the array of errors
            errors = errors.errors;

            /*
                for each error, store the error inside the object `details`
                the field is equal to the parameter + `Error`
                the value is equal to `msg`
                as defined in the validation middlewares

                for example, if there is an error for parameter `fName`:
                store the value to the field `fNameError`
            */
            var details = {};
            for(i = 0; i < errors.length; i++)
                details[errors[i].path + 'Error'] = errors[i].msg;

            /*
                render `../views/signup.hbs`
                display the errors defined in the object `details`
            */
            res.render('signup', details);
        }

        else {
            /*
                when submitting forms using HTTP POST method
                the values in the input fields are stored in `req.body` object
                each <input> element is identified using its `name` attribute
                Example: the value entered in <input type="text" name="fName">
                can be retrieved using `req.body.fName`
            */
            var fName = req.body.fName;
            var lName = req.body.lName;
            var idNum = req.body.idNum;
            var pw = req.body.pw;

            var user = {
                fName: fName,
                lName: lName,
                idNum: idNum,
                pw: pw
            }

            /*
                calls the function insertOne()
                defined in the `database` object in `../models/db.js`
                this function adds a document to collection `users`
            */
            var response = await db.insertOne(User, user);

            /*
                upon adding a user to the database,
                redirects the client to `/success` using HTTP GET,
                defined in `../routes/routes.js`
                passing values using URL
                which calls getSuccess() method
                defined in `./successController.js`
            */

            if(response != null){
                res.redirect('/success?fName=' + fName +'&lName=' + lName + '&idNum=' + idNum);
            }
            else {
                res.render('error');
            }
        }
    },

    /*
        executed when the client sends an HTTP GET request `/getCheckID`
        as defined in `../routes/routes.js`
    */
    getCheckID: async function (req, res) {

        /*
            when passing values using HTTP GET method
            the values are stored in `req.query` object
            Example url: `http://localhost/getCheckID?idNum=11312345`
            To retrieve the value of parameter `idNum`: `req.query.idNum`
        */
        var idNum = req.query.idNum;

        /*
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            searches for a single document based on the model `User`
            sends an empty string to the user if there are no match
            otherwise, sends an object containing the `idNum`
        */
        var result = await db.findOne(User, {idNum: idNum}, 'idNum');
        res.send(result);
    }

}

/*
    exports the object `signupController` (defined above)
    when another script exports from this file
*/
module.exports = signupController;
