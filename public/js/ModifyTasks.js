addEventListener("load", async function() {
    setActiveNavItem();
    if (JSON.parse(sessionStorage.getItem("authentication_organizaMiDia"))) {
        showUsernameInNav();
        await showMyTasks();
    } else {
        location.href = "/";
    }
});

async function showMyTasks() {
    const data = await getAllTasksFromUser();
    sessionStorage.setItem("myTasks_organizaMiDia", JSON.stringify(data));
    const tbody = document.querySelector("#tbodyMyTasks");
    removeChilds(tbody);
    
    data.forEach(task => {
        const tr = document.createElement("TR");
        tr.id = task.id;
        const tdName = document.createElement("TD");
        tdName.appendChild(document.createTextNode(task.name));
        const tdDesc = document.createElement("TD");
        tdDesc.appendChild(document.createTextNode(task.description));
        const tdDate = document.createElement("TD");
        tdDate.appendChild(document.createTextNode(getDate(task.date)));
        const tdStatus = document.createElement("TD");

        const statusTask = task.status === 1 ? "Hecho" : "Pendiente";
        tdStatus.appendChild(document.createTextNode(statusTask));

        const tdButtonModify = document.createElement("TD");
        const buttonModify = document.createElement("button");
        buttonModify.appendChild(document.createTextNode("Editar"));
        buttonModify.classList.add("btn", "btn-warning", "btn-sm");
        buttonModify.addEventListener("click", (event) => {
            showEditTask(event.target.parentNode.parentNode.id);
            document.querySelector(".form_edit_tasks").classList.remove("none");
            location.href = "#form_edit_tasks";
        });
        tdButtonModify.appendChild(buttonModify);

        const tdButtonRemove = document.createElement("TD");
        const btnRemove = document.createElement("button");
        btnRemove.appendChild(document.createTextNode("X"));
        btnRemove.classList.add("btn", "btn-danger", "btn-sm");

        btnRemove.addEventListener("click", async (event) => {
            event.preventDefault();
            const name = event.target.parentNode.parentNode.children[0].textContent;
            if (confirm(`¿Está seguro de borrar la tarea con el nombre "${name}"?`)) {
                await removeTask(event.target.parentNode.parentNode.id);
            }
        });
        tdButtonRemove.appendChild(btnRemove);
        
        tr.appendChild(tdName);
        tr.appendChild(tdDesc);
        tr.appendChild(tdDate);
        tr.appendChild(tdStatus);
        tr.appendChild(tdButtonModify);
        tr.appendChild(tdButtonRemove);
        tbody.appendChild(tr);
    });
}

async function getAllTasksFromUser() {
    try {
        const userName = sessionStorage.getItem("username_organizaMiDia");
        return await (await fetch("/get_tasks_from_" + userName)).json();
    } catch (error) {
        showAlert("error", "Se produjo un error al obtener sus tareas.");
        location.href = "/";
    }
}

function showEditTask(idTask) {
    const task = getTask(parseInt(idTask));
    document.getElementById("input_name_task").value = task.name;
    document.getElementById("input_name_task").idTask = task.id;
    document.querySelector("#date_task").value = getValidDate(new Date(task.date));

    if (task.status === 0) {
        document.getElementById("select_task_status").children[0].selected = "selected";
    } else {
        document.getElementById("select_task_status").children[1].selected = "selected";
    }
    document.querySelector("#input_description").value = task.description;

}

function getValidDate(taskDate) {
    const dd = taskDate.getDate() < 10 ? '0' + taskDate.getDate() : taskDate.getDate();
    const mm = (taskDate.getUTCMonth() + 1) < 10 ? '0' + (taskDate.getUTCMonth() + 1) : (taskDate.getUTCMonth() + 1);
    return taskDate.getFullYear() + '-' + mm + '-' + dd;
}

function getTask(id) {
    for (let task of JSON.parse(sessionStorage.getItem("myTasks_organizaMiDia")))
    {
        if (task.id === id) return task;
    }
}
// UPDATE Task Event:
document.querySelector("#btnSaveTask").addEventListener("click", async (evt) => {
    evt.preventDefault();

    const request = await fetch("/update_task", {
        method: "POST", headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors', body: JSON.stringify({ 
            "id": document.getElementById("input_name_task").idTask,
            "name": document.getElementById("input_name_task").value, 
            "description": document.querySelector("#input_description").value, 
            "date_task": document.querySelector("#date_task").value,
            "status": document.getElementById("select_task_status").value === "1" ? true : false,
            "username": sessionStorage.getItem("username_organizaMiDia")
        })
    });
    const statusReq = await request.json();
    if (statusReq.status) {
        showAlert("success", "Su tarea fué modificada y guardada!");
        await showMyTasks();
    }
    else showAlert("error", "No se pudo procesar tu petición :(");
});

// Remove Task event:
async function removeTask(idTask) {    
    location.href = "#nav";
    fetch(`/delete_task_by_id_${idTask}`)
        .then(resp => resp.json())
        .then(data => {
            if (data.status) {
                showAlert("success_remove_task", "Su tarea fué eliminada con éxito.");
                showMyTasks();
            } else {
                showAlert("error_remove_task", "No se pudo procesar tu petición :(");
            }
        })
        .catch(error => {
            console.error(error);
            showAlert("error", "Se produjo un error. Vuelva a intentarlo.");
        })
}
