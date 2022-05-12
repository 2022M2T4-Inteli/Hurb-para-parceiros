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
