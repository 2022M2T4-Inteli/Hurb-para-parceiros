// Getting the user email address element from dom.
const userEmailAddress = document.querySelector("#email-address");
const submitButton = document.querySelector(".primary-button");

userEmailAddress.addEventListener("input", function() {
    if(userEmailAddress.value.length != 0) {
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.setAttribute("disabled","true");
    }
})

// Instancing the recordUserEmailAdress function.
function recordUserEmailAddress() {
    // Saving the user email address in local storage.
    localStorage.setItem("email-address",userEmailAddress.value);
}

// Form prevent default.
$("form").submit(function(e) {
    e.preventDefault();
});

// Sending the request when user click.
submitButton.addEventListener("click", function() {

    document.querySelector("#loading").style.visibility = "visible";

    var settings = {
        "url": "http://localhost:4000/api/v1/user/requestpincode",
        "method": "POST",
        "timeout": 0,
        "data": {
          "email": userEmailAddress.value,
        }
      };
      
      $.ajax(settings).done(function (response) {

        if(response.success) {
            window.location.href = "http://127.0.0.1:5501/public/html/pin.html";
        } else {
            document.querySelector("#loading").style.visibility = "hidden";
            toastr.error(response.error.detail,response.error.title);
        }

      });

})