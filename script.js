let warningCount = 0;
let testFinished = false;

// Prevent users from leaving the tab
document.addEventListener("visibilitychange", function() {
    if (document.hidden && !testFinished) {
        warningCount++;
        alert("Warning! Do not leave the test. You have " + (3 - warningCount) + " warnings left.");
        if (warningCount >= 3) {
            alert("Test closed due to multiple violations.");
            submitTest();
        }
    }
});

// Load questions from AWS Lambda
async function loadQuestions() {
    const response = await fetch('https://your-aws-lambda-url/questions');
    const questions = await response.json();
    const container = document.getElementById("question-container");

    questions.forEach((q, index) => {
        let questionDiv = document.createElement("div");
        questionDiv.innerHTML = `<p>${index + 1}. ${q}</p><textarea rows="3"></textarea>`;
        container.appendChild(questionDiv);
    });
}

// Submit test data to AWS
async function submitTest() {
    testFinished = true;
    const answers = document.querySelectorAll("textarea");
    let responses = [];

    answers.forEach((ans, index) => {
        responses.push({ question: index + 1, answer: ans.value });
    });

    await fetch('https://your-aws-lambda-url/submit', {
        method: "POST",
        body: JSON.stringify({ user: "student_123", responses, warnings: warningCount }),
        headers: { "Content-Type": "application/json" }
    });

    alert("Test submitted successfully!");
}
window.onload = loadQuestions;
