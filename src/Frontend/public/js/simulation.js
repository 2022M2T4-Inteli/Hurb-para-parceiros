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

// Form prevent default.
$("form").submit(function(e) {
    e.preventDefault();
});

let total = 0;
let desiredFee = false;

// Filling the dashboard fields
$(document).ready(function() {

    // Getting all app modalities from database.
    document.querySelector("#loading").style.visibility = "visible";

    var settings = {
        "url": "http://localhost:4000/api/v1/modality/",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
    };
      
    $.ajax(settings).done(function (response) {
        if(response.success){

            let counter = 1;

            const fees = document.querySelector("#fees");

            response.success.data.sort(function (a, b) {
                if (parseInt((a.nome).replace("D","")) > parseInt((b.nome).replace("D",""))) {
                  return 1;
                }
                if (parseInt((a.nome).replace("D","")) < parseInt((b.nome).replace("D",""))) {
                  return -1;
                }
                // a must be equal to b
                return 0;
            });
            
            response.success.data.forEach(fee => {

                let days = parseInt((fee.nome).replace("D",""));

                let dat = new Date();
                dat.setDate(dat.getDate() + days);
                dat = ((dat.toLocaleString()).split(" "))[0]

                const div = document.createElement("div");
                div.classList.add("radio-btn-row");

                div.innerHTML = `
                    <input type="radio" name="selected-fee" id="${fee.id}">
                    <label for="${fee.id}" time="${days}">${days} dias (<span id="date">${dat}</span>) ${counter == 1 ? "*" : ""}</label>
                    <div class="percentage-tag">-${parseInt((fee.taxa)*100)}%</div>
                `

                fees.appendChild(div);

                counter += 1;

            })

        } else  {

            toastr.error(response.error.detail, response.error.title); 

        }

        $("input[type='radio']").each(function(index) {
            this.addEventListener("click", function() {
                desiredFee = true;
                freeButtonOnInputComplete();
            })
        })

    });

    // Getting all organization avaiable reservations from database.
    document.querySelector("#loading").style.visibility = "visible";

    var settings = {
        "url": `http://localhost:4000/api/v1/organization/${sessionStorage.getItem("organization-id")}/avaiable-reservations`,
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
      };
      
      $.ajax(settings).done(function (response) {

        const quantity = response.success.data.length;

        response.success.data.forEach(reservation => {
            total += reservation.valor;
        })

        total = parseFloat(total.toFixed(2));

        const desiredValueInput = document.querySelector("#anticipation-desired-value");

        desiredValueInput.addEventListener("input", function() {
            if(desiredValueInput.value > total) {
                desiredValueInput.value = total;
            }
        })

        document.querySelector("#loading").style.visibility = "hidden";
         
        // Setting up the withdraw avaiable value.
        if(response.success){
            
            document.querySelector("#avaiable-value").textContent = String(total).replace(".",",");

        } else  {

            toastr.error(response.error.detail, response.error.title); 

        }
      });

})

// Enabling the button only when inputs are filled.

document.querySelector(".primary-button").addEventListener("click", function() {

    document.querySelector("#loading").style.visibility = "visible";

    let desiredValue = document.querySelector("#anticipation-desired-value").value;
    let modality_id = document.querySelector("input[name='selected-fee']:checked").id;

    var settings = {
        "url": "http://localhost:4000/api/v1/order/simulate",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
        "data": {
            organization_id: sessionStorage.getItem("organization-id"),
            desired_value:desiredValue,
            modality_id:modality_id,
        },
    };
    
    $.ajax(settings).done(function (response) {
        if(response.success) {
            sessionStorage.setItem("anticipation-summary", JSON.stringify(response.success.data));
            window.location.href = "http://127.0.0.1:5501/public/html/simulation-summary.html";
        } else {
            toastr.error(response.error.detail, response.error.title); 
        }

        document.querySelector("#loading").style.visibility = "hidden";
    });



})

const elements = {
    desiredValue: document.querySelector("#anticipation-desired-value"),
    submitButton: document.querySelector("#submit-button")
}

let desiredValueInputFilled = false;

function freeButtonOnInputComplete() {
    if(desiredValueInputFilled && desiredFee) {
        elements.submitButton.removeAttribute("disabled");
    } else {
        elements.submitButton.setAttribute("disabled","true");
    }
}

elements.desiredValue.addEventListener("input", function(e) {
    if(String(e.target.value).length != 0) {
        desiredValueInputFilled = true;
    } else {
        desiredValueInputFilled = false;
    }

    freeButtonOnInputComplete();
});