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
        // todoList.addTodo({ todoDescription: 'test', isSubtask: false });
        window.webContents.send('todos', todoList.getTodos());
    });

    ipcMain.on('add-todo', (_event, todoOptions) => {
        todoList.addTodo(todoOptions);
        window.webContents.send('todos', todoList.getTodos());
    });

    ipcMain.on('remove-todo', (_event, todoId) => {
        todoList.removeTodo(todoId);
        window.webContents.send('todos', todoList.getTodos());
    });

    ipcMain.on('mark-subtask', (_event, todoId) => {
        todoList.toggleSubtask(todoId);
        window.webContents.send('todos', todoList.getTodos());
    });
};

app.on('ready', main);

app.on('window-all-closed', () => {
    app.quit();
});
