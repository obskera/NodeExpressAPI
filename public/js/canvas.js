//new stuff
document.querySelector('#renderStandings').addEventListener('click', onClick)
// document.querySelector('#renderTest').addEventListener('click', _ =>{
//     canvasToImageDownload()
//     alert("BeetleHelper: Please check your downloads directory to find the exported standings.")
// })

//new default stuff
let uPlayer = "PlayerX"
let uPlayed = 0
let uWon = 0
let uWinRatio = "N/A"

let height = [52, 92, 132, 172]

let standingsArr = []
let canvasWidth = 336;
let canvasHeight = 192;

let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d');

async function getAllPeople() {
    showCanvas()
    let url = `https://beetle-app-api.herokuapp.com/people`
    await fetch(url)
        .then( response => response.json())
        .then (data => {
            standingsArr = data
            canvasHeight = (canvasHeight * standingsArr.length) + 40
            canvas.height = canvasHeight
            // use drawPlayers() for each person
            setCanvasUp()
            //enter obj from array
            drawbg()
            data.forEach( (obj, i) => {
                    drawPlayers(obj, i, height)
                    heightMultiplyer(height)
                })
            canvasToImageDownload()
            alert("BeetleHelper: Please allow the download to save the standings as an image, then check your downloads directory to find the exported standings.")
        })
    //hideCanvas()
    location.reload()
}

function setPlayerInfo(obj) {
    uPlayer = `${obj["name"]}`
    uPlayed = `Played: ${obj["played"]}`
    uWon = `Won: ${obj["won"]}`
    uWinRatio = "N/A"
    if (obj["played"] > 0) {
        uWinRatio = `Win Percentage: ${Math.round((obj["won"] / obj["played"] * 100))}%`
    }
}
function drawbg() {
    c.fillStyle = 'rgba(31, 31, 31, 1)'
    c.fillRect(0, 0, canvas.width, canvas.height);
}
function drawPlayers(item, index, height) {
    let n1 = height[0]
    let n2 = height[1]
    let n3 = height[2]
    let n4 = height[3]

        // console.log(item)
        uPlayer = item["name"]
        uPlayed = `Played: ${item["played"]}`
        uWon = `Won: ${item["won"]}`
        uWinRatio = "N/A"
        if (item["played"] > 0) {
            uWinRatio = `Win Percentage: ${Math.round((item["won"] / item["played"] * 100))}%`
        }
       
        //player
        c.font = fontSetterAvenirnext(h1FontSize);
        c.fillStyle = 'rgba(206 218 227)'
        c.fillText(uPlayer, 55, n1);
        //played
        c.font = fontSetterAvenirnext(jTitleFontSize);
        c.fillText(uPlayed, 20, n2);
        //won
        c.font = fontSetterAvenirnext(pNumberFontSize);
        c.fillText(uWon, 20, n3);
        //win Percentage
        c.font = fontSetterAvenirnext(eMailFontSize);
        c.fillText(uWinRatio, 20, n4);
}

function retinaDownscaling() {
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    c.scale(devicePixelRatio, devicePixelRatio);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
}
function setCanvasUp() {
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    retinaDownscaling()
}
   
function heightMultiplyer(arr) {
        let newHeight = []
        //multiply here
        newHeight.push(arr[3] + 75)
        newHeight.push(newHeight[0] + 40)
        newHeight.push(newHeight[1] + 40)
        newHeight.push(newHeight[2] + 40)
        // console.log(newHeight)
        height = newHeight
        return newHeight
}

function drawPlayer() {
    //setupCanvas
    setCanvasUp()
    retinaDownscaling()
    //bg
    c.fillStyle = 'rgba(31, 31, 31, 1)'
    c.fillRect(0, 0, canvas.width, canvas.height);
    //player
    c.font = fontSetterAvenirnext(h1FontSize);
    c.fillStyle = 'rgba(206 218 227)'
    c.fillText(uPlayer, 55, 52);
    //played
    c.font = fontSetterAvenirnext(jTitleFontSize);
    c.fillText(uPlayed, 20, 98);
    //won
    c.font = fontSetterAvenirnext(pNumberFontSize);
    c.fillText(uWon, 20, 135);
    //win Percentage
    c.font = fontSetterAvenirnext(eMailFontSize);
    c.fillText(uWinRatio, 20, 170);
    
}
//end new stuff

//old working canvas stuff
///Global Values///
const DEFAULTBUSINESSCARDWIDTH = 336
const DEFAULTBUSINESSCARDHEIGHT = 192
const DEFAULTFONT = "Avenir next"
//font stuff
let currentFontType = "Avenir next"
let currentFontSize = "14 px"

//Control Zone
let h1FontSize = 34
let jTitleFontSize = 18
let pNumberFontSize = 18
let eMailFontSize = 18

function canvasToImageDownload() {
        // IE / EDGE Support - PNG ONLY!//
        if (window.navigator.msSaveBlob) {
            // window.navigator.msSaveBlob(myCanvas.msToBlob(), "canvas-image.png");
            window.navigator.msSaveBlob(canvas.msToBlob(), "beetleStandings.png");
        } else {
            const a = document.createElement("a");
    
            document.body.appendChild(a);
            // a.href = myCanvas.toDataURL("image/jpg", 1);
            // a.href = myCanvas.toDataURL();
            a.href = canvas.toDataURL();
            a.download = "beetleStandings.png"
            a.click()
            document.body.removeChild(a);
        }
        // screenShot2() -- too pixelated 
}

function clearCanvas() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    //add a method to track current template and redraw it
}

function fontSetterAvenirnext(size = 12) {
    currentFontSize = size
    currentFontType = DEFAULTFONT
    return `${currentFontSize}px ${currentFontType}`
}

async function onClick() {
    // await showCanvas()
    // setTimeout()
    await getAllPeople()  
}
async function hideCanvas() { document.querySelector('#canvas').style.display = 'none' }
async function showCanvas() { document.querySelector('#canvas').style.display = 'block' }