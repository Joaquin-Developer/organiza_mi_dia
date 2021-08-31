
const switchBtn = document.getElementsByClassName("switch_change_style")[0];

const eventChangeStyle = () => {
    switchBtn.classList.toggle("active");
    document.body.classList.toggle("dark");
    
    for (let table of document.getElementsByTagName("table")) {
        table.classList.toggle("table-dark");
        table.classList.toggle("table-success");
    }
}

switchBtn.addEventListener("click", () => {
    eventChangeStyle();

    JSON.parse(localStorage.getItem("light_mode")) 
    ? localStorage.setItem("light_mode", false)
    : localStorage.setItem("light_mode", true)
});

addEventListener("load", () => {
    console.log("Change mode")
    if (JSON.parse(localStorage.getItem("light_mode"))) {
        eventChangeStyle();
    }
})
