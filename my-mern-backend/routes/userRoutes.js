const express = require('express')
const router = express.Router();

const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

const validateUserCreation = (req, res, next) => {
    const { name, email } = req.body;

    if(!name || !email){
        return res.status(400).json({
            message: 'Bad Request: Name and email are required'
        });
    }

    next();
}

router.route('/')
    .get((req, res) => {
        res.status(200).json(users);
    })
    .post(validateUserCreation, (req, res) => {
        const newUser = req.body;
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const userWithId = { id: newId, ...newUser };
        users.push(userWithId);

        console.log('Received new user data via router:', userWithId);
        res.status(201).json({
            message: 'User created successfully via router!',
            user: userWithId
        });
    });

router.route('/:id')
    .get((req, res) => {
        const userId = req.params.id;
        const user = users.find(u => u.id === parseInt(userId));

        if(isNaN(userId)){
            return res.status(400).json({
                message: 'Bad Request: User ID must be a number.'
            });
        };

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
        const userId = parseInt(res.params.id);

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