const sessionConfig = {
  key: 'appletsystem.sess' /** (string) cookie key (default is koa.sess) */,
  maxAge: 1000 * 60 * 60 * 30 /** (number || 'session') maxAge in ms (default is 1 days) */,
  autoCommit: true /** (boolean) automatically commit headers (default true) */,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: true /** (boolean) signed or not (default true) */,
  // (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  renew: false,
  // (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false)
  rolling: true,
  // secure: true /** (boolean) secure cookie*/,
  // sameSite: null /** (string) session cookie sameSite options (default null, don't set it) */,
};

export default sessionConfig;
