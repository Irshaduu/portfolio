
function appendNumber(number) {
    document.getElementById("display").value += number;
}

function appendOperator(operator) {
    document.getElementById("display").value += " " + operator + " ";
}

function clearDisplay() {
    document.getElementById("display").value = "";
    currentJokeIndex = 0; 
}

function calculateResult() {
    let display = document.getElementById("display").value;
    try {
        let result = eval(display);
        document.getElementById("display").value = result;
    } catch (error) {
        document.getElementById("display").value = "Error";
    }
}

function tellJoke() {
    if (currentJokeIndex < jokes.length) {
        document.getElementById("display").style.fontSize = "0.9em";
        document.getElementById("display").value = jokes[currentJokeIndex];
        currentJokeIndex++;
    }
}

let jokes = [
    "Need a break from numbers, huh? Hit the Laugh button again for some hilarious rainbow jokes!",
    "1. Why are there only seven colors in the rainbow? because the rainbow had to appear before human learned to count above seven. Lol!",
    "2. Why doesn't a rainbow go to school? because uniforms are compulsory in school. Haha!",
    "3. Why isn't a rainbow made of gold? because gold can't be a rainbow! Haha!",
    "4. What tone does a rainbow speak in? Of course, it speaks in colorful tones! Hehe!",
    "5. If a rainbow and a cloud had a fight, who would win? Of course, the rainbow, because rainbow always a shiner! Hohoho!!",
    "6. What would you say to a hungry rainbow? Ohh..! A rainbow is always full, Eaaaaamm! If you’re feeling hungry, borrow an eye from the rainbow, open the freezer—num num num! and Eaaaaamm!!",
    "7. What would you say if you saw a fake rainbow? Don't say anything, just run home, hoooo!",
    "Pay $7 and get our VIP membership. unlock more jokes and rainbow themes. Do more than calculate!",
];
let currentJokeIndex = 0;