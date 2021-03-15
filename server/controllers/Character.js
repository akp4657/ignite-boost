const models = require('../models');

const { Character } = models;

// Will automatically send an empty object into the find to get all data from the database
const getAllData = (request, response) => {
  const res = response;

  return Character.CharacterModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ Yukina: docs });
  });
};

module.exports.getAllData = getAllData;
