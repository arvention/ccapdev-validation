
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/UserModel.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for `profile` paths in the server
*/
const profileController = {

    /*
        executed when the client sends an HTTP GET request `/profile/:idNum`
        as defined in `../routes/routes.js`
    */
    getProfile: function (req, res) {

        // query where `idNum` is equal to URL parameter `idNum`
        var query = {idNum: req.params.idNum};

        // fields to be returned
        var projection = 'fName lName idNum';

        /*
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            this function searches the collection `users`
            based on the value set in object `query`
            the third parameter is a string containing fields to be returned
            the fourth parameter is a callback function
            this called when the database returns a value
            saved in variable `result`
        */
        db.findOne(User, query, projection, function(result) {

            /*
                if the user exists in the database
                render the profile page with their details
            */
            if(result != null) {
                var details = {
                    fName: result.fName,
                    lName: result.lName,
                    idNum: result.idNum
                };

                // render `../views/profile.hbs`
                res.render('profile', details);
            }
            /*
                if the user does not exist in the database
                render the error page
            */
            else {
                // render `../views/error.hbs`
                res.render('error');
            }
        });
    }
}

/*
    exports the object `profileController` (defined above)
    when another script exports from this file
*/
module.exports = profileController;
