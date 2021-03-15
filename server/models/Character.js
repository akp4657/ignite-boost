const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let CharacterModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const setName = (name) => _.escape(name).trim();

const CharacterSchema = new mongoose.Schema({
  move: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  startup: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  active: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  frameAdv: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
});

CharacterSchema.statics.toAPI = (doc) => ({
  move: doc.move,
  startup: doc.startup,
  active: doc.active,
  frameAdv: doc.frameAdv,
});


// Returns all entries in the database
CharacterSchema.statics.findAll = (callback) => CharacterModel.find().select('move startup active frameAdv').lean()
  .exec(callback);

CharacterModel = mongoose.model('Character', CharacterSchema);

module.exports.CharacterModel = CharacterModel;
module.exports.CharacterSchema = CharacterSchema;
