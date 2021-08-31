const btnNewTask = document.getElementById('add_new_task');
const inputNewTask = document.getElementById('newTask');

const showAllTasks = () => {
    const allTasks = QuickTask.getAllTasks();

    if (allTasks != null && allTasks.length !=0) 
    {
        for (let quickTask of allTasks) QuickTask.insertTask(quickTask);    
    }
}

addEventListener("load", () => {
    setActiveNavItem();

    if (JSON.parse(sessionStorage.getItem("authentication_organizaMiDia"))) {
        showUsernameInNav();
        showAllTasks();
    } else {
        location.href = "/";
    }
});

const event_newTask = (evt) => {
    if (inputNewTask.value) {
        const task = new QuickTask(inputNewTask.value, false);
        QuickTask.insertTask(task);
        QuickTask.saveTask(task);
        inputNewTask.value = "";
    }

}

btnNewTask.addEventListener("click", (evt) => {
    evt.preventDefault();
    event_newTask();
});

inputNewTask.addEventListener("keypress", (evt) => {
    if (evt.key === "Enter") event_newTask();
})
