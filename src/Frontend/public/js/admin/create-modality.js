const elements = {
    inputs : document.querySelectorAll(".form-field input"),
    submit: document.querySelector("input[type='submit'][class='primary-button']")
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
                case "name":
                    isFilled.firstInput = true;
                break;
                case "tax":
                    isFilled.secondInput = true;
                break;
            }
        } else {
            switch(e.target.id) {
                case "name":
                    isFilled.firstInput = false;
                break;
                case "tax":
                    isFilled.secondInput = false;
                break;
            }
        }
    
        buttonStatusHandler();

    });
})

// Form prevent default.
$("form").submit(function(e) {
    e.preventDefault();
});

// Setting up the page minimum access level.
const pageMinimumAccessLevel = 10;

// Setting up the delay function.
function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}

// Setting up the notification and redirect function.
const invalidOrExpiredToken = async () => {

    document.querySelector("#loading").style.visibility = "hidden";

    toastr.error("Faça o login novamente. Redirecionando...","Token inválido ou sessão expirada");

    await delay(3);

    window.location.href = "http://127.0.0.1:5501/public/html/login.html";

}

// Checking if the user's session still valid.
$(document).ready(function() {

    if(!localStorage.getItem("token")) {
        invalidOrExpiredToken();
    } else {

        document.querySelector("#loading").style.visibility = "visible";

        var settings = {
            "url": "http://localhost:4000/api/v1/user/is-session-token-still-valid",
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Authorization": localStorage.getItem("token"),
            },
            "error": invalidOrExpiredToken,
          };
          
          $.ajax(settings).done(function (response) {
            if(response.success) {

                document.querySelector("#loading").style.visibility = "hidden";

                if(response.success.data.access_level < pageMinimumAccessLevel) {
                    invalidOrExpiredToken();
                }
                
            }
          })

    }

});

elements.submit.addEventListener("click",function(){

    document.querySelector("#loading").style.visibility = "visible";

    var settings = {
        "url": "http://localhost:4000/api/v1/modality/create",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token")
        },
        "data": {
            "name": document.querySelector('#name').value,
            "tax": (parseFloat(document.querySelector('#tax').value))/100.00,
        }, 
        "error": invalidOrExpiredToken, 
      };
      
      $.ajax(settings).done(function (response) {
        if(response.success){
            document.querySelector("#loading").style.visibility = "hidden";
            toastr.success("Modalidade incluída com sucesso!");
        } else  {
           toastr.error(response.error.detail, response.error.title);
           document.querySelector("#loading").style.visibility = "hidden"; 
        }
      });
});

