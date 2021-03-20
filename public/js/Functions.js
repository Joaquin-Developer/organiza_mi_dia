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

function showUsernameInNav() {
    const elem = document.querySelector(".nav-username");
    elem.appendChild(document.createTextNode(`Usuario: ${sessionStorage.getItem("username_organizaMiDia")}`));
}

function showAlert(typeAlert, textAlert) {
    let alertElem = null;
    if (typeAlert === "error") {
        alertElem = document.querySelector("#errorAlert");
    } else if (typeAlert === "success") {
        alertElem = document.querySelector("#successAlert");
    } else { return; }

    if (alertElem.firstChild) alertElem.removeChild(alertElem.firstChild);
    alertElem.appendChild(document.createTextNode(textAlert));
    showHtmlElement(alertElem);
    setTimeout(() => {
        hideHtmlElement(alertElem);
    }, 6000);
}

// show and hide html elements:
function showHtmlElement(element) {
    element.classList.remove("none");
    element.classList.add("block");
}

function hideHtmlElement(element) {
    element.classList.remove("block");
    element.classList.add("none");
}

function removeChilds(elem) {
    while (elem.firstChild) { 
        elem.removeChild(elem.firstChild);
    }
}

function setActiveNavItem() {
    if (location.pathname === "/"){
        document.querySelector("#link_index").classList.add("active");
    }
    else if (location.pathname === "/insert_task") {
        document.querySelector("#link_insert_task").classList.add("active");
    } 
    else if (location.pathname === "/modify_my_tasks") {
        document.querySelector("#link_modify_my_tasks").classList.add("active");
    }
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

// addEventListener("beforeunload", (event) => {
//     localStorage.removeItem("authentication_organizaMiDia");
//     localStorage.removeItem("myTasks_organizaMiDia");
//     localStorage.removeItem("username_organizaMiDia");
// });
