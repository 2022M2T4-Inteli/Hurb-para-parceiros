var div = document.getElementById('auto-approval')
var img = document.getElementById('toggle-switch')
var enabled = false;
div.style.display = "none";

img.addEventListener('click',function(){
    if(enabled) {
        img.src = './../../icons/unable-toggle-button-icon.svg';
        div.style.display = "none";
        enabled = false;
    } else {
        img.src = './../../icons/toggle-button-icon.svg'
        div.style.display = 'block';
        enabled = true;
    }
});
