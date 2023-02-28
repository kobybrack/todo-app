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
        window.webContents.send('todos', todoList.getTodos(), todoList.getLastParentIndex());
    });

    ipcMain.on('add-todo', (_event, todoOptions) => {
        todoList.addTodo(todoOptions);
        console.log('adding todo');
        window.webContents.send('todos', todoList.getTodos(), todoList.getLastParentIndex());
    });

    ipcMain.on('remove-todo', (_event, todoIndex) => {
        todoList.removeTodo(todoIndex);
        console.log('removing todo');

        window.webContents.send('todos', todoList.getTodos(), todoList.getLastParentIndex());
    });

    ipcMain.on('toggle-subtask', (_event, todoIndex) => {
        todoList.toggleSubtask(todoIndex);
        console.log('toggling subtask');
        window.webContents.send('todos', todoList.getTodos(), todoList.getLastParentIndex());
    });

    ipcMain.on('toggle-completion', (_event, todoIndex) => {
        todoList.toggleCompletion(todoIndex);
        console.log('toggling completion');
        window.webContents.send('todos', todoList.getTodos(), todoList.getLastParentIndex());
    });
};

app.on('ready', main);

app.on('window-all-closed', () => {
    app.quit();
});
