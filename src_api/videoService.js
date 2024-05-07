import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios';
import * as config from '../config.js';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb'

// Mongoose DB
let models = {};
import _account from '../models/account.js'
models.account = _account
import _characters from '../models/characters.js'
models.characters = _characters
import _video from '../models/video.js'
models.video = _video

export const getVideosHomepage = async function(req, res) {
    models.video.find({}).sort({matchDate: -1}).then(v => {
        return res.status(200).send({data: v})
    }).catch(err => {
        console.log(err)
        return res.status(500).send({message: 'Could not find videos'})
    })
}

// TODO: Search videos dynamically
// TODO: Get assist tab