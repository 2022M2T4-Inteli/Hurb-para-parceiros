const elements = {
    inputs : document.querySelectorAll(".form-field input"),
    submit: document.querySelector("input[type='submit'][class='primary-button']")
}

let isFilled = {
    firstInput: false,
    secondInput: false,
    thirdInput: false
}

function buttonStatusHandler(){

    if(isFilled.firstInput && isFilled.secondInput && isFilled.thirdInput) {
        elements.submit.removeAttribute("disabled");
    } else {
        elements.submit.setAttribute("disabled","true");
    }

};

elements.inputs.forEach(input => {

    input.addEventListener("input", function(e) {

        if(input.value.length != 0) {
            switch(e.target.id) {
                case "full-name":
                    isFilled.firstInput = true;
                break;
                case "tel":
                    isFilled.secondInput = true;
                break;
                case "cpf":
                    isFilled.thirdInput = true;
                break;
            }
        } else {
            switch(e.target.id) {
                case "full-name":
                    isFilled.firstInput = false;
                break;
                case "tel":
                    isFilled.secondInput = false;
                break;
                case "cpf":
                    isFilled.thirdInput = false;
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

let users = [];

$(document).ready(function() {
    var settings = {
        "url": "http://localhost:4000/api/v1/user/avaiable-to-link",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
      };
      
      $.ajax(settings).done(async function (response) {
        if(response.success.data.length == 0) {
            toastr.error("Crie um novo usuário com o cargo parceiro para continuar. Redirecionando...", "Nenhum usuário disponível");
            document.querySelector("#responsible-user").setAttribute("disabled","true");
            document.querySelector("#responsible-user").setAttribute("placeholder","Nenhum usuário disponível");

            let option = document.createElement("option");
            option.textContent = "Nenhum usuário disponível";
            option.setAttribute("disabled","true");
            option.setAttribute("selected","true");

            document.querySelector("#responsible-user").appendChild(option);

            await delay(3);
            document.location.href = "http://127.0.0.1:5500/public/html/admin/create-new-user.html";
            
        } else {
            response.success.data.forEach(user => {

                users.push(user);
    
                let option = document.createElement("option");
                option.textContent = user.email;
                option.value = user.email;
                option.id = user.id;
    
                document.querySelector("#responsible-user").appendChild(option);
    
            })
        }
        
      });
})

// Form prevent default.
$("form").submit(function(e) {
    e.preventDefault();
});

document.querySelector(".primary-button").addEventListener("click", function() {
    document.querySelector('#loading').style.visibility = "visible";

    var settings = {
        "url": "http://localhost:4000/api/v1/partner/create",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
        "data": {
            accountable_id: document.querySelector(`option[value='${(document.querySelector("#responsible-user").value)}']`).id,
            full_name: document.querySelector('#full-name').value,
            telephone: document.querySelector('#tel').value, 
            cpf: document.querySelector('#cpf').value,
        }
      };
      
      $.ajax(settings).done(function (response) {

        document.querySelector("#loading").style.visibility = "hidden";

        if(response.success) {
           
            toastr.success(response.success.title);
        } else {

            toastr.error(response.error.detail, response.error.title);
        }
      });
    }) 