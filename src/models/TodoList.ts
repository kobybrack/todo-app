import { Todo } from "./Todo";
import { readFileSync } from "fs"; 

export class TodoList {
    private todos: Todo[];

    constructor(filePath: any) {
        if (filePath === null) {
            this.todos = [];
        } else if (typeof filePath === 'string') {
            const fileBuffer = readFileSync(filePath)
            const fileString = fileBuffer.toString('utf-8');
            this.todos = JSON.parse(fileString);
        } else {
            throw new Error("not a valid todo file");
        }
    }

    public addTodo(todo: Todo) {
        this.todos.push(todo)
    }

    public removeTodo(todo: Todo) {
        const index = this.todos.indexOf(todo);
        this.todos.splice(index, 1);
    }
}