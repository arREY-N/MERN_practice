const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: '1h'
    });
};

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password){
            return res.status(400).json({
                message: 'Please enter a valid username and password'
            })
        }

        const existingUser = await User.findOne({username});

        if(existingUser){
            return res.status(400).json({
                message: 'Username already in-use'
            });
        }

        const newUser = new User({
            username,
            password
        });

        const savedUser = await newUser.save();

        const token = generateToken(savedUser._id);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: savedUser.id,
                username: savedUser.username
            },
            token
        })
    }catch (error) {
        if(error.name === 'ValidationError'){
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({message: messages.join(', ')});
        }
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json({
                message: 'Please enter a valid username and password'
            });
        } 

        const user = await User.findOne({username}).select('+password');

        if(!user){
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({
                message: 'Inavalid credentials'
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user.id,
                username: user.username
            },
            token
        });
    } catch (error){
        next(error);
    }
})

module.exports = router;