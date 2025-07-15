const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Note = require('../models/Note');
const { protect } = require('../middleware/authMiddleware');

router.get('/', async (req, res, next) => {
    try {
        const notes = await Note.find().sort({createdAt: -1});
        res.status(200).json(notes);
    } catch (error){
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: 'Invalid Note ID format'
            })
        }

        const note = await Note.findById(id);

        if (!note){
            return res.status(400).json({
                message: 'Note not found'
            });
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
});

router.post('/', protect, async (req, res, next) => {
    try {
        const { title, content } = req.body;

        if (!title || !content){
            return res.status(400).json({
                message: 'Please include a title, content, and user ID'
            })
        }

        const newNote = new Note({
            title,
            content,
            userId: req.user.id
        })

        const savedNote = await newNote.save();

        res.status(201).json(savedNote);

    } catch (error) {
        next(error)
    }
});

router.put('/:id', protect, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: 'Invalid Note ID format'
            });
        }

        const note = await Note.findById(id);

        if(!note){
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        if(note.userId.toString() !== req.user.id){
            return res.status(403).json({
                message: 'Not authorized to update'
            })
        }

        const updatedNote = await Note.findByIdAndUpdate(
            id, 
            { title, content, updatedAt: Date.now() },
            { new: true, runValidators: true}
        );

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', protect, async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: 'Invalid Note ID format'
            });
        }

        const note = await Note.findById(id);

        if(note.userId.toString() !== req.user.id){
            return res.status(403).json({
                message: 'Not authorized to delete'
            })
        }

        await Note.findByIdAndDelete(id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;