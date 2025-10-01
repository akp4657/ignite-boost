
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
    // Debug logging for Heroku
    console.log('=== HTTPS Middleware Debug ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('req.secure:', req.secure);
    console.log('x-forwarded-proto:', req.headers['x-forwarded-proto']);
    console.log('x-forwarded-ssl:', req.headers['x-forwarded-ssl']);
    console.log('host:', req.hostname);
    console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Need to instead check if the original request was HTTPS since we're on Heroku
  const isHttps = req.secure || 
                  req.headers['x-forwarded-proto'] === 'https' ||
                  (req.headers['x-forwarded-ssl'] === 'on');
  
  console.log('isHttps:', isHttps);
  if (!isHttps) {
    console.log('Redirecting to HTTPS');
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  
  return next();
};

const bypassSecure = (req, res, next) => {
  console.log('Bypassing HTTPS');
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;
module.exports.requiresSecure = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'qa') ? requiresSecure : bypassSecure; 
