const elements = {
    inputs : document.querySelectorAll(".form-field input"),
    submit: document.querySelector(".primary-button")
}


let isFilled = {
    firstInput: false,
    secondInput: false,
}

function buttonStatusHandler(){

    if(isFilled.firstInput && isFilled.secondInput) {
        elements.submit.removeAttribute("disabled");
    } else {
        elements.submit.setAttribute("disabled","true");
    }

};

elements.inputs.forEach(input => {

    input.addEventListener("input", function(e) {

        if(input.value.length != 0) {
            switch(e.target.id) {
                case "role-name":
                    isFilled.firstInput = true;
                break;
                case "access":
                    isFilled.secondInput = true;
                break;
    
            }
        } else {
            switch(e.target.id) {
                case "role-name":
                    isFilled.firstInput = false;
                break;
                case "access":
                    isFilled.secondInput = false;
                break;
                
            }
        }
    
        buttonStatusHandler();

    });
})
