import { Todo } from './Todo';
export class TodoList {
    private todos: Todo[];
    private lastParentTaskId: string;

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
        this.lastParentTaskId = '';
    }

    public getTodos() {
        return this.todos;
    }

    public getLastParentId() {
        return this.lastParentTaskId;
    }

    public addTodo(todoOptions: any) {
        const todo = new Todo(todoOptions);
        if (!todo.isSubtask) {
            this.lastParentTaskId = todo.id;
        } else {
            // TODO: Could be that there is no parent task here
            let i = 0;
            while (this.todos[i].id !== this.lastParentTaskId) i++;
            this.todos[i].subtaskIds.push(todo.id);
        }
        this.todos.push(todo);
    }

    public removeTodo(idToRemove: string) {
        const newTodos: Todo[] = [];
        let mostRecentParentTaskId = '';
        for (let i = 0; i < this.todos.length; i++) {
            const currentTodo = this.todos[i];
            if (currentTodo.id === idToRemove) {
                if (currentTodo.id === this.lastParentTaskId) {
                    // reset last parent task
                    this.lastParentTaskId = mostRecentParentTaskId;

                    // find previous parent
                    // TODO: could be that there is no last parent
                    let j = 0;
                    while (this.todos[j].id !== mostRecentParentTaskId) j++;
                    this.todos[j].subtaskIds = [...this.todos[j].subtaskIds, ...currentTodo.subtaskIds];
                    // reset my children's parent ids to the new parent
                    for (const childTodoId of this.todos[j].subtaskIds) {
                        // find child
                        let k = 0;
                        while (this.todos[k].id !== childTodoId) k++;
                        // if their parent is not the new parent, change it
                        if (this.todos[k].parentId !== this.todos[j].parentId) {
                            this.todos[k].parentId = this.todos[j].id;
                        }
                    }
                }
                if (currentTodo.isSubtask) {
                    // find parent and remove me from their children
                    let j = 0;
                    while (this.todos[j].id !== currentTodo.parentId) j++;
                    this.todos[j].subtaskIds = this.todos[j].subtaskIds.filter((todoId) => todoId !== currentTodo.id);
                }
            } else {
                newTodos.push(currentTodo);
                if (!currentTodo.isSubtask) {
                    mostRecentParentTaskId = currentTodo.id;
                }
            }
        }
        this.todos = newTodos;
    }

    public toggleSubtask(todoId: string) {
        let mostRecentParentTaskId = '';
        for (const currentTodo of this.todos) {
            if (currentTodo.id === todoId) {
                if (currentTodo.isSubtask) {
                    currentTodo.isSubtask = '';
                    let i = 0;
                    while (this.todos[i].id !== currentTodo.parentId) i++;
                    // TODO: remove me from the children!
                    currentTodo.subtaskIds = [...this.todos[i].subtaskIds];
                    this.todos[i].subtaskIds = [];
                    currentTodo.parentId = '';
                } else {
                    currentTodo.isSubtask = 'subtask';
                    if (currentTodo.id === this.lastParentTaskId) {
                        this.lastParentTaskId = mostRecentParentTaskId;
                    }
                    // add me and my children to new parent's children
                    let i = 0;
                    while (this.todos[i].id !== mostRecentParentTaskId) i++;
                    this.todos[i].subtaskIds = [...currentTodo.subtaskIds];
                    this.todos[i].subtaskIds.push(currentTodo.id);
                    // reset my children because I no longer am a parent task
                    currentTodo.subtaskIds = [];
                    currentTodo.parentId = this.todos[i].id;
                }
                return;
            } // implicit else
            if (!currentTodo.isSubtask) {
                mostRecentParentTaskId = currentTodo.id;
            }
        }
    }

    public toggleCompletion(todoId: string) {
        for (const todo of this.todos) {
            if (todo.id === todoId) {
                if (todo.isCompleted) {
                    todo.isCompleted = '';
                } else {
                    todo.isCompleted = 'checked';
                }
                return;
            }
        }
    }
}
