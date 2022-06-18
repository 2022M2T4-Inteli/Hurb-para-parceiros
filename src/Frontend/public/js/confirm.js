const info = JSON.parse(sessionStorage.getItem("anticipation-summary"));
const paymentInfo = JSON.parse(localStorage.getItem("order-receive-method"));

paymentInfo.type = paymentInfo.type.charAt(0).toUpperCase() + paymentInfo.type.slice(1);

$(document).ready(function() {
    
    // Setting up the main value and cents.
    const mainValue = Math.trunc(info.value);
    const cents = ((info.value - mainValue).toFixed(2)).split(".")[1];

    document.querySelector("#main").innerHTML = mainValue;
    document.querySelector("#main").value = mainValue;

    document.querySelector("#cents").innerHTML = cents;
    document.querySelector("#cents").value = cents;

    // Spliting the data by a space character.
    info.date = info.date.split(" ");
    info.date[0] = info.date[0].split("-");
    
    // Setting up the formatted date.
    const date = `${info.date[0][2]}/${info.date[0][1]}/${info.date[0][0]}`;

    // ----

    // Spliting the data by a space character.
    info.expected_receipt_date = info.expected_receipt_date.split(" ");
    info.expected_receipt_date[0] = info.expected_receipt_date[0].split("-");
    
    // Setting up the formatted date.
    const expected_receipt_date = `${info.expected_receipt_date[0][2]}/${info.expected_receipt_date[0][1]}/${info.expected_receipt_date[0][0]}`;

    // Setting up the solicitation information.
    document.querySelector("#solicitation-date").innerHTML = date;
    document.querySelector("#expected-receipt-date").innerHTML = expected_receipt_date;
    document.querySelector("#modality").innerHTML = info.modality.nome;
    document.querySelector("#modality-tax").innerHTML = `${(info.modality.taxa * 100)}%`;
    document.querySelector("#tax").innerHTML = `R$${info.fee}`;
    document.querySelector("#receive-method").innerHTML = paymentInfo.type; 
    document.querySelector("#net").innerHTML = `R$${info.net}`;

})

document.querySelector(".primary-button").addEventListener("click", function() {

    document.querySelector("#loading").style.visibility = "visible";

    const anticipationSummaryInfo = JSON.parse(sessionStorage.getItem("anticipation-summary"));

    const organizationId = parseInt(sessionStorage.getItem("organization-id"));

    const orderReceiveMethodInfo = JSON.parse(localStorage.getItem("order-receive-method"));

    const modalityId = anticipationSummaryInfo.modality.id;

    let reservationsId = [];

    anticipationSummaryInfo.bookings.forEach(booking => {
        reservationsId.push(booking.id);
    })

    const data = {
        organization_id: organizationId,
        modality_id: modalityId,
        reservations_id: reservationsId,
    }

    const merged = {...data, ...orderReceiveMethodInfo};

    var settings = {
        "url": "http://localhost:4000/api/v1/order/create",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
        "data": {
            data: JSON.stringify(merged),
        },
    };
      
    $.ajax(settings).done(function (response) {

        document.querySelector("#loading").style.visibility = "hidden";

        if(response.success) {

            window.location.href = "http://127.0.0.1:5500/public/html/success.html";
            
        } else {

            window.location.href = "http://127.0.0.1:5500/public/html/dashboard.html"

        }

    });

})