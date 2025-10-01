
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/login');
  }
  return next();
};

const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/logout');
  }

  return next();
};

const requiresSecure = (req, res, next) => {
  // Need to instead check if the original request was HTTPS since we're on Heroku
  const isHttps = req.secure || 
                  req.headers['x-forwarded-proto'] === 'https' ||
                  (req.headers['x-forwarded-ssl'] === 'on');
  
  if (!isHttps) {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;
module.exports.requiresSecure = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'qa') ? requiresSecure : bypassSecure; 
