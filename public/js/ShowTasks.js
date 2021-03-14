const divMyTasks = document.querySelector(".myTasks");
const inputAuth = document.querySelector("#inputAuth");
const selectFilter = document.querySelector("#select_filter");

addEventListener("load", async () => {
    setActiveNavItem();
    if (! JSON.parse(sessionStorage.getItem("authentication_organizaMiDia"))) {
        showHideElement("formLogin", "class", "show");
    } else {
        showHideElement("myTasks", "class", "show"); 
        await loadMyTasks(); 
        showUsernameInNav();
    }
});

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
        try {
            const req = await fetch("/auth", {
                method: "POST", headers: { 'Content-Type': 'application/json' },
                mode: 'no-cors', body: JSON.stringify({ "username": username.value, "psw": inputAuth.value })
            });
            let statusAuth = await req.json();

            if (statusAuth.status && (! statusAuth.error)) {
                sessionStorage.setItem("authentication_organizaMiDia", true);
                sessionStorage.setItem("username_organizaMiDia", username.value);
                showHideElement("formLogin", "class", "hide");
                showHideElement("myTasks", "class", "show");
                await loadMyTasks();
                showUsernameInNav();
            } else if (statusAuth.status === false && (! statusAuth.error)) {
                showAlert("error", "Error: Usuario y/o contraseña incorrectas.");
            } else {
                showAlert("error", "Se produjo un error interno en el servidor.");
            }
        } catch (error) {
            showAlert("error", error);
        }
    } else {
        showAlert("error", "Error: Debe indicar usuario y contraseña.");
    }
});

async function loadMyTasks() {
    const data = await getMyTasks();
    sessionStorage.setItem("myTasks_organizaMiDia", JSON.stringify(data));
    const tbody = document.querySelector("#tbodyMyTasks");
    removeChilds(tbody);

    data.forEach(task => {
        const tr = document.createElement("TR");
        const tdName = document.createElement("TD");
        tdName.appendChild(document.createTextNode(task.name));
        const tdDesc = document.createElement("TD");
        tdDesc.appendChild(document.createTextNode(task.description));
        const tdDate = document.createElement("TD");
        tdDate.appendChild(document.createTextNode(getDate(task.date)));
        const tdStatus = document.createElement("TD");

        const statusTask = task.status === 1 ? "Hecho" : "Pendiente";
        tdStatus.appendChild(document.createTextNode(statusTask));
        tr.appendChild(tdName);
        tr.appendChild(tdDesc);
        tr.appendChild(tdDate);
        tr.appendChild(tdStatus);
        tbody.appendChild(tr);
    });
}

function getDate(dateString) {    
    const dt = moment(dateString).format("dddd D, MMMM YYYY");
    
    let day = dt.split(" ")[0];
    switch (day) {
        case "Monday": day = "Lunes"; break;
        case "Tuesday": day = "Martes"; break;
        case "Wednesday": day = "Miércoles"; break;
        case "Thursday": day = "Jueves"; break;
        case "Friday": day = "Viernes"; break;
        case "Saturday": day = "Sábado"; break;
        case "Sunday": day = "Domingo"; break;
    }

    let month = dt.split(" ")[2];
    switch (month) {
        case "January": month = "Enero"; break;
        case "February": month = "Febrero"; break;
        case "March": month = "Marzo"; break;
        case "April": month = "Abril"; break;
        case "May": month = "Mayo"; break;
        case "June": month = "Junio"; break;
        case "July": month = "Julio"; break;
        case "August": month = "Agosto"; break;
        case "September": month = "Setiembre"; break;
        case "October": month = "Octubre"; break;
        case "November": month = "Noviembre"; break;
        case "December": month = "Diciembre"; break;
    }
    return `${day} ${dt.split(" ")[1].replaceAll(",", "")} de ${month}`;
}

async function getMyTasks() {
    try {
        const userName = sessionStorage.getItem("username_organizaMiDia");
        switch (parseInt(selectFilter.value)) {
            case 1: return await (await fetch(`/get_all_tasks_for_today_from_${userName}`)).json();
            case 2: return await (await fetch(`/get_all_tasks_to_do_for_today_from_${userName}`)).json();
            case 3: return await (await fetch("/get_all_tasks_for_this_week_from_" + userName)).json();
            case 4: return await (await fetch("/get_all_tasks_for_this_week_to_do_from_" + userName)).json();
            case 5: return await (await fetch("/get_all_tasks_done_from_" + userName)).json();
            case 6: return await (await fetch("/get_all_tasks_to_do_from_" + userName)).json();
            case 7: return await (await fetch("/get_tasks_from_" + userName)).json();
            default: 
                showAlert("error", "Opción incorrecta.");
                return []; 
                break;
        }
    } catch (error) {
        showAlert("error", "Se produjo un error al obtener las tareas.");
    }
}

selectFilter.addEventListener("change", async () => {
    console.log(selectFilter.value);
    await loadMyTasks();
});