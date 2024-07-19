const fs = require('fs');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM(``, { runScripts: "outside-only" });
const { document } = window;

// Define the files to check
const htmlFile = 'index.html';
const cssFile = 'styles.css';
const jsFile = 'quiz.js';

// Initialize score
let score = 0;

// Check if all requisite files exist and are not empty
const files = [htmlFile, cssFile, jsFile];
files.forEach(file => {
    if (fs.existsSync(file) && fs.statSync(file).size > 0) {
        score += 1;
    } else {
        console.error(`${file} is missing or empty`);
    }
});

// Check for checkAnswer function in quiz.js
const jsContent = fs.readFileSync(jsFile, 'utf-8');
if (/function\s+checkAnswer\s*\(/.test(jsContent)) {
    score += 1;
} else {
    console.error("checkAnswer function is missing");
}

// Load the HTML content
const htmlContent = fs.readFileSync(htmlFile, 'utf-8');
const dom = new JSDOM(htmlContent);
const submitButton = dom.window.document.getElementById('submit-answer');

// Check for retrieval of the correct answer
if (/const\s+correctAnswer\s*=\s*"4";/.test(jsContent)) {
    score += 1;
} else {
    console.error("Correct answer retrieval is missing or incorrect");
}

// Check for retrieval of the user’s selected answer
if (/document\.querySelector\('input\[name="quiz"\]:checked'\)/.test(jsContent)) {
    score += 1;
} else {
    console.error("User's selected answer retrieval is missing or incorrect");
}

// Check for comparison of the user’s answer with the correct answer
if (/if\s*\(\s*userAnswer\s*===\s*correctAnswer\s*\)/.test(jsContent)) {
    score += 1;
} else {
    console.error("Comparison of user's answer with the correct answer is missing or incorrect");
}

// Check for providing feedback based on the comparison (correct answer)
if (/feedback\.textContent\s*=\s*"Correct! Well done."/.test(jsContent)) {
    score += 1;
} else {
    console.error("Feedback for correct answer is missing or incorrect");
}

// Check for providing feedback based on the comparison (incorrect answer)
if (/feedback\.textContent\s*=\s*"That's incorrect. Try again!"\s*;/.test(jsContent)) {
    score += 1;
} else {
    console.error("Feedback for incorrect answer is missing or incorrect");
}

// Check for adding an event listener to the “Submit Answer” button
if (/document\.getElementById\('submit-answer'\)\.addEventListener\('click',\s*checkAnswer\)/.test(jsContent)) {
    score += 1;
} else {
    console.error("Event listener for submit button is missing or incorrect");
}

// Check for the retrieval of the “submit-answer” button
if (submitButton) {
    score += 1;
} else {
    console.error("Submit button retrieval is missing or incorrect");
}

// Output the final score
console.log(`Final Score: ${score}/10`);
