const express = required('express');
const router = express.Router();

const Note = require('../models/Note');

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

router.post('/', async (req, res, next) => {
    try {
        const { title, content, userId } = req.body;

        if (!title || !content || !userId){
            return res.status(400).json({
                message: 'Please include a title, content, and user ID'
            })
        }

        const newNote = new Note({
            title,
            content,
            userId
        })

        const savedNote = await newNote.save();

        res.status(201).json(savedNote);

    } catch (error) {
        next(error)
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: 'Invalid Note ID format'
            });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            id, 
            { title, content },
            { new: true, runValidators: true}
        );

        if (!updatedNote) {
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: 'Invalid Note ID format'
            });
        }

        const deletedNote = await Note.findByIdAndDelete(id);

        if(!deletedNote){
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;