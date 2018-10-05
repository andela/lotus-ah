const validation = {
  isDefined(email) {
    if (!email) return false;
    return true;
  },

  isValid(email) {
    const checkemail = email.trim();
    // Reference => https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(checkemail).toLowerCase());
  },

  checkEmail(request, response, next) {
    const { email } = request.body;
    if (!validation.isDefined(email)) return response.status(400).json({ status: 'failed', message: 'Email required.' });
    if (!validation.isValid(email)) return response.status(400).json({ status: 'failed', message: 'Email incorrect.' });
    next();
  },

  checkRequiredDetails(request, response, next) {
    console.log(request.body);
    const values = request.body;
    const required = ['firstname', 'lastname', 'username', 'password', 'bio'];
    let pass = true;
    const errors = {};
    for (let i = 0; i < required.length; i += 1) {
      if (!values[required[i]] || !values[required[i]].replace(/\s/g, '').length) { pass = false; errors[required[i]] = `${required[i]} is required`; }
    }
    if (!pass) return response.status(400).json({ status: 'failed', message: errors });
    next();
  },

  checkPassword(request, response, next) {
    const { password } = request.body;
    if (!validation.isDefined(password) || !password.replace(/\s/g, '').length) return response.status(400).json({ status: 'failed', message: 'Password required.' });
    request.body.password = password.trim();
    next();
  },


};

export default validation;
