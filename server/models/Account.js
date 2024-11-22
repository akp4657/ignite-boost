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

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  console.log(pass)

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      console.log('False')
      return callback(false);
    }
    console.log('Password match');
    return callback(true);
  });
};

AccountSchema.statics.findByUsername = async (name) => {
  const search = { username: name };
  return await AccountModel.findOne(search);
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    // Fetch the user document
    const doc = await AccountModel.findByUsername(username);
    if (!doc) {
      console.log('No document found for username:', username);
      return callback(null, null);
    }

    // Validate the password
    validatePassword(doc, password, (result) => {
      if (!result) {
        return callback(null, null);
      }
      return callback(null, doc);
    });
  } catch (err) {
    console.log('An error occurred during authentication:', err);
    return callback(err);
  }
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
