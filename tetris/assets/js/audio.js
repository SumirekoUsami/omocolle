function __playSoundReal(sound) {
    return createjs.Sound.play(sound);
}

let playSound = () => {};
let resetPlaySound = () => playSound = __playSoundReal;
document.body.addEventListener("keydown", resetPlaySound);

function registerSound(name, location) {
    createjs.Sound.registerSound(location, name);
}
