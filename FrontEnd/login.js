let api = "http://localhost:5678/api/";
let urlLogin = `${api}users/login`;
let form = document.querySelector("#loginForm");

form.addEventListener("submit", function(e){
    e.preventDefault();
    loginFunction();
});

async function loginFunction(){
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    let user = {
        email,
        password
    };

    fetch (urlLogin,{
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.hasOwnProperty("token")){
            console.log(data);
            sessionStorage.setItem("token", data.token);
            window.open("./index.html", "_self");
        }
        else{
            document.querySelector("#errorMessage").style.display = "block";
            document.querySelector("#loginForm").style.marginTop = "0";
            document.querySelector("#login").style.paddingBottom = "197px";
        }
        
    })
}