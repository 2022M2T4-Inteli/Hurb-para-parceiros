// Getting all required elements from DOM.
const userEmailAdressElement = document.querySelector(".user-email-address");
const submitButton = document.querySelector(".primary-button");

// Instancing the render user email address function.
function renderUserEmailAddress() {

    // Replacing the html setted email address with the saved user email address in local storage.
    userEmailAdressElement.innerHTML = localStorage.getItem("email-address");
}


// Selecting all pin boxes.
const pinBoxes = document.querySelectorAll(".pin-box");

// For each pin box, adding a input event listener.
pinBoxes.forEach((pinBox) => {
    pinBox.addEventListener("input", function() {

        // If the pin box value length is equals to pin box max length, skipping to the next pin box.
        if(pinBox.value.length == pinBox.getAttribute("maxlength")) {
            
            // Getting the current pin box id.
            const currentId = pinBox.getAttribute("id");

            // Breaking the algorithm if the loop is on the last pin box. 
            if(currentId == pinBoxes[pinBoxes.length - 1].id) {
                return;
            }

            // Getting the next pin box node.
            const nextInput = document.getElementById(String(Number(currentId)+1));

            // Focusing on the next input pin box.
            nextInput.focus();
        }

        // Checking if the typed pin has the correct character quantity.
        if(pinBox.value.length > pinBox.getAttribute("maxlength")) {
            pinBox.value = pinBox.value.slice(0, -1);
        }

      });
})

// Form prevent default.
$("form").submit(function(e) {
    e.preventDefault();
});

function getAuthenticated() {

    document.querySelector("#loading").style.visibility = "visible";

    typedPin = "";
    document.querySelectorAll(".pin-box").forEach(pinBox => {
        typedPin += pinBox.value;
    })

    var settings = {
        "url": "http://localhost:4000/api/v1/user/signin",
        "method": "POST",
        "timeout": 0,
        "data": {
          "email": localStorage.getItem("email-address"),
          "pin": typedPin
        }
      };
      
      $.ajax(settings).done(function (response) {
        if(response.success) {
            localStorage.setItem("token", `Bearer ${response.success.data.token}`);
            localStorage.setItem("role", response.success.data.role);
            localStorage.setItem("id", response.success.data.id);

            if(response.success.data.role == 'administrador') {
                window.location.href = "http://127.0.0.1:5500/public/html/admin/dashboard.html";
            } else {
                window.location.href = "http://127.0.0.1:5500/public/html/dashboard.html";
            }
        } else {
            document.querySelector("#loading").style.visibility = "hidden";
            toastr.error(response.error.detail,response.error.title);
        }
      });

}

// Sending the request when user click.
submitButton.addEventListener("click", function() {
    getAuthenticated();
})

const dontReceiveBtn = document.querySelector(".dont-receive");

function sendPin() {

    document.querySelector("#loading").style.visibility = "visible";

    var settings = {
        "url": "http://localhost:4000/api/v1/user/requestpincode",
        "method": "POST",
        "timeout": 0,
        "data": {
          "email": localStorage.getItem("email-address"),
        }
      };
      
      $.ajax(settings).done(function (response) {

        if(response.success) {
            toastr.success(response.success.title);
            document.querySelector("#loading").style.visibility = "hidden";
        } else {
            document.querySelector("#loading").style.visibility = "hidden";
            toastr.error(response.error.detail,response.error.title);
        }
      });

}

dontReceiveBtn.addEventListener("click", function() {
    sendPin();
})

