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

    toggleSubtask(todoId: string) {
        for (const todo of this.todos) {
            if (todo.id === todoId) {
                todo.isSubtask = !todo.isSubtask;
                return;
            }
        }
    }

    getTodos() {
        return this.todos;
    }

    addTodo(todoOptions: any) {
        // merge the existing todos with the new todo
        const todo = new Todo(todoOptions);
        this.todos.push(todo);
    }

    removeTodo(todoId: string) {
        // filter out the target todo
        this.todos = this.todos.filter((todo) => todo.id !== todoId);
    }
}
