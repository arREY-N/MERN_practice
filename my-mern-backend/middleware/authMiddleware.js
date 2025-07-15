const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, jwtSecret);

            req.user = await User.findById(decoded.id).select('-password');

            if(!req.user){
                return res.status(401).json({
                    message: 'Not authorized, user not found'
                });
            }

            next();
        } catch (error){
            console.log('Token verification error: ', error.message);

            if(error.name === 'TokenExpiredError'){
                return res.status(401).json({
                    message: 'Not authorized, token expired'
                });
            }

            if(error.name === 'JsonWebTokenError'){
                return res.status(401).json({
                    message: 'Not authorized, token failed'
                });
            }

            next(error);
        }
    }

    if(!token){
        return res.status(401).json({
            message: 'Not authorized, no token'
        });
    }
}

module.exports = { protect };