const elements = {
    inputFilled : document.getElementById("bank-slip"),
    submitButton: document.getElementById("confirm-button")
}

let inputFilled = false;

function buttonOnInputCompleted(){
    if(inputFilled) {
        elements.submitButton.removeAttribute("disabled");
    } else {
        elements.submitButton.setAttribute("disabled","true");
    }
};

elements.inputFilled.addEventListener("input", function(e) {
    if(String(e.target.value).length != 0) {
        inputFilled = true;
    } else {
        inputFilled = false;
    }

    buttonOnInputCompleted();
});

