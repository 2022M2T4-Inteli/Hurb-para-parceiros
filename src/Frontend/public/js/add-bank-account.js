// Setting up the page minimum access level.
const pageMinimumAccessLevel = 5;

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

document.querySelector(".primary-button").addEventListener("click", function() {

    document.querySelector("#loading").style.visibility = "visible";
    
    var settings = {
        "url": "http://localhost:4000/api/v1/bank-account/create",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
        "data": { 
            organization_id: sessionStorage.getItem("organization-id"), 
            beneficiary: document.querySelector("#beneficiary").value,
            cpf_or_cnpj: document.querySelector("#cpf-or-cnpj").value,
            bank: document.querySelector("#bank").value,
            agency: document.querySelector("#agency").value,
            number: document.querySelector("#account").value,
            digit: document.querySelector("#digit").value
        }
    };
      
    $.ajax(settings).done(function (response) {
        if(response.success) {
            window.location.href = "http://127.0.0.1:5500/public/html/paymentMethods/select-receiving-method.html";
        } else {
            toastr.error(response.error.detail, response.error.title);
        }

        document.querySelector("#loading").style.visibility = "hidden";
    });

})