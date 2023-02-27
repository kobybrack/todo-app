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
        let parentId = '';
        if (todoDescription[0] === ';') {
            todoDescription = todoDescription.slice(1);
            isSubtask = 'subtask';
            parentId = $('.lastParentTask')[0]?.id || '';
        }
        (event.target as HTMLInputElement).value = '';
        ipcRenderer.send('add-todo', { todoDescription, isSubtask, parent: parentId });
    }
};

$('#new-todo-entry').on('keydown', createTodo);

// on receive todos
ipcRenderer.on('todos', (_event, todos: Todo[], lastParentTaskId: string) => {
    // get the todoList ul
    const newList = $('<ul>', { id: 'todo-list' });
    for (const todo of todos) {
        let isLastParentTask = '';
        if (todo.id === lastParentTaskId) {
            isLastParentTask = 'lastParentTask';
        }
        const listElement = $('<li>', {
            id: todo.id,
            class: `${todo.isSubtask} ${isLastParentTask}`,
        });
        listElement.on('dblclick', (event) => {
            if (event.target.localName !== 'input') ipcRenderer.send('toggle-subtask', todo.id);
        });

        const checkbox = $(`<input type="checkbox" ${todo.isCompleted}/>`);
        checkbox.on('click', () => ipcRenderer.send('toggle-completion', todo.id));
        const label = $(`<label>${todo.description}</label>`);
        const span = $(`<span class="close">X</span>`);
        span.on('click', () => ipcRenderer.send('remove-todo', todo.id));

        listElement.append(checkbox, label, span);
        newList.append(listElement);
    }
    if (todos.length !== 0) {
        newList.append('<br>');
    }
    $('#todo-list').replaceWith(newList);
});
