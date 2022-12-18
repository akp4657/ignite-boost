const models = require('../models');

const { Video } = models;

const mainPage = (req, res) => {
  Video.VideoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), videos: docs });
  });
};

// Sets up the object from the req.body then sends them to the database to be stored
const makeVideo = (req, res) => {
  const promiseArray = [];
  const values = Object.values(req.body);

  for (let i = 0; i < values.length - 2; i++) {
    // Check if all data fields were entered
    // For some reason, this always throws regardless. I think we should stick
    // to the client side error check for emptiness.
    /* if (!values[i].player1 || !values[i].player2 || !values[i].char1
      || !values[i].char2  || !values[i].link) {
      return res.status(400).json({ error: "All fields must be entered to store the data."});
    }*/

    const videoData = {
      player1: values[i].player1,
      player2: values[i].player2,
      char1: values[i].char1,
      char2: values[i].char2,
      assist1: values[i].assist1,
      assist2: values[i].assist2,
      link: values[i].link,
      version: values[i].version,
      matchDate: values[i].matchDate,
      owner: req.session.account._id,
    };
    const newVideo = new Video.VideoModel(videoData);
    const videoPromise = newVideo.save();

    videoPromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Video already exists' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });

    promiseArray.push(videoPromise);
  }


  Promise.all(promiseArray).then(() => res.json({ redirect: '/main' }));
};

// Gets the videos that match the specific user
const getVideos = (request, response) => {
  const req = request;
  const res = response;

  return Video.VideoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ videos: docs });
  });
};

// Will automatically send an empty object into the find to get all data from the database
const getAllVideos = (request, response) => {
  const res = response;

  return Video.VideoModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ videos: docs });
  });
};

// Gets the _id of the send obj then deletes it from the database.
const deleteEntry = (request, response) => {
  const req = request;
  const res = response;

  Video.VideoModel.deleteItem(req.body.uid, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ result: docs });
  });
};

// Gets the query string from the request,
// checks to see which params exist then add them to the search object.
const searchVideos = (request, response) => {
  const req = request;
  const res = response;
  let sorting = -1;

  let params = { $and: [] };

  // check if the params exist
  const {
    player1, player2, char1, char2, assist1, assist2, version, sort
  } = req.query;
  let i = 0; // keeps track of position in params.$and array

  // If param exists, add it to the $and array with the
  // $or syntax to check for name in either slot 1 or 2 for player/char
  // Using regex to be case insensitive and act likes '$like' in SQL 
  if (player1) {
      params.$and[i] = { $or: [{ player1: {$regex: RegExp('^' + player1 ), $options: 'i'}}, { player2: {$regex: RegExp('^' + player1 ), $options: 'i'}}]}
      i++;
  }
  if (player2) {
    params.$and[i] = { $or: [{ player1: {$regex: RegExp('^' + player2 ), $options: 'i'}}, { player2: {$regex: RegExp('^' + player2 ), $options: 'i'}}]}
    i++;
  }

  // Characters selected only 
  if (char1) {
    params.$and[i] = { $or: [{ char1: `${char1}` }, { char2: `${char1}` }] };
    i++;
  }
  if (char2) {
    params.$and[i] = { $or: [{ char2: `${char2}` }, { char1: `${char2}` }] };
    i++;
  }
  
  // Check if it's a mirror first
 if(char1 && char2) {
    if(char1 === char2) params.$and[i] = { $and: [{ char2: `${char2}` }, { char1: `${char1}` }] };
    else params.$and[i] = { $or: [{ char2: `${char2}` }, { char1: `${char1}` }, { char2: `${char1}` }, { char1: `${char2}` }] };
    i++;
  }

  // If the character and assist are selected
  if (char1 && assist1) {
    params.$and[i] = { $or: [{ char1: `${char1}`, assist1: `${assist1}` }, { char2: `${char1}`, assist2: `${assist1}` }] };
    i++;
  }
  if (char2 && assist2) {
    params.$and[i] = { $or: [{ char1: `${char2}`, assist1: `${assist2}` }, { char2: `${char2}`, assist2: `${assist2}` }] };
    i++;
  }

  // If the character and player are searched
  if (char1 && player1) {
    params.$and[i] = { $or: [{ char1: `${char1}`, player1: {$regex: RegExp('^' + player1 ), $options: 'i'} }, { char2: `${char1}`, player2: {$regex: RegExp('^' + player1 ), $options: 'i'} }] };
    i++;
  }
  if (char2 && player2) {
    params.$and[i] = { $or: [{ char1: `${char2}`, player1: {$regex: RegExp('^' + player2 ), $options: 'i'} }, { char2: `${char2}`, player2: {$regex: RegExp('^' + player2 ), $options: 'i'} }] };
    i++;
  }

  // If one assist is selected
  if (assist1) {
    params.$and[i] = { $or: [{ assist1: `${assist1}` }, { assist2: `${assist1}` }] };
    i++;
  }
  if (assist2) {
    params.$and[i] = { $or: [{ assist2: `${assist2}` }, { assist1: `${assist2}` }] };
    i++;
  }

  // If both assists are called
  // check if it's a mirror first
  if(assist1 && assist2) {
    if(assist1 === assist2) params.$and[i] = { $and: [{ assist2: `${assist2}` }, { assist1: `${assist1}` }] };
    else params.$and[i] = { $or: [{ assist2: `${assist2}`}, { assist1: `${assist1}` }, { assist2: `${assist1}`}, { assist1: `${assist2}` }] };
    i++;
  }

  if (version) {
    params.$and[i] = { $or: [{version: `${version}`}]};
    i++;
  }

  if(sort) {
    if(sort === 'Oldest') {
      sorting = 1
    } else {
      sorting = -1
    }
  }


  if (i === 0) params = {}; // set params to empty object if no query params were sent
  
  return Video.VideoModel.find(params, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ videos: docs });
  }).sort({matchDate: sorting});
};


module.exports.mainPage = mainPage;
module.exports.getVideos = getVideos;
module.exports.getAllVideos = getAllVideos;
module.exports.make = makeVideo;
module.exports.delete = deleteEntry;
module.exports.searchVideos = searchVideos;
//module.exports.searchURL = searchURL;
