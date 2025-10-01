const { reduce } = require('underscore');
const models = require('../models');
const nodemailer = require('nodemailer');

const { Account } = models;

const auth = (req, res) => {
  return res.json({
    auth: (req.session.account !== undefined)
  });
}

const logout = (req, res) => {
  req.session.destroy();
  res.status(200).json({
    redirect: '/'
  });
};

const login = async (req, res) => {
  // force cast to strings to cover up security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.password}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'ERROR | All fields are required.' });
  }

  const {err, account} = await Account.AccountModel.authenticate(username, password);
  if (err || !account) {
    return res.status(401).json({
      error: 'ERROR | Incorrect username or password'
    });
  }
  req.session.account = Account.AccountModel.toAPI(account);
  
  return res.status(200).json({
    redirect: '/'
  });
};

// Sending an email to myself on reports
const sendReport = (req, res) => {
  const report = `${req.body.report}`;

  if (!report) {
    return res.status(400).json({ error: 'ERROR | All fields are required.' });
  }

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'igniteboost.net@gmail.com',
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
      console.error(error);
      return res.status(500).json({ error: 'ERROR | Unable to send email, please try again later.' });
    } else {
      return res.status(200).json({ redirect: '/' });
    }
  })

  return true;
};

// Password change that takes a lot from the signup function
const passChange = async (req, res) => {
  req.body.username = `${req.body.username}`;
  req.body.password = `${req.body.password}`;
  req.body.new = `${req.body.new}`;
  req.body.retype = `${req.body.retype}`;

  if (!req.body.username || !req.body.password || !req.body.new || !req.body.retype) {
    return res.status(400).json({
      error: 'ERROR | All fields are required.'
    });
  }

  if (req.body.password === req.body.new) {
    return res.status(400).json({
      error: 'ERROR | The new password cannot be the same as the current password'
    });
  }

  if (req.body.new !== req.body.retype) {
    return res.status(400).json({
      error: 'ERROR | New Passwords must match'
    });
  }

  try {
    // Check to see if the initial password was correct in the first place
    const {err, account} = await Account.AccountModel.authenticate(req.session.account.username, req.body.password);

    if (err || !account) {
      return res.status(400).json({
        error: 'ERROR | Incorrect username or password.'
      });
    }

    const {salt, hash} = Account.AccountModel.generateHash(req.body.new);
    await Account.AccountModel.updateOne({ username: req.session.account.username },{ salt, password: hash });
    return res.status(200).json({
      redirect: '/'
    });
  } catch(err) {
    console.error(err);
    return res.status(500).json({
      error: 'Unable to change password, please try again later.'
    });
  }
}

const signup =  async (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.password = `${req.body.password}`;
  req.body.retype = `${req.body.retype}`;

  if (!req.body.username || !req.body.password || !req.body.retype) {
    return res.status(400).json({ error: 'ERROR | All fields are required.' });
  }

  if (req.body.password !== req.body.retype) {
    return res.status(400).json({ error: 'ERROR | Passwords must match.' });
  }

  const existingUser = await Account.AccountModel.findByUsername(req.body.username)
  if(existingUser) {
    return res.status(400).json({ 
      error: 'ERROR | Username is taken, please try a different one.' 
    });
  }

  try {
    const { salt, hash } = await Account.AccountModel.generateHash(req.body.password);
    const accountData = {
      username: req.body.username,
      salt,
      password: hash
    };

    const newAccount = new Account.AccountModel(accountData);

    try {
      await newAccount.save();
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.status(201).json({
        redirect: '/'
      });
    } catch(err) {
      if (err.code === 11000) {
        console.error(err);
        return res.status(400).json({
          error: 'ERROR | Username is taken, please try a different one.' 
        });
      }

      return res.status(500).json({
        error: 'ERROR | Unable to create account. Please try again later.'
      });
    }

  } catch(err) {
    console.error(err);
    return res.status(500).json({
      error: 'ERROR | Unable to create account. Please try again later.'
    });
  }
};

const getToken = (req, res) => {
  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.auth = auth;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.passChange = passChange;
module.exports.sendReport = sendReport;
