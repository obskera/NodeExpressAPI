module.exports = (app) => {
    const people = require('../controllers/person.controller.js');

    // Create a new Note
    app.post('/people', people.create);

    // Retrieve all Notes
    app.get('/people', people.findAll);

    // Retrieve a single Note with noteId
    app.get('/people/:name', people.findOne);

    // Update a Note with noteId
    app.put('/people/:name', people.update);

    // Delete a Note with noteId
    app.delete('/people/:name', people.delete);
}