class StringBase {
    constructor() {
        //add if needed
    }
    
    urlStrBuilder(urlFirst, str, urlSecond) {
        return urlFirst + str + urlSecond
        }
    //Generic BeetleHelper
    OlKorrect = "All Good Here."
    downloadComplete = "Download completed"
    downloadStarted = "Download Started"
    nameError = "Name error: please check names entered and try again."
    duplicatePlayer = "Duplicate Error: Please enter unique names + a winner."
    invalidWinner = "Winner doesn't match any player entered, please try again."
    somethingWrong = "Error: please try again."
    updatedStandings = "Standings updated."
    updatedPlayer = "Player updated."
    playerAdded = "Player added."
    nameTaken = "Name taken, please enter a unique name."
    nameNeeded = "Please enter a name."
    confirmDelete = (name) => {
        return `Please type > ${name} < below to confirm deletion.`
    }
    playerDeleted = "Player deleted."
    deleteCanceled = "Deletion canceled."
    noDataToUpdate = "No data entered to update"

    //URLS
    allPeopleURL = `https://beetle-app-api.herokuapp.com/people`
    singlePerson = (name) => {
        return `${this.allPeopleURL}/${name}`
    }
    //Toast shorthand
    s = 'success'
    e = 'error'
}

const stringBase = new StringBase()