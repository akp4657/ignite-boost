const models = require('../models');

const { Character } = models;

// Will automatically send an empty object into the find to get all data from the database
const getData = (request, response) => {
  const res = response;
  const req = request;

  //console.log(req.query.character)
   return Character.CharacterModel.find({character: req.query.character}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ character: docs });
  });
};

module.exports.getData = getData;
