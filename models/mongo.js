import * as config from '../config.js';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
var db_config = config.db_config;

const mg = {
    connectToServer: function (callback) {
        mongoose.connect(db_config.connection_string, { 
        useNewUrlParser: true}).then(console.log('Connected')).catch((e)=>{
            console.log(e)
            console.log(`not connected`);
        })
    }
}

export default mg