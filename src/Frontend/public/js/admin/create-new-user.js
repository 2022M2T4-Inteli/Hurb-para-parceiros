const elements = {
    input : document.querySelector("#email"),
    submit: document.querySelector("input[type='submit'][class='primary-button']")
}

let isAllInputsFilled = false;

function buttonStatusHandler(){
    if(isAllInputsFilled) {
        elements.submit.removeAttribute("disabled");
    } else {
        elements.submit.setAttribute("disabled","true");
    }
};

elements.input.addEventListener("input", function(e) {
    if(elements.input.value.length != 0) {
        isAllInputsFilled = true;
    } else {
        isAllInputsFilled = false;
    }

    buttonStatusHandler();
});

