const mongoose = require('mongoose');
const Joi = require('joi');

const noteSchema = new mongoose.Schema({
    title: {type: String, require: true},
    content: {type: String, require: true},
    createdAt: {type: Date, default: Date.now}
})

function validateNote(category) {
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required()
    });
    return  schema.validate(category);

}

const Note = mongoose.model('Note', noteSchema);

exports.Note = Note;
exports.validate = validateNote;