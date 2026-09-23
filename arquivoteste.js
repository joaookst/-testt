let a = false;

let random = Math.random(0, 1);

function randomize() {
    if (random == 1) {
        a = true;
    } else if (random == 0) {
        a = false;
    }
}

randomize();

function abc() {
    if (a == (true)) {
        return "a is true";
    };
    if (a == (false)) {
        return "a is false";
    };
}

console.log(abc());