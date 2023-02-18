const { ipcRenderer } = require('electron');

const createTodo = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
        const todoDescription = event.target.value;
        event.target.value = '';
        ipcRenderer.send('add-todo', todoDescription);
    }
};

document.getElementById('new-todo-entry').addEventListener('keydown', createTodo);

// on receive todos
ipcRenderer.on('todos', (_event, todos) => {
    // get the todoList ul
    const todoList = document.getElementById('todoList');

    // create html string
    const todoItems = todos.reduce((html, todo) => {
        html += `<li><input type="checkbox" id="${todo.id}"><label for=${todo.index}> ${todo.description}</label></li>`;

        return html;
    }, '');
    todoList.innerHTML = todoItems;
});
