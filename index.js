const express = require('express')
const app = express();
const mongoose = require('mongoose')
const notesRoute = require('./routes/notes')

mongoose.connect('mongodb://localhost/notes', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successful connection to the database')
    })
    .catch((err) => {
        console.log('Error connecting to database:', err)
    })

app.use(express.json());
app.use('/notes', notesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})