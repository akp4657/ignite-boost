const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let CharacterModel = {};


const CharacterSchema = new mongoose.Schema({
  move: {
    type: String,
    trim: true,
  },

  startup: {
    type: String,
    trim: true,
  },

  active: {
    type: String,
    trim: true,
  },

  frameAdv: {
    type: String,
    trim: true,
  },

  character: {
    type: String, 
    trim: true,
  }
});

CharacterSchema.statics.toAPI = (doc) => ({
  move: doc.move,
  startup: doc.startup,
  active: doc.active,
  frameAdv: doc.frameAdv,
  character: doc.character
});


// Returns all entries in the database
CharacterSchema.statics.findAll = (callback) => CharacterModel.find().select('move startup active frameAdv character').lean()
  .exec(callback);

CharacterModel = mongoose.model('Character', CharacterSchema);

module.exports.CharacterModel = CharacterModel;
module.exports.CharacterSchema = CharacterSchema;
