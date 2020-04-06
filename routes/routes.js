
// import module `express`
const express = require('express');

// import module `controller` from `../controllers/controller.js`
const controller = require('../controllers/controller.js');

// import module `signupController` from `../controllers/signupController.js`
const signupController = require('../controllers/signupController.js');

// import module `successController` from `../controllers/successController.js`
const successController = require('../controllers/successController.js');

// import module `profileController` from `../controllers/profileController.js`
const profileController = require('../controllers/profileController.js');

// import module `validation` from `../helpers/validation.js`
const validation = require('../helpers/validation.js');

const app = express();

/*
    execute function getFavicon()
    defined in object `controller` in `../controllers/controller.js`
    when a client sends an HTTP GET request for `/favicon.ico`
*/
app.get('/favicon.ico', controller.getFavicon);

/*
    execute function getIndex()
    defined in object `controller` in `../controllers/controller.js`
    when a client sends an HTTP GET request for `/`
*/
app.get('/', controller.getIndex);

/*
    execute function getSignUp()
    defined in object `signupController` in `../controllers/signupController.js`
    when a client sends an HTTP GET request for `/signup`
*/
app.get('/signup', signupController.getSignUp);

/*
    execute the array of middleware functions returned by signupValidation()
    defined in object `validation` in `../helpers/validation.js`
    then execute function postSignUp()
    defined in object `signupController` in `../controllers/signupController.js`
    when a client sends an HTTP POST request for `/signup`
*/
app.post('/signup', validation.signupValidation(), signupController.postSignUp);

/*
    execute function getCheckID()
    defined in object `signupController` in `../controllers/signupController.js`
    when a client sends an HTTP GET request for `/getCheckID`
*/
app.get('/getCheckID', signupController.getCheckID);

/*
    execute function getSuccess()
    defined in object `successController` in `../controllers/successController.js`
    when a client sends an HTTP GET request for `/success`
*/
app.get('/success', successController.getSuccess);

/*
    execute function getProfile()
    defined in object `profileController` in `../controllers/profileController.js`
    when a client sends an HTTP GET request for `/profile/:idNum`
    where `idNum` is a parameter
*/
app.get('/profile/:idNum', profileController.getProfile);

/*
    exports the object `app` (defined above)
    when another script exports from this file
*/
module.exports = app;
