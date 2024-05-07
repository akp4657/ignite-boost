import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import mongo from './models/mongo.js';

import * as video_service from './src_api/videoService.js'
const port = 3000;

import cors from 'cors'
const app = express();

// Mounting the app under the process.env.ROUTE as a parent route (if present)
var route = process.env.ROUTE;
var parent_app;

// Enable CORS for all routes
app.use(cors());

mongo.connectToServer(function (err, client) {
  if (err) console.log(err)
})

import http_server from 'http'
if(route == undefined) {
  http_server.createServer(app);
} else {
  parent_app = express();
  parent_app.use("/" + route, app);
  http_server.createServer(parent_app);
}

// body parser set up
app.use(bodyParser.urlencoded({ 
  limit: '200mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '200mb',
  extended: true
}));

// Endpoints for FE
app.get('/getVideos', video_service.getVideosHomepage);

// TODO: DUAL PANELS FOR HOMEPAGE

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

mongo.connectToServer(function (err, client) {
  if (err) console.log(err)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

