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
    } else if (typeAlert === "error_remove_task") {
        alertElem = document.querySelector("#error_alert_remove_task");
    } else if (typeAlert === "success_remove_task") {
        alertElem = document.querySelector("#success_alert_remove_task");
    } else { return; }

    if (alertElem.firstChild) alertElem.removeChild(alertElem.firstChild);
    alertElem.appendChild(document.createTextNode(textAlert));
    showHtmlElement(alertElem);
    setTimeout(() => {
        hideHtmlElement(alertElem);
    }, 6000);
}

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

const setActiveNavItem = () => {
    // Path names Array:
    [
        { path: "/", selector: "#link_index" },
        { path: "/insert_task", selector: "#link_insert_task" },
        { path: "/modify_my_tasks", selector: "#link_modify_my_tasks" }, 
        { path: "/quick_tasks", selector: "#link_quick_tasks" }
    ]
    .some((elem) => { 
        if (location.pathname === elem.path) {
            document.querySelector(elem.selector).classList.add("active");
            return true;
        } 
    });

}

const getDate = (dateString) => {
    const dateObject = new Date(dateString);
    let date = dateObject.toLocaleDateString("es-UY", {
        day: 'numeric', month: 'long', weekday: 'long' 
    });
    return date.charAt(0).toUpperCase() + date.slice(1);
}

function getActualDate() {
    const dt = new Date();
    const day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
    const month = (dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1);

    return `${dt.getFullYear()}-${month}-${day}`;
}

// addEventListener("beforeunload", (event) => {
//     localStorage.removeItem("authentication_organizaMiDia");
//     localStorage.removeItem("myTasks_organizaMiDia");
//     localStorage.removeItem("username_organizaMiDia");
// });
