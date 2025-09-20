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
const crypto = require('crypto');
const fs = require('fs');

// Pull in our routes
const router = require('./router');

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
//app.use(helmet());
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(32).toString("hex");
  next();
});
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
      },
    },
  }),
);

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

app.use(express.static(path.resolve(`${__dirname}/../dist/browser`), {
  index: false, // Don't serve index.html statically
}));
app.get(`/{*splat}`, (req, res) => {
  const indexPath = path.join(__dirname, '/../dist/browser', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send("Error loading index.html");

    const indexWithNonce = data.replaceAll('randomNonceGoesHere', res.locals.cspNonce);
    res.send(indexWithNonce);
  });
});

const port = process.env.PORT || process.env.NODE_PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
