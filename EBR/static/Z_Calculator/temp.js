// Array to store jokes
let jokes = [
    "Need a break from numbers, huh? Hit the Laugh button again for some hilarious rainbow jokes!",
    "1. Why are there only seven colors in the rainbow? Because the rainbow had to appear before humans learned to count above seven. Lol!",
    "2. Why doesn't a rainbow go to school? Because uniforms are compulsory in school. Haha!",
    "3. Why isn't a rainbow made of gold? Because gold can't be a rainbow! Haha!",
    "4. What tone does a rainbow speak in? Of course, it speaks in colorful tones! Hehe!",
    "5. If a rainbow and a cloud had a fight, who would win? Of course, the rainbow, because the rainbow is always a shiner! Hohoho!!",
    "6. What would you say to a hungry rainbow? 'I don’t know, hehe! If you’re feeling hungry, forget the rainbow and open the freezer - num num num!",
    "7. What would you say if you saw a fake rainbow? Don't say anything, just run home, heeee!",
    "Pay $7 and get our VIP membership to unlock more jokes and rainbow themes. Do more than calculate!"
];

// Variable to track the current joke index
let currentJokeIndex = 0;

// Function to append a number to the display
function appendNumber(number) {
    document.getElementById("display").value += number;
}

// Function to append an operator to the display
function appendOperator(operator) {
    document.getElementById("display").value += " " + operator + " ";
}

// Function to clear the display
function clearDisplay() {
    document.getElementById("display").value = "";
}

// Function to calculate the result
function calculateResult() {
    let display = document.getElementById("display").value;
    try {
        let result = eval(display.replace(/ /g, ''));
        document.getElementById("display").value = result;
    } catch (error) {
        document.getElementById("display").value = "Error";
    }
}

// Function for addition
function addition() {
    let n1 = document.getElementById("num1").value;
    let n2 = document.getElementById("num2").value;
    let result = Number(n1) + Number(n2);
    document.getElementById("display").value = `${n1} + ${n2} = ${result}`;
}

// Function for subtraction
function subtraction() {
    let n1 = document.getElementById("num1").value;
    let n2 = document.getElementById("num2").value;
    let result = Number(n1) - Number(n2);
    document.getElementById("display").value = `${n1} - ${n2} = ${result}`;
}

// Function for multiplication
function multiplication() {
    let n1 = document.getElementById("num1").value;
    let n2 = document.getElementById("num2").value;
    let result = Number(n1) * Number(n2);
    document.getElementById("display").value = `${n1} * ${n2} = ${result}`;
}

// Function for division
function division() {
    let n1 = document.getElementById("num1").value;
    let n2 = document.getElementById("num2").value;
    let result = Number(n1) / Number(n2);
    document.getElementById("display").value = `${n1} / ${n2} = ${result}`;
}

// Function to display a joke
function tellJoke() {
    if (currentJokeIndex < jokes.length) { // Check if there are more jokes to display
        document.getElementById("display").style.fontSize = "0.9em"; // Set the font size for the joke
        document.getElementById("display").value = jokes[currentJokeIndex]; // Display the current joke
        currentJokeIndex++; // Increment the joke index for the next joke
    }
}
