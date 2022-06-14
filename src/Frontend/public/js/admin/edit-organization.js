const elements = {
    inputs : document.querySelectorAll(".form-field input"),
    submit: document.querySelector(".primary-button")
}


let isFilled = {
    firstInput: false,
    secondInput: false,
    thirdInput: false,
    fourthInput: false,
}

function buttonStatusHandler(){

    if(isFilled.firstInput && isFilled.secondInput && isFilled.thirdInput && isFilled.fourthInput) {
        elements.submit.removeAttribute("disabled");
    } else {
        elements.submit.setAttribute("disabled","true");
    }

};

elements.inputs.forEach(input => {

    input.addEventListener("input", function(e) {

        if(input.value.length != 0) {
            switch(e.target.id) {
                case "organization-name":
                    isFilled.firstInput = true;
                break;
                case "organization-telephone":
                    isFilled.secondInput = true;
                break;
                case "cnpj":
                    isFilled.thirdInput = true;
                break;
                case "rooms":
                    isFilled.fourthInput = true;
                break;
            }
        } else {
            switch(e.target.id) {
                case "organization-name":
                    isFilled.firstInput = false;
                break;
                case "organization-telephone":
                    isFilled.secondInput = false;
                break;
                case "cnpj":
                    isFilled.thirdInput = false;
                break;
                case "rooms":
                    isFilled.fourthInput = false;
                break;
            }
        }
    
        buttonStatusHandler();

    });
})
