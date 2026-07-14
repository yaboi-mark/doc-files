
var body = document.getElementById("body");
var original_text = body.innerHTML;
var current_text = ""
var in_tag = false;
var in_special = false;
let isPressed = false;
var speed = 0;

const global_speed = 0.06
const random_offset_speed = 0.03
const speed_lookup = {
    " ": 1.5,
    "-": 3,
    ",": 5,
    ":": 6,
    ".": 7,
    "!": 7,
    "?": 7,
    "\n": 0,
};

var has_started_sine = false;

window.addEventListener('mousedown', () => {
    isPressed = true;
    if (!has_started_sine) {
        sine();
        has_started_sine = true;
    }
});
window.addEventListener('mouseup', () => {
    isPressed = false;
});
	
async function sine() {
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	
	const oscillator = audioCtx.createOscillator();
    const gain_node = audioCtx.createGain();
	
	oscillator.type = 'sine';
    gain_node.gain.value = 0.1;
	
	oscillator.frequency.setValueAtTime(60, audioCtx.currentTime);
	
    oscillator.connect(gain_node);
    gain_node.connect(audioCtx.destination);

	oscillator.start();
}

var current_time = Date.now();
async function sleep(seconds) {
    let milliseconds = seconds * 1000;
    current_time += milliseconds;
    let latest_time = Date.now();
    let difference = current_time - latest_time;
    if (difference > 0)
	    return new Promise(resolve => setTimeout(resolve, Math.round(difference)));
    return;
}

main();

async function main() {

    for (i in original_text) {
        if (original_text[i] === ">") {
            in_tag = false
        }
        else if (original_text[i] === "<") {
            in_tag = true;
        }


        if (in_tag) {
            current_text += original_text[i];
        }
        else {
            current_text += "᠎"//"​";
        }
    }

    body.innerHTML = current_text
    current_text = ""

    console.log("asdf")

    for (i in original_text) {
        if (original_text[i] === "<") {
            in_tag = true;
        }

        if (!in_special && original_text[i] === "|") {
            in_special = true;
        }
        else if (in_special && original_text[i] === "|") {
            in_special = false;
            i++;
        }

        if (!in_special) {
            current_text = current_text + original_text[i];
        }

        if (!in_tag && !in_special) {
            let speed_temp = global_speed;
            speed_temp += (Math.random() * 2 - 1) * random_offset_speed;
            speed_temp *= speed_lookup[original_text[i]] ?? 1;
            if (!isPressed) {
                speed = 0;
            }
            else {
                speed_temp = speed_temp / (1 + speed);
                speed += 0.03;
            }
            body.innerHTML = current_text;
            await sleep(speed_temp);
        }
        else if (in_special) {
            if (original_text[i] === "w") {
                let speed_temp = 0
                if (!isPressed) {
                    speed_temp = global_speed
                    speed = 0;
                }
                else {
                    speed_temp = global_speed / (1 + speed);
                    speed += 0.01;
                }
                await sleep(speed_temp);
            }
        }

        if (original_text[i] === ">") {
            in_tag = false;
        }
    }
}