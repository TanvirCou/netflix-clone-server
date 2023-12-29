const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
    const {authorization} = req.headers;
    if (
        authorization &&
        authorization.startsWith("Bearer")
      ) {
        try{
            const token = authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const { userId, isAdmin } = decoded;
            req.userId = userId;
            req.isAdmin = isAdmin;
            next();
        }catch(err) {
            next('Authentication failure')
        }
    } else {
        next("Not authorized, no token");
    }
};

module.exports = checkLogin;