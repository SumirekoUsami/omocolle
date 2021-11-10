const spritePrefix = "../common/girls/" + girlName + "/tetris/";

function drawMatrix(matrix, table, offset = 0) {
    for(let i = offset; i < matrix.length; i++) {
        let row = table.querySelector("tr:nth-of-type(" + (i - offset + 1) + ")");
        for(let j = 0; j < matrix[0].length; j++) {
            let cell = row.querySelector("td:nth-of-type(" + (j + 1) + ")");
            cell.className = "";
            
            if(matrix[i][j] !== 0) {
                cell.classList.add("f" + matrix[i][j]);
                cell.classList.add("filled");
            }
        }
    }
}

function spriteUrl(border) {
    return spritePrefix + thresholds[border] + "." + spriteFormat;
}

let pervFullness = 0;
function updateGauge(fullness) {
    if(fullness < 15) {
        urinometer.style.visibility = "hidden";
    } else {
        urinometer.style.visibility = "visible";
        urinometer.style.height = "min(100%, " + fullness + "%)";
    }
    
    let sprite;
    Object.keys(thresholds).map(Number).forEach(border => {
        if(border <= fullness)
            sprite = "url(" + spriteUrl(border) + ")";
    });
    
    if(girl.style["background-image"] != sprite) {
        if(fullness - pervFullness > 20)
            playSound("gauge");
        
        girl.style["background-image"] = sprite;
    }
    
    pervFullness = fullness;
}

function onGameBoardUpdate(event) {
    drawMatrix(event.board, board__table, 3);
    updateGauge(this.getHeight());
}

function onNextTetraminoAvailable(event) {
    drawMatrix(event.tetramino[0], droplet__table, 1);
}

function onTetraminoLanded(event) {
    playSound("freeze");
}

function onRowRemovalComplete(event) {
    if(event.removed > 0) {
        playSound(event.removed >= 4 ? "super" : "rowrem");
    }
}

function onGameOver() {
    playSound("gameover");
    if(confirm("Вы проиграли, ми! Хотите ещё раз?"))
        window.location.reload();
}

function onPause() {
    playSound("pause");
}

function onCheatCodeEntered(board) {
    board = Array.matrix(13, 8);
    playSound("cheat");
}

window.__paused = false;
function onUserInput(event) {
    switch(event.which) {
        case 38:
        case 87:
            playSound("move");
            window.tetris.rotate();
            break;
        
        case 39:
        case 68:
            playSound("move");
            window.tetris.move(Tetris.TURN_RIGHT);
            break;
        
        case 37:
        case 65:
            playSound("move");
            window.tetris.move(Tetris.TURN_LEFT);
            break;
        
        case 40:
        case 83:
            window.tetris.drop();
            break;
        
        case 32:
            window.__paused = !window.__paused;
            if(!window.__paused)
                window.tetris.pause();
            else
                window.tetris.start();
            break;
    }
}

function initGame() {
    if(verge.viewportH() < 750 || verge.viewportW() < 750) {
        alert("This game can't be run on this screen. We recommend at least 1336x768px screen to use this software.");
        return;
    }
    
    loading.style.display = "none";
    game_ui.style.display = "flex";
    
    registerSound("super", "assets/sounds/ahaha.mp3");
    registerSound("cheat", "assets/sounds/ahaha.mp3");
    registerSound("freeze", "assets/sounds/dropped.wav");
    registerSound("gameover", "assets/sounds/game_over.wav");
    registerSound("fill", "assets/sounds/gauge_state_changed.wav");
    registerSound("move", "assets/sounds/move.wav");
    registerSound("rowrem", "assets/sounds/nipah.mp3");
    registerSound("pause", "assets/sounds/pause.mp3");
    registerSound("gauge", "assets/sounds/gauge_state_changed.wav");

    window.board  = Array.matrix(15, 8);
    window.tetris = new Tetris(board, {
        loopDuration: 600
    });

    window.tetris.on("tick", window.onGameBoardUpdate);
    window.tetris.on("pause", window.onPause);
    window.tetris.on("freeze", window.onTetraminoLanded);
    window.tetris.on("gameOver", window.onGameOver);
    window.tetris.on("nextTetraminoUpdated", window.onNextTetraminoAvailable);
    window.tetris.on("rowRemovalComplete", window.onRowRemovalComplete);

    document.body.addEventListener("keydown", window.onUserInput);

    window.tetris.start();
}

let filesToBeLoaded = [
    "../common/images/key.png",
    "assets/images/bladder_blue.png",
    "assets/images/drop_yellow.png",
    "assets/images/urine.webp",
    "assets/sounds/ahaha.mp3",
    "assets/sounds/dropped.wav",
    "assets/sounds/game_over.wav",
    "assets/sounds/gauge_state_changed.wav",
    "assets/sounds/move.wav",
    "assets/sounds/nipah.mp3",
    "assets/sounds/pause.mp3",
    "assets/sounds/gauge_state_changed.wav"
];

Object.keys(thresholds).forEach(x => filesToBeLoaded.push(spriteUrl(x)));

let preloadQueue = new createjs.LoadQueue();
preloadQueue.installPlugin(createjs.Sound);
preloadQueue.loadManifest(filesToBeLoaded);
preloadQueue.on("complete", initGame);
preloadQueue.load();
