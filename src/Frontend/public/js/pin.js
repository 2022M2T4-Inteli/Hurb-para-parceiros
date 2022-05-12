// Getting user email address element from DOM.
const userEmailAdressElement = document.querySelector(".user-email-address");

// Instancing the render user email address function.
function renderUserEmailAddress() {

    // Replacing the html setted email address with the saved user email address in local storage.
    userEmailAdressElement.innerHTML = localStorage.getItem("email-address");
}


// Selecting all pin boxes.
const pinBoxes = document.querySelectorAll(".pin-box");

// For each pin box, adding a keyup event listener.
pinBoxes.forEach((pinBox) => {
    pinBox.addEventListener("keyup", function() {

        // If the pin box value length is equals to pin box max length, skipping to the next pin box.
        if(pinBox.value.length == pinBox.getAttribute("maxlength")) {
            
            // Getting the current pin box id.
            const currentId = pinBox.getAttribute("id");

            // Breaking the algorithm if the loop is on the last pin box. 
            if(currentId == pinBoxes[pinBoxes.length - 1].id) {
                return;
            }

            // Getting the next pin box node.
            const nextInput = document.getElementById(String(Number(currentId)+1));

            // Focusing on the next input pin box.
            nextInput.focus();
        }
      });
})