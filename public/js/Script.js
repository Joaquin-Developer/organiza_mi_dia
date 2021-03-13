const formLogin = document.querySelector(".formLogin");
const inputAuth = document.querySelector("#inputAuth");

addEventListener("load", () => {
    if (! JSON.parse(sessionStorage.getItem("authentication_organizaMiDia"))) {
        showFormLogin();
    }
});

function showFormLogin() {
    formLogin.classList.remove("none");
    formLogin.classList.add("block");
}

const checkShowPassword = document.querySelector("#checkShowPassword");
checkShowPassword.addEventListener("change", () => {
    if (checkShowPassword.checked)
    inputAuth.type = "text";
    else
        inputAuth.type = "password";
});

document.querySelector("#btnLogin").addEventListener("click", async (evt) => {
    evt.preventDefault();
    const username = document.querySelector("#inputUsername");
    if (username.value && inputAuth.value) {
        const resp = await fetch("/auth", {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors', body: JSON.stringify({ "username": username.value, "psw": inputAuth.value })
        });
        let statusAuth = await resp.json();
        if (statusAuth.status) {
            sessionStorage.setItem("authentication_organizaMiDia", true);
            sessionStorage.setItem("username_organizaMiDia", username.value);
        }
    }
    
});

