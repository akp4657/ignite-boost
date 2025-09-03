const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
});

const validatePassword = (doc, password) => {
  const pass = doc.password;
  const hash = crypto.pbkdf2Sync(password, doc.salt, iterations, keyLength, 'RSA-SHA512');
  return (hash.toString('hex') === pass);
};

AccountSchema.statics.findByUsername = async (name) => {
  const search = { username: name };

  try {
    return await AccountModel.findOne(search);
  } catch(err) {
    throw err;
  }
};

AccountSchema.statics.generateHash = (password) => {
  const salt = crypto.randomBytes(saltLength);
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'RSA-SHA512');
  return {
    salt: salt,
    hash: hash.toString('hex')
  };
};

AccountSchema.statics.authenticate = async (username, password) => {
  const res = {
    err: null,
    account: null
  };

  try {
    // Fetch the user document
    const doc = await AccountModel.findByUsername(username);
    if (!doc) {
      console.log('No document found for username:', username);
      return res;
    }

    const valid = await validatePassword(doc, password);
    if (valid) res.account = doc;
  } catch (err) {
    res.err = err;
  }

  return res;
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
