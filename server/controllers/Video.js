const { filter } = require('underscore');
const models = require('../models');

const { Video } = models;

// Validation arrays
const allowedCharacters = [
    "Akira", "Ako", "Asuna", "Emi", "Kirino", "Kirito", "Kuroko",
    "Kuroyukihime", "Mikoto", "Miyuki", "Quenser", "Rentaro", "Selvaria",
    "Shana", "Shizuo", "Taiga", "Tatsuya", "Tomoka", "Yukina", "Yuuki"
];

const allowedAssists = [
    "Accelerator", "Alicia", "Boogiepop", "Celty", "Dokuro", "Enju",
    "Erio", "Froleytia", "Haruyuki", "Holo", "Innocent Charm", "Iriya",
    "Izaya", "Kino", "Kojou", "Kouko", "Kuroneko", "Leafa", "LLENN",
    "Mashiro", "Miyuki", "Pai", "Rusian", "Ryuuji", "Sadao", "Tatsuya",
    "Touma", "Tomo", "Uiharu", "Wilhelmina", "Zero"
];

// Data validator
function validateVideoData(videoData) {
    const { char1, char2, assist1, assist2 } = videoData;
    if (!allowedCharacters.includes(char1)) return false;
    if (!allowedCharacters.includes(char2)) return false;
    if (!allowedAssists.includes(assist1)) return false;
    if (!allowedAssists.includes(assist2)) return false;

    return true;
}

const makeVideos = async (req, res) => {
    const values = Object.values(req.body);

    for (let i = 0; i < values.length; i++) {
        const videoData = {
            player1: values[i].player1,
            player2: values[i].player2,
            char1: values[i].char1,
            char2: values[i].char2,
            assist1: values[i].assist1,
            assist2: values[i].assist2,
            link: values[i].link,
            version: parseInt(values[i].version, 10),
            matchDate: values[i].matchDate,
            owner: req.session.account._id,
        };

        try {
            const result = await validateVideoData(videoData); // Suuuuper important
            if (!result) return res.status(400).json({ error: 'ERROR | Invalid data.' });

            const newVideo = new Video.VideoModel(videoData);
            await newVideo.save();
        } catch(err) {
            console.error(err);
            if (err.code === 11000) {
                return res.status(400).json({
                    error: 'ERROR | Video already exists.'
                });
            }
        }
    }

    return res.status(201).json({
        message: `${(values.length < 2) ? 'Video has' : 'Videos have'} been successfully added!`
    });
};

// Gets the videos that match the specific user
const getVideos = async (req, res) => {
    try {
        const docs = await Video.VideoModel.find(req.session.account._id);
        return res.json({
            videos: docs
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'ERROR | Unable to get videos, please try again later.'
        });
    }
};

// Will automatically send an empty object into the find to get all data from the database
const getAllVideos = async (req, res) => {
    try {
        const docs = await Video.VideoModel.findAll();
        return res.json({
            videos: docs
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'ERROR | Unable to get videos, please try again later.'
        });
    }
};

const searchVideos = async (req, res) => {
    let sorting = -1;

    // check if the params exist
    const {
        player1, player2, char1, char2, assist1, assist2, version, sort
    } = req.query;

    let params = { $and: [] };

    // Check each query option if it exists
    if (player1) {
        params.$and.push({
            $or: [
                { player1: { $regex: RegExp('^' + player1), $options: 'i' } },
                { player2: { $regex: RegExp('^' + player1), $options: 'i' } }
            ]
        });
    }
    if (player2) {
        params.$and.push({
            $or: [
                { player1: { $regex: RegExp('^' + player2), $options: 'i' } },
                { player2: { $regex: RegExp('^' + player2), $options: 'i' } }
            ]
        });
    }

    // Characters selected only
    if (char1) {
        params.$and.push({
            $or: [
                { char1: `${char1}` },
                { char2: `${char1} `}
            ]
        });
    }
    if (char2) {
        params.$and.push({
            $or: [
                { char1: `${char2}` },
                { char2: `${char2} `}
            ]
        });
    }

    // Check if it's a mirror
    if (char1 && char2) {
        if (char1 === char2) {
            params.$and.push({
                $and: [
                    { char2: `${char2} `},
                    { char1: `${char1}` }
                ]
            });
        } else {
            params.$and.push({
                $or: [
                    { char2: `${char2} `},
                    { char1: `${char1}` }
                ]
            });
        }
    }

    // If the character and assist are selected
    if (char1 && assist1) {
        params.$and.push({
            $or: [
                { char1: `${char1}`, assist1: `${assist1}` },
                { char2: `${char1}`, assist2: `${assist1}` }
            ]
        });
    }
    if (char2 && assist2) {
        params.$and.push({
            $or: [
                { char1: `${char2}`, assist1: `${assist2}` },
                { char2: `${char2}`, assist2: `${assist2}` }
            ]
        });
    }

    // If the character and player are searched
    if (char1 && player1) {
        params.$and.push({
            $or: [
                { char1: `${char1}`, player1: { $regex: RegExp('^' + player1), $options: 'i' } },
                { char2: `${char1}`, player2: { $regex: RegExp('^' + player1), $options: 'i' } }
            ]
        })
    }
    if (char2 && player2) {
        params.$and.push({
            $or: [
                { char1: `${char2}`, player1: { $regex: RegExp('^' + player2), $options: 'i' } },
                { char2: `${char2}`, player2: { $regex: RegExp('^' + player2), $options: 'i' } }
            ]
        })
    }

    // If one assist is called
    if (assist1) {
        params.$and.push({
            $or: [
                { assist1: `${assist1}` },
                { assist2: `${assist1}` }
            ]
        });
    }
    if (assist2) {
        params.$and.push({
            $or: [
                { assist1: `${assist2}` },
                { assist2: `${assist2}` }
            ]
        });
    }

    // If both assists are called, check if it's a mirror
    if (assist1 && assist2) {
        if (assist1 === assist2) {
            params.$and.push({
                $and: [
                    { assist2: `${assist2}` },
                    { assist1: `${assist1}` }
                ]
            });
        } else {
            params.$and.push({
                $or: [
                    { assist2: `${assist2}` },
                    { assist1: `${assist1}` }
                ]
            });
        }
    }

    if (version) {
        params.$and.push({
            version: { $lte: version }
        });
    }

    try {
        const docs = await Video.VideoModel.findSearch(params, sorting);
        return res.json({
            videos: docs,
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            error: 'ERROR | Unable to search videos, please try again later.'
        });
    }
}

// Gets the _id of the send obj then deletes it from the database
const deleteEntry = async (req, res) => {
    try {
        const docs = await Video.VideoModel.deleteItem;
        return res.json({
            result: docs
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'ERROR | Unable to delete video, please try again later.'
        });
    }
};

module.exports.getVideos = getVideos;
module.exports.getAllVideos = getAllVideos;
module.exports.makeVideos = makeVideos;
module.exports.searchVideos = searchVideos;
module.exports.delete = deleteEntry;
