// Getting all necessary elements from DOM.
const elements = {
    monthToReceiveValueBoxes: document.querySelectorAll(".to-receive-values-box"),
    visibilityControlButtons: document.querySelectorAll("#visibility-control-btn"),
}

// Instancing the resfreshVisibleBoxes function.
function refreshVisibleBoxes() {

    // Getting all month to receive boxes elements and setting its display property according to their classes.
    elements.monthToReceiveValueBoxes.forEach(box => {
        if(box.classList.contains("active")) {
            box.children[1].style.display = "flex";
        } else {
            box.children[1].style.display = "none";
        }
    })
}

// Getting all visibility control buttons.
elements.visibilityControlButtons.forEach(button => {

    // Adding a click event listener to all buttons.
    button.addEventListener("click", function() {

        // Controlling the "active" class in the target month to receive box element.
        if(button.parentNode.parentNode.classList.contains("active")) {
            button.parentNode.parentNode.classList.remove("active")
            button.parentNode.children[1].src = "../icons/arrow-down-circle.svg";
        } else {
            button.parentNode.parentNode.classList.add("active");
            button.parentNode.children[1].src = "../icons/arrow-up-circle.svg";
        }

        // Refreshing the visible boxes.
        refreshVisibleBoxes();
    })
})

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

$(document).ready(function() {

    var settings = {
        "url": `http://localhost:4000/api/v1/organization/${sessionStorage.getItem("organization-id")}/calendar`,
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
    };
      
    $.ajax(settings).done(function (response) {

        const responseObj = response.success.data;

        responseObj.sort((first,second)=>{

            return first.data > second.data ? 1 : -1
        })
        
        responseObj.forEach(recebimentoObj => {
            recebimentoObj.data = (new Date(recebimentoObj.data)).toUTCString();
        })

        responseObj.forEach((recebimentoObj, index) => {
            let date = recebimentoObj.data;
            date = date.split(" ");
            date.pop();
            date.pop();
            date.reverse();
            recebimentoObj.data = date;
        })

        responseObj.push({data: ['2023','Ago','19','Fri'], valor: 1000});
        responseObj.push({data: ['2022','Jul','15','Fri'], valor: 1000});
        
        const obj = {}

        responseObj.forEach((recebimentoObj, i) => {
            let date = recebimentoObj.data;

            if(!(obj[date[0]])) {
                obj[date[0]] = {};
                obj[date[0]][date[1]] = [[date[3], date[2], recebimentoObj.valor]];
            } else {
                if(!(obj[date[0]][date[1]])) {
                    obj[date[0]][date[1]] = [[date[3], date[2], recebimentoObj.valor]];
                } else {

                    (obj[date[0]][date[1]]).push([date[3], date[2], recebimentoObj.valor]);

                }
            }
        })

        console.log(obj)
        console.log(JSON.stringify(obj));

    });
})