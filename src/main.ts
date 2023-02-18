import { app, ipcMain } from 'electron';
import { Todo } from './models/Todo';
import { TodoList } from './models/TodoList';
import { Window } from './models/Window';

require('electron-reload')(__dirname);

const appDataPath =
    process.env.APPDATA ||
    (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share');
console.log(appDataPath);
const todoList = new TodoList(appDataPath);

const main = () => {
    const window = new Window({ file: 'views/index.html' });
    window.once('show', () => {
        window.webContents.send('todos', todoList.getTodos());
    });

    ipcMain.on('add-todo', (_event, todoDescription) => {
        todoList.addTodo(todoDescription);
        window.webContents.send('todos', todoList.getTodos());
    });
};

app.on('ready', main);

app.on('window-all-closed', () => {
    app.quit();
});
