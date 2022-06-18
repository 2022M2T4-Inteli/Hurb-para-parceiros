function copyText(){

    // Get the input
    var copyText = document.getElementById('tokenId');

    // Select the input value
    copyText.select();
    copyText.setSelectionRange(0, 9999);

    // Copy the value inside the input
    navigator.clipboard.writeText(copyText.value);
}