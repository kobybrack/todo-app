import { ipcRenderer } from 'electron';
import { Todo } from './models/Todo';

const createTodo = (event: KeyboardEvent) => {
    if (event.code === '13' && !event.shiftKey) {
        let todoDescription = (event.target as HTMLInputElement).value;
        if (todoDescription === '') {
            (document.activeElement as HTMLElement).blur();
            return;
        }

        let isSubtask = false;
        if (todoDescription[0] === ';') {
            todoDescription = todoDescription.slice(1);
            isSubtask = true;
        }
        (event.target as HTMLInputElement).value = '';
        ipcRenderer.send('add-todo', { todoDescription, isSubtask });
    }
};

const removeTodo = (element: HTMLLIElement) => {
    const todoId = element.id;
    ipcRenderer.send('remove-todo', todoId);
};

const toggleSubtask = (element: HTMLLIElement) => {
    const todoId = element.id;
    ipcRenderer.send('mark-subtask', todoId);
};

document.getElementById('new-todo-entry')?.addEventListener('keydown', createTodo);

// on receive todos
ipcRenderer.on('todos', (_event, todos) => {
    // get the todoList ul
    const todoList = document.getElementById('todoList');
    if (!todoList) {
        throw new Error('todoList is undefined/null!');
    }

    // create html string
    let todoItems = todos.reduce((html: string, todo: Todo) => {
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
