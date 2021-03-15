const txtNewUsername = document.querySelector("#txtNewUsername");
const txtNewPassword = document.querySelector("#txtNewPassword");

document.querySelector("#btnSignIn").addEventListener("click", async function(evt) {
    evt.preventDefault();
    if (txtNewUsername.value && txtNewPassword.value) {

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
                setTimeout(() => location.href = "/", 3000);
            } else { showAlert("error", data.message); }
        })
        .catch(error => { 
            console.error(error);
            showAlert("error", "Debe indicar un usuario y una contraseña.");
        });
    } else { showAlert("error", "Debe indicar un usuario y una contraseña."); }
});

document.querySelector("#btnVerificationCode").addEventListener("click", function() {
    showAlert("error", "Función fuera de servicio. Podrá registrarse sin un código de activación.");
});
