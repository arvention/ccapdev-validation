# ccapdev-validation
Express-Validator Tutorial for CCAPDEV1920T2

This repository will help you integrate client-side and server-side validation to your web applications using [validator.js](https://github.com/validatorjs/validator.js) and [express-validator](https://express-validator.github.io/docs/). This web application is based on the previous [repository on ajax tutorial](https://github.com/arvention/ccapdev-ajax). For this tutorial, we will use these libraries to validate the user input in the sign-up form, both in the client-side and the server-side, before storing the values in the database.

## Contents:

Each folder and file in this repository is properly documented. You may read the `README.md` file of each folder to understand its content. You may also read the inline comments of each file explaining the statements line-per-line.

- [controllers](controllers) - This folder contains files which defines callback functions for client requests.
- [helpers](helpers) - This folder contains files which contains helper functions.
- [models](models) - This folder contains files for database modeling and access.
- [public](public) - This folder contains static assets such as css, js, and image files.
- [routes](routes) - This folder contains files which describes the response of the server for each HTTP method request to a specific path in the server.
- [views](views) - This folder contains all hbs files to be rendered when requested from the server.
- [index.js](index.js) - The main entry point of the web application.

## Follow the steps below to set-up and study this repository:
1. Clone the repository either by downloading the contents of the repository [here](https://github.com/arvention/ccapdev-validation/archive/master.zip), or using the command below (Note: git should be installed in your system for this to work).
```
git clone https://github.com/arvention/ccapdev-validation
```
2. Open Command Prompt
3. Navigate to the project folder - the folder containing the contents of the cloned or downloaded repository.
4. Run the command `npm install` to initialize and install all necessary modules used in the project.

5. We may now run our server. To do this, we run the command `node index.js`. Upon running the command, your Command Prompt should display the following statement:
```
app listening at port 9090
Connected to: mongodb://localhost:27017/ccapdev-validation
```

6. Let's test our web application. Go to the link below to access the web application:
```
http://localhost:9090/
```

Your web browser should display the screen below:
![alt text](index.png "Index Page")

7. Go to the sign-up page either using the menu item or the button.

The picture below shows a blank sign-up form.
![alt text](signup.png "Sign-up Page")

Review the file [`views/signup.hbs`](views/signup.hbs), focus on the `<form>` element, and take note of its elements and their attributes. Shown below is the `<form>` as excerpted from the file:

```
<form id="signup" method="post">
    <input type="text" name="fName" id="fName" class="field" placeholder="First Name" required> <br>
    <p id="fNameError" class="error">{{fNameError}}</p>
    <input type="text" name="lName" id="lName" class="field" placeholder="Last Name" required> <br>
    <p id="lNameError" class="error">{{lNameError}}</p>
    <input type="number" name="idNum" id="idNum" class="field" placeholder="Id Number" required> <br>
    <p id="idNumError" class="error">{{idNumError}}</p>
    <input type="password" name="pw" id="pw" class="field" placeholder="Password" required> <br>
    <p id="pwError" class="error">{{pwError}}</p>
    <input type="submit" id="submit" value="SUBMIT" disabled>
 </form>
```

We'll first discuss the client-side validation. For the client-side validation, we will use [validator.js](https://github.com/validatorjs/validator.js). We will use this to validate and sanitize the user input in the client-side. Client-side validation means that we will not send any HTTP request to the server to validate the values entered by the user.

For the sign-up sheet in [`views/signup.hbs`](views/signup.hbs), we will:
- Check if the value entered by the user for the field `fName` is not an empty string.
- Check if the value entered by the user for the field `lName` is not an empty string.
- Check if the value entered by the user for the field `idNum` contains EXACTLY 8 digits.
- Check if the value entered by the user for the field `pw` contains AT LEAST 8 characters.

Make sure that JavaScript is allowed in your web browser. Try typing some values in each field to check if the client side validation works. For the field `fName`, try entering a blank space, or try entering a character and deleting it. A message should display below the field which says `First name should not be empty`.

The picture below shows the error message displayed when the user enters an empty string for the field `fName`.
![alt text](signup-client-validation.png "Sign-up Page with Client-Side Validation")

Try to check the client-side validation of the other fields. For field `idNum`, every time the user enters a digit in the field, the client-side script will check if the user has entered EXACTLY 8 digits. For field `pw`, every time the user enters a character in the field, the client-side script will check if the user has entered AT LEAST 8 characters.

The client-side script [`public/js/signup.js`](public/js/signup.js) is attached to [`views/signup.hbs`](views/signup.hbs). This script contains lines of code which attaches a `keyup()` event all `<input>` element. We will discuss all the functions in the script.

Function `isFilled()` returns true if all the fields are not empty, otherwise it returns false. This function uses functions defined in [validator.js](https://github.com/validatorjs/validator.js). The function call `validator.trim()` removes all leading and trailing blank spaces entered by the user. The function call `validator.isEmpty()` returns true if the string argument is empty, otherwise, returns false. Shown below is the code as excerpted from the file:

```
function isFilled() {

    var fName = validator.trim($('#fName').val());
    var lName = validator.trim($('#lName').val());
    var idNum = validator.trim($('#idNum').val());
    var pw = validator.trim($('#pw').val());

    var fNameEmpty = validator.isEmpty(fName);
    var lNameEmpty = validator.isEmpty(lName);
    var idNumEmpty = validator.isEmpty(idNum);
    var pwEmpty = validator.isEmpty(pw);

    return !fNameEmpty && !lNameEmpty && !idNumEmpty && !pwEmpty;
}
```

Function `isValidID()` returns true if the field `idNum` contains EXACTLY 8 digits, otherwise it returns false. This function uses functions defined in [validator.js](https://github.com/validatorjs/validator.js). The function call `validator.isLength()` checks if the number of characters in the string is within the defined range. The function call `validator.isLength()` accepts an object with 2 fields, min (defines the minimum number of characters in the string) and max (defines the maximum number of characters in the string).

The function `isValidID()` accepts two parameters - `field` (which is the current `<input>` field calling the function) and `callback` (which is the function called after the execution of `isValidID()`).

The function `isValidID()` is not entirely a client-side validation since it also integrates an AJAX call to check if the ID number entered by the user is unique from the ID numbers already stored in the database. The function displays appropriate error messages for all scenarios. Shown below is the code as excerpted from the file:
```
function isValidID(field, callback) {

    var idNum = validator.trim($('#idNum').val());
    var isValidLength = validator.isLength(idNum, {min: 8, max: 8});

    if(isValidLength) {
        $.get('/getCheckID', {idNum: idNum}, function (result) {
            if(result.idNum != idNum) {
                if(field.is($('#idNum')))
                    $('#idNumError').text('');

                return callback(true);

            }

            else {
                if(field.is($('#idNum')))
                    $('#idNumError').text('ID number already registered.');
                    return callback(false);
                }
            });
        }

    else {
        if(field.is($('#idNum')))
            $('#idNumError').text('ID Number should contain 8 digits.');
            return callback(false);
    }
}
```

Function `isValidPassword()` returns true if the field `pw` contains AT LEAST 8 characters, otherwise it returns false. This function uses functions defined in [validator.js](https://github.com/validatorjs/validator.js). The function call `validator.isLength()` checks if the number of characters in the string is within the defined range. The function call `validator.isLength()` accepts an object with 2 fields, min (defines the minimum number of characters in the string) and max (defines the maximum number of characters in the string). The function displays appropriate error messages for all scenarios. Shown below is the code as excerpted from the file:

```
function isValidPassword(field) {

    var validPassword = false;

    var password = validator.trim($('#pw').val());
    var isValidLength = validator.isLength(password, {min: 8});

    if(isValidLength) {
        if(field.is($('#pw')))
            $('#pwError').text('');
        validPassword = true;
    }

    else {
        if(field.is($('#pw')))
            $('#pwError').text(`Passwords should contain at least 8 characters.`);
    }

    return validPassword;
}
```
