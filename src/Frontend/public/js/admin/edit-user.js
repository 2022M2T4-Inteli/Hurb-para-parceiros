const elements = {
    inputs : document.querySelectorAll(".form-field input"),
    submit: document.querySelector(".primary-button")
}


let isFilled = {
    firstInput: false,
}

function buttonStatusHandler(){

    if(isFilled.firstInput) {
        elements.submit.removeAttribute("disabled");
    } else {
        elements.submit.setAttribute("disabled","true");
    }

};

elements.inputs.forEach(input => {

    input.addEventListener("input", function(e) {

        if(input.value.length != 0) {
            switch(e.target.id) {
                case "email":
                    isFilled.firstInput = true;
                break;
            }
        } else {
            switch(e.target.id) {
                case "email":
                    isFilled.firstInput = false;
                break;
            }
        }
    
        buttonStatusHandler();

    });
})
