import { ipcRenderer } from 'electron';
import $ from 'jquery';
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

$('#new-todo-entry').on('keydown', createTodo);

// on receive todos
ipcRenderer.on('todos', (_event, todos) => {
    // get the todoList ul
    const newList = $('ul');
    for (const todo of todos) {
        const listElement = $('li', {
            id: todo.id,
            ondblclick: ipcRenderer.send('remove-todo', todo.id),
            class: `subtask${todo.isSubtask}`,
        });
        const label = $(`label><input type="checkbox">${todo.description}</label>`);
        const span = $(`<span class="close">x</span>`);
        span.on('click', ipcRenderer.send('mark-subtask', todo.todoId));
        listElement.append(label, span);
        newList.append(listElement);
    }

    $('#todo-list').replaceWith(newList);
});
