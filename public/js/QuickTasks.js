
class QuickTask {
    constructor(name, finished) {
        this.name = name
        this.finished = finished
    }

    static saveTask(quickTask) {
        let allTasks = this.getAllTasks();
        if (allTasks == null || allTasks == undefined) {
            allTasks = new Array();
        }
        allTasks.push(quickTask);
        localStorage.setItem('all_tasks', JSON.stringify(allTasks));
    }

    static getAllTasks = () => JSON.parse(localStorage.getItem('all_tasks'));
    
    static insertTask(quickTask) {
        let liTask = document.createElement("li")
        let inputCheck = document.createElement("input");
        inputCheck.classList.add("form-check-input")
        inputCheck.type = "checkbox"
        inputCheck.id = "checkbox_" + quickTask.name;
        inputCheck.addEventListener("click", new QuickTask().#event_updateTaskStatus);
        
        let label = document.createElement("label");
        label.classList.add("form-check-label");
        label.for = inputCheck.id;
        label.appendChild(document.createTextNode(quickTask.name));
        label.addEventListener("dblclick", new QuickTask().#event_removeTask);
        
        if (quickTask.finished) {
            label.classList.add("line-through");
            inputCheck.checked = true;
        }
        liTask.appendChild(inputCheck);
        liTask.appendChild(label);
        document.getElementById("all_tasks").appendChild(liTask);
    }

    #event_removeTask(evt) {
        if (confirm("¿Seguro que deseas eliminar la tarea?")) {
            // label.parentElement.parentElement.removeChild(label.parentElement)
            /**
             * Seguir...
             */
        }
    }

    #event_updateTaskStatus(evt) {
        const element = evt.srcElement;
        console.log(`src element: ${element}`)
        let taskName = element.id.split('_')[1];
        // remove line from label:
        const label = element.parentElement.childNodes[1]
        // debugger;
        if (element.checked) {
            label.classList.add("line-through");
        } else {
            label.classList.remove("line-through");
        }
        // updated task in local storage:
        QuickTask.updateTaskStatus(taskName);
    }

    static updateTaskStatus(taskname) {
        const allTasks = this.getAllTasks();
        for (let task of allTasks) {
            if (task.name === taskname) {
                task.finished = (!task.finished);
            }
        }
        
        localStorage.setItem('all_tasks', JSON.stringify(allTasks));
    }

}