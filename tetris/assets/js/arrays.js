function randomInt(min, max) {
    let range = max - min + 1;
    
    let buf = new Uint8Array(1);
    window.crypto.getRandomValues(buf);
    
    let int = buf[0];
    if(int > range)
        int -= range * Math.floor(buf[0] / range);
    
    return Math.min(max, min + int);
}

Array.prototype.isMatrix = function() {
    if(this.length < 1)
        return false;
    
    let n = undefined;
    for(let i = 0; i < this.length; i++) {
        if(!Array.isArray(this[i]))
            return false;
        
        if(this[i].length !== n) {
            if(typeof n === "undefined")
                n = this[i].length;
            else
                return false;
        }
    }
    
    return true;
}

Array.prototype.isZeroMatrix = function() {
    if(!this.isMatrix())
        return false;
    
    for(let i = 0; i < this.length; i++)
        for(let j = 0; j < this[0].length; j++)
            if(this[i][j] !== 0)
                return false;
    
    return true;
}

Array.prototype.matrixInPlaceMap = function(callback) {
    if(!this.isMatrix())
        return false;
    
    for(let i = 0; i < this.length; i++)
        for(let j = 0; j < this[0].length; j++)
            this[i][j] = callback(this[i][j], i, j, this);
    
    return this;
}

Array.prototype.matrixInPlaceReplace = function(needle, replacement) {
    return this.matrixInPlaceMap(x => x == needle ? replacement : x);
}

Array.prototype.matrixInPlaceColour = function(colour) {
    return this.matrixInPlaceMap(x => x != 0 ? colour : 0);
}

Array.prototype.threeDMatrixInPlaceColour = function(colour) {
    this.forEach(x => x.matrixInPlaceColour(colour));
    
    return this;
}

Array.prototype.matrixRemoveRow = function(i) {
    for(let j = i; j >= 1; j--)
        this[j] = this[j - 1];
    
    this[0] = Array.matrix(1, this[0].length)[0];
}

Array.prototype.matrixIntersects = function(matrixTwo) {
    if(!this.isMatrix() || !matrixTwo.isMatrix())
        throw new Error("Can't use matrixIntersects on non-matrix array");
    
    let matrixOne = this;
    for(let i = 0; i < matrixOne.length; i++)
        for(let j = 0; j < matrixOne[i].length; j++)
            if(matrixOne[i][j] !== 0 && matrixTwo[i][j] !== 0)
                return true;
    
    return false;
}

Array.prototype.matrixGetNZOffsets = function() {
    if(!this.isMatrix())
        throw new Error("Can't use matrixGetNZOffsets on non-matrix array");
    else if(this.isZeroMatrix())
        return { top: Infinity, bottom: Infinity, left: Infinity, right: Infinity };
    
    let res = Object.create(null);
    for(let i = 0; i < this.length; i++) {
        if(typeof res.top !== "undefined")
            break;
        
        for(let j = 0; j < this[0].length; j++) {
            if(this[i][j] !== 0) {
                res.top = i;
                break;
            }
        }
    }
    
    for(let i = this.length - 1; i >= 0; i--) {
        if(typeof res.bottom !== "undefined")
            break;
        
        for(let j = 0; j < this[0].length; j++) {
            if(this[i][j] !== 0) {
                res.bottom = this.length - i - 1;
                break;
            }
        }
    }
    
    for(let j = 0; j < this[0].length; j++) {
        if(typeof res.left !== "undefined")
            break;
        
        for(let i = 0; i < this.length; i++) {
            if(this[i][j] !== 0) {
                res.left = j;
                break;
            }
        }
    }
    
    for(let j = this[0].length - 1; j >= 0; j--) {
        if(typeof res.right !== "undefined")
            break;
        
        for(let i = 0; i < this.length; i++) {
            if(this[i][j] !== 0) {
                res.right = this[0].length - j - 1;
                break;
            }
        }
    }
            
    
    return res;
}

Array.prototype.matrixInsert = function(matrixTwo, x, y, transparent = true, debug = false) {
    if(!this.isMatrix() || !matrixTwo.isMatrix())
        throw new Error("Can't use matrixInsert on non-matrix array");
    
    let matrixOne = this;
    let newMatrix = new Array(matrixOne.length);
    
    let offsets = matrixTwo.matrixGetNZOffsets();
    if(y < (offsets.top * -1) || matrixTwo.length - offsets.bottom + y > matrixOne.length)
        throw new Error("Can't fit matrix №2 in matrix №1: Y offset out of range.");
    else if(x < (offsets.left * -1) || matrixTwo[0].length - offsets.right + x > matrixOne[0].length)
        throw new Error("Can't fit matrix №2 in matrix №1: X offset out of range.");
    
    // For each row in matrix
    for(let i = 0; i < matrixOne.length; i++) {
        newMatrix[i] = [...matrixOne[i]]; // Copy it into new matrix
        if(i < y || (i - y) >= matrixTwo.length) // And exit if insertion will not happen here
            continue;
        
        // Alternatively, if insertion will happen on this Y offset
        // For each element of matrix on this Y
        for(let j = 0; j < matrixOne[0].length; j++) {
            // Copy original matrix element, unless...
            if(j < x || (j - x) >= matrixTwo[0].length) {
                newMatrix[i][j] = matrixOne[i][j];
            
            // ...unless the insertion will happen here.
            } else {
                // Try cell from second matrix
                let cell = matrixTwo[i - y][j - x];
                if(transparent)
                    newMatrix[i][j] = cell === 0 ? matrixOne[i][j] : cell;
                else
                    newMatrix[i][j] = cell;
            }
        }
    }
    
    return newMatrix;
}

Array.prototype.matrixMerge = function(matrixTwo) {
    try {
        return this.matrixInsert(matrixTwo, 0, 0);
    } catch(e) {
        console.error(e);
        throw new Error("Can't merge incompatible matrices, check .matrixInsert");
    }
}

Array.matrix = function(m, n) {
    let matrix = new Array(m);
    for(let i = 0; i < m; i++)
        matrix[i] = "0".repeat(n).split("").map(Number);
    
    return matrix;
}
