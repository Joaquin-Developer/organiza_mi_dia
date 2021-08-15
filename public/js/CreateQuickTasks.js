const btnNewTask = document.getElementById('add_new_task');
const inputNewTask = document.getElementById('newTask');

const showAllTasks = () => {
    const allTasks = QuickTask.getAllTasks();

    if (allTasks != null && allTasks.length !=0) 
    {
        for (let quickTask of allTasks) QuickTask.insertTask(quickTask);    
    }
}

addEventListener("load", showAllTasks);

btnNewTask.addEventListener("click", (evt) => {
    evt.preventDefault();
    
    if (inputNewTask.value) {
        const task = new QuickTask(inputNewTask.value, false);
        QuickTask.insertTask(task);
        QuickTask.saveTask(task);
        inputNewTask.value = "";
    }
});