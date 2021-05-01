const models = require('../models');
const nodemailer = require('nodemailer')

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover up security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'ERROR | All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/main' });
  });
};

// Sending an email to myself on reports
const sendReport = (request, response) => {
  const req = request;
  const res = response;

  //<button id="reportButton" className="formSubmit btn secondBtn"type="button">Report</button>
  //
  const report = `${req.body.report}`;

  if (!report) {
    return res.status(400).json({ error: 'ERROR | All fields are required' });
  }

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'igniteboost.net@gmail.com',
      pass: 'v5HZvuSrqX5BQGb' // Meta
    }
  });

  var mailOptions = {
    from: 'igniteboost.net@gmail.com',
    to: 'igniteboost.net@gmail.com',
    subject: 'ignite-boost.net report',
    text: report
  }

  transporter.sendMail(mailOptions, function(error, info){
    if(error) {
      console.log(error);
      return res.status(400).json({ error: 'ERROR | Email error occured' });
    } else {
      console.log('Email sent: ' + info.response)
      return res.json({ redirect: '/main' });
    }
  })

  return true;
};

// Password change that takes a lot from the signup function
const passChange = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  req.body.pass3 = `${req.body.pass3}`;

  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'ERROR | All fields are required' });
  }

  if (req.body.pass === req.body.pass2) {
    return res.status(400).json({ error: 'ERROR | Passwords cannot match' });
  }

  if (req.body.pass2 !== req.body.pass3) {
    return res.status(400).json({ error: 'ERROR | The new passwords do not match' });
  }

  // Check to see if the initial password was correct in the first place
  return Account.AccountModel.authenticate(req.session.account.username,
    req.body.pass, (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'Incorrect Password' });
      }

      // If they do, make a new hash for it with the newPassword
      return Account.AccountModel.generateHash(req.body.pass2, (salt, hash) => {
      // While making the hash, update the current password for this
      // session's username since we require login anyway
      // https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/
        Account.AccountModel.updateOne({ username: req.session.account.username },
          { salt, password: hash }, (errUpdate) => {
            if (errUpdate) {
              return res.status(400).json({ error: 'There was an error' });
            }
            return res.json({ redirect: '/main' });
          });
      });
    });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'ERROR | All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'ERROR | Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/main' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.passChange = passChange;
module.exports.sendReport = sendReport;
