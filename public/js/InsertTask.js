addEventListener("load", function() {
    setActiveNavItem();
    if (JSON.parse(sessionStorage.getItem("authentication_organizaMiDia"))) {
        showUsernameInNav();
        document.getElementById("date_task").value = getActualDate();
    }  else {
        location.href = "/";
    }
});

const inputNameTask = document.querySelector("#input_name_task");
const inputDescription = document.querySelector("#input_description");
const inputDate = document.querySelector("#date_task");

document.querySelector("#btnSaveTask").addEventListener("click", async (event) => {
    event.preventDefault();
    if (inputNameTask.value && inputDescription.value && inputDate.value) {
        await insertTask();
    } else {
        showAlert("error", "Debes completar todos los datos.");
    }

});

async function insertTask() {
    const request = await fetch("/insert_task", {
        method: "POST", headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors', body: JSON.stringify({ 
            "name": inputNameTask.value, 
            "description": inputDescription.value, 
            "date_task": inputDate.value,
            "username": sessionStorage.getItem("username_organizaMiDia")
        })
    });
    const statusRequest = await request.json();
    
    if (statusRequest) {
        showAlert("success", "Tarea guardada con éxito!");
        inputDescription.value = "";
        inputNameTask.value = "";
    } else {
        showAlert("error", "No se pudo procesar tu petición :(");
    }
}
