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


document.querySelector(".primary-button").addEventListener("click", function() {
    
    // Getting the slip bank code from input.
    const slip_bank_code = document.querySelector("#bank-slip").value;

    // Getting the payment info from local storage.
    const paymentInfo = JSON.parse(localStorage.getItem("order-receive-method"));

    // Setting up the slip bank code to the payment info.
    paymentInfo.slip_bank_code = slip_bank_code

    // Setting up the updated payment info.
    localStorage.setItem("order-receive-method", JSON.stringify(paymentInfo));

    window.location.href = "http://127.0.0.1:5501/public/html/confirm.html";
})