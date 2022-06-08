const radioButtons = document.querySelectorAll("input[type='radio']");
const submitButton = document.querySelector("input[type='submit']");

function freeSubmitButton() {
    console.log(submitButton);
    submitButton.removeAttribute("disabled");
}

radioButtons.forEach(radio => {
    radio.addEventListener("click", function() {
        freeSubmitButton();
    })
})