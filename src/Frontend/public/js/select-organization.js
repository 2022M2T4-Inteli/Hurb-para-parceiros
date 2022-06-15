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

function selectOrganization(e) {
    sessionStorage.setItem("organization-telephone", e.target.getAttribute("telefone"));
    sessionStorage.setItem("organization-name",e.target.value);
    sessionStorage.setItem("organization-id", e.target.id);
    window.location.href = "http://127.0.0.1:5501/public/html/dashboard.html";
}

$(document).ready(function() {

    document.querySelector("#loading").style.visibility = "visible";

    var settings = {
        "url": "http://localhost:4000/api/v1/organization/",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
    };
      
    $.ajax(settings).done(function (response) {

        document.querySelector("#loading").style.visibility = "hidden";
        
        if(response.success){

            response.success.data.forEach(organization => {
                const input = document.createElement("input");
                input.value = organization.nome;
                input.id = organization.id;
                input.type = "button";
                input.setAttribute("onclick","selectOrganization(event)");
                input.setAttribute("telefone", organization.telefone);
                document.querySelector(".organizations").appendChild(input);
            })

        } else  {
            toastr.error(response.error.detail, response.error.title); 
        }

    });
    
})