require('dotenv').config();

// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');

// Pull in our routes
const router = require('./router');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

let mongoURL;
if(process.env.NODE_ENV == 'production') mongoURL = process.env.PROD_MONGO
else mongoURL = process.env.QA_MONGO || 'mongodb://127.0.0.1/DFCDatabase';
mongoose.connect(mongoURL).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

const app = express();

app.disable('x-powered-by');
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       'script-src': [
//         "'self'", 
//         'https://youtube.com', 
//         'https://twitch.tv', 
//         'https://nicovideo.jp',
//         'https://bilibili.com'
//       ],
//     },
//   },
// }));
// Serve static files from the Angular dist directory
app.use('/assets', express.static(path.resolve(`${__dirname}/../dist/browser/assets`)));
app.use(express.static(path.resolve(`${__dirname}/../dist/browser`)));

app.use(compression());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  key: 'sessionid',
  secret: 'Stop It Skieup',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
app.use(cookieParser());

app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token');
  console.log(err.code)
  return false;
});

router(app);

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../dist/browser/index.html`));
});

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
