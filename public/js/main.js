// const { json } = require("express/lib/response")

// const { string } = require("i/lib/util")

// const { string } = require("i/lib/util")

// //const $ = ($) => `document.querySelector(${$})`
class People {
    constructor(all) {
        this.all = all
    }
    errors = []
    logs = []
    //render database contents on page
    getReportedNames() {
        const player1 = document.querySelector('#player1').value || 'empty'
        const player2 = document.querySelector('#player2').value || 'empty'
        const player3 = document.querySelector('#player3').value || 'empty'
        const player4 = document.querySelector('#player4').value || 'empty'
        const winner = document.querySelector('#reportedWinner').value || 'empty'
        const arr = [player1, player2, player3, player4, winner]
        //console.log(arr)
        return arr
    }
    async getAllNames() {
        const all = await fetch(stringBase.allPeopleURL)
        //arr of objects
        const data = await all.json();
        let arr = []
        data.forEach(item => {
            arr.push(item["name"])
        })
        //returns array of just the names in order
        return arr
    }
    async checkNamesEntered() {
        const reportedNamesArr = await this.getReportedNames()
        const allNamesArr = await this.getAllNames()
        let namesAllExist = true
        reportedNamesArr.forEach(name => {
            if (allNamesArr.indexOf(name) === -1) {
                namesAllExist = false
                return false
            } else {
                console.log(stringBase.OlKorrect)
            }
        })
        if (!namesAllExist) {
            console.log(stringBase.nameError)
                //ZZX Replace
                toast.show(stringBase.nameError, stringBase.e)
                //alert(stringBase.nameError)
        }
        return namesAllExist
    }
    //current 
    async reportGame() {
        toast.show(stringBase.workingOnIt, stringBase.s)
        let status = await this.checkNamesEntered()
        if (!status) { return }
            const names = this.getReportedNames()
            const p1 = names[0]
            const p2 = names[1]
            const p3 = names[2]
            const p4 = names[3]
            const winner = names[4]

            const playedUpdateArr = [p1, p2, p3, p4]
            //check for duplicate names, and that winner is in names entered, 
            //index 0-3 are players, index 4 is the winner 
            //(which should be one of the four players)
            let winnerPresent = false
            let checkErrors = [stringBase.duplicatePlayer, stringBase.invalidWinner]
            let displayError = false
            playedUpdateArr.forEach(name => {
                let checkName = playedUpdateArr.indexOf(name)
                if (checkName < 0) {
                    status = false
                    displayError = checkErrors[0]
                    return stringBase.somethingWrong
                  }
            })
            if(playedUpdateArr.indexOf(winner) < 0) {
                //console.log("checking winner is one of players")
                status = false
                displayError = checkErrors[1]
                console.log(displayError)
                //alert(displayError)
                toast.show(displayError, stringBase.e)
                return stringBase.somethingWrong
            }
            if (displayError) {
                console.log(displayError)
                toast.show(displayError, stringBase.e)
                //alert(displayError)
                return displayError
            }
            if (status) {
                   //p1 set timeout may break it
            let one = await this.getPerson(p1)
            .then( res => {
                //console.log(res)
                this.putPerson(res[0], (res[1] + 1), res[2])
            })
            // //p2
            let two = await this.getPerson(p2)
                .then(res => { 
                    this.putPerson(res[0], (res[1] + 1), res[2])
                })
            // //p3
            let three = await this.getPerson(p3)
            //     .then(this.putPerson(three[0], (three[1] + 1), three[2]))
                .then(res => { 
                    this.putPerson(res[0], (res[1] + 1), res[2])
                })
            // //p4
            let four = await this.getPerson(p4)
            //     .then(this.putPerson(four[0], (four[1] + 1), four[2])) 
                .then(res => { 
                    this.putPerson(res[0], (res[1] + 1), res[2])
                })
            // //winner
            let winnerRep = await this.getPerson(winner)
            //     .then(this.putPerson(winnerRep[0], winnerRep[1], (winnerRep[2] + 1)))
                .then(res => { 
                    this.putPerson(res[0], res[1], (res[2] + 1))
                })
            //stuff before event loop does junk
                //CHANGES
            //document.querySelector('#reportLoad').style.display = "block";
            document.querySelector('#reportGameButton').getElementsByClassName.display = "block";
            //alert(stringBase.updatedStandings)
            toast.show(stringBase.updatedStandings, stringBase.s)
            location.reload()
        }
         
    }
    async getPerson(name) {
        const all = await fetch(stringBase.singlePerson(name))
        const data = await all.json();
        let stripped = [data["name"], data["played"], data["won"]]
        return stripped
    }

    async putPerson(name, played, won) {
        const url = stringBase.singlePerson(name)

        try{
            const response = await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'played': played,'won': won})
            })
            const data = await response.json()
            // console.log(data)
            people.logs.push(data)
            console.log(stringBase.updatedPlayer)
            //location.reload()
        } catch(err) {
            console.log(err)
            people.errors.push(err)
            console.log(stringBase.somethingWrong)
        }
    }
    
    //end current
    winLoss(wins, played) {
        //console.log(wins, Number(wins))
        return Math.round(Number(wins) / Number(played) * 100)
    }
    render = () => {
        let ul = document.querySelector('#peopleDisplay')
        let i = 0
        for (i = 0; i < this.all.length; i++) {
            const allName = this.all[i]["name"]
            //create li
            let li = document.createElement('li')
            //add h2
            let h2 = document.createElement('h2')
            //ake text node
            let textH2 = document.createTextNode(`Name: ${this.all[i]["name"]}`)
            //add to h2
            h2.appendChild(textH2)
            //add h2 to li
            li.appendChild(h2)
            // let br = document.createElement('br')
            // li.appendChild(br)
            //p with played
            let playedP = document.createElement('h2')
            let textPlayed = document.createTextNode(`Played: ${this.all[i]["played"]}`)
            playedP.appendChild(textPlayed)
            li.appendChild(playedP)
            //p with won
            let wonP = document.createElement('h2')
            let textWon = document.createTextNode(`Won: ${this.all[i]["won"]}`)
            wonP.appendChild(textWon)
            li.appendChild(wonP)
            
            if (this.all[i]["played"] > 0) {
                let winLoss = document.createElement('h2')
                let textWinLoss = document.createTextNode(`Win Percentage: ${this.winLoss(this.all[i]["won"], this.all[i]["played"])}%`)
                winLoss.appendChild(textWinLoss)
                li.appendChild(winLoss)
            } else {
                let winLoss = document.createElement('h2')
                let textWinLoss = document.createTextNode(`Win Percentage: N/A`)
                winLoss.appendChild(textWinLoss)
                li.appendChild(winLoss)
            }
            let deleteButton = document.createElement('button')
            deleteButton.innerText = "Delete"
            deleteButton.id = `Delete${this.all[i]["name"]}`
            li.appendChild(deleteButton)
            li.addEventListener('click', function() {
                deletePerson2(allName)
            }, false)
            ul.appendChild(li)
        }
    }
    //create new person
    async addPerson() {
        const url = stringBase.allPeopleURL
        const name = document.querySelector('#newName').value
        const played = document.querySelector('#newPlayed').value
        const won = document.querySelector('#newWon').value
        if (!name) {
            //alert(stringBase.nameError)
            toast.show(stringBase.nameError, stringBase.e)
            console.log(stringBase.nameError)
            return stringBase.nameError
        } else {
            try{
                const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'played': played,'won': won})
                })
                const data = await response.json()
                //console.log(data)
                people.logs.push(data)
                //alert(stringBase.playerAdded)
                toast.show(stringBase.playerAdded, stringBase.s)
                location.reload()
            } catch(err) {
                console.log(err)
                people.errors.push(err)
                //alert(stringBase.nameTaken)
                toast.show(stringBase.nameTaken, stringBase.e)
            }
        }
    }
       
    //for display button
    async deletePerson2(name) {
        const url = stringBase.singlePerson(name)
    
        const confirmation = prompt(stringBase.confirmDelete(name), '')
    
        if (confirmation === name) {
            try{
                const response = await fetch(url, {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name})
                })
                const data = await response.json()
                //console.log(data)
                //alert(stringBase.playerDeleted)
                toast.show(stringBase.playerDeleted, stringBase.s)
                location.reload()
                
            } catch(err) {
                console.log(err)
            }
        } else {
            //alert(stringBase.deleteCanceled)
            toast.show(stringBase.deleteCanceled, stringBase.e)
        }
    }
    //delete person by input name
    //changed
    async deletePerson() {
        const name = document.querySelector('#newName').value
        const played = document.querySelector('#newPlayed').value
        const won = document.querySelector('#newWon').value
        const url = stringBase.singlePerson(name)
    
        const confirmation = prompt(stringBase.confirmDelete(name), '')
    
        if (confirmation === name) {
            try{
                const response = await fetch(url, {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'played': played,'won': won})
                })
                const data = await response.json()
                //console.log(data)
                //alert(stringBase.playerDeleted)
                toast.show(stringBase.playerDeleted, stringBase.s)
                location.reload()
                
            } catch(err) {
                console.log(err)
            }
        } else {
            //alert(stringBase.deleteCanceled)
            toast.show(stringBase.deleteCanceled, stringBase.e)
        }
    }
    //find person by name and update by input
    async updatePerson() {
        const name = document.querySelector('#newName').value
        const played = document.querySelector('#newPlayed').value
        const won = document.querySelector('#newWon').value
        const url = stringBase.singlePerson(name)
        //new Stuff may break
        if (!name) { 
            console.log(stringBase.nameError)
            //alert(stringBase.nameError)
            toast.show(stringBase.nameError, stringBase.e)
            return stringBase.nameError
        } else {
            try{
                if (played && won) {
                    const response = await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'played': played,'won': won})
                    })
                
                    const data = await response.json()
                    //console.log(data)
                    if (data[0] === "Successfully updated!") {
                        //alert(stringBase.updatedPlayer)
                        toast.show(stringBase.updatedPlayer, stringBase.s)
                    } else { toast.show(stringBase.nameError, stringBase.e)}
                } else if (played && !won) {
                    const response = await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'played': played})
                    })
                
                    const data = await response.json()
                    //console.log(data)
                    if (data[0] === "Successfully updated!") {
                        //alert(stringBase.updatedPlayer)
                        toast.show(stringBase.updatedPlayer, stringBase.s)
                        // let userAlert = new AlertSystem() 
                        // userAlert.alert(userAlert.messages.somethingWrong)
                        // - octoshrimpy
                    } else { toast.show(stringBase.nameError, stringBase.e) }
                } else if (!played && won) {
                    // let dbapi = new DbApi()
                    // let obj = {'name': name,'won': won}
                    // const response = await dbApi.put(JSON.stringify(obj))
                    const response = await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'won': won})
                    })
                    const data = await response.json()
                    //console.log(data)
                    if (data[0] === "Successfully updated!") {
                        //alert(stringBase.updatedPlayer)
                        toast.show(stringBase.updatedPlayer, stringBase.s)
                    } else { toast.show(stringBase.nameError, stringBase.e) }
                } else if (!played && !won) {
                    const response = await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name})
                    })
                    const data = await response.json()
                    //console.log(data)
                    if (data[0] === "Successfully updated!") {
                        // alert(stringBase.noDataToUpdate)
                        toast.show(stringBase.noDataToUpdate, stringBase.e)
                    } else { toast.show(stringBase.nameError, stringBase.e) }
                }
                location.reload()
            } catch(err) {
                toast.show(stringBase.nameError, stringBase.e)
                //alert(stringBase.nameError)
                console.log(err)
            }
        }
       
    }
}

//event listeners for buttons
document.querySelector('#createNewButton').addEventListener('click', addPerson)
document.querySelector('#updatePlayer').addEventListener('click', updatePerson)
// document.querySelector('#deletePlayer').addEventListener('click', deletePerson)
document.querySelector('#reportGameButton').addEventListener('click', reportGame)
//add a new person fetch
async function reportGame() {
    people.reportGame()
}
async function addPerson() {
    people.addPerson()
}
async function updatePerson() {
    people.updatePerson()
}
async function deletePerson() {
    people.deletePerson()
}
async function deletePerson2(name) {
    people.deletePerson2(name)
}
async function loadJS() {
    await fetch(stringBase.allPeopleURL)
    .then(res => res.json())
    .then(data => {
        people = new People(data)
        people.render()
    })
}

loadJS()