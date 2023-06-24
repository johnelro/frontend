const questionDiv = document.getElementById('question_div');
const submitButton = document.querySelector("input[type='submit']");
const resultDiv = document.getElementById('result_div');
const closeButton = document.getElementById('close');
const ocrHide = document.getElementById('ocr');

resultDiv.style.display = "none";

submitButton.addEventListener("click", () =>{
    questionDiv.style.display = "none";
    resultDiv.style.display = "block";
    ocrHide.style.display = "none";
});

closeButton.addEventListener("click", () =>{
    window.location.reload();
});