// Getting the "pending checkouts" and "pending money" elements.
const pendingCheckouts = document.querySelector(".quantity")

const pendingMoney = {
    main: document.querySelector(".pending-money .value .main"),
    cents: document.querySelector(".pending-money .value .cents")
}

// Instancing the app values visibility status variable.
let isValuesVisible = true;

// Defining the changeValuesVisibility function.
function changeValuesVisibility(event) {

    // Switching according to the current visibility status.
    switch(isValuesVisible) {
        // Case values are visible, changing to invisible.
        case true:
            // Replacing every character of pending checkouts value with asterisks.
            pendingCheckouts.innerHTML = (pendingCheckouts.innerHTML).replaceAll(/./g, "*");

            // Replacing every character of pending money value with asterisks.
            pendingMoney.main.innerHTML = (pendingMoney.main.innerHTML).replaceAll(/./g, "*")

            // Deleting all characters of pending money cents value.
            pendingMoney.cents.innerHTML = "";

            // Changing the eye icon.
            event.target.src="../icons/show-icon.svg";

            // Changing the visibility status.
            isValuesVisible = false;
        break;
        // Case values are invisible, changing to visible.
        case false:
            // Showing all application values.
            pendingCheckouts.innerHTML = pendingCheckouts.getAttribute("value");
            pendingMoney.main.innerHTML = pendingMoney.main.getAttribute("value");
            pendingMoney.cents.innerHTML = pendingMoney.cents.getAttribute("value");

            // Changing the eye icon.
            event.target.src="../icons/hide-icon.svg"

            // Changing the visibility status.
            isValuesVisible = true;
        break;
    }
}

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


// Filling the dashboard fields

$(document).ready(function() {

    document.querySelector("#loading").style.visibility = "visible";

    document.querySelector("#partner-name").textContent = JSON.parse(localStorage.getItem("partner")).nome_completo;
    document.querySelector("#organization-name").textContent = sessionStorage.getItem("organization-name");

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
        let total = 0;

        response.success.data.forEach(reservation => {
            total += reservation.valor;
        })

        total = total.toFixed(2);
        total = parseFloat(total);

        let main = Math.trunc(total);
        let cents = ((total - main).toFixed(2)).replace("0.","");

        document.querySelector("#loading").style.visibility = "hidden";
          
        if(response.success){
            
            document.querySelector("#quantity").textContent = quantity;
            document.querySelector("#quantity").setAttribute("value", quantity);

            document.querySelector("#main").textContent = main;
            document.querySelector("#main").setAttribute("value", main);

            document.querySelector("#cents").textContent = cents;
            document.querySelector("#cents").setAttribute("value", cents);

        } else  {
            toastr.error(response.error.detail, response.error.title); 
        }
      });

})