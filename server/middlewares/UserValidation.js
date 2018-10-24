const validation = {
  /**
  * @static
  * @param {string} email
  * @description Checks if user email is defined
  * @return {boolean} boolean
  * @memberof UserValidation
  */
  isDefined(email) {
    if (!email) {
      return false;
    }
    return true;
  },

  /**
  * @static
  * @param {string} email
  * @description Checks if user email is valid
  * @return {boolean} boolean
  * @memberof UserValidation
  */
  isValid(email) {
    const checkemail = email.trim();
    // Reference => https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //
    return re.test(String(checkemail).toLowerCase());
  },

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @param {function} next
  * @description Checks if user email is defined and valid
  * @return {object} object
  * @memberof UserValidation
  */
  checkEmail(request, response, next) {
    const { email } = request.body;
    if (!validation.isDefined(email)) {
      return response.status(400).json({
        status: 'failed',
        message: 'Email required.'
      });
    }
    if (!validation.isValid(email)) {
      return response.status(400).json({
        status: 'failed',
        message: 'Email incorrect.'
      });
    }
    next();
  },

  /**
  * @static
  * @param {string} pwd
  * @description Checks if user chosen password is alphanumeric
  * @return {boolean} boolean
  * @memberof UserValidation
  */
  checkPasswordAlphanumeric(pwd) {
    const letter = /[a-zA-Z]/;
    const number = /[0-9]/;
    const valid = number.test(pwd) && letter.test(pwd);
    return valid;
  },

  /**
  * @static
  * @param {string} password
  * @description Checks if user chosen password's length is greater than 8
  * @return {boolean} boolean
  * @memberof UserValidation
  */
  checkPasswordLength(password) {
    return password.length < 8;
  },

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @param {function} next
  * @description Checks if user details are defined and are valid
  * @return {object} object
  * @memberof UserValidation
  */
  checkRequiredDetails(request, response, next) {
    const values = request.body;
    const { password } = values;
    const required = ['firstname',
      'lastname', 'username', 'password', 'bio'];
    let pass = true;
    const errors = {};
    for (let i = 0; i < required.length; i += 1) {
      if (!values[required[i]] || !values[required[i]].replace(/\s/g, '').length) {
        pass = false;
        errors[required[i]] = `${required[i]} is required`;
      }
    }
    if (!pass) {
      return response.status(400).json({
        status: 'failed',
        message: errors
      });
    }
    if (validation.checkPasswordLength(password)) {
      return response.status(400).json({
        status: 'failed',
        message: 'Password length should not be less than 8 characters'
      });
    }
    if (!validation.checkPasswordAlphanumeric(password)) {
      return response.status(400).json({
        status: 'failed',
        message: 'Password should contain atleast one number and one alphabet'
      });
    }
    request.body.fileUrl = request.file ? request.file.secure_url : '';
    next();
  },

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @param {function} next
  * @description Checks if user details are defined and are valid
  * @return {object} object
  * @memberof UserValidation
  */
  checkUserDetails(request, response, next) {
    const values = request.body;
    const required = ['firstname',
      'lastname', 'bio'];
    let pass = true;
    const errors = {};
    for (let i = 0; i < required.length; i += 1) {
      if (!values[required[i]] || !values[required[i]].replace(/\s/g, '').length) {
        pass = false;
        errors[required[i]] = `${required[i]} is required`;
      }
    }
    if (!pass) {
      return response.status(400).json({
        status: 'failed',
        message: errors
      });
    }
    request.body.fileUrl = request.file ? request.file.secure_url : '';
    next();
  },


  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @param {function} next
  * @description Checks if user password is defined and valid
  * @return {object} object
  * @memberof UserValidation
  */
  checkPassword(request, response, next) {
    const { password } = request.body;
    if (!validation.isDefined(password) || !password.replace(/\s/g, '').length) {
      return response.status(400).json({
        status: 'failed',
        message: 'Password required.'
      });
    }
    request.body.password = password.trim();
    next();
  },

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @param {function} next
  * @description Checks if the id sent with the user profile route is valid
  * @return {object} object
  * @memberof UserValidation
  */
  checkProfileId(request, response, next) {
    const { id } = request.params;
    if (!validation.isDefined(id) || !parseInt(id, 10)) {
      return response.status(400).json({
        status: 'failed',
        message: 'The id provided must be an integer.'
      });
    }
    next();
  },

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @param {function} next
  * @description Checks if the id sent is th same with the token id
  * @return {object} object
  * @memberof UserValidation
  */
  compareId(request, response, next) {
    const { id } = request.params;
    if (parseInt(id, 10) !== parseInt(request.decoded.id, 10)) {
      return response.status(400).json({
        status: 'failed',
        message: 'The is not your account.'
      });
    }
    next();
  },

};

export default validation;
