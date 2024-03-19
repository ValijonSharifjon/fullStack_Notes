const express = require('express')
const router = express.Router();
const {Note, validate} = require('../models/note')

router.get('/', async (req, res) => {
    try {
        const notes = await Note.find().sort('created_at')
        res.send(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
})

router.post('/', async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const {title, content} = req.body
        let note = new Note({
            title,
            content
        })
        note = await note.save();
        res.status(201).send(note)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send('An entry with the specified ID was not found');
        }
        res.send(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
})

router.put('/:id', async (req, res) => {
    try {
        const {error} = validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        let note = await Note.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content
        },{
            new: true
        })

        if (!note) {
            return res.status(404).send('An entry with the specified ID was not found');
        }

        res.send(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).send('An entry with the specified ID was not found');
        }
        res.send(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});

module.exports = router;