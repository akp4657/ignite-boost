import dotenv from 'dotenv'
dotenv.config()

let slackToken;
let to = {};

const currentEnv = process.env.CURRENT || 'dev'


export const db_config = {
    connection_string: process.env.MONGO_CONNECTION
}