function loadCalendarHandler() {
    // Getting all necessary elements from DOM.
    const elements = {
        monthToReceiveValueBoxes: document.querySelectorAll(".to-receive-values-box"),
        visibilityControlButtons: document.querySelectorAll(".visibility-control-btn"),
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

        // Instancing the response object.
        const responseObj = response;

        // Sending an error response case there's no pending to payment orders.
        if(responseObj.error) {

            toastr.error(response.error.detail, response.error.title);

        } else {

            // Saving the all received data from server to dates and values array variable.
            const datesAndValuesArr = responseObj.success.data;
            
            // Sorting the array by its elements date.
            datesAndValuesArr.sort(function(primary, secondary) {

                if(primary.date < secondary.date) {
                    return -1;
                }
                
                if (primary.date > secondary.date) {
                    return 1;
                }
                
                return 0;

            })

            // Splitting the array elements dates.
            datesAndValuesArr.forEach(element => {
                element.date = element.date.split("-");
                element.date = {
                    year: element.date[0],
                    month: element.date[1],
                    day: parseInt(element.date[2]),
                }
            })

            // Instancing the front-end constructor object.
            const contructorObj = {};

            // Defining the month map.
            const monthMap = {
                "01": "Janeiro",
                "02": "Fevereiro",
                "03": "Março",
                "04": "Abril",
                "05": "Maio",
                "06": "Junho",
                "07": "Julho",
                "08": "Agosto",
                "09": "Setembro",
                "10": "Outubro",
                "11": "Novembro",
                "12": "Dezembro"
            };
            
            // Making an hashmap of dates and values array.
            datesAndValuesArr.forEach((element, index) => {
                // Checking if the year of the current element of dates and values array its already defined.
                if(contructorObj[element.date.year]) {
                    // If the year of the current element of dates and values array its already defined, checking if the month its already defined.
                    if(contructorObj[element.date.year][monthMap[element.date.month]]) {
                        // If the month of the current element of dates and values array its already defined checking if the day its already defined.
                        if(contructorObj[element.date.year][monthMap[element.date.month]][element.date.day]) {
                            // If the day of the current element of dates and values array its already defined summing the current value to the last defined value.
                            contructorObj[element.date.year][monthMap[element.date.month]][element.date.day] += element.value;
                        } else {
                            // If the day of the current element of dates and values array its not already defined, setting up the day.
                            contructorObj[element.date.year][monthMap[element.date.month]][element.date.day] = element.value;
                        }
                    } else {
                        // If the month of the current element of dates and values array its not already defined, setting up the date.
                        contructorObj[element.date.year][monthMap[element.date.month]] = {
                            [element.date.day]: element.value,
                        }
                    }
                } else {
                    // If the year of the current element of dates and values array its not already defined, setting up the date.
                    contructorObj[element.date.year] = {
                        [monthMap[element.date.month]]: {
                            [element.date.day]: element.value,
                        },
                    }
                }
            })

            console.log(contructorObj);
            
            // Getting the calendar element from dom.
            const calendar = document.querySelector("#calendar");

            // Printing the dates on the screen...
            for(const year in contructorObj) {

                for(const month in contructorObj[year]) {

                    // Instacing the 'to receive values box' element.
                    const toReceiveValuesBox = document.createElement("div");
                    toReceiveValuesBox.classList.add("to-receive-values-box");

                    // Instacing the 'box summary' element.
                    const boxSummary = document.createElement("div");
                    boxSummary.classList.add("box-summary");

                    // Instacing the month and year span element.
                    const monthAndYear = document.createElement("span");
                    monthAndYear.textContent = `${month} de ${year}`;

                    // Appending month and year span to the 'box summary' element.
                    boxSummary.appendChild(monthAndYear);

                    // Instancing the visibility control button image element.
                    const visibilityControlButton = document.createElement("img");
                    visibilityControlButton.classList.add("visibility-control-btn");
                    visibilityControlButton.setAttribute("src", "../icons/arrow-down-circle.svg");
                    visibilityControlButton.setAttribute("alt", "círculo preto com seta branca voltada para baixo simbolizando um botão de encolher conteúdo");

                    // Appending visibility control button image element to 'box summary' element.
                    boxSummary.appendChild(visibilityControlButton);

                    // Appending box summary to the 'to receive values box' element.
                    toReceiveValuesBox.appendChild(boxSummary);

                    // Instacing the 'box content' element.
                    const boxContent = document.createElement("div");
                    boxContent.classList.add("box-content");

                    for(const day in contructorObj[year][month]) {
                        // Printing the day | subsubkey == day
                        console.log(day);

                        // Instancing the 'day and value' element.
                        const dayAndValue = document.createElement("div");
                        dayAndValue.classList.add("day-and-value");

                        // Instancing the day element.
                        const dayNumber = document.createElement("span");
                        dayNumber.textContent = `Dia ${day}`;

                        // Appending the day element to the 'day and value' element.
                        dayAndValue.appendChild(dayNumber);

                        // Instacing the value element.
                        const value = document.createElement("span");
                        value.textContent = `R$${contructorObj[year][month][day]}`;

                        // Appending the value element to the 'day and value' element.
                        dayAndValue.appendChild(value);

                        // Appending the 'day and value' element to the 'box content' element.
                        boxContent.appendChild(dayAndValue);

                        toReceiveValuesBox.appendChild(boxContent);

                    }

                    calendar.appendChild(toReceiveValuesBox);

                }
            }

            // Loading the calendar handler function...
            loadCalendarHandler();

        }



    });
})