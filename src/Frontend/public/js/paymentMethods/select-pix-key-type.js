const radioButtons = document.querySelectorAll("input[type='radio']");

let openedInput;

radioButtons.forEach(radio => {
    radio.addEventListener("click", function(e) {

        openedInput ?  openedInput.style.display = "none" : false;

        e.target.parentElement.parentElement.children[1].style.display = "flex";

        openedInput = e.target.parentElement.parentElement.children[1];
        
    })
})