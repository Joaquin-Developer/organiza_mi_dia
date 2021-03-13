const divMyTasks = document.querySelector(".myTasks");
const inputAuth = document.querySelector("#inputAuth");

addEventListener("load", async () => {
    if (! JSON.parse(sessionStorage.getItem("authentication_organizaMiDia"))) {
        showHideElement("formLogin", "class", "show");
    } else {
        showHideElement("myTasks", "class", "show"); 
        await loadMyTasks(); 
        showUsernameInNav();
    }
});

function showHideElement(idElem, typeParam, action) {
    let elem;
    if (typeParam === "id") {
        elem = document.querySelector("#" + idElem);
    } else if (typeParam === "class") {
        elem = document.querySelector("." + idElem);
    } else { return; }

    if (action === "show") {
        elem.classList.remove("none");
        elem.classList.add("block");
    } else if (action === "hide") {
        elem.classList.remove("block");
        elem.classList.add("none");
    }
    
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
            showHideElement("formLogin", "class", "hide");
            showHideElement("myTasks", "class", "show");
            await loadMyTasks();
            showUsernameInNav();
        }
    }
    
});

async function loadMyTasks() {
    const data = await getMyTasks();
    console.log(data);
    sessionStorage.setItem("myTasks_organizaMiDia", JSON.stringify(data));
    // Add data in table:
    const tbody = document.querySelector("#tbodyMyTasks");
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
    const userName = sessionStorage.getItem("username_organizaMiDia");
    return await (await fetch("/get_tasks_from_" + userName)).json();
}

function showUsernameInNav() {
    const elem = document.querySelector(".nav-username");
    console.log(elem);
    elem.appendChild(document.createTextNode(`Usuario: ${sessionStorage.getItem("username_organizaMiDia")}`));
}