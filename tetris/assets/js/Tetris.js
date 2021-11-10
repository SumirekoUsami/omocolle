class Tetris {
    constructor(board, options = {}) {
        if(!board.isZeroMatrix())
            throw new Error("Board should be a valid 0-matrix");
        else if(board.length < 8)
            throw new Error("Board should be at least 8 rows tall");
        else if(board[0].length < 8)
            throw new Error("Board should be at least 8 columns long");
        else if(board[0].length % 2 != 0)
            throw new Error("Board width must be even");
        
        this.board = board;
        this.opts  = options;
        
        this.tetraminoe   = this.opts.tetraminoe || Tetraminoe;
        this.loopDuration = this.opts.loopDuration || 1000;
        this.raiseSpeed   = typeof this.opts.raiseSpeed == "undefined" ? false : this.opts.raiseSpeed;
        
        // Game state
        this.nextTetramino    = null;
        this.nextTetramino    = this._getNextTetramino();
        this.fallingTetramino = null;
        this.fallingX         = ((this.board[0].length - 8) / 2) + 2;
        this.fallingY         = -1;
        this.fallingRotation  = 0;
        
        this.score    = 0;
        this.speed    = 1;
        this.interval = 0;
        this.stopped  = false;
        
        // Event listeners
        this.listeners = {
            tick: [],
            fall: [],
            freeze: [],
            rowRemovalComplete: [],
            nextTetraminoUpdated: [],
            start: [],
            stop: [],
            pause: [],
            gameOver: [],
        };
    }
    
    _emitEvent(type, data = {}) {
        data.target = this;
        
        this.listeners[type].forEach(x => Reflect.apply(x, this, [data]));
    }
    
    _emitTick() {
        this._emitEvent("tick", { board: this.getBoard(), score: this.getScore() });
    }
    
    _getNextLoopDelay() {
        return (1 / this.speed) * this.loopDuration;
    }
    
    _scheduleLoop() {
        this.interval = setTimeout(() => Reflect.apply(this._gameLoop, this, []), this._getNextLoopDelay());
    }
    
    _getNextTetramino() {
        let names     = Object.keys(this.tetraminoe);
        let randIndex = randomInt(0, names.length - 1);
        let tetramino = this.tetraminoe[names[randIndex]].threeDMatrixInPlaceColour(randIndex + 1);
        if(this.nextTetramino === null)
            return tetramino;
        
        let nTetramino     = this.nextTetramino;
        this.nextTetramino = tetramino;
        this._emitEvent("nextTetraminoUpdated", { tetramino: tetramino });
        
        return nTetramino;
    }
    
    _getGhostBoard() {
        let ghostBoard = new Array(this.board.length);
        for(let i = 0; i < this.board.length; i++)
            ghostBoard[i] = "0".repeat(this.board[0].length).split("").map(Number);
        
        try {
            return ghostBoard.matrixInsert(this.fallingTetramino[this.fallingRotation], this.fallingX, this.fallingY);
        } catch(e) {
            return false;
        }
    }
    
    _internalStateValid() {
        let gBoard = this._getGhostBoard();
        if(gBoard === false)
            return gBoard;
        
        return !this._getGhostBoard().matrixIntersects(this.board);
    }
    
    _startFalling() {
        if(this._isFalling())
            return false;
        
        this.fallingTetramino = this._getNextTetramino();
        if(!this._internalStateValid()) {
            this.fallingTetramino = null;
            this._emitEvent("gameOver", { board: this.getBoard(), score: this.getScore() });
            this.stop();
            return false;
        }
        
        return true;
    }
    
    _finishFalling() {
        if(!this._isFalling())
            return;
        
        this.board = this.board.matrixMerge(this._getGhostBoard());
        
        this.fallingTetramino = null;
        this.fallingX         = ((this.board[0].length - 8) / 2) + 2;
        this.fallingY         = -1;
        this.fallingRotation  = 0;
        this.ticksSinceFallen = 0;
        
        this._emitEvent("freeze");
    }
    
    _doFall() {
        this.fallingY += 1;
        if(!this._internalStateValid()) {
            this.fallingY -= 1;
            this._finishFalling();
            return false;
        }
        
        this._emitEvent("fall");
        
        return true;
    }
    
    _isFalling() {
        return this.fallingTetramino !== null;
    }
    
    _doRemoveFullRows() {
        let count = 0;
        for(let i = 0; i < this.board.length; i++) {
            let isComplete = true;
            for(let j = 0; j < this.board[0].length; j++) {
                if(this.board[i][j] == 0) {
                    isComplete = false;
                    break;
                }
            }
            
            if(isComplete) {
                this.board.matrixRemoveRow(i);
                count++;
            }
        }
        
        return count;
    }
    
    _gameLoop() {
        if(!this._isFalling()) {
            if(this.ticksSinceFallen === 0) {
                let removed;
                this.score += 10 * (removed = this._doRemoveFullRows());
                this.ticksSinceFallen++;
                this._emitEvent("rowRemovalComplete", { score: this.score, removed: removed });
                this._gameLoop(); // don't reschedule since non-falling loops shouldn't consume time
            } else {
                this.ticksSinceFallen = 0;
                if(this._startFalling()) // don't reenter loop if game's over
                    this._gameLoop();
            }
        } else {
            this._doFall();
            this._scheduleLoop();
        }
        
        this._emitTick();
    }
    
    getNextTetramino() {
        return this.nextTetramino[0];
    }
    
    getScore() {
        return this.score;
    }
    
    getHeight() {
        let offset = null;
        let realBoardHeight = this.board.length - 2;
        for(let i = 0; i < this.board.length; i++) {
            if(offset !== null)
                break;
            
            for(let j = 0; j < this.board[0].length; j++) {
                if(this.board[i][j] !== 0) {
                    offset = i;
                    break;
                }
            }
        }
        
        let height = offset === null ? 0 : this.board.length - offset;
        return Math.ceil((height / realBoardHeight) * 100);
    }
    
    getBoard() {
        if(this._isFalling())
            return this.board.matrixMerge(this._getGhostBoard());
        else
            return this.board;
    }
    
    rotate() {
        if(this.fallingTetramino === null)
            return false;
        
        let oldRotation = this.fallingRotation;
        this.fallingRotation = oldRotation + 1;
        if(this.fallingRotation > 3)
            this.fallingRotation = 0;
        
        if(!this._internalStateValid()) {
            this.fallingRotation = oldRotation;
            return false;
        }
        
        this._emitTick();
        return true;
    }
    
    move(direction) {
        if(this.fallingTetramino === null)
            return false;
        
        let oldX = this.fallingX;
        this.fallingX += direction == 0 ? -1 : 1;
        if(!this._internalStateValid()) {
            this.fallingX = oldX;
            return false;
        }
        
        this._emitTick();
        return true;
    }
    
    drop() {
        if(this.fallingTetramino === null)
            return false;
        
        while(true)
            if(!this._doFall())
                break;
        
        this._emitTick();
        return true;
    }
    
    start() {
        if(this.stopped)
            return false;
        
        this._scheduleLoop();
        this._emitEvent("start");
    }
    
    pause() {
        clearInterval(this.interval);
        this._emitEvent("pause");
    }
    
    stop() {
        clearInterval(this.interval);
        this._emitEvent("stop");
        
        this.stopped = true;
    }
    
    // implements EventTarget
    addEventListener(type, callback) {
        this.listeners[type].push(callback);
    }
    
    on(type, callback) {
        this.addEventListener(type, callback);
    }
}

Tetris.TURN_LEFT  = 0;
Tetris.TURN_RIGHT = 1;
