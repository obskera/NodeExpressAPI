// const { json } = require("express/lib/response")

// //const $ = ($) => `document.querySelector(${$})`
class People {
    constructor(all) {
        this.all = all
    }
    errors = []
    logs = []
    //render database contents on page
    winLoss(wins, played) {
        console.log(wins, Number(wins))
        return Math.round(Number(wins) / Number(played) * 100)
    }
    render = () => {
        let ul = document.querySelector('#peopleDisplay')
        let i = 0
        for (i = 0; i < this.all.length; i++) {
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
//add a new person fetch
async function addPerson() {
    people.addPerson()
}
async function updatePerson() {
    people.updatePerson()
}
async function deletePerson() {
    people.deletePerson()
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