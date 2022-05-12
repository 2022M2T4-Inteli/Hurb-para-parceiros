// Getting the user email address element from dom.
const userEmailAddress = document.querySelector("#email-address");

// Instancing the recordUserEmailAdress function.
function recordUserEmailAddress() {

    // Saving the user email address in local storage.
    localStorage.setItem("email-address",userEmailAddress.value);
}