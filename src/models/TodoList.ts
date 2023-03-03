import { Todo } from './Todo';
export class TodoList {
    private todos: Todo[];
    private lastParentTodoIndex: number;

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
        this.lastParentTodoIndex = -1;
    }

    public getTodos() {
        return this.todos;
    }

    public getLastParentIndex() {
        return this.lastParentTodoIndex;
    }

    public addTodo(todoOptions: any) {
        const newTodo = new Todo(todoOptions);
        if (!newTodo.isSubtask) {
            this.lastParentTodoIndex = this.todos.length;
        } else {
            if (this.lastParentTodoIndex >= 0) {
                this.todos[this.lastParentTodoIndex].subtaskIndexes.push(this.todos.length);
                newTodo.parentIndex = this.lastParentTodoIndex;
            }
        }
        this.todos.push(newTodo);
    }

    //TODO: update index for all todos after me
    public removeTodo(indexToRemove: number) {
        const targetTodo = this.todos[indexToRemove];
        if (targetTodo.isSubtask) {
            // remove me from my parent's children
            this.todos[targetTodo.parentIndex].subtaskIndexes.pop();
        } else {
            // it is a parent todo, find new parent
            let newParentIndex = indexToRemove - 1;
            while (newParentIndex >= 0 && this.todos[newParentIndex].isSubtask) newParentIndex--;
            // update children's parents (if any)
            for (const subtaskIndex of targetTodo.subtaskIndexes) {
                this.todos[subtaskIndex].parentIndex = newParentIndex;
            }
            if (newParentIndex >= 0) {
                // found a parent, migrate children
                const newParent = this.todos[newParentIndex];
                targetTodo.subtaskIndexes = targetTodo.subtaskIndexes.map((index) => index - 1);
                newParent.subtaskIndexes = [...newParent.subtaskIndexes, ...targetTodo.subtaskIndexes];
            }

            if (indexToRemove === this.lastParentTodoIndex) {
                this.lastParentTodoIndex = newParentIndex;
            }
        }
        this.todos.splice(indexToRemove, 1);
        let decrementStartingIndex = indexToRemove + 1;
        while (decrementStartingIndex < this.todos.length && this.todos[decrementStartingIndex].isSubtask) {
            decrementStartingIndex++;
        }
        this.decrementTodoIndexes(decrementStartingIndex);
    }

    public decrementTodoIndexes(startingIndex: number) {
        if (startingIndex >= this.todos.length) {
            return;
        }
        this.todos[startingIndex].subtaskIndexes = this.todos[startingIndex].subtaskIndexes.map((index) => index - 1);
        if (this.todos[startingIndex].parentIndex !== -1) this.todos[startingIndex].parentIndex--;
        this.decrementTodoIndexes(startingIndex + 1);
    }

    public toggleSubtask(indexToToggle: number) {
        const targetTodo = this.todos[indexToToggle];

        if (targetTodo.isSubtask) {
            // it is a sub todo going to a parent todo
            targetTodo.isSubtask = '';
            // adopt my parent's children who are after me
            targetTodo.subtaskIndexes = this.todos[targetTodo.parentIndex].subtaskIndexes.filter(
                (index) => index > indexToToggle,
            );
            for (const subtaskIndex of targetTodo.subtaskIndexes) {
                this.todos[subtaskIndex].parentIndex = indexToToggle;
            }
            // remove adopted children from old parent
            this.todos[targetTodo.parentIndex].subtaskIndexes = this.todos[
                targetTodo.parentIndex
            ].subtaskIndexes.filter((index) => index < indexToToggle);
            if (targetTodo.parentIndex === this.lastParentTodoIndex) {
                this.lastParentTodoIndex = indexToToggle;
            }
            targetTodo.parentIndex = -1;
        } else {
            // it is a parent todo going to a sub todo
            targetTodo.isSubtask = 'subtask';
            let newParentIndex = this.lastParentTodoIndex - 1;
            while (newParentIndex >= 0 && this.todos[newParentIndex].isSubtask) newParentIndex--;
            let newParent;
            if (newParentIndex >= 0) {
                newParent = this.todos[newParentIndex];
                newParent.subtaskIndexes.push(indexToToggle);
            }
            for (const subtaskIndex of targetTodo.subtaskIndexes) {
                if (newParent) newParent.subtaskIndexes.push(subtaskIndex);
                this.todos[subtaskIndex].parentIndex = newParentIndex;
            }
            targetTodo.subtaskIndexes = [];
            targetTodo.parentIndex = newParentIndex;
            if (indexToToggle === this.lastParentTodoIndex) {
                this.lastParentTodoIndex = newParentIndex;
            }
        }
    }

    public toggleCompletion(indexToToggle: number) {
        const targetTodo = this.todos[indexToToggle];
        if (targetTodo.isCompleted) {
            targetTodo.isCompleted = '';
        } else {
            targetTodo.isCompleted = 'checked';
        }
    }
}
