// Filling the simulation summary fields
$(document).ready(function() {

    // Getting the data from session storage.
    const info = JSON.parse(sessionStorage.getItem("anticipation-summary"));

    // Spliting the data by a space character.
    info.date = info.date.split(" ");
    info.date[0] = info.date[0].split("-");
    
    // Setting up the formatted date.
    const date = `${info.date[0][2]}/${info.date[0][1]}/${info.date[0][0]}`;

    // Setting up the solicitation information.
    
    if(info.isValueTheDesiredValue == false) {
        document.querySelector("#isRounded").innerHTML = "O valor da antecipação foi arredondado para possibilitar um pedido com reservas inteiras."
    }

    document.querySelector("#solicitation-date").innerHTML = date;
    document.querySelector("#value").innerHTML = `R$${(info.value).toFixed(2)}`;
    document.querySelector("#modality").innerHTML = info.modality.nome;
    document.querySelector("#modality-tax").innerHTML = `${(info.modality.taxa * 100)}%`;
    document.querySelector("#tax").innerHTML = `R$${info.fee}`;
    document.querySelector("#net").innerHTML = `R$${info.net}`;

    info.bookings.forEach(booking => {

        document.querySelector("#bookings").innerHTML += `
        
            <div class="daily">
                <span>Reserva #${booking.codigo}</span>
                <span>+R$${booking.valor}</span>
            </div>
        
        `
    })

})