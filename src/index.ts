import { ipcRenderer } from 'electron';
import $ from 'jquery';
import { Todo } from './models/Todo';

const createTodo = (event: any) => {
    if (event.code === 'Enter' && !event.shiftKey) {
        let todoDescription = (event.currentTarget as HTMLInputElement).value;
        if (todoDescription === '') {
            (document.activeElement as HTMLElement).blur();
            return;
        }

        let isSubtask = '';
        let parentIndex = -1;
        if (todoDescription[0] === ';') {
            todoDescription = todoDescription.slice(1);
            isSubtask = 'subtask';
            const lastParentTaskId = $('.lastParentTodo')[0]?.id;
            if (lastParentTaskId) parentIndex = Number(lastParentTaskId);
        }
        (event.target as HTMLInputElement).value = '';
        ipcRenderer.send('add-todo', { todoDescription, isSubtask, parentIndex: parentIndex });
    }
};

$('#new-todo-entry').on('keydown', createTodo);

// on receive todos
ipcRenderer.on('todos', (_event, todos: Todo[], lastParentTodoIndex: number) => {
    // get the todoList ul
    const newList = $('<ul>', { id: 'todo-list' });
    for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        let isLastParentTodo = '';
        if (i === lastParentTodoIndex) {
            isLastParentTodo = 'lastParentTodo';
        }
        const listElement = $('<li>', {
            id: i,
            class: `${todo.isSubtask} ${isLastParentTodo}`,
        });
        listElement.on('dblclick', (event) => {
            if (event.target.localName !== 'input') ipcRenderer.send('toggle-subtask', i);
        });

        const checkbox = $(`<input type="checkbox" ${todo.isCompleted}/>`);
        checkbox.on('click', () => ipcRenderer.send('toggle-completion', i));
        const label = $(`<label>${todo.description}</label>`);
        const span = $(`<span class="close">X</span>`);
        span.on('click', () => ipcRenderer.send('remove-todo', i));

        listElement.append(checkbox, label, span);
        newList.append(listElement);
    }
    if (todos.length !== 0) {
        newList.append('<br>');
    }
    $('#todo-list').replaceWith(newList);
});
