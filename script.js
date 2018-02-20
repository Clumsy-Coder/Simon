const sounds = {
    green: "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
    red: "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
    yellow: "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
    blue: "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
};
const colors = ["green", "red", "yellow", "blue"];
let level = 0;                  // simon level. goes up to 20
let strict = undefined;         // restart the game if player makes a mistake
let genSeq = [];                // randomly generated colors sequence
let pSeq = [];                  // user colors sequence. What the user has pressed
let songInterval = undefined;   // setInterval for playing color sounds

// start the game
const newGame = () => {
    stopAudio();
    genSeq = [];
    level = 0;
    nextLevel();
}

// get the next color sequence and play the whole sequence
const nextLevel = () => {
    $("#levelDisplay").text(("0" + ++level).slice(-2));
    getNextSeq();
    playSeq();
}

// play the audio file based on the color provided
const playAudio = colors => {
    $("#" + colors + "Btn").addClass("pulse");
    let audioPlayer = new Audio(sounds[colors]);
    audioPlayer.play();
    setTimeout(() => { $("#" + colors + "Btn").removeClass("pulse"); }, 500);
};

// stops the audio being played
const stopAudio = () => {
    clearInterval(songInterval);
}

// play the generated color sequence
const playSeq = () => {
    $("#greenBtn, #redBtn, #yellowBtn, #blueBtn").addClass("disabled");
    let i = 0;
    songInterval = setInterval(function() {
        playAudio(genSeq[i]);
        if(i++ == genSeq.length) {
            pSeq = [];
            $("#greenBtn, #redBtn, #yellowBtn, #blueBtn").removeClass("disabled");
            clearInterval(songInterval);
        }
    }, 1000);
}

// randomly choose which color to add in the generated sequence
const getNextSeq = () => {
    let random = Math.floor(Math.random() * (4 - 0));
    genSeq.push(colors[random]);
};

// blink the content in levelDisplay div
// returns a promise
const flashMsg = (str, times) => { 
    let prev = $("#levelDisplay").text();
    $("#levelDisplay").addClass("blink");
    $("#levelDisplay").text(str);
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            $("#levelDisplay").removeClass("blink")
            $("#levelDisplay").text(prev);
            resolve();
        }, 1000 * times);
    });
};

// called when player presses a color button
// checks if the player buttons presses match the generated sequence
const playerColorPress = (color) => {
    pSeq.push(color);
    playAudio(color);
    
    if(pSeq[pSeq.length - 1] != genSeq[pSeq.length - 1]) {
        pSeq = [];
        flashMsg("(ಠ_ಠ)", 3)
            .then(() => {
                setTimeout(() => { strict ? newGame() : playSeq(); }, 500);
            });
    }
    else {
        if(pSeq.length == genSeq.length) {
            if(level == 20) {
                flashMsg("^-^", 3).then(() => { setTimeout(newGame, 500); });
            }
            else {
                setTimeout(nextLevel, 1000);
            }
        }        
    }
}

$(document).ready(() => {
    $("#strictMode").change(function() {        
        strict = $(this).is(":checked") ? true : false;
    });
});
