const elements = {
    inputs : document.querySelectorAll(".form-field input"),
    submit: document.querySelector(".primary-button")
}


let isFilled = {
    firstInput: false,
}

function buttonStatusHandler(){

    if(isFilled.firstInput) {
        elements.submit.removeAttribute("disabled");
    } else {
        elements.submit.setAttribute("disabled","true");
    }

};

elements.inputs.forEach(input => {

    input.addEventListener("input", function(e) {

        if(input.value.length != 0) {
            switch(e.target.id) {
                case "email":
                    isFilled.firstInput = true;
                break;
            }
        } else {
            switch(e.target.id) {
                case "email":
                    isFilled.firstInput = false;
                break;
            }
        }
    
        buttonStatusHandler();

    });
})


$(document).ready(function() {

    var settings = {
        "url": `http://localhost:4000/api/v1/user/u/${sessionStorage.getItem("target-edit-id")}`,
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem("token"),
        },
    };
      
    $.ajax(settings).done(function (response) {

         user = response.success.data;

         document.querySelector("#email").value = user.email;

         var settings = {
            "url": "http://localhost:4000/api/v1/role/",
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Authorization": localStorage.getItem("token")
            },
          };
          
          $.ajax(settings).done(async function (response) {
            await response.success.data.forEach(role => {
    
                let option = document.createElement("option");
                option.textContent = role.nome;
                option.value = role.nome;
                option.id = role.id;
    
                document.querySelector("#role").appendChild(option);
    
            })

            document.querySelector("#role").value = document.querySelector(`option[id="${user.id_do_cargo}"]`).value;

          });

          isFilled.firstInput = true;

          buttonStatusHandler();

          document.querySelector(".primary-button").addEventListener("click", function() {
            var settings = {
                "url": `http://localhost:4000/api/v1/user/u/${user.id}`,
                "method": "PUT",
                "timeout": 0,
                "headers": {
                  "Authorization": localStorage.getItem("token"),
                },
                "data": {
                    email:document.querySelector("#email").value,
                    role: document.querySelector("#role").value
                }
            };
              
            $.ajax(settings).done(function (response) {
                window.location.href = "http://127.0.0.1:5500/public/html/admin/edit-registered-user.html";
            });
          })

          document.querySelector("#delete-btn").addEventListener("click", function() {
            
            var settings = {
                "url": `http://localhost:4000/api/v1/user/u/${user.id}`,
                "method": "DELETE",
                "timeout": 0,
                "headers": {
                  "Authorization": localStorage.getItem("token"),
                },
              };
              
            $.ajax(settings).done(function (response) {
                window.location.href = "http://127.0.0.1:5500/public/html/admin/edit-registered-user.html";
            });

          })
          

    });

})


