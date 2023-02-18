import { Todo } from './Todo';
export class TodoList {
    private todos: Todo[];
    // private readonly todosPath: string;

    constructor(appDataPath: string) {
        // initialize with todos or empty array
        // this.todosPath = appDataPath + '/todo-app' + '/todos.json';
        // try {
        //     const fileData = fs.readFileSync(appDataPath + '/todo-app' + '/todos.json', 'utf8');
        // } catch (error: any) {
        //     if (error.code !== 'ENOENT') {
        //         throw error;
        //     }
        // }
        this.todos = [];
    }

    saveTodos() {
        // save todos to JSON file
        // fs.writeFileSync(this.appDataPath + 'todos.json', JSON.stringify(this.todos));
        // // returning 'this' allows method chaining
        return this;
    }

    getTodos() {
        return this.todos;
    }

    addTodo(todoDescription: string) {
        // merge the existing todos with the new todo
        const todo = new Todo(todoDescription);
        this.todos.push(todo);
        return this.saveTodos();
    }

    deleteTodo(todo: Todo) {
        // filter out the target todo
        this.todos = this.todos.filter((t) => t !== todo);
        return this.saveTodos();
    }
}
