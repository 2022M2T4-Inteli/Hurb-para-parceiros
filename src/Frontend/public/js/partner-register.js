var cpf = document.querySelector("#cpf");

cpf.addEventListener("blur", function(){
   cpf.value = cpf.value.match(/.{1,3}/g).join(".").replace(/\.(?=[^.]*$)/,"-");
});