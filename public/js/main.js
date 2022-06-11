// const { json } = require("express/lib/response")

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
        const all = await fetch('https://beetle-app-api.herokuapp.com/people')
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
                console.log('We got a problem with one of the names, boss!')
                alert("BeetleHelper: We got a problem with one of the names, boss! Please check the names entered and try again. (They are all case sensitive, and you have to enter all 4 names AND a winner.)")
            } else {
                console.log('All good here boss!')
            }
        })
        return namesAllExist
    }
    //current 
    async reportGame() {
        const status = this.checkNamesEntered()
        if (!status) { return "UhOh" }
            const names = this.getReportedNames()
            const p1 = names[0]
            const p2 = names[1]
            const p3 = names[2]
            const p4 = names[3]
            const winner = names[4]

            const playedUpdateArr = [p1, p2, p3, p4]
            
            //p1 set timeout may break it
            let one = await this.getPerson(p1)
                .then( res => {
                    console.log(res)
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

            document.querySelector('#reportLoad').style.display = "block";
            location.reload()
    }
    async getPerson(name) {
        const all = await fetch(`https://beetle-app-api.herokuapp.com/people/${name}`)
        const data = await all.json();
        let stripped = [data["name"], data["played"], data["won"]]
        return stripped
    }

    async putPerson(name, played, won) {
        const url = `https://beetle-app-api.herokuapp.com/people/${name}`

        try{
            const response = await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'played': played,'won': won})
            })
            const data = await response.json()
            console.log(data)
            people.logs.push(data)
            console.log("BeetleHelper: I updated that player with the information you gave me.")
            //location.reload()
        } catch(err) {
            console.log(err)
            people.errors.push(err)
            console.log("Beetle Helper: Uh Oh! I couldn't find them, or something went wrong. Double check what you entered and try again")
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
            //p with played
            let playedP = document.createElement('p')
            let textPlayed = document.createTextNode(`Played: ${this.all[i]["played"]}`)
            playedP.appendChild(textPlayed)
            li.appendChild(playedP)
            //p with won
            let wonP = document.createElement('p')
            let textWon = document.createTextNode(`Won: ${this.all[i]["won"]}`)
            wonP.appendChild(textWon)
            li.appendChild(wonP)
            
            if (this.all[i]["played"] > 0) {
                let winLoss = document.createElement('p')
                let textWinLoss = document.createTextNode(`Win Percentage: ${this.winLoss(this.all[i]["won"], this.all[i]["played"])}%`)
                winLoss.appendChild(textWinLoss)
                li.appendChild(winLoss)
            } else {
                let winLoss = document.createElement('p')
                let textWinLoss = document.createTextNode(`Win Percentage: N/A`)
                winLoss.appendChild(textWinLoss)
                li.appendChild(winLoss)
            }
            let deleteButton = document.createElement('button')
            deleteButton.innerText = "X"
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
        const url = 'https://beetle-app-api.herokuapp.com/people'
        const name = document.querySelector('#newName').value
        const played = document.querySelector('#newPlayed').value
        const won = document.querySelector('#newWon').value
    
        try{
            const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'played': played,'won': won})
            })
            const data = await response.json()
            console.log(data)
            people.logs.push(data)
            alert("BeetleHelper: I added that player with the information you gave me.")
            location.reload()
        } catch(err) {
            console.log(err)
            people.errors.push(err)
            alert("Beetle Helper: Uh Oh! That name is taken. I can't use duplicate names, please try a different name")
        }
    }
    //for display button
    async deletePerson2(name) {
        const url = `https://beetle-app-api.herokuapp.com/people/${name}`
    
        const confirmation = prompt('BeetleHelper: Are you sure you want to delete them? Please enter their name again (case sensitive) and click ok to confirm delete', 'No')
    
        if (confirmation === name) {
            try{
                const response = await fetch(url, {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name})
                })
                const data = await response.json()
                //console.log(data)
                alert("BeetleHelper: OK, I deleted them.")
                location.reload()
                
            } catch(err) {
                console.log(err)
            }
        } else {
            alert("BeetleHelper: Whew! Name didn't match, or you hit cancel; delete cancelled.")
        }
    }
    //delete person by input name
    async deletePerson() {
        const name = document.querySelector('#newName').value
        const played = document.querySelector('#newPlayed').value
        const won = document.querySelector('#newWon').value
        const url = `https://beetle-app-api.herokuapp.com/people/${name}`
    
        const confirmation = prompt('BeetleHelper: Are you sure you want to delete them? Please enter their name again (case sensitive) and click ok to confirm delete', 'No')
    
        if (confirmation === name) {
            try{
                const response = await fetch(url, {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'played': played,'won': won})
                })
                const data = await response.json()
                //console.log(data)
                alert("BeetleHelper: OK, I deleted them.")
                location.reload()
                
            } catch(err) {
                console.log(err)
            }
        } else {
            alert("BeetleHelper: Whew! Name didn't match, or you hit cancel; delete cancelled.")
        }
    }
    //find person by name and update by input
    async updatePerson() {
        const name = document.querySelector('#newName').value
        const played = document.querySelector('#newPlayed').value
        const won = document.querySelector('#newWon').value
        const url = `https://beetle-app-api.herokuapp.com/people/${name}`
        
        try{
            if (played && won) {
                const response = await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'played': played,'won': won})
                })
            
                const data = await response.json()
                console.log(data)
                if (data[0] === "Successfully updated!") {
                    alert("BeetleHelper: OK, I updated their entry.")
                } else { alert("BeetleHelper: Something went wrong, please check that you entered the name correctly (it's case sensitive).") }
            } else if (played && !won) {
                const response = await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'played': played})
                })
            
                const data = await response.json()
                console.log(data)
                if (data[0] === "Successfully updated!") {
                    alert("BeetleHelper: OK, I updated their entry.")
                } else { alert("BeetleHelper: Something went wrong, please check that you entered the name correctly (it's case sensitive).") }
            } else if (!played && won) {
                const response = await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name,'won': won})
                })
                const data = await response.json()
                console.log(data)
                if (data[0] === "Successfully updated!") {
                    alert("BeetleHelper: OK, I updated their entry.")
                } else { alert("BeetleHelper: Something went wrong, please check that you entered the name correctly (it's case sensitive).") }
            } else if (!played && !won) {
                const response = await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'name': name})
                })
                const data = await response.json()
                console.log(data)
                if (data[0] === "Successfully updated!") {
                    alert("BeetleHelper: You didn't enter anything to change, so I just reloaded their data.")
                } else { alert("BeetleHelper: Something went wrong, please check that you entered the name correctly (it's case sensitive).") }
            }
            location.reload()
        } catch(err) {
            alert("BeetleHelper: I wasn't able to find/update based on that name. Please check that you entered an already created name (it's case sensitive).")
            console.log(err)
        }
    }
}



//event listeners for buttons
document.querySelector('#createNewButton').addEventListener('click', addPerson)
document.querySelector('#updatePlayer').addEventListener('click', updatePerson)
document.querySelector('#deletePlayer').addEventListener('click', deletePerson)
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
    await fetch('https://beetle-app-api.herokuapp.com/people')
    .then(res => res.json())
    .then(data => {
        people = new People(data)
        people.render()
    })
}

loadJS()