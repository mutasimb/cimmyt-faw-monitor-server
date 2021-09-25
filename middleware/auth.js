const { verify } = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {

  const token = req.header('x-auth-token');

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.userId = decoded.user.id;
        next();
      }
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
