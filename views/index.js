const { ipcRenderer } = require('electron');

const createTodo = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
        let todoDescription = event.target.value;
        if (todoDescription === '') {
            document.activeElement.blur();
            return;
        }

        let isSubtask = false;
        if (todoDescription[0] === ';') {
            todoDescription = todoDescription.slice(1);
            isSubtask = true;
        }
        event.target.value = '';
        ipcRenderer.send('add-todo', { todoDescription, isSubtask });
    }
};

const removeTodo = (element) => {
    const todoId = element.id;
    ipcRenderer.send('remove-todo', todoId);
};

const toggleSubtask = (element) => {
    const todoId = element.id;
    ipcRenderer.send('mark-subtask', todoId);
};

document.getElementById('new-todo-entry').addEventListener('keydown', createTodo);

// on receive todos
ipcRenderer.on('todos', (_event, todos) => {
    // get the todoList ul
    const todoList = document.getElementById('todoList');

    // create html string
    let todoItems = todos.reduce((html, todo) => {
        html += `
        <li id="${todo.id}" ondblclick="toggleSubtask(this)" class="subtask${todo.isSubtask}">
            <label><input type="checkbox">${todo.description}</label> 
            <span onclick="removeTodo(this.parentElement)" class="close">x</span>
        </li>`;
        return html;
    }, '');
    if (todoItems !== '') {
        todoItems += '<br>';
    }
    todoList.innerHTML = todoItems;
});
