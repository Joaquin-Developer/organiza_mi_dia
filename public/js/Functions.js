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

// addEventListener("beforeunload", (event) => {
//     localStorage.removeItem("authentication_organizaMiDia");
//     localStorage.removeItem("myTasks_organizaMiDia");
//     localStorage.removeItem("username_organizaMiDia");
// });
