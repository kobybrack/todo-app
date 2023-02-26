import { app, ipcMain } from 'electron';
import { Todo } from './models/Todo';
import { TodoList } from './models/TodoList';
import { Window } from './models/Window';

require('electron-reload')(__dirname);

const appDataPath =
    process.env.APPDATA ||
    (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share');

const todoList = new TodoList(appDataPath);

const main = () => {
    const window = new Window('views/index.html');
    window.once('show', () => {
        window.webContents.send('todos', todoList.getTodos());
    });

    ipcMain.on('add-todo', (_event, todoOptions) => {
        todoList.addTodo(todoOptions);
        console.log('adding todo');
        window.webContents.send('todos', todoList.getTodos());
    });

    ipcMain.on('remove-todo', (_event, todoId) => {
        todoList.removeTodo(todoId);
        console.log('removing todo');
        window.webContents.send('todos', todoList.getTodos());
    });

    ipcMain.on('toggle-subtask', (_event, todoId) => {
        todoList.toggleSubtask(todoId);
        console.log('toggling subtask');
        window.webContents.send('todos', todoList.getTodos());
    });

    ipcMain.on('toggle-completion', (_event, todoId) => {
        todoList.toggleCompletion(todoId);
        console.log('toggling completion');
        window.webContents.send('todos', todoList.getTodos());
    });
};

app.on('ready', main);

app.on('window-all-closed', () => {
    app.quit();
});
