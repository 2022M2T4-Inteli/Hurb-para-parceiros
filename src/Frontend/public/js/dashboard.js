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