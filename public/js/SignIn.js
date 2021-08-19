
const txtNewUsername = document.querySelector("#txtNewUsername");
const txtNewPassword = document.querySelector("#txtNewPassword");

const validString = (username, pass) => {
    
    // this can be improved...
    const invalidChars = [" ", "$", "/", "#", "@", '"', "`", "(", ")",
        "'", "!", "¡", "|", "~", "¬", "{", "}"];

    for (let char of invalidChars) {
        if (username.includes(char) || pass.includes(char)) {
            return false
        }
    }
    return true
}

const signIn = () => {
    fetch("function_sign_in", {
        method: "POST", headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors', body: JSON.stringify({ 
            "new_username":  txtNewUsername.value,
            "new_password": txtNewPassword.value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status) { 
            showAlert("success", data.message);
            setTimeout(() => {
                sessionStorage.setItem("authentication_organizaMiDia", true);
                sessionStorage.setItem("username_organizaMiDia", txtNewUsername.value);
                location.href = "/";
            }, 2500);
            
        } else { showAlert("error", data.message); }
    })
    .catch(error => { 
        console.error(error);
        showAlert("error", "Debe indicar un usuario y una contraseña.");
    });
}

document.querySelector("#btnSignIn").addEventListener("click", async function(evt) {
    evt.preventDefault();
    let username = txtNewUsername.value;
    let pass = txtNewPassword.value;

    if (username && pass) {
        if (validString(username, pass)) {
            signIn();
        } else {
            showAlert("error", "Hay caracteres inválidos en los datos ingresados");
        }
    } else {
        showAlert("error", "Debe indicar un usuario y una contraseña."); 
    }
});

document.querySelector("#btnVerificationCode").addEventListener("click", () => {
    showAlert("error", "Función fuera de servicio. Podrá registrarse sin un código de activación.");
});
