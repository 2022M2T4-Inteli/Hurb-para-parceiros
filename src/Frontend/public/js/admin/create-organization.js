const elements = {
    inputs : document.querySelectorAll(".form-field input"),
    submit: document.querySelector("input[type='submit'][class='primary-button']")
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
                case "name":
                    isFilled.firstInput = true;
                break;
                case "tel":
                    isFilled.secondInput = true;
                break;
                case "cnpj":
                    isFilled.thirdInput = true;
                break;
                case "rooms-qtd":
                    isFilled.fourthInput = true;
                break;
            }
        } else {
            switch(e.target.id) {
                case "name":
                    isFilled.firstInput = false;
                break;
                case "tel":
                    isFilled.secondInput = false;
                break;
                case "cnpj":
                    isFilled.thirdInput = false;
                break;
                case "rooms-qtd":
                    isFilled.fourthInput = false;
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

                if(response.success.data.access_level < pageMinimumAccessLevel) {
                    invalidOrExpiredToken();
                }
                
            }
          })

    }

});

let partners = [];

$(document).ready(function() {
    var settings = {
        "url": "http://localhost:4000/api/v1/partner/",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
      };
      
      $.ajax(settings).done(function (response) {
        response.success.data.forEach(partner => {

            partners.push(partner);

            let option = document.createElement("option");
            option.textContent = `${partner.nome_completo} - ${partner.cpf}`;
            option.value = `${partner.nome_completo} - ${partner.cpf}`;
            option.id = partner.id;

            document.querySelector("#responsible-partner").appendChild(option);

        })
      });
})