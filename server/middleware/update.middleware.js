module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  // console.log(req.headers.authorization);
  try {
    // console.log(req.baseUrl);
    next()
  } catch (e) {
    console.log(e);
  }
}