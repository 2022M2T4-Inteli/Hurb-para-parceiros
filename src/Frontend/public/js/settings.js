$(document).ready(function() {

    const parceiro = JSON.parse(localStorage.getItem("partner"));
    document.querySelector("#person-name").value = parceiro.nome_completo;
    document.querySelector("#email-address").value = localStorage.getItem("email-address");
    document.querySelector("#partner-telephone").value = parceiro.telefone;
    document.querySelector("#establishment-name").value = sessionStorage.getItem("organization-name");
    document.querySelector("#organization-telephone").value = sessionStorage.getItem("organization-telephone");
})