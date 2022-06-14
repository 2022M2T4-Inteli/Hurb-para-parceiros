const radioButtons = document.querySelectorAll("input[type='radio']");

let openedInput;

let isInputFilled = false;

let activeButton;

function buttonHandler(n) {
    if(n == 0) {
        document.querySelector(".primary-button").setAttribute("disabled","true");
    } else {
        document.querySelector(".primary-button").removeAttribute("disabled");
    }
}

radioButtons.forEach(radio => {
    radio.addEventListener("click", function(e) {

        openedInput ?  openedInput.style.display = "none" : false;

        e.target.parentElement.parentElement.children[1].style.display = "flex";

        openedInput = e.target.parentElement.parentElement.children[1];

        activeButton = openedInput;

        if(openedInput.children[0].value.length >= 1) {
            buttonHandler(1);
        } else {
            buttonHandler(0);
        }

        openedInput.children[0].addEventListener("input", function (event) {
            if(event.target.value.length >= 1) {
                isInputFilled = true;
                buttonHandler(1);
            } else {
                isInputFilled = false;
                buttonHandler(0);
            }
        })
        
    })
})

document.querySelector(".primary-button").addEventListener("click", function() {

    // Getting the slip bank code from input.
    const pixKey = activeButton.children[0].value;
    
    // Getting the payment info from local storage.
    const paymentInfo = JSON.parse(localStorage.getItem("order-receive-method"));

    // Setting up the slip bank code to the payment info.
    paymentInfo.pix_key = pixKey;
    paymentInfo.pix_key_type = activeButton.children[0].id;


    // Setting up the updated payment info.
    localStorage.setItem("order-receive-method", JSON.stringify(paymentInfo));

    window.location.href = "http://127.0.0.1:5501/public/html/confirm.html";
    
})