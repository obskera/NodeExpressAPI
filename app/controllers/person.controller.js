const { exists } = require('../models/person.model.js');
const Person = require('../models/person.model.js');

// Create and Save a new Note ERRORS ITS NOT WORKING GUYS
exports.create = async (req, res) => {

    const isEmpty = async _ => {
        if (!req.body.name) {
            res.status(400).send({
                message: "A Beetle needs a name! Please enter a name in the body of request."
            })
        }
    }
    const makeAndSave = async _ => {
        let named = req.body.name
        //if (Person.exists({name: named})) { res.send('Already exists, use another!')} else {
            // Create a Person (LOL)
            const person = new Person({
                name: req.body.name || "Anon", 
                played: req.body.played || 0,
                won: req.body.won || 0
            });
            // Save person in the database
            person.save()
            .then(data => {
                res.send(data);
                console.log('success!')
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating this person (lol)."
                });
            });
        //}
    }
    const dupeCheck = _ => {
        console.log(req.body.name)
        let arr = []
        isEmpty()
        Person.find()
            .then(people => {
                //console.log(Object.keys(people))
                for (i = 0; i < Object.keys(people).length; i++) {
                    arr.push(people[i]["name"])
                }
                //console.log(arr, arr.includes("xerry"))
                if (!arr.includes(req.body.name)) {
                    makeAndSave()
                } else {
                    res.send("duplicate name")
                }
            })
    }
    dupeCheck()
};

// Retrieve and return all people from the database.
exports.findAll = (req, res) => {
    Person.find()
    .then(people => {
        res.send(people);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving this."
        });
    });
};

// Find a single person with a name
exports.findOne = async (req, res) => {
    Person.findOne({name: req.params.name})
        .then(person => {
            console.log(person)
            if (!person) {
                res.status(404).send({
                    message: "Not found with name " + req.params.name
                });   
            } else {
                res.send(person)
            }
        })
        .catch(err => {
            if(err.kind === 'ObjectName') {
                return res.status(404).send({
                    message: "Not found with name " + req.params.name
                });                
            }
            return res.status(500).send({
                message: "Error retrieving with name " + req.params.name
            });
        });
};

// Update a person identified by the name in the request
exports.update = async (req, res) => {
    //method
    //const updatedPerson = await Person.findOne({name: req.params.name})
    const person = await Person.findOneAndUpdate(
        { name: req.params.name },
        {
          name: req.body.name,
          played: req.body.played,
          won: req.body.won
        })
    const duper = await Person.findOne({name: req.params.name})
    // Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Name cannot be empty"
        });
    } else if (!duper) {
        return res.status(404).send({
            message: "Not found with name " + req.params.name
        });                
    } else {
        person
        
        res.send(['Successfully updated!', duper])
    }
  
      

};

exports.delete = (req, res) => {
    //Person.findByIdAndRemove(req.params.name)
    Person.findOne({name: req.params.name})
        .then(check => {
            if (!check) {
                //res.send('No such person, try someone else')
                res.status(404).send({
                    message: "Not found with name " + req.params.name
                });   
            } else {
                Person.deleteOne({name: req.params.name})
                .then(person => {
                    console.log(person)
                    if(!person) {
                        return res.status(404).send({
                            message: "Not found with name " + req.params.name
                        });
                    }
                    res.send({message: "Deleted successfully!"});
                }).catch(err => {
                    if(err.kind === 'ObjectName' || err.name === 'NotFound') {
                        return res.status(404).send({
                            message: "Not found with name " + req.params.name
                        });                
                    }
                    return res.status(500).send({
                        message: "Could not delete with name " + req.params.name
                    });
                });
            }
        })
};