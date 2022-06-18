$(document).ready(function() {

    document.querySelector("#loading").style.visibility = "visible";

    const urlParams = new URLSearchParams(window.location.search);
    const targetOrderId = urlParams.get('id');

    var settings = {
        "url": `http://localhost:4000/api/v1/order/${targetOrderId}`,
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
    };
      
    $.ajax(settings).done(function (response) {

        if(response.success) {

            // Getting the data from session storage.
            const info = response.success.data;

            // Spliting the data by a space character.
            info.data_de_solicitacao = info.data_de_solicitacao.split("-");
            
            // Setting up the formatted date.
            const date = `${info.data_de_solicitacao[2]}/${info.data_de_solicitacao[1]}/${info.data_de_solicitacao[0]}`;

            // --------------------

            // Spliting the data by a space character.
            info.receivement_info.data_de_recebimento_prevista = info.receivement_info.data_de_recebimento_prevista.split("-");

            // Setting up the formatted date.
            const expectedReceiptDate = `${info.receivement_info.data_de_recebimento_prevista[2]}/${info.receivement_info.data_de_recebimento_prevista[1]}/${info.receivement_info.data_de_recebimento_prevista[0]}`;

            // Setting up the solicitation information.
            document.querySelector("#order-id").innerHTML = `Pedido #${info.id}`;
            document.querySelector("#solicitation-date").innerHTML = date;
            document.querySelector("#expected-receipt-date").innerHTML = expectedReceiptDate;
            document.querySelector("#value").innerHTML = `R$${parseFloat((info.receivement_info.valor_bruto).toFixed(2))}`;
            document.querySelector("#modality").innerHTML = info.modality.nome;
            document.querySelector("#modality-tax").innerHTML = `${(info.modality.taxa * 100)}%`;
            document.querySelector("#tax").innerHTML = `R$${parseFloat((info.receivement_info.taxa_em_reais).toFixed(2))}`;
            document.querySelector("#net").innerHTML = `R$${parseFloat((info.receivement_info.valor_liquido).toFixed(2))}`;

            info.bookings.forEach(booking => {

                document.querySelector("#bookings").innerHTML += `
                
                    <div class="daily">
                        <span>Reserva #${booking.codigo}</span>
                        <span>+R$${booking.valor}</span>
                    </div>
                
                `
            })


        } else {
            toastr.error(response.error.detail, response.error.title); 
        }

        document.querySelector("#loading").style.visibility = "hidden";

    });

})