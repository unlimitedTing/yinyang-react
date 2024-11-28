module.exports = (req, res, next) => {
  console.log('--- Incoming Request ---');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  console.log('Query Params:', req.query);
  console.log('Body:', req.body); // Requires body-parsing middleware like express.json()
  console.log('------------------------');
  next();
};
