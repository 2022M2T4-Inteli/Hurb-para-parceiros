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
                case "cod":
                    isFilled.firstInput = true;
                break;
                case "value":
                    isFilled.secondInput = true;
                break;
            }
        } else {
            switch(e.target.id) {
                case "cod":
                    isFilled.firstInput = false;
                break;
                case "value":
                    isFilled.secondInput = false;
                break;
            }
        }
    
        buttonStatusHandler();

    });
})

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

    window.location.href = "http://127.0.0.1:5500/public/html/login.html";

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

                if(response.success.data.access_level < 10) {
                    invalidOrExpiredToken();
                }
                
            }
          })

    }

});

// Form prevent default.
$("form").submit(function(e) {
    e.preventDefault();
});

elements.submit.addEventListener("click",function(){

    document.querySelector("#loading").style.visibility = "visible";

    var settings = {
        "url": "http://localhost:4000/api/v1/role/create",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoic2Vzc2lvbiIsInVzZXIiOnsiaWQiOjEsImVtYWlsIjoiY29udGF0b0BlbGlhc2Jpb25kby5jb20iLCJyb2xlIjoiYWRtaW5pc3RyYWRvciIsImFjY2Vzc19sZXZlbCI6MTB9LCJpYXQiOjE2NTQ3OTQyNzAsImV4cCI6MTY1NDg4MDY3MH0.3geyAI9-2k0317UhgO_PbDbvImxoe2893GiCXlTbq-c"
        },
        "data": {
            "name": document.querySelector('#cod').value,
            "access_level": document.querySelector('#value').value
        },
        "error": invalidOrExpiredToken,
      };
      
      $.ajax(settings).done(function (response) {
        if(response.success){
            document.querySelector("#loading").style.visibility = "hidden";
            toastr.success("Modalidade incluída com sucesso!");
        } else {
            toastr.error(response.error.detail, response.error.title);
            document.querySelector("#loading").style.visibility = "hidden"; 
        }
      });

});
