const elements = {
    desiredValue: document.querySelector("#anticipation-desired-value"),
    radioButtons: document.querySelectorAll("input[name='selected-fee']"),
    submitButton: document.querySelector("#submit-button")
}

let desiredValueInputFilled = false;
let desiredFee = false;

function freeButtonOnInputComplete() {
    if(desiredValueInputFilled && desiredFee) {
        elements.submitButton.removeAttribute("disabled");
    } else {
        elements.submitButton.setAttribute("disabled","true");
    }
}

elements.desiredValue.addEventListener("input", function(e) {
    if(String(e.target.value).length != 0) {
        desiredValueInputFilled = true;
    } else {
        desiredValueInputFilled = false;
    }

    freeButtonOnInputComplete();
});

elements.radioButtons.forEach(radioButton => {
    radioButton.addEventListener("click", function(e) {
        desiredFee = true;
        freeButtonOnInputComplete();
    })
})

