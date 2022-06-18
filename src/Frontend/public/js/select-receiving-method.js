function freeTriggerButton() {
    document.querySelector(".primary-button").removeAttribute("disabled");
}

$(document).ready(function() {

    const organizationId = sessionStorage.getItem("organization-id");

    var settings = {
        "url": `http://localhost:4000/api/v1/organization/${organizationId}/bank-account`,
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
    };
      
    $.ajax(settings).done(function (response) {

        if(response.error) {
            document.querySelector("#bank-section").innerHTML += `
            
            <div class="bank-account-row" id="bank-account-row">
                <span class="eighteen-size-light-text">Adicionar conta bancária</span>
                <img src="../../icons/black-add-icon.svg" alt="">
            </div>

            `

            document.querySelector("#bank-account-row").addEventListener("click", function() {
                window.location.href = "http://127.0.0.1:5500/public/html/add-bank-account.html"
            })
        } else {

            const { data } = response.success;

            document.querySelector("#bank-section").innerHTML += `
            
                <div class="radio-btn-row" style="display: flex; flex-direction:column; align-items: flex-start;">
                    <div class="main-information" style="display: flex; align-items:center;">
                        <input type="radio" name="receiving-method" id="transferencia">
                        <img src="../../icons/wallet-black-icon.svg" alt="ícone de carteira">
                        <label for="transferencia" class="eighteen-size-medium-text">Minha conta</label>
                    </div>
                    
                    <div class="bank-account-data">
                        <span>${data.beneficiario}</span>
                        <span>${data.banco}</span>
                        <span>Agência: ${data.agencia}</span>
                        <span>Conta: ${data.numero}-${data.digito}</span>
                    </div>
                </div>

            `

        }

        document.querySelectorAll("input[name='receiving-method']").forEach(radioInput => {
            radioInput.addEventListener("click", function() {
                freeTriggerButton();
            })
        })

    });

})

document.querySelector(".primary-button").addEventListener("click", function() {

    const orderReceiveMethod = {
        type: document.querySelector("input[type='radio']:checked").id,
    }

    localStorage.setItem("order-receive-method", JSON.stringify(orderReceiveMethod));

    switch(document.querySelector("input[type='radio']:checked").id) {
        case "pix":
            window.location.href = "http://127.0.0.1:5500/public/html/paymentMethods/select-pix-key-type.html";
        break;
        case "boleto":
            window.location.href = "http://127.0.0.1:5500/public/html/paymentMethods/bank-slip-method.html";
        break;
        default:
            window.location.href = "http://127.0.0.1:5500/public/html/confirm.html";
        break;
    }
})