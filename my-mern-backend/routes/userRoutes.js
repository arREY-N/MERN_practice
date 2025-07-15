const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

const User = require('../models/User');

const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

const validateUserCreation = (req, res, next) => {
    const { username, password } = req.body;

    if(!username || !password){
        return res.status(400).json({
            message: 'Bad Request: Username and password are required'
        });
    }

    next();
}

router.route('/')
    .get((req, res) => {
        res.status(200).json(users);
    })
    .post(validateUserCreation, async (req, res) => {
        const { username, password } = req.body;
        
        if (!username || !password){
            return res.status(400).json({
                message: 'Please include a valid username and password'
            })
        }

        const newUser = new User({
            username,
            password
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'User created successfully via router!',
            user: savedUser
        });
    });

router.route('/:id')
    .get(async (req, res) => {
        const userId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({
                message: 'Bad Request: Invalid User ID.'
            });
        };

        const user = await User.findById(userId);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({
                message: 'User not found.' 
            });
        }
    })
    .put((req, res) => {
        const userId = parseInt(req.params.id);
        const updatedData = req.body;
        
        if (isNaN(userId)) {
            return res.status(400).json({
                message: 'Bad Request: User ID must be a number'
            });
        }
        
        const userIndex = users.findIndex(u => u.id === userId);
        
        if(userIndex !== -1){
            users[userIndex] = { ...users[userIndex], ...updatedData, id: userId };
            res.status(200).json({
                message: 'User updated successfully',
                user: users[userIndex]
            });
        } else {
            res.status(400).json({
                message: 'User not found'
            });
        }
    })
    .delete((req, res) => {
        const userId = parseInt(req.params.id);

        if(isNaN(userId)){
            return res.status(400).json({
                message: 'Bad Request: User ID must be a number'
            });
        }

        const initialLength = users.length;
        const filteredUsers = users.filter(u => u.id !== userId);

        if (filteredUsers.length < initialLength) {
            res.status(204).send();
        } else {
            res.status(404).json({ 
                message: 'User not found' 
            });
        } 
    });

module.exports = router;