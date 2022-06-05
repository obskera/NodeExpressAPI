const Person = require('../models/person.model.js');

// Create and Save a new Note ERRORS ITS NOT WORKING GUYS
exports.create = async (req, res) => {
    // Validate request
    // if(!req.body.name) {
    //     return res.status(400).send({
    //         message: "Content can not be empty"
    //     });
    // }\

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
                    res.send("Oops, that name is already in the database, please use another")
                }
            })
    }
    dupeCheck()
    //dupeCheck()
 

    //failed async
    // const checkDupe = async (namePara) =>{
    //     let exists = await Person.exists({name: namePara})
    //     console.log(exists)
    // }
    // const checkAndMake = async _ => {
    //     await checkDupe(req.params.name);
    //     await makeAndSave();
    // }

    // checkAndMake()

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
exports.findOne = (req, res) => {
    //Person.findById(req.params.name)
    Person.find({name: req.params.name})
    .then(person => {
        if(!person) {
            return res.status(404).send({
                message: "Not found with name " + req.params.name
            });            
        }
        res.send(person);
    }).catch(err => {
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
    // Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Name cannot be empty"
        });
    }
    const person = await Person.findOneAndUpdate(
        { name: req.params.name },
        {
          name: req.body.name,
          played: req.body.played,
          won: req.body.won
        })
      
      console.log(person)
      res.send('Successfully updated!')

    //new Find one and update with req body that still doesnt work
    // let person = await Person.find({name: req.params.name})
    // if(!person) {
    //     return res.status(404).send({ message: "Not found with name " + req.params.name
    //     });
    // }
    // console.log(person)
    // person["name"] = req.params.name || "Anon"
    // person["played"] = req.params.played || 0
    // person["won"] = req.params.won || 0
    // const doc = await person.save()
    // console.log(doc)
    //end

    //non-working new
    // Person.find({name: req.params.name})
    //     .then(person => {
    //         if(!person) {
    //             return res.status(404).send({
    //                 message: "Not found with name " + req.params.name
    //             });
    //         }
    //         person["name"] = req.body.name || "Anon"
    //         person["played"] = req.body.played || 0
    //         person["won"] = req.body.won || 0
    //         person.save()
    //         res.send(person);
    //     }).catch(err => {
    //         if(err.kind === 'ObjectName') {
    //             return res.status(404).send({
    //                 message: "Not found with name " + req.params.name
    //             });                
    //         }
    //         return res.status(500).send({
    //             message: "Error retrieving with name " + req.params.name
    //         });
    //     });

        //end

    // Find person and update with the request body
    //old 

    // Person.findByIdAndUpdate(req.params.name, {
    //     name: req.body.name || "Anon",
    //     played: req.body.played || 0,
    //     won: req.body.won || 0
    // }, {new: true})
    // .then(person => {
    //     if(!person) {
    //         return res.status(404).send({
    //             message: "Not found with name " + req.params.name
    //         });
    //     }
    //     res.send(person);
    // }).catch(err => {
    //     if(err.kind === 'ObjectName') {
    //         return res.status(404).send({
    //             message: "Not found with name " + req.params.name
    //         });                
    //     }
    //     return res.status(500).send({
    //         message: "Error updating with name " + req.params.name
    //     });
    // });
};

// Delete a person with the specified name in the request
exports.delete = (req, res) => {
    Person.findByIdAndRemove(req.params.name)
    .then(person => {
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
};